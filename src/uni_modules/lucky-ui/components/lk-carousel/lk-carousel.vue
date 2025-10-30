<script lang="ts" setup>
import { ref, computed, watch, nextTick, getCurrentInstance, onMounted, useSlots } from 'vue';
import lkCarouselItem from './lk-carousel-item.vue';

interface Props {
  carouselList?: any[];
  current?: number; // v-model:current
  autoPlay?: boolean; // 是否自动播放
  interval?: number; // 自动播放间隔(ms)
  // 兼容历史：effect 参数已不再生效，统一使用内置 swiper 的滑动效果
  effect?: 'fade' | 'slide';
  // 新增：是否垂直方向
  vertical?: boolean;
  // 新增：是否显示指示器
  showIndicators?: boolean;
  // 新增：指示器类型：点状/条状/数字
  indicatorType?: 'dots' | 'bars' | 'number';
  // 新增：指示器位置；auto 会在 vertical=true 时放到 right，否则 bottom
  indicatorPosition?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  // 新增：指示器对齐：居中/开始/结束
  indicatorAlign?: 'center' | 'start' | 'end';
  // 新增：指示器是否可点击（数字类型无效）
  indicatorClickable?: boolean;
  // 新增：指示器颜色
  indicatorColor?: string;
  indicatorActiveColor?: string;
  // 新增：卡片样式
  card?: boolean;
  cardPrevMargin?: string; // e.g. '40rpx'
  cardNextMargin?: string; // e.g. '40rpx'
  cardScale?: number; // 非激活卡片缩放
  cardRadius?: string; // 卡片圆角
  cardShadow?: string; // 卡片阴影
  // 新增：预览下一张（只在一侧留白显示部分下一张）
  peek?: boolean;
  peekPrevMargin?: string; // e.g. '0'
  peekNextMargin?: string; // e.g. '60rpx'
  // 新增：指示器动画
  indicatorAnimated?: boolean;
  // 新增：自适应内容高度
  autoHeight?: boolean;
  // 新增：固定高度（autoHeight=false 时生效）
  height?: string | number;
}

const props = withDefaults(defineProps<Props>(), {
  carouselList: () => [],
  current: 0,
  autoPlay: true,
  interval: 3000,
  effect: 'fade',
  vertical: false,
  showIndicators: true,
  indicatorType: 'dots',
  indicatorPosition: 'auto',
  indicatorAlign: 'center',
  indicatorClickable: true,
  indicatorColor: 'rgba(255, 255, 255, 0.5)',
  indicatorActiveColor: 'rgba(255, 255, 255, 1)',
  card: false,
  cardPrevMargin: '40rpx',
  cardNextMargin: '40rpx',
  cardScale: 0.92,
  cardRadius: '16rpx',
  cardShadow: '0 12rpx 32rpx rgba(0,0,0,0.18)',
  peek: false,
  peekPrevMargin: '0',
  peekNextMargin: '60rpx',
  indicatorAnimated: true,
  autoHeight: false,
  height: '400rpx',
});

const emit = defineEmits<{
  'update:current': [value: number]
  'change': [value: number]
  'click': [item: any, index: number]
}>();

// swiper 绑定的内部 current
const innerCurrent = ref(props.current);

const length = computed(() => props.carouselList?.length || 0);
const slots = useSlots();
const hasDefaultSlot = computed(() => !!slots.default);
const autoplayEnabled = computed(() => props.autoPlay && length.value > 1);
const circular = computed(() => length.value > 1);
const resolvedIndicatorPosition = computed(() => {
  if (props.indicatorPosition && props.indicatorPosition !== 'auto') return props.indicatorPosition;
  return props.vertical ? 'right' : 'bottom';
});
const indicatorVertical = computed(() => ['left', 'right'].includes(resolvedIndicatorPosition.value));
const showIndicators = computed(() => props.showIndicators && length.value > 1);

