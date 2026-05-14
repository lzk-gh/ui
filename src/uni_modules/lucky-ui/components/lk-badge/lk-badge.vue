<script setup lang="ts">
import type { StyleValue } from 'vue';
import { computed } from 'vue';
import { badgeEmits, badgeProps } from './badge.props';
defineOptions({ name: 'LkBadge' });

const props = defineProps(badgeProps);
const emit = defineEmits(badgeEmits);

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

const mergedBadgeStyle = computed<StyleValue>(() => [
  badgeStyle.value,
  props.customStyle as StyleValue,
]);

function onClick(event: unknown) {
  emit('click', { value: props.value, displayValue: displayValue.value, event });
}
</script>

<template>
  <view :id="id" class="lk-badge-wrapper">
    <slot />
    <view
      v-if="!hidden && (dot || value !== '')"
      class="lk-badge"
      :class="[`lk-badge--${type}`, { 'is-dot': dot }, customClass]"
      :style="mergedBadgeStyle"
      @tap="onClick"
    >
      <text v-if="!dot">{{ displayValue }}</text>
    </view>
  </view>
</template>

<style lang="scss">
@use './lk-badge.scss';
</style>
