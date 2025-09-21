<script setup lang="ts">
defineOptions({ name:'LkTimelineItem' });

const props = defineProps({
  time: { type:String, default:'' },
  lineColor: { type:String, default:'var(--lk-color-border-weak)' },
  dotColor: { type:String, default:'var(--lk-color-primary)' },
  hollow: { type:Boolean, default:false }
});
</script>

<template>
  <view class="lk-timeline-item">
    <view class="lk-timeline-item__left">
      <view
          class="lk-timeline-item__dot"
          :class="{ 'is-hollow': hollow }"
          :style="{ background: hollow ? '#fff' : dotColor, borderColor: dotColor }"
      />
      <view class="lk-timeline-item__line" :style="{ background: lineColor }"></view>
    </view>
    <view class="lk-timeline-item__content">
      <view class="lk-timeline-item__time">{{ time }}</view>
      <view class="lk-timeline-item__body">
        <slot />
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.lk-timeline-item {
  display:flex;
  align-items:flex-start;
  gap: 24rpx;
  position:relative;
  &__left {
    width: 32rpx;
    position:relative;
    display:flex;
    justify-content:center;
  }
  &__dot {
    width: 24rpx; height:24rpx;
    border-radius:50%;
    border:4rpx solid var(--lk-color-primary);
    position:relative;
    z-index:1;
    &.is-hollow { background:#fff; }
  }
  &__line {
    position:absolute;
    top:24rpx;
    width:4rpx;
    bottom:-28rpx;
    left:50%;
    transform:translateX(-50%);
    background: var(--lk-color-border-weak);
  }
  &:last-child &__line { display:none; }
  &__content {
    flex:1;
    display:flex;
    flex-direction:column;
    gap: 4rpx;
  }
  &__time { font-size:22rpx; color: var(--lk-color-text-secondary); }
  &__body { font-size:26rpx; line-height:1.5; }
}
</style>