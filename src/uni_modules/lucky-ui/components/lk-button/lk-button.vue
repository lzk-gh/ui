<script setup lang="ts">
import { computed } from 'vue';
import { buttonProps, buttonEmits } from './button.props';
import { useRipple } from '@/uni_modules/lucky-ui/composables/useRipple';

defineOptions({ name: 'LkButton' });

const props = defineProps(buttonProps);
const emit = defineEmits(buttonEmits);

const { rippleActive, rippleWaveStyle, triggerRipple } = useRipple({ duration: 600 });

const cls = computed(() => [
  'lk-ripple',
  'lk-button',
  `lk-button--${props.variant}`,
  `lk-button--${props.size}`,
  `lk-button--shape-${props.shape}`,
  {
    'is-loading': props.loading,
    'is-disabled': props.disabled,
    'is-block': props.block,
    'lk-ripple--active': rippleActive.value,
  },
]);

function onClick(e: MouseEvent) {
  if (props.disabled || props.loading) return;
  triggerRipple(e);
  emit('click', e);
}
</script>

<template>
  <button :class="cls" :disabled="disabled" :form-type="nativeType" @tap="onClick">
    <view v-if="loading" class="lk-button__loader" />
    <slot />
    <view class="lk-ripple__wave" :style="rippleWaveStyle" />
  </button>
</template>

<style lang="scss" scoped>
@use './index.scss';
</style>
