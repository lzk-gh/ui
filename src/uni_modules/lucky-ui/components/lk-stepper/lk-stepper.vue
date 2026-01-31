<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { stepperProps, stepperEmits } from './stepper.props';

defineOptions({ name: 'LkStepper' });

const props = defineProps(stepperProps);
const emit = defineEmits(stepperEmits);

const current = ref(format(props.modelValue));

// --- 核心逻辑：格式化与精度处理 ---

// 解决浮点数精度问题 (0.1 + 0.2 = 0.300000004)
function add(num1: number, num2: number) {
  const card = Math.pow(10, 10);
  return Math.round((num1 + num2) * card) / card;
}

// 严格限制范围与整数
function clamp(value: number): number {
  let num = value;
  if (props.integer) {
    num = Math.floor(num);
  }
  return Math.max(Number(props.min), Math.min(Number(props.max), num));
}

function format(value: string | number): string {
  if (value === '') return '';
  let num = Number(value);
  if (isNaN(num)) num = Number(props.min);

  return String(clamp(num));
}

// --- 计算属性 ---

const isMinusDisabled = computed(
  () => props.disabled || Number(current.value) <= Number(props.min)
);

const isPlusDisabled = computed(() => props.disabled || Number(current.value) >= Number(props.max));

const wrapperStyle = computed(() => {
  const style: Record<string, string> = {};
  if (props.buttonSize) style['--stepper-btn-size'] = `${props.buttonSize}rpx`;
  if (props.inputWidth) style['--stepper-input-width'] = `${props.inputWidth}rpx`;
  return style;
});

// --- 事件处理 ---

// 统一变更处理
async function handleChange(type: 'minus' | 'plus' | 'input', val?: string) {
  if (props.disabled) return;

  const stepNum = Number(props.step);
  let nextVal: number;

  if (type === 'input') {
    nextVal = Number(val);
  } else {
    // 按钮点击
    const now = Number(current.value || 0);
    if (type === 'minus' && isMinusDisabled.value) {
      emit('overlimit', 'minus');
      return;
    }
    if (type === 'plus' && isPlusDisabled.value) {
      emit('overlimit', 'plus');
      return;
    }
    nextVal = type === 'minus' ? add(now, -stepNum) : add(now, stepNum);
  }

  // 限制范围
  const clampedVal = clamp(nextVal);

  // 拦截逻辑
  if (props.beforeChange) {
    try {
      const allow = await props.beforeChange(clampedVal);
      if (!allow) {
        // 恢复原值 (主要针对 input 输入的情况)
        current.value = String(props.modelValue);
        return;
      }
    } catch {
      current.value = String(props.modelValue);
      return;
    }
  }

  current.value = String(clampedVal);
  emit('update:modelValue', clampedVal);
  emit('change', clampedVal);
}

// 输入框事件
const onInput = (e: any) => {
  current.value = e.detail.value;
};

const onBlur = (e: any) => {
  const val = Number(current.value);
  // Blur 时强制修正格式和范围
  handleChange('input', String(clamp(isNaN(val) ? Number(props.min) : val)));
  emit('blur', e);
};

const onFocus = (e: any) => emit('focus', e);

// --- 长按处理 (简单实现) ---
let longPressTimer: ReturnType<typeof setTimeout> | null = null;

const onTouchStart = (type: 'minus' | 'plus') => {
  if (!props.longPress) return;
  handleChange(type); // 立即触发一次

  longPressTimer = setTimeout(() => {
    longPressTimer = setInterval(() => {
      handleChange(type);
    }, 200); // 长按触发间隔
  }, 600); // 长按触发阈值
};

const onTouchEnd = () => {
  if (longPressTimer) {
    clearTimeout(longPressTimer);
    clearInterval(longPressTimer);
    longPressTimer = null;
  }
};

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
    class="lk-stepper"
    :class="[`lk-stepper--${size}`, { 'is-disabled': disabled }]"
    :style="wrapperStyle"
  >
    <view
      class="lk-stepper__btn lk-stepper__minus"
      :class="{ 'is-disabled': isMinusDisabled }"
      @touchstart.passive="onTouchStart('minus')"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
      @click.stop="!longPress && handleChange('minus')"
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
      @click.stop="!longPress && handleChange('plus')"
    />
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
