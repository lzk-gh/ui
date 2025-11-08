<script setup lang="ts">
import { tagProps } from './tag.props';

defineOptions({ name: 'LkTag' });

const props = defineProps(tagProps);
const emit = defineEmits(['close', 'click']);

function onClose(e: any) {
  if (props.disabled) return;
  emit('close', e);
  e.stopPropagation();
}

function onClick(e: any) {
  if (props.disabled) return;
  emit('click', e);
}
</script>

<template>
  <view
    class="lk-tag"
    :class="[
      `lk-tag--${type}`,
      `lk-tag--${size}`,
      { 'is-disabled': disabled, 'is-round': round, 'is-closable': closable },
    ]"
    @click="onClick"
  >
    <slot />
    <view v-if="closable" class="lk-tag__close" @click="onClose">×</view>
  </view>
</template>

<style scoped lang="scss">
.lk-tag {
  --_fs: 24rpx;
  --_px: 20rpx;
  --_radius: var(--lk-radius-pill);
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  font-size: var(--_fs);
  padding: 8rpx var(--_px);
  line-height: 1;
  border-radius: var(--_radius);
  user-select: none;
  background: var(--lk-color-primary);
  color: var(--lk-color-text-inverse);
  transition:
    background var(--lk-transition-fast),
    color var(--lk-transition-fast),
    opacity var(--lk-transition-fast);
  &--sm {
    --_fs: 22rpx;
    --_px: 16rpx;
  }
  &--lg {
    --_fs: 28rpx;
    --_px: 28rpx;
  }
  &--outline {
    background: transparent;
    color: var(--lk-color-primary);
    box-shadow: inset 0 0 0 2rpx var(--lk-color-primary);
  }
  &--soft {
    background: var(--lk-color-primary-bg-soft);
    color: var(--lk-color-primary);
  }
  &:active:not(.is-disabled) {
    filter: brightness(0.93);
  }
  &.is-disabled {
    opacity: 0.55;
    pointer-events: none;
  }
  &.is-round {
    border-radius: var(--lk-radius-pill);
  }
  &__close {
    font-size: 28rpx;
    line-height: 1;
    padding: 4rpx;
    border-radius: var(--lk-radius-sm);
    &:active {
      background: var(--lk-color-primary-bg-soft);
      color: var(--lk-color-primary-active);
    }
  }
}
</style>
