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
      :value="inner"
      :type="type"
      :placeholder="placeholder"
      :maxlength="maxlength > -1 ? maxlength : 140000"
      :disabled="disabled"
      :readonly="readonly"
      :focus="autofocus"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @compositionstart="onCompositionStart"
      @compositionend="onCompositionEnd"
    />

    <!-- 内嵌通知栏插槽 -->
    <slot name="notice"></slot>

    <view v-if="$slots.suffix || suffixIcon" class="lk-input__suffix">
      <slot name="suffix">
        <lk-icon v-if="suffixIcon" :name="suffixIcon" size="36" />
      </slot>
    </view>

    <view
      v-if="clearable && !disabled && !readonly && inner && !fake"
      class="lk-input__clear"
      @click="clear"
      >×</view
    >
    <view v-if="count && !fake" class="lk-input__count">{{ count }}</view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
