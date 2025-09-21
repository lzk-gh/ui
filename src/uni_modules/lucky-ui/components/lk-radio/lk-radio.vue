<script setup lang="ts">
import { inject, computed } from 'vue';

defineOptions({ name:'LkRadio' });
const props = defineProps({
  modelValue: { type:[String,Number,Boolean], default: undefined },
  label: { type:[String,Number,Boolean], required:true },
  size: { type:String, default:'' },
  disabled: { type:Boolean, default:false },
});
const emit = defineEmits(['update:modelValue','change']);

const group = inject<any>('LkRadioGroup', null);
const isGroup = computed(()=> !!group?.isGroup);
const mergedSize = computed(()=> props.size || group?.size || 'md');
const checked = computed(()=> isGroup.value ? group.value() === props.label : props.modelValue === props.label);
const isDisabled = computed(()=> isGroup.value ? group.disabled : props.disabled);

function select(){
  if(isDisabled.value || checked.value) return;
  if(isGroup.value) group.update(props.label);
  else {
    emit('update:modelValue', props.label);
    emit('change', props.label);
  }
}
</script>

<template>
  <view
      class="lk-radio"
      :class="[`lk-radio--${mergedSize}`, { 'is-checked': checked, 'is-disabled': isDisabled }]"
      @click="select"
  >
    <view class="lk-radio__outer">
      <view class="lk-radio__inner" />
    </view>
    <view class="lk-radio__label"><slot>{{ label }}</slot></view>
  </view>
</template>

<style lang="scss">
.lk-radio {
  --_size: var(--lk-choice-size-md);
  --_gap: 14rpx;
  display:inline-flex;
  align-items:center;
  font-size:28rpx;
  cursor:pointer;
  user-select:none;
  -webkit-tap-highlight-color:transparent;
  transition: opacity var(--lk-transition-fast);

  &--sm { --_size: var(--lk-choice-size-sm); font-size:26rpx; }
  &--lg { --_size: var(--lk-choice-size-lg); font-size:30rpx; }

  &__outer {
    width:var(--_size);
    height:var(--_size);
    border:2rpx solid var(--lk-color-border);
    border-radius:50%;
    display:flex;
    align-items:center;
    justify-content:center;
    background:var(--lk-color-bg-surface);
    transition:border-color var(--lk-transition-fast), background var(--lk-transition-fast), transform var(--lk-transition-fast);
  }
  &__inner {
    width:48%; height:48%;
    background:var(--lk-color-primary);
    border-radius:50%;
    transform:scale(.2);
    opacity:0;
    transition: transform var(--lk-transition-base), opacity var(--lk-transition-fast);
  }
  &__label { margin-left:var(--_gap); }

  &:active:not(.is-disabled) .lk-radio__outer { transform:scale(.94); }

  &.is-checked {
    .lk-radio__outer {
      border-color:var(--lk-color-primary);
      background:var(--lk-color-primary-bg-soft);
    }
    .lk-radio__inner { opacity:1; transform:scale(1); }
  }

  &.is-disabled { opacity:.45; cursor:not-allowed; }
}
</style>