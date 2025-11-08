<script setup lang="ts">
defineOptions({ name: 'DemoBlock' });
const props = defineProps({
  title: { type: String, default: '' },
  padding: { type: Boolean, default: true },
});
</script>

<template>
  <view class="demo-block">
    <view v-if="title" class="demo-block__title">{{ title }}</view>
    <view class="demo-block__body" :class="{ 'no-pad': !padding }"><slot /></view>
  </view>
</template>

<style scoped lang="scss">
.demo-block {
  background: var(--lk-color-bg-surface);
  border-radius: var(--lk-radius-lg);
  padding: 40rpx 36rpx 44rpx;
  box-shadow: var(--lk-shadow-sm);
  border: 2rpx solid var(--lk-color-border-weak);
  display: flex;
  flex-direction: column;
  gap: 32rpx;

  &__title {
    font-size: 36rpx;
    font-weight: 600;
    position: relative;
    padding-left: 28rpx;
    line-height: 1.2;
  }
  &__title::before {
    content: '';
    position: absolute;
    left: 0;
    top: 8rpx;
    bottom: 8rpx;
    width: 12rpx;
    border-radius: 6rpx;
    background: linear-gradient(180deg, var(--lk-color-primary), var(--lk-color-primary-active));
  }
  &__body {
    display: flex;
    flex-direction: column;
    gap: 28rpx;
  }
  &__body.no-pad {
    padding: 0;
  }
}
</style>
