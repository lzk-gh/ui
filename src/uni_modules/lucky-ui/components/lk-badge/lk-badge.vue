<script setup lang="ts">
import { computed } from 'vue';
import { badgeProps } from './badge.props';
defineOptions({ name: 'LkBadge' });

const props = defineProps(badgeProps);

const displayValue = computed(() => {
  if (props.dot) return '';
  const val = props.value;
  if (typeof val === 'number' && val > props.max) return props.max + '+';
  return val;
});
</script>

<template>
  <view class="lk-badge-wrapper">
    <slot />
    <view
      v-if="!hidden && (dot || value !== '')"
      class="lk-badge"
      :class="{ 'is-dot': dot }"
      :style="{
        right: (offset as [number, number])[0] + 'rpx',
        top: (offset as [number, number])[1] + 'rpx',
        color: color,
        background: bgColor,
      }"
    >
      <text v-if="!dot">{{ displayValue }}</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.lk-badge-wrapper {
  position: relative;
  display: inline-block;
}
.lk-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: var(--lk-color-primary);
  color: var(--lk-color-text-inverse);
  font-size: 20rpx;
  min-width: 36rpx;
  height: 36rpx;
  padding: 0 10rpx;
  border-radius: var(--lk-radius-pill);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  box-shadow: var(--lk-shadow-sm);
  transform: translate(50%, -50%);
  &.is-dot {
    width: 20rpx;
    height: 20rpx;
    min-width: 20rpx;
    padding: 0;
  }
}
</style>
