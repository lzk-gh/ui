<script setup lang="ts">
import type { StyleValue } from 'vue';
import { computed, ref, watch, inject } from 'vue';
import type { StepperAction } from './stepper.props';
import { stepperProps, stepperEmits } from './stepper.props';
import { formContextKey } from '../lk-form/context';
import {
  formatStepperValue,
  isStepperMinusDisabled,
  isStepperPlusDisabled,
  normalizeStepperBlurValue,
  readStepperInputValue,
  resolveStepperChange,
  resolveStepperClass,
  resolveStepperStyle,
  shouldValidateStepperField,
} from './stepper.utils';

defineOptions({ name: 'LkStepper' });

const props = defineProps(stepperProps);
const emit = defineEmits(stepperEmits);
const form = inject(formContextKey, null);

const current = ref(format(props.modelValue));

function format(value: string | number): string {
  return formatStepperValue({
    value,
    min: props.min,
    max: props.max,
    integer: props.integer,
  });
}

// --- 计算属性 ---

const isMinusDisabled = computed(
  () => isStepperMinusDisabled({
    disabled: props.disabled,
    current: current.value,
    min: props.min,
  })
);

const isPlusDisabled = computed(() => isStepperPlusDisabled({
  disabled: props.disabled,
  current: current.value,
  max: props.max,
}));

const wrapperStyle = computed(() => {
  return resolveStepperStyle({
    buttonSize: props.buttonSize,
    inputWidth: props.inputWidth,
    customStyle: props.customStyle as StyleValue,
  });
});

const classes = computed(() => resolveStepperClass({
  customClass: props.customClass,
  size: props.size,
  disabled: props.disabled,
}));

// --- 事件处理 ---

// 统一变更处理
async function handleChange(type: StepperAction, val?: string) {
  const result = resolveStepperChange({
    action: type,
    inputValue: val,
    current: current.value,
    disabled: props.disabled,
    min: props.min,
    max: props.max,
    step: props.step,
    integer: props.integer,
  });

  if (result.type === 'disabled') return;
  if (result.type === 'overlimit') {
    emit('overlimit', result.action, result.limit);
    return;
  }

  const clampedVal = result.value;
  emit('before-change', clampedVal, type);

  // 拦截逻辑
  if (props.beforeChange) {
    try {
      const allow = await props.beforeChange(clampedVal);
      if (!allow) {
        // 恢复原值 (主要针对 input 输入的情况)
        current.value = String(props.modelValue);
        emit('change-cancel', clampedVal, type, 'before-change');
        return;
      }
    } catch {
      current.value = String(props.modelValue);
      emit('change-cancel', clampedVal, type, 'error');
      return;
    }
  }

  current.value = String(clampedVal);
  emit('update:modelValue', clampedVal);
  emit('change', clampedVal, type);
  if (type === 'plus') emit('plus', clampedVal);
  if (type === 'minus') emit('minus', clampedVal);
  if (shouldValidateStepperField({ validateEvent: props.validateEvent, prop: props.prop })) {
    form?.emitFieldChange(props.prop, clampedVal);
  }
}

// 输入框事件
function onInput(e: Event | { detail?: { value?: string }; target?: { value?: string } }) {
  const value = readStepperInputValue(e);
  current.value = value;
  emit('input', value);
}

function onBlur(e: unknown) {
  // Blur 时强制修正格式和范围
  handleChange('input', normalizeStepperBlurValue({
    current: current.value,
    min: props.min,
    max: props.max,
    integer: props.integer,
  }));
  emit('blur', e);
}

function onFocus(e: unknown) {
  emit('focus', e);
}

// --- 长按处理 (简单实现) ---
let longPressTimer: ReturnType<typeof setTimeout> | null = null;
// 标记是否由 touch 事件处理过，用于阻止 PC 端重复触发 click
let touchHandled = false;

function onTouchStart(type: 'minus' | 'plus') {
  touchHandled = true;
  handleChange(type); // 立即触发一次

  if (!props.longPress) return;

  longPressTimer = setTimeout(() => {
    longPressTimer = setInterval(() => {
      handleChange(type);
    }, 200); // 长按触发间隔
  }, 600); // 长按触发阈值
}

function onTouchEnd() {
  if (longPressTimer) {
    clearTimeout(longPressTimer);
    clearInterval(longPressTimer);
    longPressTimer = null;
  }
  // 延迟重置，确保后续 click 事件能被正确屏蔽
  setTimeout(() => {
    touchHandled = false;
  }, 300);
}

function onClick(type: 'minus' | 'plus') {
  // 如果已由 touchstart 处理过，跳过（移动端会同时触发 touch 和 click）
  if (touchHandled) return;
  handleChange(type);
}

watch(
  () => props.modelValue,
  val => {
    if (val !== Number(current.value)) {
      current.value = format(val);
    }
  }
);
</script>

<template>
  <view
    :id="id"
    class="lk-stepper"
    :class="classes"
    :style="wrapperStyle"
  >
    <view
      class="lk-stepper__btn lk-stepper__minus"
      :class="{ 'is-disabled': isMinusDisabled }"
      @touchstart.passive="onTouchStart('minus')"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
      @click.stop="onClick('minus')"
    />

    <input
      v-model="current"
      class="lk-stepper__input"
      :class="{ 'is-disabled': disableInput }"
      :type="integer ? 'number' : 'digit'"
      :disabled="disabled || disableInput"
      @input="onInput"
      @blur="onBlur"
      @focus="onFocus"
    />

    <view
      class="lk-stepper__btn lk-stepper__plus"
      :class="{ 'is-disabled': isPlusDisabled }"
      @touchstart.passive="onTouchStart('plus')"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
      @click.stop="onClick('plus')"
    />
  </view>
</template>

<style lang="scss">
@use './lk-stepper.scss';
</style>
