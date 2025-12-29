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
        '--_color': color || undefined,
        '--_bg': bgColor || undefined,
      }"
    >
      <text v-if="!dot">{{ displayValue }}</text>
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
