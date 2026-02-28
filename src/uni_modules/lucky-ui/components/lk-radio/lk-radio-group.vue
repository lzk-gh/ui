<script setup lang="ts">
import { provide, computed, inject } from 'vue';
import { radioGroupProps, radioGroupEmits } from './radio.props';
import { formContextKey } from '../lk-form/context';

defineOptions({ name: 'LkRadioGroup' });

const props = defineProps(radioGroupProps);
const emit = defineEmits(radioGroupEmits);

const form = inject(formContextKey, null);

// 使用 Symbol.for 确保和子组件匹配
const LK_RADIO_GROUP_KEY = Symbol.for('LkRadioGroup');

function updateValue(value: any) {
  emit('update:modelValue', value);
  emit('change', value);
  // 表单联动验证
  if (props.validateEvent && props.prop) {
    form?.emitFieldChange(props.prop, value);
  }
}

provide(LK_RADIO_GROUP_KEY, {
  props,
  updateValue,
});

const groupClass = computed(() => {
  return ['lk-radio-group', `lk-radio-group--${props.direction}`, props.customClass];
});
</script>

<template>
  <view :class="groupClass" :style="customStyle as any">
    <slot />
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
