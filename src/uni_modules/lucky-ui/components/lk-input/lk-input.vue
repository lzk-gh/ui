<script setup lang="ts">
import type { StyleValue } from 'vue';
import { ref, watch, computed, inject } from 'vue';
import { formContextKey } from '../lk-form/context';
import type { InputEventPayload, InputValue } from './input.props';
import { inputProps, inputEmits } from './input.props';
import LkIcon from '../lk-icon/lk-icon.vue';

defineOptions({ name: 'LkInput' });

const props = defineProps(inputProps);
const emit = defineEmits(inputEmits);

const form = inject(formContextKey, null);

const inner = ref<InputValue>(props.modelValue);
const composing = ref(false);
const passwordVisible = ref(false);

const realType = computed(() => {
  if (props.type === 'password' && props.showPassword && passwordVisible.value) {
    return 'text';
  }
  return props.type;
});

const style = computed(() => props.customStyle as StyleValue);
const isFocused = computed(() => props.focus || props.autofocus);

function readInputValue(e: InputEventPayload): InputValue {
  if (typeof e === 'object' && e !== null && 'detail' in e) {
    const detail = e.detail as { value?: InputValue } | undefined;
    if (detail?.value !== undefined) return detail.value;
  }
  if (typeof e === 'object' && e !== null && 'target' in e) {
    const target = e.target as { value?: InputValue } | null | undefined;
    if (target?.value !== undefined) return target.value;
  }
  return '';
}

function commit(val: InputValue, change = false) {
  inner.value = val;
  emit('update:modelValue', val);
  emit('input', val);
  if (change) {
    emit('change', val);
    if (props.prop) form?.emitFieldChange(props.prop, val);
  }
}

function onInput(e: InputEventPayload) {
  let v = readInputValue(e);
  if (props.maxlength > -1 && String(v).length > props.maxlength) {
    v = String(v).slice(0, props.maxlength);
  }
  if (!composing.value) commit(v, false);
}
function onBlur(e: InputEventPayload) {
  emit('blur', e);
  emit('change', inner.value);
  if (props.prop) form?.emitFieldBlur(props.prop);
}
function onFocus(e: InputEventPayload) {
  emit('focus', e);
}
function onConfirm(e: InputEventPayload) {
  emit('confirm', e);
}
function onKeyboardHeightChange(e: InputEventPayload) {
  emit('keyboardheightchange', e);
}
function onCompositionStart(e: InputEventPayload) {
  composing.value = true;
  emit('compositionstart', e);
}
function onCompositionUpdate(e: InputEventPayload) {
  emit('compositionupdate', e);
}
function onCompositionEnd(e: InputEventPayload) {
  composing.value = false;
  emit('compositionend', e);
  onInput(e);
}
function clear() {
  if (props.disabled || props.readonly || !inner.value) return;
  commit('', true);
  emit('clear');
}

// 密码明暗切换
function togglePassword() {
  passwordVisible.value = !passwordVisible.value;
}

function onFakeClick(e: unknown) {
  if (props.disabled) return;
  emit('click', e);
}

const count = computed(() => {
  if (!props.showCount && !props.showWordLimit) return '';
  const len = String(inner.value ?? '').length;
  return props.maxlength > -1 ? `${len}/${props.maxlength}` : `${len}`;
});

const classes = computed(() => [
  'lk-input',
  `lk-input--${props.size}`,
  {
    'is-disabled': props.disabled,
    'is-readonly': props.readonly,
    'is-fake': props.fake,
    'is-borderless': props.borderless,
    'has-count': !!count.value,
  },
  props.customClass,
]);

const fakeDisplayText = computed(() => {
  return props.fakeText || props.placeholder || '';
});

const showPasswordToggle = computed(() => {
  return props.showPassword && props.type === 'password' && !props.disabled && !props.readonly && !props.fake;
});

watch(
  () => props.modelValue,
  v => (inner.value = v)
);
</script>

<template>
  <view :id="id" :class="classes" :style="style" @tap="fake ? onFakeClick($event) : undefined">
    <view v-if="$slots.prefix || prefixIcon" class="lk-input__prefix">
      <slot name="prefix">
        <lk-icon v-if="prefixIcon" :name="prefixIcon" size="36" />
      </slot>
    </view>

    <!-- 假输入框模式 -->
    <view v-if="fake" class="lk-input__fake">
      <slot>
        <text class="lk-input__fake-text">{{ fakeDisplayText }}</text>
      </slot>
    </view>

    <!-- 真实输入框 -->
    <input
      v-else
      class="lk-input__inner"
      :class="[`lk-input__inner--${inputAlign}`]"
      :name="name"
      :value="inner"
      :type="realType"
      :password="type === 'password' && !passwordVisible"
      :placeholder="placeholder"
      :placeholder-style="placeholderStyle"
      :placeholder-class="placeholderClass"
      :maxlength="maxlength > -1 ? maxlength : 140000"
      :disabled="disabled"
      :readonly="readonly"
      :focus="isFocused"
      :confirm-type="confirmType"
      :confirm-hold="confirmHold"
      :cursor-spacing="cursorSpacing"
      :cursor="cursor"
      :selection-start="selectionStart"
      :selection-end="selectionEnd"
      :adjust-position="adjustPosition"
      :hold-keyboard="holdKeyboard"
      :inputmode="inputmode"
      :ignore-composition-event="ignoreCompositionEvent"
      :aria-disabled="disabled"
      :aria-readonly="readonly"
      :aria-label="placeholder"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @confirm="onConfirm"
      @keyboardheightchange="onKeyboardHeightChange"
      @compositionstart="onCompositionStart"
      @compositionupdate="onCompositionUpdate"
      @compositionend="onCompositionEnd"
    />

    <!-- 内嵌通知栏插槽 -->
    <slot name="notice"></slot>

    <!-- 清空按钮 -->
    <view
      v-if="clearable && !disabled && !readonly && inner && !fake"
      class="lk-input__clear"
      @click.stop="clear"
    >
      <lk-icon name="x-circle-fill" size="32" />
    </view>

    <!-- 密码明暗切换按钮 -->
    <view
      v-if="showPasswordToggle"
      class="lk-input__password-toggle"
      @click.stop="togglePassword"
    >
      <lk-icon :name="passwordVisible ? 'eye' : 'eye-slash'" size="36" />
    </view>

    <!-- 后缀图标/插槽 -->
    <view v-if="($slots.suffix || suffixIcon) && !showPasswordToggle" class="lk-input__suffix">
      <slot name="suffix">
        <lk-icon v-if="suffixIcon" :name="suffixIcon" size="36" />
      </slot>
    </view>

    <view v-if="count && !fake" class="lk-input__count">{{ count }}</view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
