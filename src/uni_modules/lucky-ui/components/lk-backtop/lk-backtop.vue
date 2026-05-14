<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { onPageScroll } from '@dcloudio/uni-app';
import { backtopProps, backtopEmits } from './backtop.props';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import { addUnit } from '@/uni_modules/lucky-ui/core/src/utils/unit';
import { scrollToTop } from '@/uni_modules/lucky-ui/core/src/utils/scroll';

/**
 * Backtop 回到顶部
 * - 页面滚动到一定距离后显示悬浮按钮，点击快速返回顶部
 */

defineOptions({ name: 'LkBacktop' });

const props = defineProps(backtopProps);

const emit = defineEmits(backtopEmits);

const visible = ref(false);
let framePending = false;
let latestScrollTop = 0;

function syncVisibleFromScrollTop(scrollTop: number) {
  const next = scrollTop >= props.visibilityHeight;
  if (next !== visible.value) {
    visible.value = next;
    emit('change:visible', next, scrollTop);
  }
}

const computedVisible = computed(() => {
  return props.usePageScroll ? visible.value : props.scrollTop >= props.visibilityHeight;
});

if (props.usePageScroll) {
  onPageScroll(e => {
    latestScrollTop = e.scrollTop;
    if (framePending) return;
    framePending = true;
    setTimeout(() => {
      framePending = false;
      syncVisibleFromScrollTop(latestScrollTop);
    }, 16);
  });
} else {
  // 受控模式，根据外部传入的 scrollTop 判断显隐
  watch(
    () => props.scrollTop,
    st => {
      syncVisibleFromScrollTop(st);
    },
    { immediate: true }
  );
}

function toTop(event?: unknown) {
  emit('click', event);
  if (props.usePageScroll) {
    scrollToTop({
      duration: props.duration,
      easing: props.easing,
      startScrollTop: latestScrollTop,
    });
  }
  // 无论哪种模式都抛出事件，受控模式由外部自行将容器滚动置 0
  emit('to-top', {
    usePageScroll: props.usePageScroll,
    duration: props.duration,
    easing: props.easing,
    event,
  });
}

const wrapperStyle = computed(() => {
  const r = addUnit(props.right) || 'var(--lk-rpx-32)';
  const b = addUnit(props.bottom) || 'var(--lk-rpx-80)';
  return {
    right: r,
    bottom: b,
    zIndex: String(props.zIndex),
  } as Record<string, string>;
});

const classes = computed(() => [
  'lk-backtop',
  `lk-backtop--${props.size}`,
  `lk-backtop--shape-${props.shape}`,
  { 'is-visible': computedVisible.value },
  props.customClass,
]);
</script>

<template>
  <view
    v-show="computedVisible"
    :id="id"
    :class="classes"
    :style="[wrapperStyle, customStyle as any]"
    aria-label="Back to top"
    role="button"
    @tap="toTop"
  >
    <slot>
      <view class="lk-backtop__icon">
        <LkIcon :name="icon" size="32" color="currentColor" />
      </view>
      <text v-if="text" class="lk-backtop__text">{{ text }}</text>
    </slot>
  </view>
</template>

<style lang="scss">
@use './lk-backtop.scss';
</style>
