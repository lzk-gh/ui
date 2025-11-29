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

<style scoped lang="scss">
.lk-segmented {
  display: inline-flex;
  background: var(--lk-color-primary-bg-soft);
  padding: 4rpx;
  border-radius: var(--lk-radius-pill);
  &--sm {
    font-size: 22rpx;
  }
  &--md {
    font-size: 24rpx;
  }
  &--lg {
    font-size: 28rpx;
  }

  &__item {
    position: relative;
    padding: 16rpx 36rpx;
    border-radius: var(--lk-radius-pill);
    color: var(--lk-color-primary);
    font-weight: 500;
    transition:
      background var(--lk-transition-fast),
      color var(--lk-transition-fast);
    &.is-active {
      background: var(--lk-color-primary);
      color: var(--lk-color-text-inverse);
    }
    &:active:not(.is-active) {
      background: var(--lk-color-primary-hover);
      color: #fff;
    }
  }
}
</style>
