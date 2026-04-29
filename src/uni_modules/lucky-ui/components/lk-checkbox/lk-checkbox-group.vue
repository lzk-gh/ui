<script setup lang="ts">
import type { StyleValue } from 'vue';
import { provide, computed, inject } from 'vue';
import type { CheckboxValue } from './checkbox.props';
import { checkboxGroupProps, checkboxGroupEmits } from './checkbox.props';
import { formContextKey } from '../lk-form/context';

defineOptions({ name: 'LkCheckboxGroup' });

const props = defineProps(checkboxGroupProps);
const emit = defineEmits(checkboxGroupEmits);

const form = inject(formContextKey, null);

// 使用 Symbol.for 确保和子组件注入匹配
const LK_CHECKBOX_GROUP_KEY = Symbol.for('LkCheckboxGroup');

const style = computed(() => props.customStyle as StyleValue);

function updateValue(value: CheckboxValue[], changedValue: CheckboxValue, checked: boolean) {
  emit('update:modelValue', value);
  emit('change', value);
  emit('item-change', changedValue, checked, value);
  // 表单联动验证
  if (props.validateEvent && props.prop) {
    form?.emitFieldChange(props.prop, value);
  }
}

function toggleValue(name: CheckboxValue) {
  const value = [...props.modelValue];
  const index = value.indexOf(name);
  if (index !== -1) {
    value.splice(index, 1);
    updateValue(value, name, false);
  } else {
    // max === 0 表示不限制
    if (props.max === 0 || value.length < props.max) {
      value.push(name);
      updateValue(value, name, true);
    } else {
      emit('overlimit', name, props.max);
    }
  }
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
  <view :id="id" :class="groupClass" :style="style">
    <slot />
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
