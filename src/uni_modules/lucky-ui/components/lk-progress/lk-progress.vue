<script setup lang="ts">
import { computed } from 'vue';
defineOptions({ name: 'LkProgress' });

const props = defineProps({
  percentage: { type: Number, default: 0 },
  striped: { type: Boolean, default: false },
  animated: { type: Boolean, default: false },
  textInside: { type: Boolean, default: false },
  showText: { type: Boolean, default: true },
  type: { type: String, default: 'linear' }, // linear | circle
  size: { type: Number, default: 120 }, // circle size (rpx)
  stroke: { type: Number, default: 10 }
});

const pct = computed(()=> Math.min(100, Math.max(0, props.percentage)));
const circleProps = computed(()=>{
  const r = (props.size - props.stroke)/2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct.value / 100);
  return { r, c, offset };
});
</script>

<template>
  <view v-if="type==='linear'" class="lk-progress" :class="{ 'is-striped': striped, 'is-animated': animated }">
    <view class="lk-progress__track">
      <view class="lk-progress__bar" :style="{ width: pct + '%' }">
        <text v-if="textInside && showText" class="lk-progress__text-in">{{ pct }}%</text>
      </view>
    </view>
    <text v-if="showText && !textInside" class="lk-progress__text">{{ pct }}%</text>
  </view>

  <view v-else class="lk-progress-circle" :style="{ width: size+'rpx', height:size+'rpx' }">
    <svg :width="size" :height="size" viewBox="0 0 100 100">
      <circle
          class="lk-progress-circle__track"
          cx="50" cy="50" r="45"
          stroke-width="10"
          fill="none"
      />
      <circle
          class="lk-progress-circle__bar"
          cx="50" cy="50" r="45"
          stroke-width="10"
          fill="none"
          :stroke-dasharray="circleProps.c"
          :stroke-dashoffset="circleProps.offset"
      />
    </svg>
    <text v-if="showText" class="lk-progress-circle__text">{{ pct }}%</text>
  </view>
</template>

<style scoped lang="scss">
.lk-progress {
  display: flex;
  align-items: center;
  gap: 16rpx;
  &__track {
    position: relative;
    flex: 1;
    height: 20rpx;
    background: var(--lk-color-primary-bg-soft);
    border-radius: 12rpx;
    overflow: hidden;
  }
  &__bar {
    position: absolute;
    left: 0; top: 0; bottom: 0;
    background: var(--lk-color-primary);
    border-radius: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--lk-color-text-inverse);
    font-size: 20rpx;
    transition: width .3s ease;
    &::after {
      content:'';
      display:block;
      width:100%;
      height:100%;
      background-image: repeating-linear-gradient(
              -45deg,
              rgba(255,255,255,0.15) 0 20rpx,
              transparent 20rpx 40rpx
      );
      opacity: 0;
      transition: opacity .3s;
      pointer-events: none;
    }
  }
  &.is-striped .lk-progress__bar::after { opacity: 1; }
  &.is-animated.is-striped .lk-progress__bar::after {
    animation: lk-progress-move 2s linear infinite;
  }
  &__text { font-size: 24rpx; color: var(--lk-color-text-secondary); }
  &__text-in { font-size: 20rpx; color: #fff; padding: 0 8rpx; }
}
@keyframes lk-progress-move {
  from { background-position: 0 0; }
  to { background-position: 80rpx 0; }
}
.lk-progress-circle {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  svg { transform: rotate(-90deg); }
  &__track {
    stroke: var(--lk-color-primary-bg-soft);
  }
  &__bar {
    stroke: var(--lk-color-primary);
    stroke-linecap: round;
    transition: stroke-dashoffset .4s ease;
  }
  &__text {
    position: absolute;
    font-size: 24rpx;
    font-weight: 600;
    color: var(--lk-color-primary-active);
  }
}
</style>