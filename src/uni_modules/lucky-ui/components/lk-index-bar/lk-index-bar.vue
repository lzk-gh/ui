<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { indexBarProps, indexBarEmits } from './index-bar.props';

defineOptions({ name: 'LkIndexBar' });

const props = defineProps(indexBarProps);
const emit = defineEmits(indexBarEmits);

const active = ref('');
const touching = ref(false);
const indicatorVisible = ref(false);
const indicatorText = ref('');
const isProgrammaticScrolling = ref(false);

let sidebarTop = 0;
let itemHeight = 0;
let anchorPositions: { letter: string; top: number }[] = [];
let scrollingTimer: ReturnType<typeof setTimeout> | null = null;

const highlightStyle = computed(() => {
  if (props.highlightColor) {
    return { '--_highlight-color': props.highlightColor };
  }
  return {};
});

const sidebarStyle = computed(() => ({
  '--lk-index-bar-sticky-top': `${props.stickyOffsetTop}px`,
}));

function updateSidebarInfo() {
  const query = uni.createSelectorQuery();
  // #ifdef MP
  const pages = typeof getCurrentPages === 'function' ? getCurrentPages() : [];
  const page = Array.isArray(pages) ? pages[pages.length - 1] : null;
  if (page) {
    (query as unknown as { in: (ctx: unknown) => ReturnType<typeof uni.createSelectorQuery> }).in(page);
  }
  // #endif
  query.select('.lk-index-bar__sidebar').boundingClientRect();
  query.select('.lk-index-bar__item').boundingClientRect();
  query.exec((res) => {
    if (res[0] && res[1]) {
      sidebarTop = res[0].top;
      itemHeight = res[1].height;
    }
  });
}

function updateAnchorPositions() {
  const query = uni.createSelectorQuery();
  // #ifdef MP
  const pages = typeof getCurrentPages === 'function' ? getCurrentPages() : [];
  const page = Array.isArray(pages) ? pages[pages.length - 1] : null;
  if (page) {
    (query as any).in(page);
  }
  // #endif

  query.selectAll('.lk-index-anchor').boundingClientRect();
  query.selectViewport().scrollOffset();
  query.exec((res) => {
    const list = res[0] as any[];
    const viewport = res[1] as any;
    if (!list || !viewport) return;

    const scrollTop = viewport.scrollTop || 0;
    anchorPositions = list
      .map((item) => ({
        letter: item.dataset?.lkIndexAnchor || '',
        top: item.top + scrollTop,
      }))
      .filter((item) => !!item.letter)
      .sort((a, b) => a.top - b.top);
  });
}

function syncActiveByScroll(scrollTop: number) {
  if (isProgrammaticScrolling.value || anchorPositions.length === 0) return;

  const threshold = scrollTop + Number(props.stickyOffsetTop) + 12;
  let current = anchorPositions[0]?.letter || '';

  for (let i = 0; i < anchorPositions.length; i++) {
    if (threshold >= anchorPositions[i].top) {
      current = anchorPositions[i].letter;
    } else {
      break;
    }
  }

  if (current && current !== active.value) {
    active.value = current;
    emit('change', current);
  }
}

function scrollTo(letter: string) {
  if (active.value === letter && !touching.value) return;
  emit('select', letter);
  active.value = letter;
  isProgrammaticScrolling.value = true;

  // 震动反馈
  // #ifdef APP-PLUS || MP-WEIXIN
  try {
    uni.vibrateShort({ type: 'light' });
  } catch {
    // ignore
  }
  // #endif

  const targetAnchor = anchorPositions.find((a) => a.letter === letter);
  if (targetAnchor && !props.scrollTarget) {
    uni.pageScrollTo({
      scrollTop: targetAnchor.top - Number(props.stickyOffsetTop),
      duration: 0,
    });
  }

  if (scrollingTimer) clearTimeout(scrollingTimer);
  scrollingTimer = setTimeout(() => {
    isProgrammaticScrolling.value = false;
  }, 360);
}

function showIndicator(letter: string) {
  if (props.showIndicator) {
    indicatorText.value = letter;
    indicatorVisible.value = true;
  }
}

function hideIndicator() {
  indicatorVisible.value = false;
}

function onTouchStart(e: TouchEvent) {
  touching.value = true;
  updateSidebarInfo();
  handleTouch(e);
}

function onTouchMove(e: TouchEvent) {
  if (!touching.value) return;
  e.preventDefault?.();
  handleTouch(e);
}

function onTouchEnd() {
  touching.value = false;
  hideIndicator();
}

function handleTouch(e: TouchEvent) {
  const touch = e.touches[0];
  if (!touch) return;

  if (sidebarTop === 0 || itemHeight === 0) return;
  const clientY = touch.clientY;
  const index = Math.floor((clientY - sidebarTop) / itemHeight);

  if (index >= 0 && index < props.indexList.length) {
    const letter = props.indexList[index];
    showIndicator(letter);
    scrollTo(letter);
  }
}

function onItemClick(letter: string) {
  showIndicator(letter);
  scrollTo(letter);
  setTimeout(hideIndicator, 300);
}

watch(
  () => props.scrollTop,
  (val) => {
    syncActiveByScroll(val);
  }
);

defineExpose({
  scrollTo,
  onScroll: (scrollTop: number) => syncActiveByScroll(scrollTop),
  refresh: () => {
    updateSidebarInfo();
    updateAnchorPositions();
  },
});

onMounted(() => {
  nextTick(() => {
    updateSidebarInfo();
    setTimeout(() => {
      updateAnchorPositions();
    }, 500);
  });
});

onUnmounted(() => {
  if (scrollingTimer) clearTimeout(scrollingTimer);
});
</script>

<template>
  <view class="lk-index-bar" :style="highlightStyle">
    <slot />

    <!-- 大字母指示器 -->
    <view v-if="indicatorVisible" class="lk-index-bar__indicator">
      <text class="lk-index-bar__indicator-text">{{ indicatorText }}</text>
    </view>

    <!-- 侧边栏 -->
    <view
      class="lk-index-bar__sidebar"
      :class="{ 'is-touching': touching, 'is-non-sticky': !sticky }"
      :style="sidebarStyle"
      @touchstart.stop.prevent="onTouchStart"
      @touchmove.stop.prevent="onTouchMove"
      @touchend.stop.prevent="onTouchEnd"
      @touchcancel.stop.prevent="onTouchEnd"
    >
      <view
        v-for="ch in indexList"
        :key="ch"
        class="lk-index-bar__item"
        :class="{ 'is-active': active === ch }"
        @click.stop="onItemClick(ch)"
      >
        {{ ch }}
      </view>
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
