<script setup lang="ts">
import { computed } from 'vue';
import { switchProps, switchEmits } from './switch.props';

defineOptions({ name: 'LkSwitch' });

const props = defineProps(switchProps);
const emit = defineEmits(switchEmits);

const checked = computed(() => props.modelValue === props.activeValue);
let changing = false;

async function toggle() {
  if (props.disabled || props.loading || changing) return;
  const target = checked.value ? props.inactiveValue : props.activeValue;
  if (props.beforeChange) {
    changing = true;
    try {
      const ok = await props.beforeChange(target);
      if (!ok) {
        changing = false;
        return;
      }
    } catch {
      changing = false;
      return;
    }
  }
  emit('update:modelValue', target);
  emit('change', target);
  changing = false;
}
function onClick() {
  emit('click');
  toggle();
}
</script>

<template>
  <view
    class="lk-switch"
    :class="[
      `lk-switch--${size}`,
      { 'is-checked': checked, 'is-disabled': disabled, 'is-loading': loading },
    ]"
    @click="onClick"
  >
    <view class="lk-switch__knob">
      <view v-if="loading" class="lk-switch__spinner" />
    </view>
  </view>
</template>

<style lang="scss">
.lk-switch {
  --_h: var(--lk-switch-height-md);
  --_gap: var(--lk-switch-knob-gap);
  --_bg-off: var(--lk-color-border-weak);
  --_bg-on: var(--lk-color-primary);
  --_knob-bg: var(--lk-color-bg-surface);
  --_radius: var(--lk-switch-height-md);
  position: relative;
  width: calc(var(--_h) * 1.9);
  height: var(--_h);
  border-radius: var(--_radius);
  background: var(--_bg-off);
  padding: var(--_gap);
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s ease;

  &--small {
    --_h: var(--lk-switch-height-sm);
  }
  &--default {
    --_h: var(--lk-switch-height-md);
  }
  &--large {
    --_h: var(--lk-switch-height-lg);
  }

  &__knob {
    width: calc(var(--_h) - var(--_gap) * 2);
    height: calc(var(--_h) - var(--_gap) * 2);
    background: var(--_knob-bg);
    border-radius: 50%;
    box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.15);
    transition: transform 0.15s ease;
    position: relative;
  }
  &.is-checked {
    background: var(--_bg-on);
    .lk-switch__knob {
      transform: translateX(calc(100% + var(--_gap)));
    }
  }
  &__spinner {
    width: 60%;
    height: 60%;
    border: 4rpx solid rgba(0, 0, 0, 0.15);
    border-top-color: rgba(0, 0, 0, 0.45);
    border-radius: 50%;
    animation: lk-switch-spin 1s linear infinite;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &.is-disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  &.is-loading {
    cursor: progress;
  }
  &:active:not(.is-disabled):not(.is-loading) .lk-switch__knob {
    transform: translateX(calc((var(--is-checked, 0) * 100%))) scale(0.95);
  }
}

@keyframes lk-switch-spin {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>
