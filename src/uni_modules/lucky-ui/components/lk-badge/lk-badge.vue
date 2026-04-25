<script setup lang="ts">
import { computed } from 'vue';
import { badgeProps } from './badge.props';
defineOptions({ name: 'LkBadge' });

const props = defineProps(badgeProps);

const typeBgMap: Record<string, string> = {
  primary: 'var(--lk-color-primary)',
  success: 'var(--lk-color-success)',
  warning: 'var(--lk-color-warning)',
  danger: 'var(--lk-color-danger)',
  info: 'var(--lk-color-info)',
};

const displayValue = computed(() => {
  if (props.dot) return '';
  const val = props.value;
  if (typeof val === 'number' && val > props.max) return `${props.max  }+`;
  return val;
});

/**
 * 小程序端优先使用直出样式，确保语义色稳定生效
 */
const badgeStyle = computed(() => ({
  right: `${(props.offset as [number, number])[0]}rpx`,
  top: `${(props.offset as [number, number])[1]}rpx`,
  color: props.color || undefined,
  background: props.bgColor || typeBgMap[props.type] || undefined,
}));
</script>

<template>
  <view class="lk-badge-wrapper">
    <slot />
    <view
      v-if="!hidden && (dot || value !== '')"
      class="lk-badge"
      :class="[`lk-badge--${type}`, { 'is-dot': dot }, customClass]"
      :style="[badgeStyle, customStyle]"
    >
      <text v-if="!dot">{{ displayValue }}</text>
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