// 统一处理 previous/next margin：卡片优先，其次 peek
const previousMargin = computed(() => {
  if (props.card) return props.cardPrevMargin;
  if (props.peek) return props.peekPrevMargin;
  return '0';
});
const nextMargin = computed(() => {
  if (props.card) return props.cardNextMargin;
  if (props.peek) return props.peekNextMargin;
  return '0';
});

// 自适应高度支持
const currentHeight = ref<number>(0);
const instance = getCurrentInstance();
const heightProp = computed(() => typeof props.height === 'number' ? `${props.height}px` : props.height);
const outerStyle = computed(() => props.autoHeight ? { height: `${Math.max(0, currentHeight.value)}px` } : { height: heightProp.value });
const swiperStyle = outerStyle; // swiper 与容器保持同高

function measureActiveHeight() {
  if (!props.autoHeight) return;
  const idx = innerCurrent.value;
  nextTick(() => {
    const q = uni.createSelectorQuery().in(instance as any);
    q.select(`#lk-slide-${idx}`).boundingClientRect((rect) => {
      const r: any = rect as any;
      const h = Array.isArray(r) ? (r[0]?.height || 0) : (r?.height || 0);
      if (h) currentHeight.value = h;
    }).exec();
    // 再次测量以适配图片延迟加载
    setTimeout(() => {
      const q2 = uni.createSelectorQuery().in(instance as any);
      q2.select(`#lk-slide-${idx}`).boundingClientRect((rect) => {
        const r: any = rect as any;
        const h = Array.isArray(r) ? (r[0]?.height || 0) : (r?.height || 0);
        if (h) currentHeight.value = h;
      }).exec();
    }, 200);
  });
}

// v-model 同步（外 -> 内）
watch(
  () => props.current,
  (val) => {
    const n = length.value;
    if (typeof val !== 'number' || n === 0) return;
    const clamped = Math.max(0, Math.min(val, Math.max(0, n - 1)));
    innerCurrent.value = clamped;
    measureActiveHeight();
  }
);

// 数据源长度变化时，校正 current
watch(
  () => length.value,
  (n) => {
    if (n <= 0) {
      innerCurrent.value = 0;
      currentHeight.value = 0;
      return;
    }
    if (innerCurrent.value > n - 1) {
      innerCurrent.value = n - 1;
    }
    measureActiveHeight();
  }
);

function updateActive(index: number) {
  innerCurrent.value = index;
  emit('update:current', index);
  emit('change', index);
}

function onSwiperChange(e: any) {
  const idx = e?.detail?.current ?? 0;
  updateActive(idx);
  measureActiveHeight();
}

function onItemClick(index: number) {
  const list = props.carouselList || [];
  if (!list.length) return;
  emit('click', list[index], index);
}

function setActive(index: number) {
  const n = length.value;
  if (n === 0) return;
  const clamped = Math.max(0, Math.min(index, n - 1));
  updateActive(clamped);
  measureActiveHeight();
}

onMounted(() => {
  measureActiveHeight();
});
</script>

