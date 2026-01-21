<script setup lang="ts">
import { computed, inject, useSlots } from 'vue';
import { timelineItemProps } from './timeline-item.props';

defineOptions({ name: 'LkTimelineItem' });

const emits = defineEmits<{ (e: 'click', ev: Event): void }>();
const props = defineProps(timelineItemProps);
const slots = useSlots();

const injectedRaw = inject<any>('LkTimelineCtx', null as any);
const injected = computed(
  () =>
    injectedRaw?.value ?? {
      direction: 'vertical',
      lineColor: 'var(--lk-color-border-weak)',
      lineWidth: '4rpx',
      itemGap: '28rpx',
      size: 'md',
    }
);

const dotSize = computed(() => {
  if (injected.value.size === 'sm') return '16rpx';
  if (injected.value.size === 'lg') return '26rpx';
  return '20rpx';
});

const hasTime = computed(() => !!(props.time || props.endTime || slots.time));

const itemStyle = computed(() => ({
  '--lk-timeline-accent': props.accent,
  '--lk-timeline-card-bg': props.cardBg,
  '--lk-timeline-card-border': props.cardBorder,
  '--lk-timeline-dot-size': dotSize.value,
}));

function onClick(ev: Event) {
  emits('click', ev);
}
</script>

<template>
  <view class="lk-timeline-item" :style="itemStyle" role="listitem" @click="onClick">
    <view v-if="hasTime" class="lk-timeline-item__time">
      <slot name="time">
        <text class="lk-timeline-item__time-start">{{ time }}</text>
        <text v-if="endTime" class="lk-timeline-item__time-end">{{ endTime }}</text>
      </slot>
    </view>

    <view class="lk-timeline-item__rail">
      <view class="lk-timeline-item__dot" />
      <view class="lk-timeline-item__line" />
    </view>

    <view class="lk-timeline-item__card">
      <view class="lk-timeline-item__header">
        <view class="lk-timeline-item__title">
          <slot name="title">{{ title }}</slot>
        </view>
        <view v-if="tag || $slots.tag" class="lk-timeline-item__tag">
          <slot name="tag">{{ tag }}</slot>
        </view>
      </view>

      <view v-if="subtitle" class="lk-timeline-item__subtitle">{{ subtitle }}</view>
      <view v-if="desc" class="lk-timeline-item__desc">{{ desc }}</view>
      <slot />

      <view v-if="location || person || $slots.footer" class="lk-timeline-item__meta">
        <view v-if="location" class="lk-timeline-item__meta-item">
          <lk-icon name="geo-alt" :size="24" />
          <text>{{ location }}</text>
        </view>
        <view v-if="person" class="lk-timeline-item__meta-item">
          <image v-if="avatar" :src="avatar" class="lk-timeline-item__avatar" mode="aspectFill" />
          <lk-icon v-else name="person" :size="24" />
          <text>{{ person }}</text>
        </view>
        <slot name="footer" />
      </view>
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
