<script setup lang="ts">
import type { StyleValue } from 'vue';
import { ref, provide, watch, onMounted, nextTick, computed, getCurrentInstance } from 'vue';
import { tabsProps, tabsEmits, type TabPaneContext, type TabsValue } from './tabs.props';
import {
  findTabPaneIndex,
  getTabsTouchPoint,
  removeTabPane,
  resolveTabNavItemClass,
  resolveTabsInitialValue,
  resolveTabsLineStyle,
  resolveTabsOverflow,
  resolveTabsRootClass,
  resolveTabsRootStyle,
  resolveTabsScrollable,
  resolveTabsSetActive,
  resolveTabsStretching,
  resolveTabsSwipe,
  upsertTabPane,
  type TabsTouchEventLike,
} from './tabs.utils';

defineOptions({ name: 'LkTabs' });

const props = defineProps(tabsProps);
const emit = defineEmits(tabsEmits);
const rootStyle = computed<StyleValue>(() => resolveTabsRootStyle(props.customStyle as StyleValue));

const current = ref(props.modelValue);
watch(
  () => props.modelValue,
  v => (current.value = v)
);

const panes = ref<TabPaneContext[]>([]);
const instance = getCurrentInstance();

function register(pane: TabPaneContext) {
  panes.value = upsertTabPane(panes.value, pane);
  const initialValue = resolveTabsInitialValue({
    current: current.value,
    panes: panes.value,
  });
  if (initialValue !== null) {
    current.value = initialValue;
    emit('update:modelValue', current.value);
  }
  nextTick(() => {
    scrollActiveIntoView();
    updateLinePosition();
  });
}

function unregister(pane: TabPaneContext) {
  panes.value = removeTabPane(panes.value, pane);
  nextTick(() => {
    scrollActiveIntoView();
    updateLinePosition();
  });
}

function setActive(name: TabsValue, event?: unknown, source: 'click' | 'swipe' = 'click') {
  const result = resolveTabsSetActive({
    current: current.value,
    panes: panes.value,
    name,
    source,
  });
  const { index, pane } = result;
  if (source === 'click') {
    const payload = { name, pane, index, event };
    emit('click', name, pane, index, event);
    emit('tab-click', payload);
    if (result.kind === 'disabled') {
      emit('click-disabled', payload);
      return;
    }
  }
  if (result.kind !== 'change') return;
  current.value = result.name;
  emit('update:modelValue', result.name);
  emit('change', result.name, pane, index);
}

provide('LkTabs', {
  register,
  unregister,
  active: current,
  lazy: props.lazy,
});

const activeIndex = computed(() => findTabPaneIndex(panes.value, current.value));

// ── 滚动居中 ──────────────────────────────────
// 使用 scroll-left 代替 scroll-into-view 实现精准居中
const scrollLeft = ref(0);
interface TabsScrollOffsetResult {
  scrollLeft?: number;
}

interface TabsScrollOffsetNode {
  scrollOffset?: () => unknown;
}

/**
 * 将当前激活的 tab 滚动到 scroll-view 可视区域的中间位置
 */
function scrollActiveIntoView() {
  const idx = activeIndex.value;
  if (idx < 0) return;

  nextTick(() => {
    let query = uni?.createSelectorQuery?.();
    if (!query) return;
    if (query.in && instance?.proxy) query = query.in(instance.proxy);

    query.select('.lk-tabs__nav').boundingClientRect();
    query.selectAll('.lk-tabs__nav-item').boundingClientRect();

    query.exec((res: unknown[]) => {
      if (!res || !res[0] || !res[1]) return;
      const navRect = res[0] as UniApp.NodeInfo;
      const itemRects = res[1] as UniApp.NodeInfo[];
      if (!itemRects[idx]) return;
      const navWidth = navRect.width || 0;
      const navLeft = navRect.left || 0;

      // 计算所有 tab 总宽度以得到当前 scrollLeft
      const activeItem = itemRects[idx];
      const itemCenter = (activeItem.left || 0) - navLeft + (activeItem.width || 0) / 2;

      // 需要把当前 scrollLeft 也考虑进去
      // 先估算当前的 scrollLeft：第一个 item 的 left 相对于 nav 的 left
      const firstItem = itemRects[0];
      const firstItemLeft = (firstItem?.left || 0) - navLeft;

      // 所有 tab 的总宽度
      const lastItem = itemRects[itemRects.length - 1];
      const totalWidth =
        (lastItem.left || 0) + (lastItem.width || 0) - (firstItem?.left || 0);

      // 当总宽度不超过 nav viewport 时不需要滚动
      if (totalWidth <= navWidth) {
        scrollLeft.value = 0;
        return;
      }

      // 目标: 将 activeItem 中心移到 nav 视口中心
      // 因为 query 返回的是 viewport 坐标，需要考虑当前已有的 scrollLeft
      // scrollLeft = activeItem 在内容中的中心位置 - nav 可见宽度 / 2
      const currentScrollLeft = -firstItemLeft; // 近似
      const itemCenterInContent = currentScrollLeft + itemCenter;
      let target = itemCenterInContent - navWidth / 2;

      // clamp
      const maxScroll = totalWidth - navWidth;
      if (target < 0) target = 0;
      if (target > maxScroll) target = maxScroll;

      scrollLeft.value = target;
    });
  });
}

