<script setup lang="ts">
import { ref, watch, computed, inject } from 'vue';
import { formContextKey } from '../lk-form/context';
defineOptions({ name: 'LkStepper' });

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  min: { type: Number, default: Number.NEGATIVE_INFINITY },
  max: { type: Number, default: Number.POSITIVE_INFINITY },
  step: { type: Number, default: 1 },
  disabled: { type: Boolean, default: false },
  size: { type: String, default: 'md' },
  prop: { type: String, default: '' },
});
const emit = defineEmits(['update:modelValue', 'change']);

const form = inject(formContextKey, null);

const val = ref(props.modelValue);
watch(
  () => props.modelValue,
  v => (val.value = v)
);

function clamp(v: number) {
  return Math.min(props.max, Math.max(props.min, v));
}
function update(next: number) {
  next = clamp(next);
  if (next === val.value) return;
  val.value = next;
  emit('update:modelValue', next);
  emit('change', next);
  if (props.prop) form?.emitFieldChange(props.prop, next);
}
function inc() {
  if (props.disabled) return;
  update(val.value + props.step);
}
function dec() {
  if (props.disabled) return;
  update(val.value - props.step);
}
function handleInput(e: any) {
  update(Number(e.detail.value || 0));
}

const classes = computed(() => [
  'lk-stepper',
  `lk-stepper--${props.size}`,
  { 'is-disabled': props.disabled },
]);
</script>

<template>
  <view :class="classes">
    <view class="lk-stepper__btn" :class="{ 'is-disabled': val <= min }" @click="dec"
      >-</view
    >
    <input class="lk-stepper__input" type="number" :value="val" @input="handleInput" />
    <view class="lk-stepper__btn" :class="{ 'is-disabled': val >= max }" @click="inc"
      >+</view
    >
  </view>
</template>

<style scoped lang="scss">
.lk-stepper {
  --_h: var(--lk-control-height-md);
  --_fs: var(--lk-control-font-size-md);
  --_radius: var(--lk-radius-lg);
  width: fit-content;
  display: inline-flex;
  align-items: stretch;
  border: 2rpx solid var(--lk-input-border-color);
  border-radius: var(--_radius);
  overflow: hidden;
  background: var(--lk-input-bg);
  &--sm {
    --_h: var(--lk-control-height-sm);
    --_fs: var(--lk-control-font-size-sm);
    --_radius: var(--lk-radius-md);
  }
  &--lg {
    --_h: var(--lk-control-height-lg);
    --_fs: var(--lk-control-font-size-lg);
    --_radius: var(--lk-radius-pill);
  }
  &--small {
    --_h: var(--lk-control-height-sm);
    --_fs: var(--lk-control-font-size-sm);
    --_radius: var(--lk-radius-md);
  }
  &--large {
    --_h: var(--lk-control-height-lg);
    --_fs: var(--lk-control-font-size-lg);
    --_radius: var(--lk-radius-pill);
  }
  &__btn {
    width: var(--_h);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: calc(var(--_fs) + 4rpx);
    color: var(--lk-color-primary);
    background: var(--lk-color-primary-bg-soft);
    font-weight: 500;
    user-select: none;
    &:active:not(.is-disabled) {
      background: var(--lk-color-primary);
      color: var(--lk-color-text-inverse);
    }
    &.is-disabled {
      opacity: 0.4;
    }
  }
  &__input {
    width: 140rpx;
    height: var(--_h);
    line-height: var(--_h);
    text-align: center;
    border: none;
    outline: none;
    font-size: var(--_fs);
    color: var(--lk-color-text);
    background: transparent;
    box-sizing: border-box;
  }
  &.is-disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}
</style>
