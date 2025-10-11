<script setup lang="ts">
import { ref, watch, computed, inject, onMounted, nextTick } from 'vue';
import { formContextKey } from '../lk-form/context';

defineOptions({ name: 'LkTextarea' });

const props = defineProps({
  modelValue: { type: String, default: '' },
  rows: { type: Number, default: 3 },
  autoSize: { type: [Boolean, Object], default: true }, // true | { minRows, maxRows }
  maxlength: { type: Number, default: -1 },
  showCount: { type: Boolean, default: false },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  size: { type: String, default: 'md' }, // sm|md|lg
  prop: { type: String, default: '' }
});

const emit = defineEmits(['update:modelValue','input','change','focus','blur','clear']);

const form = inject(formContextKey, null);
const val = ref(props.modelValue);
watch(()=>props.modelValue, v => { val.value = v; adjustHeight(); });

const textareaRef = ref<any>();
const countText = computed(()=>{
  if(!props.showCount) return '';
  const len = val.value.length;
  return props.maxlength > -1 ? `${len}/${props.maxlength}` : String(len);
});

function onInput(e:any){
  let value = e.detail?.value ?? e.target?.value ?? '';
  if(props.maxlength > -1 && value.length > props.maxlength) {
    value = value.slice(0, props.maxlength);
  }
  val.value = value;
  emit('update:modelValue', value);
  emit('input', value);
  adjustHeight();
}
function onBlur(e:any) {
  emit('blur', e);
  emit('change', val.value);
  if(props.prop) form?.emitFieldBlur(props.prop);
}
function onFocus(e:any){
  emit('focus', e);
}
function clear() {
  if(props.disabled || props.readonly) return;
  val.value = '';
  emit('update:modelValue', '');
  emit('clear');
  emit('change','');
  if(props.prop) form?.emitFieldChange(props.prop, '');
  adjustHeight();
}

const classes = computed(()=>[
  'lk-textarea',
  `lk-textarea--${props.size}`,
  {
    'is-disabled': props.disabled,
    'is-readonly': props.readonly,
    'has-count': !!countText.value
  }
]);

function adjustHeight() {
  if(!props.autoSize) return;
  const el = textareaRef.value;
  if(!el) return;
  // H5 webview: el is native textarea; 小程序端不能直接 style height=auto
  // 兼容：如果有 scrollHeight 可使用
  try {
    el.style.height = 'auto';
    const base = el.scrollHeight;
    let target = base;
    if(typeof props.autoSize === 'object') {
      const lineHeight = 40; // rough line height rpx->approx
      if(props.autoSize.minRows) {
        target = Math.max(target, props.autoSize.minRows * lineHeight);
      }
      if(props.autoSize.maxRows) {
        target = Math.min(target, props.autoSize.maxRows * lineHeight);
      }
    }
    el.style.height = target + 'px';
  } catch(e){
    // ignore silently on mini program
  }
}

onMounted(()=> nextTick(adjustHeight));
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
    <view v-if="clearable && val && !disabled && !readonly" class="lk-textarea__clear" @click="clear">×</view>
    <view v-if="countText" class="lk-textarea__count">{{ countText }}</view>
  </view>
</template>

<style scoped lang="scss">
.lk-textarea {
  --_fs: var(--lk-control-font-size-md);
  --_radius: var(--lk-radius-lg);
  --_border: var(--lk-input-border-color);
  --_border-hover: var(--lk-input-border-color-hover);
  --_border-active: var(--lk-input-border-color-active);
  --_placeholder: var(--lk-input-placeholder-color);
  --_bg: var(--lk-input-bg);
  position: relative;
  width: 100%;
  background: var(--_bg);
  border: 2rpx solid var(--_border);
  border-radius: var(--_radius);
  padding: 12rpx var(--lk-control-padding-x-md) 20rpx;
  display: flex;
  flex-direction: column;
  transition: border-color var(--lk-transition-fast), box-shadow var(--lk-transition-fast);

  &--sm {
    --_fs: var(--lk-control-font-size-sm);
    --_radius: var(--lk-radius-md);
    padding: 8rpx var(--lk-control-padding-x-sm) 16rpx;
  }
  &--lg {
    --_fs: var(--lk-control-font-size-lg);
    --_radius: var(--lk-radius-pill);
    padding: 16rpx var(--lk-control-padding-x-lg) 24rpx;
  }

  &__inner {
    width: 100%;
    font-size: var(--_fs);
    line-height: 1.5;
    background: transparent;
    border: none;
    resize: none;
    outline: none;
    color: var(--lk-color-text);
    min-height: 120rpx;
    &::placeholder {
      color: var(--_placeholder);
    }
  }

  &__clear {
    position: absolute;
    right: 16rpx;
    top: 12rpx;
    font-size: 32rpx;
    color: var(--lk-color-text-secondary);
    padding: 8rpx;
    line-height: 1;
    border-radius: var(--lk-radius-sm);
    &:active {
      background: var(--lk-color-primary-bg-soft);
      color: var(--lk-color-primary-active);
    }
  }

  &__count {
    align-self: flex-end;
    margin-top: 8rpx;
    font-size: 22rpx;
    color: var(--lk-color-text-secondary);
  }

  &:hover:not(.is-disabled):not(.is-readonly) { border-color: var(--_border-hover); }
  &:active:not(.is-disabled):not(.is-readonly) { border-color: var(--_border-active); }
  &:focus-within:not(.is-disabled):not(.is-readonly) {
    border-color: var(--_border-active);
    box-shadow: var(--lk-input-shadow-focus);
  }
  &.is-disabled { opacity: .6; }
  &.is-readonly { background: var(--lk-color-primary-bg-soft); }
  .lk-form-item.is-error & {
    border-color: var(--lk-input-border-color-error);
    box-shadow: 0 0 0 4rpx var(--lk-color-primary-bg-soft);
  }
}
</style>