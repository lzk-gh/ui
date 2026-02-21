<script setup lang="ts">
import { computed } from 'vue';
import { choiceProps, choiceEmits } from './choice.props';
import LkIcon from '../lk-icon/lk-icon.vue';

defineOptions({ name: 'LkChoice' });

const props = defineProps(choiceProps);
const emit = defineEmits(choiceEmits);

function isSelected(value: any) {
  if (props.multiple) {
    return Array.isArray(props.modelValue) && props.modelValue.includes(value);
  }
  return props.modelValue === value;
}

function handleSelect(option: any) {
  const value = option.value;
  if (isSelected(value)) {
    if (!props.allowUnselect) return;
    if (props.multiple) {
      const currentValues = Array.isArray(props.modelValue) ? props.modelValue : [];
      const newValue = currentValues.filter(v => v !== value);
      emit('update:modelValue', newValue);
      emit('change', newValue);
    } else {
      emit('update:modelValue', null);
      emit('change', null);
    }
  } else {
    if (props.multiple) {
      const currentValues = Array.isArray(props.modelValue) ? props.modelValue : [];
      const newValue = [...currentValues, value];
      emit('update:modelValue', newValue);
      emit('change', newValue);
    } else {
      emit('update:modelValue', value);
      emit('change', value);
    }
  }
  emit('click', option);
}

const containerStyle = computed(() => ({
  gap: `${props.gap}rpx`,
  ...(typeof props.customStyle === 'object' ? props.customStyle : {}),
}));

function itemClass(option: any) {
  return [
  'lk-choice__item',
  `lk-choice__item--${props.size}`,
  { 'is-selected': isSelected(option.value) },
  ];
}
</script>

<template>
  <view class="lk-choice" :class="customClass" :style="containerStyle">
    <view
      v-for="(opt, index) in options"
      :key="index"
      :class="itemClass(opt)"
      @click="handleSelect(opt)"
    >
      <slot name="item" :option="opt" :selected="isSelected(opt.value)">
        <lk-icon v-if="opt.icon" :name="opt.icon" class="lk-choice__icon" />
        <text class="lk-choice__label">{{ opt.label }}</text>
      </slot>
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
