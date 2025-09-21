<script setup lang="ts">
defineOptions({ name: 'LkLoading' });

const props = defineProps({
  size: { type: String, default: '40' }, // rpx
  color: { type: String, default: 'var(--lk-color-primary)' },
  variant: { type: String, default: 'spinner' }, // spinner|dots|bar
  text: { type: String, default: '' }
});
</script>

<template>
  <view class="lk-loading" :class="[`lk-loading--${variant}`]" :style="{ '--_color': color }">
    <view v-if="variant==='spinner'" class="lk-loading__spinner" :style="{ width:size+'rpx', height:size+'rpx' }"></view>
    <view v-else-if="variant==='dots'" class="lk-loading__dots" :style="{ height:size+'rpx' }">
      <i v-for="i in 3" :key="i"></i>
    </view>
    <view v-else-if="variant==='bar'" class="lk-loading__bar" :style="{ width: size*2 + 'rpx'}">
      <i></i>
    </view>
    <text v-if="text" class="lk-loading__text">{{ text }}</text>
  </view>
</template>

<style scoped lang="scss">
.lk-loading {
  display: inline-flex;
  align-items: center;
  gap: 16rpx;
  color: var(--lk-color-text-secondary);
  --_color: var(--lk-color-primary);

  &__text {
    font-size: 24rpx;
  }

  &__spinner {
    border: 6rpx solid rgba(0,0,0,0.06);
    border-top-color: var(--_color);
    border-radius: 50%;
    animation: lk-spin 0.8s linear infinite;
  }

  &__dots {
    display: inline-flex;
    align-items: center;
    gap: 10rpx;
    i {
      width: 16rpx;
      height: 16rpx;
      border-radius: 50%;
      background: var(--_color);
      animation: lk-dots 0.9s ease-in-out infinite;
    }
    i:nth-child(2){ animation-delay: .15s; }
    i:nth-child(3){ animation-delay: .3s; }
  }

  &__bar {
    position: relative;
    height: 12rpx;
    background: var(--lk-color-primary-bg-soft);
    border-radius: 12rpx;
    overflow: hidden;
    width: 160rpx;
    i {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 40%;
      background: var(--_color);
      animation: lk-bar 1.2s ease-in-out infinite;
      border-radius: inherit;
    }
  }
}

@keyframes lk-spin { to { transform: rotate(360deg); } }
@keyframes lk-dots {
  0%, 80%, 100% { transform: scale(0.4); opacity: .4; }
  40% { transform: scale(1); opacity: 1; }
}
@keyframes lk-bar {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(40%); }
  100% { transform: translateX(120%); }
}
</style>