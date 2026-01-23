<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch, computed } from 'vue';
import { verifyCodeProps, verifyCodeEmits, VerifyCodeStatus } from './verify-code.props';

defineOptions({ name: 'LkVerifyCode' });

const props = defineProps(verifyCodeProps);
const emit = defineEmits(verifyCodeEmits);

// 内部状态
const val = ref(props.modelValue || '');
const inputRef = ref<any>(null);
const isFocused = ref(false);
const focusIndex = ref(0);

// 倒计时状态
const isCountingDown = ref(false);
const countdownRemaining = ref(0);
let countdownTimer: ReturnType<typeof setInterval> | null = null;

// 当前激活的单元格索引（基于输入值长度）
const activeIndex = computed(() => {
  return Math.min(val.value.length, props.length - 1);
});

// 计算样式
const cellStyle = computed(() => ({
  width: `${props.cellSize}rpx`,
  height: `${props.cellSize}rpx`,
  fontSize: `${props.fontSize}rpx`,
}));

const containerStyle = computed(() => ({
  gap: `${props.gap}rpx`,
}));

// 倒计时显示文字
const countdownDisplayText = computed(() => {
  if (isCountingDown.value) {
    return props.countdownText.replace('{s}', String(countdownRemaining.value));
  }
  return val.value.length === 0 ? props.sendText : props.resendText;
});

// 状态样式类
const statusClass = computed(() => {
  if (props.status === VerifyCodeStatus.Error) return 'is-error';
  if (props.status === VerifyCodeStatus.Success) return 'is-success';
  if (isFocused.value) return 'is-focus';
  return '';
});

// 监听外部值变化
watch(
  () => props.modelValue,
  (v) => {
    if (v !== val.value) {
      val.value = v || '';
      focusIndex.value = v?.length || 0;
    }
  }
);

// 聚焦方法
function focus() {
  if (props.disabled) return;
  // #ifdef H5
  try {
    inputRef.value?.focus?.();
  } catch (e) {
    console.warn('Focus failed', e);
  }
  // #endif
  // #ifdef MP-WEIXIN
  isFocused.value = true;
  // #endif
}

// 失焦方法
function blur() {
  // #ifdef H5
  try {
    inputRef.value?.blur?.();
  } catch (e) {
    console.warn('Blur failed', e);
  }
  // #endif
  isFocused.value = false;
}

// 处理聚焦
function onFocus() {
  if (props.disabled) return;
  isFocused.value = true;
  emit('focus');
}

// 处理失焦
function onBlur() {
  isFocused.value = false;
  emit('blur');
}

// 处理输入
function onInput(e: any) {
  if (props.disabled) return;

  let v = e?.detail?.value ?? e?.target?.value ?? '';

  // 根据类型过滤
  if (props.type === 'number') {
    v = v.replace(/\D+/g, '');
  }

  // 限制长度
  if (v.length > props.length) {
    v = v.slice(0, props.length);
  }

  val.value = v;
  focusIndex.value = v.length;
  emit('update:modelValue', v);

  // 输入完成
  if (v.length === props.length) {
    emit('finish', v);
  }
}

// 处理粘贴（H5平台）
function onPaste(e: any) {
  if (props.disabled) return;

  // #ifdef H5
  try {
    const clipboardData = e?.clipboardData || (window as any).clipboardData;
    let pastedText = clipboardData?.getData('text') || '';

    // 过滤非法字符
    if (props.type === 'number') {
      pastedText = pastedText.replace(/\D+/g, '');
    }

    // 限制长度
    pastedText = pastedText.slice(0, props.length);

    if (pastedText) {
      val.value = pastedText;
      focusIndex.value = pastedText.length;
      emit('update:modelValue', pastedText);

      if (pastedText.length === props.length) {
        emit('finish', pastedText);
      }

      e.preventDefault();
    }
  } catch (err) {
    console.warn('Paste handling failed', err);
  }
  // #endif
}

// 处理键盘输入（支持退格）
function onKeydown(e: any) {
  if (props.disabled) return;

  const key = e?.key || e?.detail?.key;
  if (key === 'Backspace' && val.value.length > 0) {
    // 退格删除最后一位
    const newVal = val.value.slice(0, -1);
    val.value = newVal;
    focusIndex.value = Math.max(0, newVal.length);
    emit('update:modelValue', newVal);
  }
}

