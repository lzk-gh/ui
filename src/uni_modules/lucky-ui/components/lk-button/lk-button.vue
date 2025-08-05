<script setup lang="ts">
import { computed } from 'vue';
import { lkButtonProps, lkButtonEmits } from './types';

defineOptions({
  name: 'LkButton',
});

const props = defineProps(lkButtonProps);
const emit = defineEmits(lkButtonEmits);

const buttonClasses = computed(() => [
  'lk-button',
  `lk-button--${props.variant}`,
  `lk-button--${props.size}`,
  // 仅在非禁用时应用 shape，因为禁用态有全局的 shape 覆盖
  !props.disabled ? `lk-button--${props.shape}` : '',
  {
    'is-loading': props.loading,
    'is-disabled': props.disabled,
  },
]);

const handleClick = (evt: MouseEvent) => {
  if (props.disabled || props.loading) return;
  emit('click', evt);
};
</script>

<template>
  <button
      :class="buttonClasses"
      :disabled="disabled || loading"
      :type="nativeType"
      @click="handleClick"
  >
    <span v-if="loading" class="lk-button__loader"></span>
    <i v-if="icon && !loading" :class="['lk-button__icon', icon]"></i>
    <span v-if="$slots.default" class="lk-button__text">
      <slot></slot>
    </span>
  </button>
</template>

<style lang="scss">
@use '../../theme/src/helper' as theme;
@use 'sass:color';

.lk-button {
  // --- 基础布局，移动端优先的设计 ---
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 12rpx;
  vertical-align: middle;
  text-decoration: none;
  white-space: nowrap;
  box-sizing: border-box;
  border: none;
  background-color: transparent;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  outline: none;
  -webkit-tap-highlight-color: transparent; // 移除移动端点击高亮

  // 简洁的过渡效果，只有颜色变化
  transition:
      background-color 0.2s ease-out,
      color 0.2s ease-out;
}

// =============================================================================
// 变体 (Variant)
// =============================================================================

// --- 1. 实体按钮 ---
.lk-button--solid {
  background-color: theme.$color-brand-primary;
  color: #ffffff;

  // 点击态：稍微浅一点的主题色
  &:active:not(.is-disabled):not(.is-loading) {
    background-color: color.adjust(theme.$color-brand-primary, $lightness: 8%);
  }
}

// --- 2. 文字按钮（纯文字，无背景） ---
.lk-button--text {
  color: theme.$color-brand-primary; // 文字颜色使用主题色
  background-color: transparent;
  padding: 16rpx 24rpx;

  // 点击时文字颜色稍微深一点
  &:active:not(.is-disabled):not(.is-loading) {
    color: color.adjust(theme.$color-brand-primary, $lightness: -8%);
  }
}

// =============================================================================
// 尺寸 (Size)
// =============================================================================
.lk-button--medium {
  height: 88rpx;
  padding: 0 40rpx;
  font-size: 32rpx;
  line-height: 1.4;
  min-width: 128rpx;
}

.lk-button--large {
  display: flex;
  width: 100%;
  height: 100rpx;
  padding: 0 48rpx;
  font-size: 34rpx;
  font-weight: 600;
  line-height: 1.4;
}

// =============================================================================
// 形状 (Shape)
// =============================================================================
.lk-button--default {
  border-radius: 24rpx;
}

.lk-button--square {
  border-radius: 0;
}

.lk-button--round {
  border-radius: 999px; // 胶囊形状
}

.lk-button--circle {
  width: 88rpx;
  height: 88rpx;
  padding: 0;
  border-radius: 50%;
  min-width: auto;
}

.lk-button--large.lk-button--circle {
  width: 100rpx;
  height: 100rpx;
}

// =============================================================================
// 状态 (State)
// =============================================================================
.lk-button.is-disabled {
  // 禁用：很淡的主题色背景，强制胶囊形状
  background-color: color.adjust(theme.$color-brand-primary, $alpha: -0.85) !important;
  color: color.adjust(theme.$color-brand-primary, $alpha: -0.5) !important;
  border-radius: 999px !important; // 强制胶囊形状
  cursor: not-allowed;
  pointer-events: none;

  // 禁用态的文字按钮：无背景，淡色文字
  &.lk-button--text {
    background-color: transparent !important;
    color: color.adjust(theme.$color-brand-primary, $alpha: -0.65) !important;
  }
}

.lk-button.is-loading {
  pointer-events: none;

  // 加载中：比主题色稍浅
  &.lk-button--solid {
    background-color: color.adjust(theme.$color-brand-primary, $lightness: 5%);
  }

  // 加载中文字按钮保持原色，但降低透明度
  &.lk-button--text {
    opacity: 0.7;
  }
}

// =============================================================================
// 内部元素
// =============================================================================
.lk-button__loader {
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  border: 4rpx solid;
  animation: lk-button-spin 0.8s linear infinite;

  // 根据变体决定加载环颜色
  .lk-button--solid & {
    border-color: rgba(255, 255, 255, 0.3);
    border-top-color: #ffffff;
  }

  .lk-button--text & {
    border-color: color.adjust(theme.$color-brand-primary, $alpha: -0.7);
    border-top-color: theme.$color-brand-primary;
  }
}

.lk-button__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  line-height: 1;
}

.lk-button__text {
  display: flex;
  align-items: center;
  line-height: inherit;
}

@keyframes lk-button-spin {
  to {
    transform: rotate(360deg);
  }
}

// =============================================================================
// 移动端优化
// =============================================================================

// 防止移动端双击缩放
.lk-button {
  touch-action: manipulation;
}

// 移动端深色模式适配
@media (prefers-color-scheme: dark) {
  .lk-button--solid {
    &:active:not(.is-disabled):not(.is-loading) {
      background-color: color.adjust(theme.$color-brand-primary, $lightness: 12%);
    }
  }

  .lk-button--text {
    &:active:not(.is-disabled):not(.is-loading) {
      color: color.adjust(theme.$color-brand-primary, $lightness: -5%);
    }
  }
}

// 小屏幕优化
@media (max-width: 375px) {
  .lk-button--large {
    font-size: 32rpx;
    height: 96rpx;
  }
}

// 提供更好的焦点状态（无障碍）
.lk-button:focus-visible {
  outline: 4rpx solid color.adjust(theme.$color-brand-primary, $alpha: -0.5);
  outline-offset: 4rpx;
}
</style>