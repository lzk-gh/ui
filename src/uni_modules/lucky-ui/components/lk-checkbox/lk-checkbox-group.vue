<script setup lang="ts">
import { provide, computed } from 'vue';

defineOptions({ name: 'LkCheckboxGroup' });
const props = defineProps({
  modelValue: { type: Array as () => any[], default: () => [] },
  max: { type: Number, default: Infinity },
  min: { type: Number, default: 0 },
  size: { type: String, default: 'md' }, // sm|md|lg
  disabled: { type: Boolean, default: false },
  direction: { type: String, default: 'row' }, // row|column
  iconType: { type: String, default: 'check' }, // check | dot | icon
  shape: { type: String, default: 'square' }, // square | circle
});
const emit = defineEmits(['update:modelValue', 'change']);

const set = computed(() => new Set(props.modelValue));
function toggle(val: any, wantChecked: boolean) {
  const cur = new Set(props.modelValue);
  if (wantChecked) {
    if (cur.has(val) || cur.size >= props.max) return;
    cur.add(val);
  } else {
    if (!cur.has(val) || cur.size <= props.min) return;
    cur.delete(val);
  }
  const arr = Array.from(cur);
  emit('update:modelValue', arr);
  emit('change', arr);
}

provide('LkCheckboxGroup', {
  isGroup: true,
  checkedSet: set,
  toggle,
  size: props.size,
  disabled: props.disabled,
  iconType: props.iconType,
  shape: props.shape,
});
</script>

<template>
  <view class="lk-checkbox-group" :class="[`is-${direction}`]">
    <slot />
  </view>
</template>

<style lang="scss">
.lk-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx 36rpx;
  &.is-column {
    flex-direction: column;
  }
}
</style>
