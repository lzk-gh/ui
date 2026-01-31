<script setup lang="ts">
/**
 * LkWaterfall - 高性能瀑布流组件
 *
 * 特性:
 * - 贪心算法双列分配 (始终放入较短列)
 * - 绝对定位布局 (兼容小程序)
 * - 图片高度预计算 (基于 ratio)
 * - 使用 lk-skeleton 组件库骨架屏
 * - 60fps 滚动性能
 * - 无限滚动 + 预加载
 * - 作用域插槽自定义卡片
 */
import {
  computed,
  getCurrentInstance,
  nextTick,
  onMounted,
  ref,
  watch,
  type CSSProperties,
} from 'vue';
import { waterfallProps, waterfallEmits } from './waterfall.props';
import type { WaterfallItem, PlacedCard, WaterfallLoadingState } from './waterfall.props';

const props = defineProps(waterfallProps);
const emit = defineEmits(waterfallEmits);

// ======================== 工具函数 ========================

/**
 * 单位转换: rpx/px/number -> px
 */
function toPx(val: string | number | undefined, fallback = 0): number {
  if (val === undefined || val === null) return fallback;
  if (typeof val === 'number') return val;
  const v = String(val).trim();
  if (v === '100vh') {
    const sys = uni.getSystemInfoSync?.();
    return sys?.windowHeight || 600;
  }
  if (v.endsWith('%')) {
    const percent = parseFloat(v);
    if (!isNaN(percent)) {
      const sys = uni.getSystemInfoSync?.();
      const base = containerHeight.value || sys?.windowHeight || 600;
      return (base * percent) / 100;
    }
  }
  if (v.endsWith('rpx') || v.endsWith('upx')) {
    const n = parseFloat(v);
    return typeof uni !== 'undefined' && uni.upx2px ? uni.upx2px(n) : n / 2;
  }
  if (v.endsWith('px')) return parseFloat(v);
  if (v.endsWith('vh')) {
    const sys = uni.getSystemInfoSync?.();
    return ((sys?.windowHeight || 600) * parseFloat(v)) / 100;
  }
  const num = parseFloat(v);
  return isNaN(num) ? fallback : num;
}

/**
 * 添加单位
 */
function addUnit(val: string | number | undefined, unit = 'px'): string {
  if (val === undefined || val === null) return '';
  if (typeof val === 'string') return val;
  return `${val}${unit}`;
}

// ======================== 响应式状态 ========================

const uid = getCurrentInstance()?.uid ?? Math.floor(Math.random() * 1e6);
const rootId = `lk-waterfall-${uid}`;

/** 容器宽度 */
const containerWidth = ref<number>(0);
/** 容器高度 */
const containerHeight = ref<number>(0);
/** 滚动位置 */
const scrollTop = ref(0);
/** 所有卡片数据 (绝对定位) */
const cardList = ref<PlacedCard[]>([]);
/** 左列高度 */
const leftHeight = ref(0);
/** 右列高度 */
const rightHeight = ref(0);
/** 已处理的数据索引 */
const processedIndex = ref(0);
/** 是否正在处理 */
const isProcessing = ref(false);
/** 初始化完成 */
const isReady = ref(false);

// ======================== 计算属性 ========================

const gutterPx = computed(() => toPx(props.gutter, 16));
const rowGapPx = computed(() => toPx(props.rowGap, 16));
const paddingXPx = computed(() => toPx(props.paddingX, 16));
const paddingYPx = computed(() => toPx(props.paddingY, 16));
const heightPx = computed(() => toPx(props.height, 600));
const cardRadiusPx = computed(() => toPx(props.cardRadius, 16));

/** 单列宽度 */
const columnWidth = computed(() => {
  const availableWidth = containerWidth.value - paddingXPx.value * 2 - gutterPx.value;
  return Math.max(0, availableWidth / 2);
});

/** 右列左边距 */
const rightColumnLeft = computed(() => paddingXPx.value + columnWidth.value + gutterPx.value);

/** 总高度 */
const totalHeight = computed(
  () => Math.max(leftHeight.value, rightHeight.value) + paddingYPx.value
);

// ======================== 高度计算 ========================

/**
 * 计算卡片高度 (同步计算，基于 ratio)
 */
function calculateCardHeight(item: WaterfallItem): number {
  const colWidth = columnWidth.value;
  if (colWidth <= 0) return props.estimateHeight;

  // 1. 优先使用 ratio (最可靠)
  if (item.ratio && item.ratio > 0) {
    const imageHeight = colWidth * item.ratio;
    return Math.round(imageHeight + (item.extraHeight ?? props.defaultExtraHeight));
  }

  // 2. 使用预设的宽高
  if (item.imageWidth && item.imageHeight && item.imageWidth > 0 && item.imageHeight > 0) {
    const scale = colWidth / item.imageWidth;
    const imageHeight = item.imageHeight * scale;
    return Math.round(imageHeight + (item.extraHeight ?? props.defaultExtraHeight));
  }

  // 3. 降级使用估算高度
  return props.estimateHeight;
}

