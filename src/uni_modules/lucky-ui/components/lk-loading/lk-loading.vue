<script setup lang="ts">
defineOptions({ name: 'LkLoading' });

import { computed } from 'vue';

const props = defineProps({
  // 支持 number 或 string（rpx）以兼容现有用法
  size: { type: [String, Number], default: '40' }, // rpx
  color: { type: String, default: 'var(--lk-color-primary)' },
  // 保留老的 `variant`，同时新增 `type`，以便逐步迁移
  variant: { type: String, default: 'spinner' }, // spinner|dots|bar
  type: { type: String, default: undefined }, // 优先级高于 variant
  vertical: { type: Boolean, default: false },
  text: { type: String, default: '' }
});

const _type = computed(() => {
  // type 优先，其次 variant（向后兼容）
  return (props.type ?? props.variant) as string;
});
</script>

<template>
  <view class="lk-loading" :class="[`lk-loading--${_type}`, { 'is-vertical': vertical }]" :style="{ '--_color': color }" role="status" aria-live="polite">
    <!-- Spinner（改进） -->
    <view v-if="_type==='spinner'" class="lk-loading__spinner" :style="{ width: (typeof size === 'number' ? size : parseInt(size)) + 'rpx', height: (typeof size === 'number' ? size : parseInt(size)) + 'rpx' }"></view>

    <!-- Dots -->
    <view v-else-if="_type==='dots'" class="lk-loading__dots" :style="{ height:(typeof size === 'number' ? size : parseInt(size)) + 'rpx' }">
      <view v-for="i in 3" :key="i" class="dot"></view>
    </view>

    <!-- Bar -->
    <view v-else-if="_type==='bar'" class="lk-loading__bar" :style="{ width: (Number(size) * 2) + 'rpx'}">
      <view class="bar-indicator"></view>
    </view>

    <!-- Bounce -->
    <view v-else-if="_type==='bounce'" class="lk-loading__bounce" :style="{ height:(typeof size === 'number' ? size : parseInt(size)) + 'rpx' }">
      <view v-for="i in 3" :key="i" class="bounce-ball"></view>
    </view>

    <!-- Wave -->
    <view v-else-if="_type==='wave'" class="lk-loading__wave" :style="{ height:(typeof size === 'number' ? size : parseInt(size)) + 'rpx' }">
      <view v-for="i in 5" :key="i" class="wave-bar"></view>
    </view>

    <!-- Ring -->
    <view v-else-if="_type==='ring'" class="lk-loading__ring" :style="{ width: (typeof size === 'number' ? size : parseInt(size)) + 'rpx', height: (typeof size === 'number' ? size : parseInt(size)) + 'rpx' }"></view>

    <!-- Ellipsis -->
    <view v-else-if="_type==='ellipsis'" class="lk-loading__ellipsis" :style="{ height:(typeof size === 'number' ? size : parseInt(size)) + 'rpx' }">
      <view v-for="i in 3" :key="i" class="ellipsis-dot"></view>
    </view>

    <!-- Text Shine -->
    <view v-else-if="_type==='text'" class="lk-loading__text-shine">
      <text class="loading-text">{{ text || 'Loading...' }}</text>
    </view>

    <text v-if="text && _type !== 'text'" class="lk-loading__text">{{ text }}</text>
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
    display: inline-block;
    box-sizing: border-box;
  }

  &__dots {
    display: inline-flex;
    align-items: center;
    gap: 10rpx;
    .dot {
      width: 16rpx;
      height: 16rpx;
      border-radius: 50%;
      background: var(--_color);
      animation: lk-dots 0.9s ease-in-out infinite;
    }
    .dot:nth-child(2){ animation-delay: .15s; }
    .dot:nth-child(3){ animation-delay: .3s; }
  }

  &__bar {
    position: relative;
    height: 12rpx;
    background: var(--lk-color-primary-bg-soft);
    border-radius: 12rpx;
    overflow: hidden;
    width: 160rpx;
    .bar-indicator {
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

  &__bounce {
    display: inline-flex;
    align-items: center;
    gap: 8rpx;
    .bounce-ball {
      width: 20rpx;
      height: 20rpx;
      border-radius: 50%;
      background: var(--_color);
      animation: lk-bounce 1.2s ease-in-out infinite;
    }
    .bounce-ball:nth-child(2){ animation-delay: .1s; }
    .bounce-ball:nth-child(3){ animation-delay: .2s; }
  }

  &__wave {
    display: inline-flex;
    align-items: end;
    gap: 6rpx;
    .wave-bar {
      width: 12rpx;
      height: 100%;
      background: var(--_color);
      border-radius: 6rpx;
      animation: lk-wave 1.2s ease-in-out infinite;
    }
    .wave-bar:nth-child(2){ animation-delay: .1s; }
    .wave-bar:nth-child(3){ animation-delay: .2s; }
    .wave-bar:nth-child(4){ animation-delay: .3s; }
    .wave-bar:nth-child(5){ animation-delay: .4s; }
  }

  &__ring {
    border: 4rpx solid rgba(0,0,0,0.06);
    border-top-color: var(--_color);
    border-radius: 50%;
    animation: lk-spin 0.8s linear infinite;
    display: inline-block;
    box-sizing: border-box;
  }

  &__ellipsis {
    display: inline-flex;
    align-items: center;
    gap: 8rpx;
    .ellipsis-dot {
      width: 12rpx;
      height: 12rpx;
      border-radius: 50%;
      background: var(--_color);
      animation: lk-ellipsis 1.4s ease-in-out infinite;
    }
    .ellipsis-dot:nth-child(2){ animation-delay: .16s; }
    .ellipsis-dot:nth-child(3){ animation-delay: .32s; }
  }

  &__text-shine {
    .loading-text {
      font-size: 32rpx;
      font-weight: 600;
      background: linear-gradient(
        120deg,
        #452d8f 20%,
        #a18ae7 30%,
        #ffffff 40%,
        #a18ae7 50%,
        #452d8f 60%
      );
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      white-space: nowrap;
      background-size: 200% auto;
      animation: shine 3s linear infinite;
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
@keyframes lk-bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-30rpx); }
  60% { transform: translateY(-15rpx); }
}
@keyframes lk-wave {
  0%, 60%, 100% { transform: scaleY(0.4); }
  30% { transform: scaleY(1); }
}
@keyframes lk-ellipsis {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}
@keyframes shine {
  0% {
    background-position: 200% center;
  }
  100% {
    background-position: -200% center;
  }
}
</style>
