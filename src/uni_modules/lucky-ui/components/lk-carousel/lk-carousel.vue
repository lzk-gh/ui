<script lang="ts" setup>
import { ref, computed, watch, nextTick, getCurrentInstance, onMounted, useSlots } from 'vue';
import { carouselProps } from './carousel.props';
import lkCarouselItem from './lk-carousel-item.vue';

const props = defineProps(carouselProps);

const emit = defineEmits<{
  'update:current': [value: number];
  change: [value: number];
  click: [item: any, index: number];
}>();

// swiper 绑定的内部 current
const innerCurrent = ref(props.current);

const length = computed(() => props.carouselList?.length || 0);
const slots = useSlots();
const hasDefaultSlot = computed(() => !!slots.default);
const autoplayEnabled = computed(() => props.autoPlay && length.value > 1);
// 是否启用循环：受用户配置 loop 控制，同时必须有多张图片
const circular = computed(() => !!props.loop && length.value > 1);
const resolvedIndicatorPosition = computed(() => {
  if (props.indicatorPosition && props.indicatorPosition !== 'auto') return props.indicatorPosition;
  return props.vertical ? 'right' : 'bottom';
});
const indicatorVertical = computed(() =>
  ['left', 'right'].includes(resolvedIndicatorPosition.value)
);
// 是否展示指示器：支持 indicatorType='none' 直接不展示
const showIndicators = computed(
  () => props.showIndicators && props.indicatorType !== 'none' && length.value > 1
);
// 是否为非覆盖（外部）指示器
const indicatorOutside = computed(() => !props.indicatorOverlay && showIndicators.value);

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
// 外部指示器实际像素高度（仅在 indicatorOverlay=false 时生效）
const indicatorHeightPx = ref<number>(0);
const instance = getCurrentInstance();
const heightProp = computed(() =>
  typeof props.height === 'number' ? `${props.height}px` : props.height
);

// 不同类型指示器的预估占位（rpx，用于固定高时 CSS calc）
const indicatorSpaceRpx = computed(() => {
  if (!indicatorOutside.value) return '0rpx';
  const type = props.indicatorType;
  if (type === 'number') return '40rpx';
  if (type === 'bars') return '28rpx';
  return '32rpx'; // dots 默认
});

// 外层容器样式：autoHeight 时包含内容高度 + 指示器像素高度；固定高保持传入高度
const outerStyle = computed(() => {
  if (props.autoHeight) {
    const total = currentHeight.value + (indicatorOutside.value ? indicatorHeightPx.value : 0);
    return { height: `${Math.max(0, total)}px` };
  }
  return {
    height: heightProp.value,
    '--lk-indicator-space': indicatorSpaceRpx.value,
  } as any;
});

// swiper 样式：autoHeight 使用内容像素高；固定高用 calc(100% - 指示器占位)
const swiperStyle = computed(() => {
  if (props.autoHeight) {
    return { height: `${Math.max(0, currentHeight.value)}px` };
  }
  if (indicatorOutside.value) {
    return { height: 'calc(100% - var(--lk-indicator-space))' } as any;
  }
  return { height: '100%' };
});

function measureActiveHeight() {
  if (!props.autoHeight) return;
  const idx = innerCurrent.value;
  nextTick(() => {
    const q = uni.createSelectorQuery().in(instance as any);
    q.select(`#lk-slide-${idx}`)
      .boundingClientRect(rect => {
        const r: any = rect as any;
        const h = Array.isArray(r) ? r[0]?.height || 0 : r?.height || 0;
        if (h) currentHeight.value = h;
      })
      .exec();
    // 再次测量以适配图片延迟加载
    setTimeout(() => {
      const q2 = uni.createSelectorQuery().in(instance as any);
      q2.select(`#lk-slide-${idx}`)
        .boundingClientRect(rect => {
          const r: any = rect as any;
          const h = Array.isArray(r) ? r[0]?.height || 0 : r?.height || 0;
          if (h) currentHeight.value = h;
        })
        .exec();
    }, 200);
  });
}

function measureIndicatorHeight() {
  if (!props.autoHeight || !indicatorOutside.value) {
    indicatorHeightPx.value = 0;
    return;
  }
  nextTick(() => {
    const q = uni.createSelectorQuery().in(instance as any);
    q.select('#lk-indicators-outside')
      .boundingClientRect(rect => {
        const r: any = rect as any;
        const h = Array.isArray(r) ? r[0]?.height || 0 : r?.height || 0;
        indicatorHeightPx.value = h || 0;
      })
      .exec();
  });
}