// 点击单元格
function onCellClick(index: number) {
  if (props.disabled) return;
  focusIndex.value = index;
  focus();
}

// 开始倒计时
function startCountdown() {
  if (isCountingDown.value || props.disabled) return;

  // 触发发送事件
  if (val.value.length === 0) {
    emit('send');
  } else {
    emit('resend');
  }

  isCountingDown.value = true;
  countdownRemaining.value = props.countdownDuration;

  countdownTimer = setInterval(() => {
    countdownRemaining.value--;
    if (countdownRemaining.value <= 0) {
      stopCountdown();
      emit('countdownEnd');
    }
  }, 1000);
}

// 停止倒计时
function stopCountdown() {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
  isCountingDown.value = false;
  countdownRemaining.value = 0;
}

// 清空输入
function clear() {
  val.value = '';
  focusIndex.value = 0;
  emit('update:modelValue', '');
}

// 设置值（支持 SMS 自动填充）
function setValue(code: string) {
  if (props.type === 'number') {
    code = code.replace(/\D+/g, '');
  }
  code = code.slice(0, props.length);
  val.value = code;
  focusIndex.value = code.length;
  emit('update:modelValue', code);
  if (code.length === props.length) {
    emit('finish', code);
  }
}

// 暴露方法
defineExpose({
  focus,
  blur,
  clear,
  setValue,
  startCountdown,
  stopCountdown,
});

// 生命周期
onMounted(async () => {
  if (props.autofocus) {
    await nextTick();
    focus();
  }
});

onUnmounted(() => {
  stopCountdown();
});
</script>

<template>
  <view
    class="lk-verify-code"
    :class="[
      `lk-verify-code--${props.variant}`,
      statusClass,
      { 'is-disabled': props.disabled },
    ]"
  >
    <!-- 隐藏的真实输入框 -->
    <input
      ref="inputRef"
      class="lk-verify-code__input"
      :value="val"
      :maxlength="props.length"
      :type="props.type === 'number' ? 'number' : 'text'"
      :disabled="props.disabled"
      :focus="isFocused"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @keydown="onKeydown"
      @paste="onPaste"
    />

    <!-- 单元格容器 -->
    <view class="lk-verify-code__cells" :style="containerStyle" @click="focus">
      <view
        v-for="(_, index) in props.length"
        :key="index"
        class="lk-verify-code__cell"
        :class="{
          'is-active': isFocused && index === activeIndex && val.length < props.length,
          'is-filled': index < val.length,
          'is-next': index === val.length,
        }"
        :style="[
          cellStyle,
          props.focusColor && isFocused && index === activeIndex
            ? { borderColor: props.focusColor }
            : {},
          props.errorColor && props.status === 'error' ? { borderColor: props.errorColor } : {},
        ]"
        @click.stop="onCellClick(index)"
      >
        <!-- 已输入的值 -->
        <view v-if="index < val.length" class="lk-verify-code__value">
          <text v-if="props.mask" class="lk-verify-code__dot">•</text>
          <text v-else>{{ val[index] }}</text>
        </view>

        <!-- 光标 -->
        <view
          v-else-if="props.showCursor && isFocused && index === activeIndex"
          class="lk-verify-code__cursor"
        />
      </view>
    </view>

    <!-- 提示/错误文字 -->
    <view v-if="props.errorMessage || props.tips" class="lk-verify-code__message">
      <text
        v-if="props.status === 'error' && props.errorMessage"
        class="lk-verify-code__error"
      >
        {{ props.errorMessage }}
      </text>
      <text v-else-if="props.tips" class="lk-verify-code__tips">{{ props.tips }}</text>
    </view>

    <!-- 倒计时/发送按钮 -->
    <view v-if="props.countdown" class="lk-verify-code__countdown">
      <text
        class="lk-verify-code__countdown-btn"
        :class="{ 'is-disabled': isCountingDown || props.disabled }"
        @click="startCountdown"
      >
        {{ countdownDisplayText }}
      </text>
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
