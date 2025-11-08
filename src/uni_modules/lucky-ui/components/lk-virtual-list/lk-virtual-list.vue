<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted, nextTick } from 'vue';

type AnyItem = Record<string, any>;

// Utility: Convert rpx/px/number to px
function toPx(val: string | number | undefined, fallback = 0): number {
  if (val === undefined || val === null) return fallback;
  if (typeof val === 'number') return val;
  const v = String(val).trim();
  if (v.endsWith('rpx') || v.endsWith('upx')) {
    const n = parseFloat(v);
    // @ts-ignore
    return typeof uni !== 'undefined' && uni.upx2px ? uni.upx2px(n) : n;
  }
  if (v.endsWith('px')) return parseFloat(v);
  const num = parseFloat(v);
  return isNaN(num) ? fallback : num;
}

const props = defineProps({
  items: { type: Array as () => AnyItem[], default: () => [] },
  itemHeight: { type: [Number, String], default: 100 },
  height: { type: [Number, String], default: 600 },
  buffer: { type: Number, default: 5 },
  // 动态 overscan：根据滚动速度增加额外缓冲行数（减少快速滚动白屏）
  dynamicOverscan: { type: Boolean, default: true },
  maxOverscanRows: { type: Number, default: 30 },
  // 单次 rAF 计算中的“行增益系数”，越大快速滚动时缓冲行数越多
  overscanBoostFactor: { type: Number, default: 0.6 },
  lowerThreshold: { type: [Number, String], default: '80rpx' },
  prefetchRows: { type: Number, default: 0 },
  reserveRows: { type: Number, default: 0 },
  positionStrategy: { type: String, default: 'transform' }, // Default to transform for smoothness
  initialScrollIndex: { type: Number, default: 0 },
  scrollWithAnimation: { type: Boolean, default: false },
  scrollAnchoring: { type: Boolean, default: true },
  enablePassive: { type: Boolean, default: true },
  enhanced: { type: Boolean, default: true },
  bounces: { type: Boolean, default: false },
});

const wrapperRef = ref<any>();
const currentScrollTop = ref(0);
// Ensure scroll-top is always a number to avoid native event handler errors in some runtimes
const boundScrollTop = ref<number>(0);

// rAF 滚动调度（带降级）
const latestScrollTop = ref(0);
const lastProcessedTop = ref(0);
const rafPending = ref(false);
let rafId: number | null = null;
// Fallback for environments without requestAnimationFrame (e.g., some mini-program runtimes)
type RAFHandle = number;
const hasRAF = typeof requestAnimationFrame === 'function';
const rAF = (cb: (t: number) => void): RAFHandle =>
  hasRAF
    ? (requestAnimationFrame as any)(cb)
    : (setTimeout(
        () =>
          cb(
            typeof performance !== 'undefined' && (performance as any).now
              ? (performance as any).now()
              : Date.now()
          ),
        16
      ) as unknown as number);
const cAF = (id: RAFHandle) => {
  if (hasRAF) (cancelAnimationFrame as any)(id);
  else clearTimeout(id as unknown as any);
};

// 根据滚动速度动态增加 overscan 行数
const currentOverscanBoost = ref(0);

const itemPx = computed(() => Math.round(toPx(props.itemHeight, 100)));
const containerHeightPx = computed(() => toPx(props.height, 600));
const lowerThresholdPx = computed(() => toPx(props.lowerThreshold, 80));
// const overscanCount = computed(() => props.buffer);
const overscanBase = computed(() => props.buffer);
const overscanDynamic = computed(() =>
  props.dynamicOverscan ? Math.min(props.maxOverscanRows, currentOverscanBoost.value) : 0
);
const overscanCount = computed(() => overscanBase.value + overscanDynamic.value);

const list = computed(() => props.items);
const totalHeight = computed(() => list.value.length * itemPx.value);
const baseVisibleCount = computed(() => Math.ceil(containerHeightPx.value / itemPx.value));
const visibleCount = computed(() => baseVisibleCount.value + overscanCount.value * 2);

const windowStart = ref(0);
const startIndex = computed(() => windowStart.value);
const endIndex = computed(() =>
  Math.min(list.value.length, windowStart.value + visibleCount.value)
);
const visibleItems = computed(() => list.value.slice(startIndex.value, endIndex.value));

const offsetY = computed(() => windowStart.value * itemPx.value);
const renderedHeight = computed(() => (endIndex.value - startIndex.value) * itemPx.value);
const topPadding = computed(() => offsetY.value);
const bottomPadding = computed(() =>
  Math.max(0, totalHeight.value - topPadding.value - renderedHeight.value)
);
const reservePadding = computed(() => props.reserveRows * itemPx.value);
const bottomPaddingTotal = computed(() => bottomPadding.value + reservePadding.value);
const totalScrollable = computed(() => totalHeight.value + reservePadding.value);

const emit = defineEmits(['scroll', 'reach-bottom', 'prefetch']);

const nearBottomEmitted = ref(false);
const prefetchEmitted = ref(false);
const prevLength = ref(0);

const localScrollAnchoring = ref(props.scrollAnchoring);
const localScrollWithAnimation = ref(props.scrollWithAnimation);

watch(
  () => props.scrollAnchoring,
  v => (localScrollAnchoring.value = v)
);
watch(
  () => props.scrollWithAnimation,
  v => (localScrollWithAnimation.value = v)
);

