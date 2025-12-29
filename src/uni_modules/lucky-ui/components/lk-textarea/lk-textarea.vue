<script setup lang="ts">
import { ref, watch, computed, inject, onMounted, nextTick } from 'vue';
import { formContextKey } from '../lk-form/context';
import { textareaProps, textareaEmits } from './textarea.props';

defineOptions({ name: 'LkTextarea' });

const props = defineProps(textareaProps);

const emit = defineEmits(textareaEmits);

const form = inject(formContextKey, null);
const val = ref(props.modelValue);
watch(
  () => props.modelValue,
  v => {
    val.value = v;
    adjustHeight();
  }
);

const textareaRef = ref<any>();
const countText = computed(() => {
  if (!props.showCount) return '';
  const len = val.value.length;
  return props.maxlength > -1 ? `${len}/${props.maxlength}` : String(len);
});

function onInput(e: any) {
  let value = e.detail?.value ?? e.target?.value ?? '';
  if (props.maxlength > -1 && value.length > props.maxlength) {
    value = value.slice(0, props.maxlength);
  }
  val.value = value;
  emit('update:modelValue', value);
  emit('input', value);
  adjustHeight();
}
function onBlur(e: any) {
  emit('blur', e);
  emit('change', val.value);
  if (props.prop) form?.emitFieldBlur(props.prop);
}
function onFocus(e: any) {
  emit('focus', e);
}
function clear() {
  if (props.disabled || props.readonly) return;
  val.value = '';
  emit('update:modelValue', '');
  emit('clear');
  emit('change', '');
  if (props.prop) form?.emitFieldChange(props.prop, '');
  adjustHeight();
}

const classes = computed(() => [
  'lk-textarea',
  `lk-textarea--${props.size}`,
  {
    'is-disabled': props.disabled,
    'is-readonly': props.readonly,
    'has-count': !!countText.value,
  },
]);

function adjustHeight() {
  if (!props.autoSize) return;
  const el = textareaRef.value;
  if (!el) return;
  // H5 webview: el is native textarea; 小程序端不能直接 style height=auto
  // 兼容：如果有 scrollHeight 可使用
  try {
    el.style.height = 'auto';
    const base = el.scrollHeight;
    let target = base;
    if (typeof props.autoSize === 'object') {
      const lineHeight = 40; // rough line height rpx->approx
      if (props.autoSize.minRows) {
        target = Math.max(target, props.autoSize.minRows * lineHeight);
      }
      if (props.autoSize.maxRows) {
        target = Math.min(target, props.autoSize.maxRows * lineHeight);
      }
    }
    el.style.height = target + 'px';
  } catch (e) {
    // ignore silently on mini program
  }
}

onMounted(() => nextTick(adjustHeight));
</script>

<template>
  <view :class="classes">
    <textarea
      ref="textareaRef"
      class="lk-textarea__inner"
      :value="val"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength > -1 ? maxlength : 140000"
      :rows="rows"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
    />
    <view
      v-if="clearable && val && !disabled && !readonly"
      class="lk-textarea__clear"
      @click="clear"
      >×</view
    >
    <view v-if="countText" class="lk-textarea__count">{{ countText }}</view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