// ======================== 贪心布局算法 ========================

/**
 * 处理新增数据 (同步增量布局，使用绝对定位)
 */
function processNewItems() {
  if (isProcessing.value) return;
  if (processedIndex.value >= props.items.length) return;
  if (columnWidth.value <= 0) return;

  isProcessing.value = true;

  const startIndex = processedIndex.value;
  const items = props.items;

  // 同步处理所有新增项
  for (let i = startIndex; i < items.length; i++) {
    const item = items[i];
    const height = calculateCardHeight(item);

    // 贪心算法: 放入较短的列
    const isLeft = leftHeight.value <= rightHeight.value;

    const card: PlacedCard = {
      index: i,
      id: item.id ?? i,
      column: isLeft ? 0 : 1,
      top: isLeft ? leftHeight.value : rightHeight.value,
      left: isLeft ? paddingXPx.value : rightColumnLeft.value,
      width: columnWidth.value,
      height,
      loadingState: item.image ? 'loading' : 'loaded',
      item,
    };

    cardList.value.push(card);

    if (isLeft) {
      leftHeight.value += height + rowGapPx.value;
    } else {
      rightHeight.value += height + rowGapPx.value;
    }

    processedIndex.value = i + 1;
  }

  isProcessing.value = false;
  isReady.value = true;
}

/**
 * 重置布局
 */
function resetLayout() {
  cardList.value = [];
  leftHeight.value = paddingYPx.value;
  rightHeight.value = paddingYPx.value;
  processedIndex.value = 0;
  isProcessing.value = false;
}

// ======================== 事件处理 ========================

function onScroll(e: { detail?: { scrollTop?: number }; scrollTop?: number }) {
  const detail = e.detail || e;
  scrollTop.value = detail.scrollTop || 0;

  emit('scroll', {
    scrollTop: scrollTop.value,
    scrollHeight: totalHeight.value,
  });

  // 检查是否需要加载更多
  const remainingHeight = totalHeight.value - scrollTop.value - heightPx.value;
  if (remainingHeight < props.lowerThreshold) {
    emit('load-more');
  }
}

function onScrollToLower() {
  emit('reach-bottom');
  emit('load-more');
}

function onCardClick(card: PlacedCard) {
  emit('card-click', card.item, card.index);
}

function setCardLoadingState(card: PlacedCard, state: WaterfallLoadingState) {
  if (card.loadingState === state) return;
  card.loadingState = state;
}

function onImageLoaded(card: PlacedCard) {
  setCardLoadingState(card, 'loaded');
  emit('image-loaded', card.item, card.index);
}

function onImageError(card: PlacedCard) {
  setCardLoadingState(card, 'error');
  emit('image-error', card.item, card.index);
}

// ======================== 容器测量 ========================

async function measureContainer() {
  await nextTick();

  return new Promise<void>(resolve => {
    const query = uni.createSelectorQuery();
    query
      .select(`#${rootId}`)
      .boundingClientRect(rect => {
        const info = Array.isArray(rect) ? rect[0] : rect;
        const sys = uni.getSystemInfoSync?.();
        if (info && info.width && info.width > 0) {
          containerWidth.value = info.width;
        } else {
          // 降级使用屏幕宽度
          containerWidth.value = sys?.windowWidth || 375;
        }
        if (info && info.height && info.height > 0) {
          containerHeight.value = info.height;
        } else {
          // 降级使用屏幕高度
          containerHeight.value = sys?.windowHeight || 600;
        }
        resolve();
      })
      .exec();
  });
}

// ======================== 生命周期 ========================

onMounted(async () => {
  await measureContainer();
  resetLayout();
  processNewItems();
});

// 监听数据变化
watch(
  () => props.items.length,
  (newLen, oldLen) => {
    if (newLen > oldLen) {
      // 新增数据，增量处理
      processNewItems();
    } else if (newLen < oldLen || newLen === 0) {
      // 数据减少或清空，重置布局
      resetLayout();
      processNewItems();
    }
  }
);

// 监听容器宽度变化，重新布局
watch(columnWidth, (newWidth, oldWidth) => {
  if (oldWidth > 0 && newWidth !== oldWidth) {
    resetLayout();
    processNewItems();
  }
});

// ======================== 样式计算 ========================

const containerStyle = computed<CSSProperties>(() => ({
  height: addUnit(heightPx.value),
}));

const contentStyle = computed<CSSProperties>(() => ({
  position: 'relative',
  minHeight: addUnit(totalHeight.value),
}));

