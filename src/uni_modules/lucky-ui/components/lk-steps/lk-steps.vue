<script setup lang="ts">
import { ref, provide, watch } from 'vue';
import { stepsProps, stepsEmits } from './steps.props';
defineOptions({ name: 'LkSteps' });

const props = defineProps(stepsProps);
const emit = defineEmits(stepsEmits);

const items = ref<any[]>([]);
function register(item: any) {
  items.value.push(item);
}
provide('LkSteps', { register, props });

watch(
  () => props.current,
  v => emit('change', v)
);
</script>

<template>
  <view class="lk-steps" :class="[`lk-steps--${direction}`]">
    <slot />
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
