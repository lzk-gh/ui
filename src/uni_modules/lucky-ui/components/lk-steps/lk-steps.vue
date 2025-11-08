<script setup lang="ts">
import { ref, provide, watch } from 'vue';
defineOptions({ name: 'LkSteps' });

const props = defineProps({
  current: { type: Number, default: 0 },
  direction: { type: String, default: 'horizontal' }, // horizontal|vertical
  status: { type: String, default: '' }, // finish | error
});
const emit = defineEmits(['change']);

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

<style scoped lang="scss">
.lk-steps {
  display: flex;
  &--vertical {
    flex-direction: column;
    align-items: stretch;
  }
  &--horizontal {
    flex-direction: row;
    align-items: flex-start;
  }
}
</style>