watch(
  () => list.value.length,
  newLen => {
    nearBottomEmitted.value = false;
    prefetchEmitted.value = false;
    const maxStart = Math.max(0, newLen - visibleCount.value);
    const derivedStart = Math.max(
      0,
      Math.floor(currentScrollTop.value / itemPx.value) - overscanCount.value
    );
    windowStart.value = Math.min(derivedStart, maxStart);
    if (newLen > prevLength.value) {
      // Temporarily disable anchoring/animation on append for anti-jitter
      const needRestoreAnchoring = localScrollAnchoring.value;
      const needRestoreAnim = localScrollWithAnimation.value;
      if (needRestoreAnchoring) localScrollAnchoring.value = false;
      if (needRestoreAnim) localScrollWithAnimation.value = false;
      setTimeout(() => {
        localScrollAnchoring.value = needRestoreAnchoring;
        localScrollWithAnimation.value = needRestoreAnim;
      }, 50);
    }
    prevLength.value = newLen;
  }
);

function flushScroll() {
  const top = latestScrollTop.value;
  const delta = top - lastProcessedTop.value;
  lastProcessedTop.value = top;
  currentScrollTop.value = top;

  // 动态 overscan：根据本帧移动距离估算需要增加的行数
  const deltaRows = Math.abs(delta) / Math.max(1, itemPx.value);
  currentOverscanBoost.value = Math.min(
    props.maxOverscanRows,
    Math.floor(deltaRows * props.overscanBoostFactor)
  );

  const anchorRow = Math.floor(top / Math.max(1, itemPx.value));
  const desiredStart = Math.max(0, anchorRow - overscanCount.value);
  if (desiredStart !== windowStart.value) windowStart.value = desiredStart;

  emit('scroll', {
    scrollTop: top,
    start: startIndex.value,
    end: endIndex.value,
  });

  // 到底与预取触发在 rAF 中合并，避免抖动
  const remain = totalHeight.value - (top + containerHeightPx.value);
  if (remain <= lowerThresholdPx.value && !nearBottomEmitted.value) {
    nearBottomEmitted.value = true;
    emit('reach-bottom');
  } else if (remain > lowerThresholdPx.value * 2) {
    nearBottomEmitted.value = false;
  }

  if (props.prefetchRows > 0) {
    const remainingItems = list.value.length - endIndex.value;
    if (remainingItems <= props.prefetchRows && !prefetchEmitted.value) {
      prefetchEmitted.value = true;
      emit('prefetch');
    } else if (remainingItems > props.prefetchRows * 2) {
      prefetchEmitted.value = false;
    }
  }
}

function scheduleFlush() {
  if (rafPending.value) return;
  rafPending.value = true;
  rafId = rAF(() => {
    rafPending.value = false;
    flushScroll();
  });
}

function onScroll(e: any) {
  const top = e?.detail?.scrollTop ?? e?.target?.scrollTop ?? 0;
  latestScrollTop.value = top;
  scheduleFlush();
}

function onScrollToLower() {
  emit('reach-bottom');
}

function scrollToIndex(index: number) {
  const i = Math.max(0, Math.min(index, list.value.length - 1));
  const top = i * itemPx.value;
  boundScrollTop.value = top;
  latestScrollTop.value = top;
  scheduleFlush();
}

function scrollToTop() {
  boundScrollTop.value = 0;
  latestScrollTop.value = 0;
  scheduleFlush();
}

onMounted(() => {
  if (props.initialScrollIndex > 0) {
    nextTick(() => scrollToIndex(props.initialScrollIndex));
  } else {
    nextTick(() => {
      latestScrollTop.value = 0;
      flushScroll();
    });
  }
});

onUnmounted(() => {
  if (rafId != null) cAF(rafId);
});

defineExpose({ scrollToIndex, scrollToTop });
</script>

<template>
  <scroll-view
    scroll-y
    class="lk-virtual-list"
    :style="{ height: containerHeightPx + 'px' }"
    :lower-threshold="lowerThresholdPx"
    :scroll-top="boundScrollTop"
    :scroll-with-animation="localScrollWithAnimation"
    :scroll-anchoring="localScrollAnchoring"
    :enable-passive="enablePassive"
    :enhanced="enhanced"
    :bounces="bounces"
    @scroll="onScroll"
    @scrolltolower="onScrollToLower"
    ref="wrapperRef"
  >
    <view
      v-if="positionStrategy === 'padding'"
      class="lk-virtual-list__inner"
      :style="{
        paddingTop: topPadding + 'px',
        paddingBottom: bottomPaddingTotal + 'px',
      }"
    >
      <slot :items="visibleItems" :start="startIndex" :end="endIndex" :itemHeight="itemPx" />
    </view>
    <template v-else>
      <view class="lk-virtual-list__phantom" :style="{ height: totalScrollable + 'px' }" />
      <view
        class="lk-virtual-list__container"
        :style="{ transform: `translate3d(0, ${topPadding}px, 0)` }"
      >
        <slot :items="visibleItems" :start="startIndex" :end="endIndex" :itemHeight="itemPx" />
      </view>
    </template>
  </scroll-view>
</template>

<style scoped lang="scss">
.lk-virtual-list {
  width: 100%;
  position: relative;
  contain: content;
  // 隐藏各端滚动条（H5/Fx/IE系）
  scrollbar-width: none; // Firefox
  -ms-overflow-style: none; // IE/Edge legacy
}

.lk-virtual-list::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none; // WebKit
}

.lk-virtual-list__inner,
.lk-virtual-list__container {
  display: flex;
  flex-direction: column;
  contain: content;
  backface-visibility: hidden;
}

.lk-virtual-list__phantom {
  position: relative;
  width: 100%;
}

.lk-virtual-list__container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  will-change: transform;
}
</style>