// v-model 同步（外 -> 内）
watch(
  () => props.current,
  val => {
    const n = length.value;
    if (typeof val !== 'number' || n === 0) return;
    const clamped = Math.max(0, Math.min(val, Math.max(0, n - 1)));
    innerCurrent.value = clamped;
    measureActiveHeight();
    measureIndicatorHeight();
  }
);

// 数据源长度变化时，校正 current
watch(
  () => length.value,
  n => {
    if (n <= 0) {
      innerCurrent.value = 0;
      currentHeight.value = 0;
      indicatorHeightPx.value = 0;
      return;
    }
    if (innerCurrent.value > n - 1) {
      innerCurrent.value = n - 1;
    }
    measureActiveHeight();
    measureIndicatorHeight();
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
  measureIndicatorHeight();
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
  measureIndicatorHeight();
}

onMounted(() => {
  measureActiveHeight();
  measureIndicatorHeight();
});
</script>

<template>
  <view class="lk-carousel" :style="outerStyle">
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
      @change="onSwiperChange"
      :indicator-dots="false"
    >
      <swiper-item v-for="(item, index) in carouselList" :key="index">
        <view
          class="lk-carousel__item"
          :class="{
            'is-card': card,
            'is-active': index === innerCurrent,
            'is-inactive': index !== innerCurrent,
            'is-auto-height': autoHeight,
          }"
          :style="
            card
              ? {
                  '--lk-card-scale': String(cardScale),
                  '--lk-card-radius': cardRadius,
                  '--lk-card-shadow': cardShadow,
                }
              : undefined
          "
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

    <template v-if="props.indicatorOverlay">
      <!-- 指示器：数字类型 -->
      <view
        v-if="showIndicators && indicatorType === 'number'"
        class="lk-carousel__indicators is-number"
        :class="[
          `lk-carousel__indicators--pos-${resolvedIndicatorPosition}`,
          `is-align-${indicatorAlign}`,
          { 'is-vertical': indicatorVertical },
        ]"
      >
        <view class="lk-carousel__indicator-number">{{ innerCurrent + 1 }}/{{ length }}</view>
      </view>

      <!-- 指示器：点状或条状 -->
      <view
        v-else-if="showIndicators && (indicatorType === 'dots' || indicatorType === 'bars')"
        class="lk-carousel__indicators"
        :class="[
          `lk-carousel__indicators--pos-${resolvedIndicatorPosition}`,
          `is-align-${indicatorAlign}`,
          {
            'is-vertical': indicatorVertical,
            'is-bars': indicatorType === 'bars',
          },
        ]"
      >
        <view
          v-for="(_, index) in carouselList"
          :key="index"
          class="lk-carousel__indicator"
          :class="{
            'is-active': index === innerCurrent,
            'is-dot': indicatorType === 'dots',
            'is-bar': indicatorType === 'bars',
          }"
          :style="{
            backgroundColor: index === innerCurrent ? indicatorActiveColor : indicatorColor,
          }"
          @click="indicatorClickable ? setActive(index) : undefined"
        ></view>
      </view>
    </template>
    <template v-if="!props.indicatorOverlay">
      <!-- 指示器：数字类型 -->
      <view
        v-if="showIndicators && indicatorType === 'number'"
        class="lk-carousel__indicators is-outside is-number"
        id="lk-indicators-outside"
        :class="[
          `lk-carousel__indicators--pos-${resolvedIndicatorPosition}`,
          `is-align-${indicatorAlign}`,
          { 'is-vertical': indicatorVertical },
        ]"
      >
        <view class="lk-carousel__indicator-number">{{ innerCurrent + 1 }}/{{ length }}</view>
      </view>

      <!-- 指示器：点状或条状 -->
      <view
        v-else-if="showIndicators && (indicatorType === 'dots' || indicatorType === 'bars')"
        class="lk-carousel__indicators is-outside"
        id="lk-indicators-outside"
        :class="[
          `lk-carousel__indicators--pos-${resolvedIndicatorPosition}`,
          `is-align-${indicatorAlign}`,
          {
            'is-vertical': indicatorVertical,
            'is-bars': indicatorType === 'bars',
          },
        ]"
      >
        <view
          v-for="(_, index) in carouselList"
          :key="index"
          class="lk-carousel__indicator"
          :class="{
            'is-active': index === innerCurrent,
            'is-dot': indicatorType === 'dots',
            'is-bar': indicatorType === 'bars',
          }"
          :style="{
            backgroundColor: index === innerCurrent ? indicatorActiveColor : indicatorColor,
          }"
          @click="indicatorClickable ? setActive(index) : undefined"
        ></view>
      </view>
    </template>
  </view>
</template>

<style lang="scss" scoped>
@use './index.scss';
</style>