// ── Indicator / 指示器位置 ────────────────────────
const indicatorLeft = ref(0);
const indicatorWidth = ref(0);
const lineStyle = ref({ transform: 'translateX(0)', width: '0' });

function updateLinePosition() {
  const idx = activeIndex.value;
  if (idx < 0) return;

  nextTick(() => {
    let query = uni?.createSelectorQuery?.();
    if (!query) return;
    if (query.in && instance?.proxy) query = query.in(instance.proxy);

    query.select('.lk-tabs__nav').boundingClientRect();
    const navNode = query.select('.lk-tabs__nav') as unknown as TabsScrollOffsetNode;
    if (navNode.scrollOffset) {
      navNode.scrollOffset();
    }
    query.selectAll('.lk-tabs__nav-item').boundingClientRect();

    query.exec((res: unknown[]) => {
      if (!res) return;
      const navRect = res[0] as UniApp.NodeInfo;
      const hasOffset = res.length >= 3;
      const offsetObj = hasOffset ? res[1] as TabsScrollOffsetResult : null;
      const itemRects = (hasOffset ? res[2] : res[1]) as UniApp.NodeInfo[];
      if (!navRect || !itemRects || !itemRects[idx]) return;

      const activeItem = itemRects[idx];
      const navLeft = navRect.left || 0;
      const sl = offsetObj?.scrollLeft || 0;

      const itemLeftInViewport = activeItem.left || 0;
      const itemLeft = itemLeftInViewport - navLeft + sl;
      const itemWidth = activeItem.width || 0;
      const lineWidth = itemWidth * 0.5;
      const translateX = itemLeft + (itemWidth - lineWidth) / 2;

      indicatorLeft.value = translateX;
      indicatorWidth.value = lineWidth;

      lineStyle.value = resolveTabsLineStyle({ translateX, width: lineWidth });
    });
  });
}

// ── 溢出检测 (渐变蒙层) ──────────────────────────
const overflowLeft = ref(false);
const overflowRight = ref(false);
let overflowCheckTimer: ReturnType<typeof setTimeout> | null = null;

function checkOverflow() {
  nextTick(() => {
    let query = uni?.createSelectorQuery?.();
    if (!query) return;
    if (query.in && instance?.proxy) query = query.in(instance.proxy);

    query.select('.lk-tabs__nav').boundingClientRect();
    query.selectAll('.lk-tabs__nav-item').boundingClientRect();

    query.exec((res: unknown[]) => {
      if (!res || !res[0] || !res[1]) return;
      const navRect = res[0] as UniApp.NodeInfo;
      const itemRects = res[1] as UniApp.NodeInfo[];
      if (!itemRects.length) return;

      const navLeft = navRect.left || 0;
      const firstLeft = itemRects[0]?.left || 0;
      const lastRight = (itemRects[itemRects.length - 1]?.left || 0) +
        (itemRects[itemRects.length - 1]?.width || 0);
      const overflow = resolveTabsOverflow({
        navLeft,
        navWidth: navRect.width || 0,
        firstLeft,
        lastRight,
      });

      overflowLeft.value = overflow.left;
      overflowRight.value = overflow.right;
    });
  });
}

// ── Watchers ─────────────────────────────────────
watch(current, () => {
  scrollActiveIntoView();
  updateLinePosition();
  // 延迟检测溢出状态，等滚动动画完成
  setTimeout(checkOverflow, 350);
});

watch(
  () => panes.value.length,
  () => {
    scrollActiveIntoView();
    updateLinePosition();
    nextTick(checkOverflow);
  }
);

onMounted(() => {
  scrollActiveIntoView();
  updateLinePosition();
  nextTick(checkOverflow);
});

