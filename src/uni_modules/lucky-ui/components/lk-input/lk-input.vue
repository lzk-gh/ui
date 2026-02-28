<script setup lang="ts">
import { ref, watch, computed, inject } from 'vue';
import { formContextKey } from '../lk-form/context';
import { inputProps, inputEmits } from './input.props';
import LkIcon from '../lk-icon/lk-icon.vue';

defineOptions({ name: 'LkInput' });

const props = defineProps(inputProps);
const emit = defineEmits(inputEmits);

const form = inject(formContextKey, null);

const inner = ref<any>(props.modelValue);
const composing = ref(false);
// 密码明文切换状态
const passwordVisible = ref(false);

// 实际使用的 input type：密码切换时从 password 变为 text
const realType = computed(() => {
  if (props.type === 'password' && props.showPassword && passwordVisible.value) {
    return 'text';
  }
  return props.type;
});

function commit(val: any, change = false) {
  inner.value = val;
  emit('update:modelValue', val);
  emit('input', val);
  if (change) {
    emit('change', val);
    if (props.prop) form?.emitFieldChange(props.prop, val);
  }
}

function onInput(e: any) {
  let v = e.detail?.value ?? e.target?.value ?? '';
  if (props.maxlength > -1 && String(v).length > props.maxlength) {
    v = String(v).slice(0, props.maxlength);
  }
  if (!composing.value) commit(v, false);
}
function onBlur(e: any) {
  emit('blur', e);
  emit('change', inner.value);
  if (props.prop) form?.emitFieldBlur(props.prop);
}
function onFocus(e: any) {
  emit('focus', e);
}
function onConfirm(e: any) {
  emit('confirm', e);
}
function onCompositionStart() {
  composing.value = true;
}
function onCompositionEnd(e: any) {
  composing.value = false;
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

// 假输入框点击事件
function onFakeClick() {
  emit('click');
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
    'has-count': !!count.value,
  },
]);

// 假输入框显示的文本
const fakeDisplayText = computed(() => {
  return props.fakeText || props.placeholder || '';
});

// 是否显示密码切换按钮
const showPasswordToggle = computed(() => {
  return props.showPassword && props.type === 'password' && !props.disabled && !props.readonly && !props.fake;
});

watch(
  () => props.modelValue,
  v => (inner.value = v)
);
</script>

<template>
  <view :class="classes" @click="fake ? onFakeClick() : undefined">
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
      :value="inner"
      :type="realType"
      :password="type === 'password' && !passwordVisible"
      :placeholder="placeholder"
      :maxlength="maxlength > -1 ? maxlength : 140000"
      :disabled="disabled"
      :readonly="readonly"
      :focus="autofocus"
      :confirm-type="confirmType"
      :cursor-spacing="cursorSpacing"
      :aria-disabled="disabled"
      :aria-readonly="readonly"
      :aria-label="placeholder"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @confirm="onConfirm"
      @compositionstart="onCompositionStart"
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
