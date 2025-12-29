<script setup lang="ts">
import { computed, inject } from 'vue';

defineOptions({ name: 'LkTimelineItem' });

const emits = defineEmits<{ (e: 'click', ev: Event): void }>();

const props = withDefaults(
  defineProps<{
    time?: string;
    title?: string;
    desc?: string;
    icon?: string;
    dot?: boolean;
    color?: string;
    lineColor?: string;
    hollow?: boolean;
  }>(),
  {
    time: '',
    title: '',
    desc: '',
    dot: true,
    hollow: false,
  }
);

const injectedRaw = inject<any>('LkTimelineCtx', null as any);
const injected = computed(
  () =>
    injectedRaw?.value ?? {
      direction: 'vertical',
      mode: 'left',
      dashed: false,
      lineCap: 'equal',
      lineColor: 'var(--lk-color-border-weak)',
      lineWidth: '4rpx',
      itemGap: '28rpx',
      size: 'md',
      lastVisibleTail: false,
    }
);

const dotColor = computed(() => props.color || 'var(--lk-color-primary)');
const lineColorFinal = computed(() => props.lineColor || injected.value.lineColor);
const lineWidth = computed(() => injected.value.lineWidth || '4rpx');
const isDashed = computed(() => !!injected.value.dashed);

function parseRpx(val: string | number | undefined, fallback = 0) {
  if (val == null) return fallback;
  if (typeof val === 'number') return val;
  const m = String(val).match(/(-?\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) : fallback;
}

const sizeToken = computed<'sm' | 'md' | 'lg'>(() => injected.value.size || 'md');
const dotBox = computed(() => {
  const s = sizeToken.value;
  if (s === 'sm') return { size: '16rpx', border: '3rpx', haloPad: 6 };
  if (s === 'lg') return { size: '26rpx', border: '5rpx', haloPad: 10 };
  return { size: '20rpx', border: '4rpx', haloPad: 8 };
});

const dotStyle = computed(() => ({
  width: dotBox.value.size,
  height: dotBox.value.size,
  borderRadius: '50%',
  borderWidth: dotBox.value.border,
  borderStyle: 'solid',
  borderColor: dotColor.value,
  background: props.hollow ? '#fff' : dotColor.value,
}));

const haloStyle = computed(() => {
  const pad = dotBox.value.haloPad;
  const base = parseRpx(dotBox.value.size, 20);
  const halo = base + pad * 2;
  return {
    width: `${halo}rpx`,
    height: `${halo}rpx`,
    background: dotColor.value,
    opacity: '0.15',
  } as Record<string, string>;
});

const lineStyle = computed(() => {
  const color = lineColorFinal.value;
  const width = lineWidth.value;
  const itemGap = injected.value.itemGap || '28rpx';
  return {
    width: width,
    bottom: `-${itemGap}`,
    background: isDashed.value
      ? `repeating-linear-gradient(to bottom, ${color}, ${color} 8rpx, transparent 8rpx, transparent 16rpx)`
      : color,
  } as Record<string, string>;
});

function onClick(ev: Event) {
  emits('click', ev);
}
</script>

<template>
  <view class="lk-timeline-item" role="listitem" @click="onClick">
    <view class="lk-timeline-item__side" v-if="$slots.left">
      <slot name="left" />
    </view>
    <view class="lk-timeline-item__left">
      <view class="lk-timeline-item__dot-wrapper">
        <view class="lk-timeline-item__halo" :style="haloStyle" />
        <slot name="dot">
          <view class="lk-timeline-item__dot" :style="dotStyle">
            <slot name="icon">
              <image v-if="icon" class="lk-timeline-item__icon" :src="icon" mode="aspectFit" />
            </slot>
          </view>
        </slot>
      </view>
      <view class="lk-timeline-item__line" :style="lineStyle" />
    </view>
    <view class="lk-timeline-item__content">
      <view v-if="!!$slots.time || time" class="lk-timeline-item__time">
        <slot name="time">{{ time }}</slot>
      </view>
      <view class="lk-timeline-item__title" v-if="!!$slots.title || title">
        <slot name="title">{{ title }}</slot>
      </view>
      <view class="lk-timeline-item__body">
        <slot />
      </view>
      <view v-if="!!$slots.desc || desc" class="lk-timeline-item__desc">
        <slot name="desc">{{ desc }}</slot>
      </view>
      <view v-if="$slots.extra" class="lk-timeline-item__extra">
        <slot name="extra" />
      </view>
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