const columnStyle = computed<CSSProperties>(() => ({
  width: addUnit(columnWidth.value),
}));

/** 获取卡片的绝对定位样式 */
function getCardStyle(card: PlacedCard): CSSProperties {
  return {
    position: 'absolute',
    top: addUnit(card.top),
    left: addUnit(card.left ?? 0),
    width: addUnit(card.width),
    height: addUnit(card.height),
    borderRadius: addUnit(cardRadiusPx.value),
  };
}
</script>

<template>
  <view :id="rootId" class="lk-waterfall" :style="containerStyle">
    <scroll-view
      class="lk-waterfall__scroll"
      scroll-y
      :scroll-with-animation="scrollWithAnimation"
      :enhanced="enhanced"
      :bounces="bounces"
      :show-scrollbar="showScrollbar"
      :lower-threshold="lowerThreshold"
      @scroll="onScroll"
      @scrolltolower="onScrollToLower"
    >
      <!-- 头部插槽 -->
      <slot name="header" />

      <!-- 初始加载骨架屏 -->
      <view
        v-if="showSkeleton && !isReady"
        class="lk-waterfall__init-skeleton"
        :style="{ padding: `${addUnit(paddingYPx)} ${addUnit(paddingXPx)}` }"
      >
        <view class="lk-waterfall__columns">
          <view class="lk-waterfall__column" :style="columnStyle">
            <view
              v-for="i in 3"
              :key="`left-skel-${i}`"
              class="lk-waterfall__skeleton-card"
              :style="{
                height: `${180 + i * 40}px`,
                borderRadius: addUnit(cardRadiusPx),
                marginBottom: addUnit(rowGapPx),
              }"
            >
              <lk-skeleton
                :loading="true"
                :animated="true"
                :avatar="false"
                :title="false"
                :rows="0"
              />
              <view class="lk-waterfall__skeleton-image" />
              <view class="lk-waterfall__skeleton-content">
                <lk-skeleton
                  :loading="true"
                  :animated="true"
                  :avatar="false"
                  :title="true"
                  title-width="80%"
                  :rows="1"
                  row-width="60%"
                />
              </view>
            </view>
          </view>
          <view class="lk-waterfall__column" :style="columnStyle">
            <view
              v-for="i in 3"
              :key="`right-skel-${i}`"
              class="lk-waterfall__skeleton-card"
              :style="{
                height: `${220 + i * 30}px`,
                borderRadius: addUnit(cardRadiusPx),
                marginBottom: addUnit(rowGapPx),
              }"
            >
              <lk-skeleton
                :loading="true"
                :animated="true"
                :avatar="false"
                :title="false"
                :rows="0"
              />
              <view class="lk-waterfall__skeleton-image" />
              <view class="lk-waterfall__skeleton-content">
                <lk-skeleton
                  :loading="true"
                  :animated="true"
                  :avatar="false"
                  :title="true"
                  title-width="70%"
                  :rows="1"
                  row-width="50%"
                />
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 正式内容 - 使用绝对定位布局 -->
      <view v-else class="lk-waterfall__content" :style="contentStyle">
        <!-- 单一循环渲染所有卡片，避免小程序插槽冲突 -->
        <view
          v-for="card in cardList"
          :key="card.id"
          class="lk-waterfall__card"
          :style="getCardStyle(card)"
          @click="onCardClick(card)"
        >
          <!-- 插槽内容 -->
          <slot
            name="item"
            :item="card.item"
            :index="card.index"
            :width="card.width"
            :height="card.height"
            :loading="card.loadingState === 'loading'"
            :image-state="card.loadingState"
            :on-image-load="() => onImageLoaded(card)"
            :on-image-error="() => onImageError(card)"
          >
            <!-- 默认卡片 -->
            <view class="lk-waterfall__default-card">
              <image
                v-if="card.item.image"
                class="lk-waterfall__default-image"
                :src="card.item.image"
                mode="widthFix"
                :lazy-load="true"
                @load="onImageLoaded(card)"
                @error="onImageError(card)"
              />
              <view class="lk-waterfall__default-content">
                <text class="lk-waterfall__default-title">{{
                  card.item.title || `#${card.index + 1}`
                }}</text>
              </view>
            </view>
          </slot>
        </view>

        <!-- 加载更多状态 -->
        <view
          v-if="cardList.length > 0"
          class="lk-waterfall__footer"
          :style="{
            position: 'absolute',
            top: addUnit(totalHeight - paddingYPx),
            left: 0,
            right: 0,
          }"
        >
          <slot name="loading">
            <view class="lk-waterfall__loading">
              <view class="lk-waterfall__loading-dot" />
              <view class="lk-waterfall__loading-dot" />
              <view class="lk-waterfall__loading-dot" />
            </view>
          </slot>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
