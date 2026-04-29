<script lang="ts" setup>
import type { StyleValue } from 'vue';
import { ref, computed, watch, nextTick, getCurrentInstance, onMounted, useSlots } from 'vue';
import { carouselEmits, carouselProps } from './carousel.props';
import lkCarouselItem from './lk-carousel-item.vue';

const props = defineProps(carouselProps);
const emit = defineEmits(carouselEmits);

const innerCurrent = ref(props.current);
const length = computed(() => props.carouselList?.length || 0);
const slots = useSlots();
const hasDefaultSlot = computed(() => !!slots.default);
const autoplayEnabled = computed(() => props.autoPlay && length.value > 1);
const circular = computed(() => !!props.loop && length.value > 1);

// 指示器位置
const resolvedIndicatorPosition = computed(() => {
  if (props.indicatorPosition && props.indicatorPosition !== 'auto') return props.indicatorPosition;
  return props.vertical ? 'right' : 'bottom';
});
const indicatorVertical = computed(() =>
  ['left', 'right'].includes(resolvedIndicatorPosition.value)
);
const showIndicators = computed(
  () => props.showIndicators && props.indicatorType !== 'none' && length.value > 1
);
const indicatorOutside = computed(() => !props.indicatorOverlay && showIndicators.value);
const indicatorInactiveColor = computed(() => props.indicatorInactiveColor || props.indicatorColor || undefined);

// Margin 处理
const previousMargin = computed(() => {
  if (props.card) return props.cardPrevMargin || 'var(--lk-rpx-60)';
  if (props.peek) return props.peekPrevMargin;
  return '0';
});
const nextMargin = computed(() => {
  if (props.card) return props.cardNextMargin || 'var(--lk-rpx-60)';
  if (props.peek) return props.peekNextMargin;
  return '0';
});

// 高度处理
const currentHeight = ref<number>(0);
const indicatorHeightPx = ref<number>(0);
const instance = getCurrentInstance();

const heightProp = computed(() => {
  if (!props.height) return 'var(--lk-rpx-320)';
  return typeof props.height === 'number' ? `${props.height}px` : props.height;
});

// 指示器占位
const indicatorSpaceRpx = computed(() => {
  if (!indicatorOutside.value) return 'var(--lk-rpx-0)';
  const type = props.indicatorType;
  if (type === 'number') return 'var(--lk-rpx-50)';
  return 'var(--lk-rpx-40)';
});

// 外层容器样式
const outerStyle = computed(() => {
  if (props.autoHeight) {
    const total = currentHeight.value + (indicatorOutside.value ? indicatorHeightPx.value : 0);
    return {
      height: total > 0 ? `${total}px` : 'var(--lk-rpx-200)',
      transition: 'height 0.3s ease',
    };
  }
  return {
    height: heightProp.value,
    '--lk-indicator-space': indicatorSpaceRpx.value,
  };
});

// Swiper 样式
const swiperStyle = computed(() => {
  if (props.autoHeight) {
    return { height: currentHeight.value > 0 ? `${currentHeight.value}px` : '100%' };
  }
  if (indicatorOutside.value) {
    return { height: 'calc(100% - var(--lk-indicator-space))' };
  }
  return { height: '100%' };
});

// 卡片样式变量
const cardStyleVars = computed(() => {
  if (!props.card) return {};
  return {
    '--lk-card-scale': props.cardScale ? String(props.cardScale) : '0.9',
    '--lk-card-radius': props.cardRadius || 'var(--lk-rpx-16)',
    '--lk-card-shadow': props.cardShadow || '0 var(--lk-rpx-8) var(--lk-rpx-24) rgba(0,0,0,0.12)',
  };
});

// 测量内容高度
function measureActiveHeight() {
  if (!props.autoHeight) return;
  const idx = innerCurrent.value;

  function query() {
    const q = uni.createSelectorQuery().in(instance?.proxy);
    q.select(`#lk-slide-${idx}`)
      .boundingClientRect(rect => {
        const r: any = rect as any;
        const h = Array.isArray(r) ? r[0]?.height || 0 : r?.height || 0;
        if (h && h !== currentHeight.value) {
          currentHeight.value = h;
          emit('height-change', h);
        }
      })
      .exec();
  }

  nextTick(() => {
    query();
    setTimeout(query, 150);
    setTimeout(query, 300);
  });
}

// 测量外部指示器高度
function measureIndicatorHeight() {
  if (!props.autoHeight || !indicatorOutside.value) {
    indicatorHeightPx.value = 0;
    return;
  }
  nextTick(() => {
    const q = uni.createSelectorQuery().in(instance?.proxy);
    q.select('#lk-indicators-outside')
      .boundingClientRect(rect => {
        const r: any = rect as any;
        const h = Array.isArray(r) ? r[0]?.height || 0 : r?.height || 0;
        indicatorHeightPx.value = h || 0;
      })
      .exec();
  });
}

// 监听
watch(
  () => props.current,
  val => {
    const n = length.value;
    if (typeof val !== 'number' || n === 0) return;
    const clamped = Math.max(0, Math.min(val, Math.max(0, n - 1)));
    if (innerCurrent.value !== clamped) innerCurrent.value = clamped;
  }
);

