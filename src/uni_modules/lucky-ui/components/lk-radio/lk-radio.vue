<script setup lang="ts">
import { inject, computed, useSlots } from 'vue';
import { radioProps, radioEmits } from './radio.props';

defineOptions({ name: 'LkRadio' });
const props = defineProps(radioProps);
const emit = defineEmits(radioEmits);

const slots = useSlots();
const group = inject<any>('LkRadioGroup', null);
const isGroup = computed(() => !!group?.isGroup);
const mergedSize = computed(() => props.size || group?.size || 'md');
const mergedIconType = computed(() => props.iconType || group?.iconType || 'dot');
const mergedShape = computed(() => props.shape || group?.shape || 'circle');
const checked = computed(() =>
  isGroup.value ? group.value() === props.label : props.modelValue === props.label
);
const isDisabled = computed(() => (isGroup.value ? group.disabled : props.disabled));
const hasIconSlot = computed(() => !!slots.icon);

function select() {
  if (isDisabled.value || checked.value) return;
  if (isGroup.value) group.update(props.label);
  else {
    emit('update:modelValue', props.label);
    emit('change', props.label);
  }
}
</script>

<template>
  <view
    class="lk-radio"
    :class="[
      `lk-radio--${mergedSize}`,
      `lk-radio--${mergedShape}`,
      `lk-radio--${mergedIconType}`,
      { 'is-checked': checked, 'is-disabled': isDisabled },
    ]"
    @click="select"
  >
    <view class="lk-radio__outer">
      <view v-if="mergedIconType === 'dot'" class="lk-radio__inner lk-radio__dot" />
      <view v-else-if="mergedIconType === 'check'" class="lk-radio__inner lk-radio__check">✓</view>
      <view
        v-else-if="mergedIconType === 'icon' || hasIconSlot"
        class="lk-radio__inner lk-radio__icon"
      >
        <slot name="icon" :checked="checked" :disabled="isDisabled" />
      </view>
    </view>
    <view class="lk-radio__label"
      ><slot>{{ label }}</slot></view
    >
  </view>
</template>

<style lang="scss">
.lk-radio {
  --_size: var(--lk-choice-size-md);
  --_gap: 14rpx;
  display: inline-flex;
  align-items: center;
  font-size: 28rpx;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: opacity var(--lk-transition-fast);

  &--sm {
    --_size: var(--lk-choice-size-sm);
    font-size: 26rpx;
  }
  &--lg {
    --_size: var(--lk-choice-size-lg);
    font-size: 30rpx;
  }

  &__outer {
    width: var(--_size);
    height: var(--_size);
    border: 2rpx solid var(--lk-color-border);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--lk-color-bg-surface);
    transition:
      border-color var(--lk-transition-fast),
      background var(--lk-transition-fast),
      transform var(--lk-transition-fast);
  }

  &__inner {
    transition:
      transform var(--lk-transition-base),
      opacity var(--lk-transition-fast);
    opacity: 0;
    transform: scale(0.2);
  }

  &__dot {
    width: 48%;
    height: 48%;
    background: var(--lk-color-primary);
    border-radius: 50%;
  }

  &__check {
    font-size: calc(var(--_size) * 0.65);
    color: var(--lk-color-primary);
    font-weight: bold;
    line-height: 1;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: var(--lk-color-primary);
    font-size: calc(var(--_size) * 0.7);
  }

  &__label {
    margin-left: var(--_gap);
  }

  &--square {
    .lk-radio__outer {
      border-radius: var(--lk-radius-md);
    }
    .lk-radio__dot {
      border-radius: var(--lk-radius-sm);
    }
  }

  &:active:not(.is-disabled) .lk-radio__outer {
    transform: scale(0.94);
  }

  &.is-checked {
    .lk-radio__outer {
      border-color: var(--lk-color-primary);
      background: var(--lk-color-primary-bg-soft);
    }
    .lk-radio__inner {
      opacity: 1;
      transform: scale(1);
    }
  }

  &.is-disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
}
</style>