<template>
  <view class="lk-carousel" :style="outerStyle">
    <swiper
      class="lk-swiper"
      :style="swiperStyle"
      :current="innerCurrent"
      :autoplay="autoplayEnabled"
      :interval="interval"
      :circular="circular"
      :vertical="vertical"
      :previous-margin="previousMargin"
      :next-margin="nextMargin"
      :duration="300"
      @change="onSwiperChange"
      :indicator-dots="false"
    >
      <swiper-item v-for="(item, index) in carouselList" :key="index">
        <view
          class="carousel-item-wrapper"
          :class="{
            'is-card': card,
            'is-active': index === innerCurrent,
            'is-inactive': index !== innerCurrent,
            'auto-height': autoHeight,
          }"
          :style="card ? { '--lk-card-scale': String(cardScale), '--lk-card-radius': cardRadius, '--lk-card-shadow': cardShadow } : undefined"
          :id="`lk-slide-${index}`"
          @click="onItemClick(index)"
        >
          <template v-if="hasDefaultSlot">
            <slot :item="item" :index="index" />
          </template>
          <template v-else>
            <lk-carousel-item :src="item" />
          </template>
        </view>
      </swiper-item>
    </swiper>

    <!-- 指示器：数字类型 -->
    <view
      v-if="showIndicators && indicatorType === 'number'"
      class="lk-indicators number"
      :class="[
        `pos-${resolvedIndicatorPosition}`,
        `align-${indicatorAlign}`,
        { vertical: indicatorVertical },
      ]"
    >
      <view class="lk-indicator-number">{{ innerCurrent + 1 }}/{{ length }}</view>
    </view>

    <!-- 指示器：点状或条状 -->
    <view
      v-else-if="showIndicators && (indicatorType === 'dots' || indicatorType === 'bars')"
      class="lk-indicators"
      :class="[
        `pos-${resolvedIndicatorPosition}`,
        `align-${indicatorAlign}`,
        { vertical: indicatorVertical, bars: indicatorType === 'bars', animated: indicatorAnimated },
      ]"
    >
      <view
        v-for="(_, index) in carouselList"
        :key="index"
        class="lk-indicator"
        :class="{
          active: index === innerCurrent,
          dot: indicatorType === 'dots',
          bar: indicatorType === 'bars',
        }"
        :style="{
          backgroundColor: index === innerCurrent ? indicatorActiveColor : indicatorColor,
        }"
        @click="indicatorClickable ? setActive(index) : undefined"
      ></view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.lk-carousel {
  position: relative;
  width: 100%;
  height: 400rpx;
  overflow: hidden;

  .lk-swiper {
    width: 100%;
    height: 100%;
  }

  .carousel-item-wrapper {
    width: 100%;
    height: 100%;
    transition: transform 0.3s ease;
    &.auto-height {
      height: auto;
    }
    &.is-card {
      border-radius: var(--lk-card-radius, 16rpx);
      overflow: hidden;
      position: relative;
    }
    &.is-card.is-inactive {
      transform: scale(var(--lk-card-scale, 0.92));
      opacity: 0.92;
      z-index: 1;
    }
    &.is-card.is-active {
      transform: scale(1);
      box-shadow: var(--lk-card-shadow, 0 12rpx 32rpx rgba(0,0,0,0.18));
      z-index: 2;
    }
  }

  /* 指示器通用容器 */
  .lk-indicators {
    position: absolute;
    display: flex;
    gap: 10rpx;
    &.vertical {
      flex-direction: column;
    }
    &.align-start {
      justify-content: flex-start;
    }
    &.align-center {
      justify-content: center;
    }
    &.align-end {
      justify-content: flex-end;
    }

    /* 位置 */
    &.pos-bottom {
      left: 50%;
      transform: translateX(-50%);
      bottom: 20rpx;
    }
    &.pos-top {
      left: 50%;
      transform: translateX(-50%);
      top: 20rpx;
    }
    &.pos-left {
      left: 20rpx;
      top: 50%;
      transform: translateY(-50%);
    }
    &.pos-right {
      right: 20rpx;
      top: 50%;
      transform: translateY(-50%);
    }

    /* 点/条 */
    .lk-indicator {
      transition: background-color 0.28s ease, width 0.28s ease, height 0.28s ease, transform 0.28s ease;
      &.dot {
        width: 12rpx;
        height: 12rpx;
        border-radius: 50%;
      }
      &.bar {
        width: 24rpx;
        height: 6rpx;
        border-radius: 8rpx;
      }
      &.active {
        transform: scale(1.25);
      }
    }

    &.vertical.bars .lk-indicator {
      width: 8rpx;
      height: 28rpx;
    }

    /* 数字类型 */
    &.number .lk-indicator-number {
      padding: 6rpx 12rpx;
      background: rgba(0, 0, 0, 0.35);
      color: #fff;
      border-radius: 20rpx;
      font-size: 24rpx;
      line-height: 1;
    }
  }
}

</style>