watch(
  () => innerCurrent.value,
  () => measureActiveHeight()
);

watch(
  () => length.value,
  n => {
    if (n <= 0) {
      innerCurrent.value = 0;
      currentHeight.value = 0;
      return;
    }
    if (innerCurrent.value > n - 1) innerCurrent.value = n - 1;
    measureActiveHeight();
    measureIndicatorHeight();
  }
);

function updateActive(index: number, source: 'swiper' | 'indicator' | 'api' = 'api') {
  const oldValue = innerCurrent.value;
  if (oldValue === index) return;
  innerCurrent.value = index;
  emit('update:current', index);
  emit('change', index, oldValue, source);
  if (source === 'swiper' && props.autoPlay) emit('autoplay-change', index, oldValue);
}

function onSwiperChange(e: any) {
  const idx = e?.detail?.current ?? 0;
  updateActive(idx, 'swiper');
}

function onItemClick(index: number, event?: unknown) {
  const list = props.carouselList || [];
  if (list.length) emit('click', list[index], index, event);
}

function setActive(index: number, event?: unknown) {
  const n = length.value;
  if (n === 0) return;
  const clamped = Math.max(0, Math.min(index, n - 1));
  emit('indicator-click', clamped, innerCurrent.value, event);
  updateActive(clamped, 'indicator');
}

const rootStyle = computed<StyleValue>(() => [outerStyle.value, props.customStyle as StyleValue]);

onMounted(() => {
  measureActiveHeight();
  measureIndicatorHeight();
});
</script>

<template>
  <view :id="id" class="lk-carousel" :class="customClass" :style="rootStyle">
    <swiper
      class="lk-carousel__swiper"
      :style="swiperStyle"
      :current="innerCurrent"
      :autoplay="autoplayEnabled"
      :interval="interval"
      :circular="circular"
      :vertical="vertical"
      :previous-margin="previousMargin"
      :next-margin="nextMargin"
      :duration="300"
      :indicator-dots="false"
      @change="onSwiperChange"
    >
      <swiper-item v-for="(item, index) in carouselList" :key="index">
        <view
          :id="`lk-slide-${index}`"
          class="lk-carousel__item-wrap"
          :class="{
            'is-card': card,
            'is-active': index === innerCurrent,
            'is-inactive': index !== innerCurrent,
            'is-auto-height': autoHeight,
          }"
          :style="card ? cardStyleVars : undefined"
          @tap="onItemClick(index, $event)"
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

    <!-- 内部指示器 (Overlay) -->
    <template v-if="props.indicatorOverlay && showIndicators">
      <view
        class="lk-carousel__indicators"
        :class="[
          `lk-carousel__indicators--pos-${resolvedIndicatorPosition}`,
          `is-align-${indicatorAlign}`,
          {
            'is-vertical': indicatorVertical,
            'is-animated': indicatorAnimated,
          },
        ]"
      >
        <view v-if="indicatorType === 'number'" class="lk-carousel__indicator-number">
          {{ innerCurrent + 1 }}/{{ length }}
        </view>
        <view
          v-for="(_, index) in carouselList"
          v-else-if="indicatorType === 'dots' || indicatorType === 'bars'"
          :key="index"
          class="lk-carousel__indicator"
          :class="{
            'is-active': index === innerCurrent,
            'is-dot': indicatorType === 'dots',
            'is-bar': indicatorType === 'bars',
          }"
          :style="{
            backgroundColor:
              index === innerCurrent
                ? indicatorActiveColor || undefined
                : indicatorInactiveColor,
          }"
          @tap.stop="indicatorClickable ? setActive(index, $event) : undefined"
        ></view>
      </view>
    </template>

    <!-- 外部指示器 (Outside) -->
    <template v-if="!props.indicatorOverlay && showIndicators">
      <view
        id="lk-indicators-outside"
        class="lk-carousel__indicators is-outside"
        :class="[
          `lk-carousel__indicators--pos-${resolvedIndicatorPosition}`,
          `is-align-${indicatorAlign}`,
          {
            'is-vertical': indicatorVertical,
            'is-animated': indicatorAnimated,
          },
        ]"
      >
        <view v-if="indicatorType === 'number'" class="lk-carousel__indicator-number">
          {{ innerCurrent + 1 }}/{{ length }}
        </view>
        <view
          v-for="(_, index) in carouselList"
          v-else-if="indicatorType === 'dots' || indicatorType === 'bars'"
          :key="index"
          class="lk-carousel__indicator"
          :class="{
            'is-active': index === innerCurrent,
            'is-dot': indicatorType === 'dots',
            'is-bar': indicatorType === 'bars',
          }"
          :style="{
            backgroundColor:
              index === innerCurrent
                ? indicatorActiveColor || undefined
                : indicatorInactiveColor,
          }"
          @tap.stop="indicatorClickable ? setActive(index, $event) : undefined"
        ></view>
      </view>
    </template>
  </view>
</template>

<style lang="scss" scoped>
@use './index.scss';
</style>
