<script setup lang="ts">
import { provide, computed, inject } from 'vue';
import { checkboxGroupProps, checkboxGroupEmits } from './checkbox.props';
import { formContextKey } from '../lk-form/context';

defineOptions({ name: 'LkCheckboxGroup' });

const props = defineProps(checkboxGroupProps);
const emit = defineEmits(checkboxGroupEmits);

const form = inject(formContextKey, null);

// 使用 Symbol.for 确保和子组件注入匹配
const LK_CHECKBOX_GROUP_KEY = Symbol.for('LkCheckboxGroup');

function updateValue(value: any[]) {
  emit('update:modelValue', value);
  emit('change', value);
  // 表单联动验证
  if (props.validateEvent && props.prop) {
    form?.emitFieldChange(props.prop, value);
  }
}

function toggleValue(name: any) {
  const value = [...props.modelValue];
  const index = value.indexOf(name);
  if (index !== -1) {
    value.splice(index, 1);
  } else {
    // max === 0 表示不限制
    if (props.max === 0 || value.length < props.max) {
      value.push(name);
    }
  }
  updateValue(value);
}

provide(LK_CHECKBOX_GROUP_KEY, {
  props,
  toggleValue,
});

const groupClass = computed(() => {
  return ['lk-checkbox-group', `lk-checkbox-group--${props.direction}`, props.customClass];
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
