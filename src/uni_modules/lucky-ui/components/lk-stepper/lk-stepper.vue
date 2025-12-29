<script setup lang="ts">
import { ref, watch, computed, inject } from 'vue';
import { formContextKey } from '../lk-form/context';
import { stepperProps, stepperEmits } from './stepper.props';
defineOptions({ name: 'LkStepper' });

const props = defineProps(stepperProps);
const emit = defineEmits(stepperEmits);

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
    <view class="lk-stepper__btn" :class="{ 'is-disabled': val <= min }" @click="dec">-</view>
    <input class="lk-stepper__input" type="number" :value="val" @input="handleInput" />
    <view class="lk-stepper__btn" :class="{ 'is-disabled': val >= max }" @click="inc">+</view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
