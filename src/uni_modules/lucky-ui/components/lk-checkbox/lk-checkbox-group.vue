<script setup lang="ts">
import { provide, computed } from 'vue';
import { checkboxGroupProps, checkboxGroupEmits } from './checkbox.props';

defineOptions({ name: 'LkCheckboxGroup' });

const props = defineProps(checkboxGroupProps);
const emit = defineEmits(checkboxGroupEmits);

const updateValue = (value: any[]) => {
  emit('update:modelValue', value);
  emit('change', value);
};

const toggleValue = (name: any) => {
  const value = [...props.modelValue];
  const index = value.indexOf(name);
  if (index !== -1) {
    value.splice(index, 1);
  } else {
    if (value.length < props.max) {
      value.push(name);
    }
  }
  updateValue(value);
};

provide('lkCheckboxGroup', {
  props,
  toggleValue,
});

const groupClass = computed(() => {
  return [
    'lk-checkbox-group',
    `lk-checkbox-group--${props.direction}`,
    props.customClass,
  ];
});
</script>

<template>
  <view :class="groupClass" :style="customStyle">
    <slot />
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
