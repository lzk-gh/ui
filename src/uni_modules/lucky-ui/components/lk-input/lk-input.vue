<script setup lang="ts">
import { ref, watch, computed, inject } from 'vue';
import { formContextKey } from '../lk-form/context';
import LkIcon from '../lk-icon/lk-icon.vue';

defineOptions({ name:'LkInput' });

const props = defineProps({
  modelValue: { type:[String,Number], default:'' },
  size: { type:String, default:'md' },
  type: { type:String, default:'text' },
  placeholder: { type:String, default:'' },
  disabled: { type:Boolean, default:false },
  readonly: { type:Boolean, default:false },
  clearable: { type:Boolean, default:true },
  maxlength: { type:Number, default:-1 },
  showCount: { type:Boolean, default:false },
  prop: { type:String, default:'' },
  autofocus: { type:Boolean, default:false },
  prefixIcon: { type:String, default:'' },
  suffixIcon: { type:String, default:'' },
  showWordLimit: { type:Boolean, default:false }
});

const emit = defineEmits(['update:modelValue','input','change','focus','blur','clear']);

const form = inject(formContextKey, null);

const inner = ref<any>(props.modelValue);
const composing = ref(false);

function commit(val:any, change=false){
  inner.value = val;
  emit('update:modelValue', val);
  emit('input', val);
  if(change){
    emit('change', val);
    if(props.prop) form?.emitFieldChange(props.prop, val);
  }
}

function onInput(e:any) {
  let v = e.detail?.value ?? e.target?.value ?? '';
  if(props.maxlength>-1 && String(v).length>props.maxlength) {
    v = String(v).slice(0, props.maxlength);
  }
  if(!composing.value) commit(v, false);
}
function onBlur(e:any){
  emit('blur', e);
  emit('change', inner.value);
  if(props.prop) form?.emitFieldBlur(props.prop);
}
function onFocus(e:any){ emit('focus', e); }
function onCompositionStart(){ composing.value=true; }
function onCompositionEnd(e:any){ composing.value=false; onInput(e); }
function clear(){
  if(props.disabled || props.readonly || !inner.value) return;
  commit('', true);
  emit('clear');
}

const count = computed(()=>{
  if(!props.showCount && !props.showWordLimit) return '';
  const len = String(inner.value ?? '').length;
  return props.maxlength> -1 ? `${len}/${props.maxlength}` : `${len}`;
});

const classes = computed(()=>[
  'lk-input', `lk-input--${props.size}`, {
    'is-disabled': props.disabled,
    'is-readonly': props.readonly,
    'has-count': !!count.value
  }
]);

watch(()=>props.modelValue, v=> inner.value=v);
</script>

<template>
  <view :class="classes">
    <view v-if="$slots.prefix || prefixIcon" class="lk-input__prefix">
      <slot name="prefix">
        <lk-icon v-if="prefixIcon" :name="prefixIcon" size="32" />
      </slot>
    </view>

    <input
        class="lk-input__inner"
        :value="inner"
        :type="type"
        :placeholder="placeholder"
        :maxlength="maxlength> -1? maxlength : 140000"
        :disabled="disabled"
        :readonly="readonly"
        :focus="autofocus"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @compositionstart="onCompositionStart"
        @compositionend="onCompositionEnd"
    />
    <view v-if="$slots.suffix || suffixIcon" class="lk-input__suffix">
      <slot name="suffix">
        <lk-icon v-if="suffixIcon" :name="suffixIcon" size="32" />
      </slot>
    </view>

    <view v-if="clearable && !disabled && !readonly && inner" class="lk-input__clear" @click="clear">×</view>
    <view v-if="count" class="lk-input__count">{{ count }}</view>
  </view>
</template>

<style lang="scss">
.lk-input {
  --_height: var(--lk-control-height-md);
  --_fs: var(--lk-control-font-size-md);
  --_px: var(--lk-control-padding-x-md);
  --_radius: var(--lk-radius-lg);
  --_border: var(--lk-input-border-color);
  --_border-hover: var(--lk-input-border-color-hover);
  --_border-active: var(--lk-input-border-color-active);
  --_placeholder: var(--lk-input-placeholder-color);
  --_bg: var(--lk-input-bg);

  position:relative;
  display:inline-flex;
  align-items:center;
  width:100%;
  background:var(--_bg);
  border:2rpx solid var(--_border);
  border-radius:var(--_radius);
  padding:0 calc(var(--_px) - 4rpx) 0 var(--_px);
  transition:border-color var(--lk-transition-fast), box-shadow var(--lk-transition-fast), background-color var(--lk-transition-fast);

  &--sm { --_height: var(--lk-control-height-sm); --_fs: var(--lk-control-font-size-sm); --_px: var(--lk-control-padding-x-sm); --_radius: var(--lk-radius-md); }
  &--lg { --_height: var(--lk-control-height-lg); --_fs: var(--lk-control-font-size-lg); --_px: var(--lk-control-padding-x-lg); --_radius: var(--lk-radius-pill); }

  &__inner {
    flex:1;
    height:var(--_height);
    font-size:var(--_fs);
    background:transparent;
    border:none;
    outline:none;
    padding:0;
    color:var(--lk-color-text);
    line-height:calc(var(--_height) - 4rpx);
    &::placeholder { color:var(--_placeholder); }
  }
  &__prefix, &__suffix {
    display:flex;
    align-items:center;
    color:var(--lk-color-text-secondary);
    flex-shrink:0;
  }
  &__prefix {
    margin-right:8rpx;
  }
  &__suffix {
    margin-left:8rpx;
  }
  &__clear {
    margin-left:8rpx;
    font-size:32rpx;
    padding:8rpx;
    color:var(--lk-color-text-secondary);
    border-radius:var(--lk-radius-sm);
    transition: background var(--lk-transition-fast), color var(--lk-transition-fast);
    &:active { background:var(--lk-color-primary-bg-soft); color:var(--lk-color-primary-active); }
  }
  &__count {
    margin-left:12rpx;
    font-size:22rpx;
    color:var(--lk-color-text-secondary);
  }

  &:hover:not(.is-disabled):not(.is-readonly) { border-color:var(--_border-hover); }
  &:active:not(.is-disabled):not(.is-readonly) { border-color:var(--_border-active); }
  &:focus-within:not(.is-disabled):not(.is-readonly) {
    border-color:var(--_border-active);
    box-shadow:var(--lk-input-shadow-focus);
  }

  &.is-disabled { opacity:.6; }
  &.is-readonly { background:var(--lk-color-primary-bg-soft); }

  /* 表单错误态（父 .lk-form-item.is-error 加的类） */
  .lk-form-item.is-error & {
    border-color: var(--lk-input-border-color-error);
    box-shadow: 0 0 0 4rpx var(--lk-color-primary-bg-soft);
  }
}
</style>