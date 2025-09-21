<script setup lang="ts">
import { computed } from 'vue';
import { lkButtonProps, lkButtonEmits } from './types';

defineOptions({ name: 'LkButton' });

const props = defineProps(lkButtonProps);
const emit = defineEmits(lkButtonEmits);

const cls = computed(()=>[
  'lk-button',
  `lk-button--${props.variant}`,
  `lk-button--${props.size}`,
  `lk-button--shape-${props.shape}`,
  {
    'is-loading': props.loading,
    'is-disabled': props.disabled,
    'is-block': props.block
  }
]);

function onClick(e: MouseEvent) {
  if (props.disabled || props.loading) return;
  emit('click', e);
}
</script>

<template>
  <button
      :class="cls"
      :disabled="disabled || loading"
      :type="nativeType"
      @click="onClick"
  >
    <text v-if="loading" class="lk-button__loader"></text>
    <i v-if="icon && !loading" :class="['lk-button__icon', icon]" />
    <text class="lk-button__content"><slot /></text>
  </button>
</template>

<style lang="scss">
.lk-button {
  --_height: var(--lk-control-height-md);
  --_fs: var(--lk-control-font-size-md);
  --_px: var(--lk-control-padding-x-md);
  --_radius: var(--lk-radius-pill);
  --_bg: var(--lk-color-primary);
  --_bg-hover: var(--lk-color-primary-hover);
  --_bg-active: var(--lk-color-primary-active);
  --_txt: var(--lk-color-text-inverse);

  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  height: var(--_height);
  padding: 0 var(--_px);
  font-size: var(--_fs);
  font-weight: 500;
  line-height: 1;
  color: var(--_txt);
  background: var(--_bg);
  border: none;
  border-radius: var(--_radius);
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: background var(--lk-transition-fast), color var(--lk-transition-fast), box-shadow var(--lk-transition-fast), opacity var(--lk-transition-fast);

  &--sm { --_height: var(--lk-control-height-sm); --_fs: var(--lk-control-font-size-sm); --_px: var(--lk-control-padding-x-sm); }
  &--lg { --_height: var(--lk-control-height-lg); --_fs: var(--lk-control-font-size-lg); --_px: var(--lk-control-padding-x-lg); }

  &--shape-square { --_radius: var(--lk-radius-xs); }
  &--shape-round { --_radius: var(--lk-radius-pill); }
  &--shape-circle {
    width: var(--_height);
    padding: 0;
    --_radius: 50%;
  }

  &.is-block { width: 100%; }

  /* Variants */
  &--outline {
    background: transparent;
    color: var(--lk-color-primary);
    box-shadow: inset 0 0 0 2rpx var(--lk-color-primary);
  }
  &--text {
    background: transparent;
    color: var(--lk-color-primary);
    padding: 0 12rpx;
  }
  &--soft {
    background: var(--lk-color-primary-bg-soft);
    color: var(--lk-color-primary);
  }
  &--danger { /* 仍使用品牌色体系：用 active 做按压感 */
    background: var(--lk-color-primary-active);
  }

  /* Hover / Active */
  &:not(.is-disabled):not(.is-loading) {
    &.lk-button--solid,
    &:not(.lk-button--outline):not(.lk-button--text):not(.lk-button--soft):not(.lk-button--danger) {
      &:active { background: var(--_bg-active); }
    }
    &.lk-button--outline {
      &:active {
        background: var(--lk-color-primary-bg-soft);
      }
    }
    &.lk-button--text {
      &:active {
        color: var(--lk-color-primary-active);
        background: var(--lk-color-primary-bg-soft);
        border-radius: var(--lk-radius-sm);
      }
    }
    &.lk-button--soft {
      &:active { background: var(--lk-color-primary-hover); color: var(--lk-color-text-inverse); }
    }
    &.lk-button--danger {
      &:active { filter: brightness(.92); }
    }
  }

  /* Loading / Disabled */
  &.is-loading,
  &.is-disabled {
    cursor: not-allowed;
    opacity: .65;
  }

  &__loader {
    width: 32rpx;
    height: 32rpx;
    border-radius: 50%;
    border: 4rpx solid rgba(255,255,255,0.35);
    border-top-color: #fff;
    animation: lk-btn-spin .8s linear infinite;
  }
  &--outline &__loader {
    border: 4rpx solid var(--lk-color-primary-bg-soft);
    border-top-color: var(--lk-color-primary);
  }
  &--text &__loader,
  &--soft &__loader {
    border: 4rpx solid var(--lk-color-primary-bg-soft);
    border-top-color: var(--lk-color-primary);
  }

  &__icon {
    font-size: 32rpx;
    line-height: 1;
  }
  &__content {
    display: inline-flex;
    align-items: center;
    line-height: 1;
  }

  &:focus-visible {
    outline: var(--lk-focus-ring-width) solid var(--lk-focus-ring-color);
    outline-offset: 4rpx;
  }
}

@keyframes lk-btn-spin { to { transform: rotate(360deg); } }
</style>