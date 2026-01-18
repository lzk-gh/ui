<script setup lang="ts">
import { computed } from 'vue';
import { progressProps } from './progress.props';
import { addUnit } from '../../core/src/utils/unit';

defineOptions({ name: 'LkProgress' });

const props = defineProps(progressProps);

const pct = computed(() => Math.min(100, Math.max(0, props.percentage)));

const trackStyle = computed(() => {
  const style: any = {};
  if (props.strokeWidth) style.height = addUnit(props.strokeWidth);
  if (props.trackColor) style.backgroundColor = props.trackColor;
  return style;
});

const barStyle = computed(() => {
  const style: any = {
    width: pct.value + '%',
  };
  if (props.color) {
    style.backgroundColor = props.color;
  } else if (props.status) {
    const statusColors: Record<string, string> = {
      success: 'var(--lk-color-success)',
      warning: 'var(--lk-color-warning)',
      danger: 'var(--lk-color-danger)',
      error: 'var(--lk-color-danger)',
    };
    if (statusColors[props.status]) {
      style.backgroundColor = statusColors[props.status];
    }
  }
  return style;
});
</script>

<template>
  <view
    class="lk-progress"
    :class="[{ 'is-striped': striped, 'is-animated': animated }, customClass]"
    :style="customStyle"
  >
    <view class="lk-progress__track" :style="trackStyle">
      <view class="lk-progress__bar" :style="barStyle">
        <text v-if="textInside && showText" class="lk-progress__text-in">{{ pct }}%</text>
      </view>
    </view>
    <text v-if="showText && !textInside" class="lk-progress__text">{{ pct }}%</text>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
