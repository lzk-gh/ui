<script setup lang="ts">
import { computed } from 'vue';
import { buttonProps, buttonEmits } from './button.props';

defineOptions({ name: 'LkButton' });

const props = defineProps(buttonProps);
const emit = defineEmits(buttonEmits);

const cls = computed(() => [
  'lk-button',
  `lk-button--${props.variant}`,
  `lk-button--${props.size}`,
  `lk-button--shape-${props.shape}`,
  {
    'is-loading': props.loading,
    'is-disabled': props.disabled,
    'is-block': props.block,
  },
]);

function onClick(e: MouseEvent) {
  if (props.disabled || props.loading) return;
  emit('click', e);
}
</script>

<template>
  <button
    :class="cls"
    :disabled="disabled"
    :form-type="nativeType"
    hover-class="none"
    @tap="onClick"
  >
    <view v-if="loading" class="lk-button__loader" />

    <slot />
  </button>
</template>

<style lang="scss" scoped>
@use './index.scss';
</style>
