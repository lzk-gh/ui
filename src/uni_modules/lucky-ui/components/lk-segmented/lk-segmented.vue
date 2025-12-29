<script setup lang="ts">
import { ref, watch } from 'vue';
import { segmentedProps, segmentedEmits } from './segmented.props';
defineOptions({ name: 'LkSegmented' });

const props = defineProps(segmentedProps);
const emit = defineEmits(segmentedEmits);

const active = ref(props.modelValue);
watch(
  () => props.modelValue,
  v => (active.value = v)
);

function select(v: any) {
  if (v === active.value) return;
  active.value = v;
  emit('update:modelValue', v);
  emit('change', v);
}
</script>

<template>
  <view class="lk-segmented" :class="[`lk-segmented--${size}`]">
    <view
      v-for="opt in options"
      :key="opt.value"
      class="lk-segmented__item"
      :class="{ 'is-active': opt.value === active }"
      @click="select(opt.value)"
    >
      {{ opt.label }}
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