// ── 滚动事件：实时刷新溢出蒙层 ────────────────────
function onNavScroll() {
  if (overflowCheckTimer) clearTimeout(overflowCheckTimer);
  overflowCheckTimer = setTimeout(() => {
    checkOverflow();
  }, 16);
}

// ── Swipe 滑动切换逻辑 ────────────────────────────
let startX = 0;
let startY = 0;
let deltaX = 0;
let deltaY = 0;
let isTracking = false;
const SWIPE_THRESHOLD = 50;

function onTouchStart(e: TouchEvent | TabsTouchEventLike) {
  if (!props.swipeable) return;
  const t = getTabsTouchPoint(e);
  if (!t) return;
  isTracking = true;
  startX = t.pageX;
  startY = t.pageY;
  deltaX = 0;
  deltaY = 0;
}
function onTouchMove(e: TouchEvent | TabsTouchEventLike) {
  if (!isTracking || !props.swipeable) return;
  const t = getTabsTouchPoint(e);
  if (!t) return;
  deltaX = t.pageX - startX;
  deltaY = t.pageY - startY;
}
function onTouchEnd() {
  if (!isTracking || !props.swipeable) return;
  isTracking = false;
  const result = resolveTabsSwipe({
    panes: panes.value,
    current: current.value,
    deltaX,
    deltaY,
    threshold: SWIPE_THRESHOLD,
  });
  if (!result) return;
  setActive(result.pane.name, undefined, 'swipe');
  emit('swipe-change', {
    name: result.pane.name,
    pane: result.pane,
    index: result.index,
    direction: result.direction,
  });
}

// 多 tab 时不 stretch（避免把 tab 压扁），少 tab 才 stretch
const stretching = computed(() => resolveTabsStretching({
  stretch: props.stretch,
  paneCount: panes.value.length,
}));
// 是否可滚动（超过 5 个时自然溢出滚动）
const scrollable = computed(() => resolveTabsScrollable(panes.value.length));
const rootClass = computed(() => resolveTabsRootClass({
  type: props.type,
  stretching: stretching.value,
  border: props.border,
  customClass: props.customClass,
}));
</script>

<template>
  <view
    :id="id"
    class="lk-tabs"
    :class="rootClass"
    :style="rootStyle"
  >
    <!-- header 插槽 -->
    <slot name="header"></slot>

    <!-- Tab 栏 -->
    <view class="lk-tabs__header">
      <!-- prefix -->
      <view v-if="$slots.prefix" class="lk-tabs__prefix">
        <slot name="prefix"></slot>
      </view>

      <!-- 左侧渐变蒙层 -->
      <view
        v-if="scrollable"
        class="lk-tabs__fade lk-tabs__fade--left"
        :class="{ 'is-visible': overflowLeft }"
      ></view>

      <scroll-view
        scroll-x
        class="lk-tabs__nav"
        :scroll-left="scrollLeft"
        :scroll-with-animation="true"
        :show-scrollbar="false"
        enable-flex
        @scroll="onNavScroll"
      >
        <view class="lk-tabs__nav-wrap">
          <view
            v-for="(pane, index) in panes"
            :id="'lk-tab-' + pane.name"
            :key="pane.name"
            class="lk-tabs__nav-item"
            :class="resolveTabNavItemClass({
              active: pane.name === current,
              disabled: pane.disabled,
            })"
            @tap="setActive(pane.name, $event)"
          >
            <!-- tab 插槽 -->
            <slot
              name="tab"
              :item="pane"
              :index="index"
              :active="pane.name === current"
            >
              <text class="lk-tabs__label">{{ pane.label }}</text>
            </slot>
          </view>

          <!-- indicator -->
          <view v-if="showIndicator && type === 'line'" class="lk-tabs__indicator-wrap">
            <slot
              name="indicator"
              :active-index="activeIndex"
              :left="indicatorLeft"
              :width="indicatorWidth"
            >
              <view class="lk-tabs__line" :style="lineStyle"></view>
            </slot>
          </view>
        </view>
      </scroll-view>

      <!-- 右侧渐变蒙层 -->
      <view
        v-if="scrollable"
        class="lk-tabs__fade lk-tabs__fade--right"
        :class="{ 'is-visible': overflowRight }"
      ></view>

      <!-- suffix -->
      <view v-if="$slots.suffix" class="lk-tabs__suffix">
        <slot name="suffix"></slot>
      </view>
    </view>

    <!-- default 内容面板 -->
    <view
      class="lk-tabs__content"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <slot />
    </view>
  </view>
</template>

<style lang="scss">
@use './lk-tabs.scss';
</style>
