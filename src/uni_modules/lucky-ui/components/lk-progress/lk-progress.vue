<script setup lang="ts">
import { computed } from 'vue';
import { progressProps } from './progress.props';
defineOptions({ name: 'LkProgress' });

const props = defineProps(progressProps);

const pct = computed(() => Math.min(100, Math.max(0, props.percentage)));
const circleProps = computed(() => {
  const r = (props.size - props.stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct.value / 100);
  return { r, c, offset };
});
</script>

<template>
  <view
    v-if="type === 'linear'"
    class="lk-progress"
    :class="{ 'is-striped': striped, 'is-animated': animated }"
  >
    <view class="lk-progress__track">
      <view class="lk-progress__bar" :style="{ width: pct + '%' }">
        <text v-if="textInside && showText" class="lk-progress__text-in">{{ pct }}%</text>
      </view>
    </view>
    <text v-if="showText && !textInside" class="lk-progress__text">{{ pct }}%</text>
  </view>

  <view v-else class="lk-progress-circle" :style="{ width: size + 'rpx', height: size + 'rpx' }">
    <svg :width="size" :height="size" viewBox="0 0 100 100">
      <circle
        class="lk-progress-circle__track"
        cx="50"
        cy="50"
        r="45"
        stroke-width="10"
        fill="none"
      />
      <circle
        class="lk-progress-circle__bar"
        cx="50"
        cy="50"
        r="45"
        stroke-width="10"
        fill="none"
        :stroke-dasharray="circleProps.c"
        :stroke-dashoffset="circleProps.offset"
      />
    </svg>
    <text v-if="showText" class="lk-progress-circle__text">{{ pct }}%</text>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
