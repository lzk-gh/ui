<script setup lang="ts">
import { tagProps } from './tag.props';
import { computed } from 'vue';
import type { CSSProperties } from 'vue';

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

const customStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {};

  // 文本颜色优先
  if (props.textColor) {
    style.color = props.textColor;
  }

  // 背景或描边颜色
  if (props.bgColor) {
    if (props.type === 'outline') {
      // outline 类型：使用内阴影模拟描边
      style.boxShadow = `inset 0 0 0 2rpx ${props.bgColor}`;
      style.background = 'transparent';
    } else {
      style.background = props.bgColor;
    }
  }

  return style;
});
</script>

<template>
  <view
    class="lk-tag"
    :class="[
      `lk-tag--${props.type}`,
      `lk-tag--${props.size}`,
      { 'is-disabled': props.disabled, 'is-round': props.round, 'is-closable': props.closable },
    ]"
    :style="customStyle"
    @click="onClick"
  >
    <slot />
    <view v-if="props.closable" class="lk-tag__close" @click="onClose">×</view>
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
  &--md {
    --_fs: 26rpx;
    --_px: 20rpx;
  }
  &--lg {
    --_fs: 30rpx;
    --_px: 28rpx;
  }
  &--light {
    background: rgba(var(--lk-color-primary), 0.8);
    color: var(--lk-color-primary);
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
