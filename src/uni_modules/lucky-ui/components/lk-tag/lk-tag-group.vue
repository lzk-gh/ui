<script setup lang="ts">
import { provide, computed } from 'vue';
import { tagGroupProps, tagGroupEmits } from './tag-group.props';

defineOptions({ name: 'LkTagGroup' });

const props = defineProps(tagGroupProps);
const emit = defineEmits(tagGroupEmits);

const toggleValue = (name: any) => {
  if (props.multiple) {
    const value = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
    const index = value.indexOf(name);
    if (index !== -1) {
      value.splice(index, 1);
    } else {
      value.push(name);
    }
    emit('update:modelValue', value);
    emit('change', value);
  } else {
    emit('update:modelValue', name);
    emit('change', name);
  }
};

provide('lkTagGroup', {
  props,
  toggleValue,
});

const classes = computed(() => [
  'lk-tag-group',
  { 'is-wrap': props.wrap },
  props.customClass,
]);

const style = computed(() => {
  return {
    gap: `${props.gap}rpx`,
    ...props.customStyle,
  };
});
</script>

<template>
  <view :class="classes" :style="style">
    <slot />
  </view>
</template>

<style lang="scss">
.lk-tag-group {
  display: flex;
  width: 100%;

  &.is-wrap {
    flex-wrap: wrap;
  }
}
</style>
