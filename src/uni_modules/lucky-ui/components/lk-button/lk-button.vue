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
    <!-- Loading 状态 -->
    <view v-if="loading" class="lk-button__loader" />

    <!-- Icon (如果不传 icon 属性，此处不渲染，通过 slot 传 icon 也可以) -->
    <view v-if="icon" class="lk-button__icon" :class="icon" />

    <!-- 内容 -->
    <slot />
  </button>
</template>

<style lang="scss" scoped>
@use './index.scss';
</style>
