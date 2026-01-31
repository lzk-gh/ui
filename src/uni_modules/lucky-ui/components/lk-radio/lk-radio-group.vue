<script setup lang="ts">
import { provide, computed } from 'vue';
import { radioGroupProps, radioGroupEmits } from './radio.props';

defineOptions({ name: 'LkRadioGroup' });

const props = defineProps(radioGroupProps);
const emit = defineEmits(radioGroupEmits);

const updateValue = (value: any) => {
  emit('update:modelValue', value);
  emit('change', value);
};

provide('lkRadioGroup', {
  props,
  updateValue,
});

const groupClass = computed(() => {
  return ['lk-radio-group', `lk-radio-group--${props.direction}`, props.customClass];
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
