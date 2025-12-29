<script setup lang="ts">
import { provide } from 'vue';

defineOptions({ name: 'LkRadioGroup' });
const props = defineProps({
  modelValue: { type: [String, Number, Boolean], default: null },
  size: { type: String, default: 'md' },
  disabled: { type: Boolean, default: false },
  direction: { type: String, default: 'row' }, // row | column
  iconType: { type: String, default: 'dot' }, // dot | check | custom
  shape: { type: String, default: 'circle' }, // circle | square
});
const emit = defineEmits(['update:modelValue', 'change']);

function update(v: any) {
  emit('update:modelValue', v);
  emit('change', v);
}

provide('LkRadioGroup', {
  isGroup: true,
  value: () => props.modelValue,
  update,
  size: props.size,
  disabled: props.disabled,
  iconType: props.iconType,
  shape: props.shape,
});
</script>

<template>
  <view class="lk-radio-group" :class="[{ 'is-column': direction === 'column' }]"><slot /></view>
</template>

<style lang="scss">
@use './index.scss';
</style>
