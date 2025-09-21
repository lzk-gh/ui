<script setup lang="ts">
import { inject, computed } from 'vue';

defineOptions({ name:'LkCheckbox' });

const props = defineProps({
  modelValue: { type:[Boolean,String,Number], default: undefined },
  label: { type:[String,Number,Boolean,Object], default: undefined },
  trueValue: { type:[Boolean,String,Number], default:true },
  falseValue: { type:[Boolean,String,Number], default:false },
  size: { type:String, default:'' },
  disabled: { type:Boolean, default:false },
  indeterminate: { type:Boolean, default:false }
});
const emit = defineEmits(['update:modelValue','change']);

const group = inject<any>('LkCheckboxGroup', null);
const isGroup = computed(()=> !!group?.isGroup);
const mergedSize = computed(()=> props.size || group?.size || 'md');

const checked = computed(()=>{
  if(isGroup.value) return group.checkedSet.value.has(props.label);
  return props.modelValue === props.trueValue;
});
const isDisabled = computed(()=> isGroup.value ? group.disabled : props.disabled);

function toggle(){
  if(isDisabled.value) return;
  if(isGroup.value) group.toggle(props.label, !checked.value);
  else {
    const target = checked.value ? props.falseValue : props.trueValue;
    emit('update:modelValue', target);
    emit('change', target);
  }
}
</script>

<template>
  <view
      class="lk-checkbox"
      :class="[`lk-checkbox--${mergedSize}`, {
      'is-checked': checked,
      'is-disabled': isDisabled,
      'is-indeterminate': indeterminate
    }]"
      @click="toggle"
  >
    <view class="lk-checkbox__box">
      <view class="lk-checkbox__icon" />
    </view>
    <view class="lk-checkbox__label"><slot>{{ label }}</slot></view>
  </view>
</template>

<style lang="scss">
.lk-checkbox {
  --_size: var(--lk-choice-size-md);
  --_border-size: var(--lk-choice-border-size);
  --_radius: var(--lk-radius-sm);
  --_gap: 14rpx;
  display:inline-flex;
  align-items:center;
  cursor:pointer;
  user-select:none;
  font-size:28rpx;
  line-height:1.2;
  color:var(--lk-color-text);
  -webkit-tap-highlight-color:transparent;
  transition: color var(--lk-transition-fast), opacity var(--lk-transition-fast);

  &--sm { --_size: var(--lk-choice-size-sm); font-size:26rpx; }
  &--lg { --_size: var(--lk-choice-size-lg); font-size:30rpx; }

  &__box {
    width:var(--_size);
    height:var(--_size);
    border:var(--_border-size) solid var(--lk-color-border);
    border-radius:var(--_radius);
    background:var(--lk-color-bg-surface);
    display:flex;
    align-items:center;
    justify-content:center;
    transition: background var(--lk-transition-fast), border-color var(--lk-transition-fast), transform var(--lk-transition-fast);
    box-sizing:border-box;
  }
  &__icon {
    position:relative;
    width:60%;
    height:60%;
    opacity:0;
    transform:scale(.5) rotate(8deg);
    transition: transform var(--lk-transition-base), opacity var(--lk-transition-fast);
    &::before{
      content:'';
      position:absolute;
      left:50%; top:50%;
      width:60%; height:36%;
      border:var(--_border-size) solid #fff;
      border-top:0; border-left:0;
      transform:translate(-50%,-50%) rotate(45deg);
      border-radius:2rpx;
    }
  }
  &__label { margin-left:var(--_gap); }

  &:active:not(.is-disabled) .lk-checkbox__box { transform:scale(.94); }

  &.is-checked {
    .lk-checkbox__box {
      background:var(--lk-color-primary);
      border-color:var(--lk-color-primary);
    }
    .lk-checkbox__icon {
      opacity:1;
      transform:scale(1) rotate(0);
    }
  }

  &.is-indeterminate {
    .lk-checkbox__box {
      background:var(--lk-color-primary);
      border-color:var(--lk-color-primary);
    }
    .lk-checkbox__icon {
      opacity:1;
      transform:none;
      &::before {
        width:70%; height:0;
        border:0;
        border-top:var(--_border-size) solid #fff;
        transform:translate(-50%,-50%) rotate(0);
      }
    }
  }

  &.is-disabled { opacity:.45; cursor:not-allowed; }
}
</style>