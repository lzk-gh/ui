<script setup lang="ts">
import { ref, provide, watch, computed } from 'vue';
import { stepsProps, stepsEmits } from './steps.props';
defineOptions({ name: 'LkSteps' });

const props = defineProps(stepsProps);
const emit = defineEmits(stepsEmits);

const items = ref<any[]>([]);
const totalSteps = computed(() => items.value.length);

function register(item: any) {
  items.value.push(item);
}

provide('LkSteps', { register, props, totalSteps });

watch(
  () => props.current,
  v => emit('change', v)
);

// 计算进度百分比用于动画
const progressPercent = computed(() => {
  if (totalSteps.value <= 1) return 0;
  return (props.current / (totalSteps.value - 1)) * 100;
});
</script>

<template>
  <view
    class="lk-steps"
    :class="[`lk-steps--${direction}`, `lk-steps--${type}`]"
    :style="{
      '--steps-progress': `${progressPercent}%`,
      '--steps-current': current,
      '--steps-total': totalSteps,
    }"
  >
    <!-- 进度条背景线（用于 progress 类型） -->
    <view v-if="type === 'progress'" class="lk-steps__track">
      <view class="lk-steps__progress" />
    </view>
    <slot />
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
