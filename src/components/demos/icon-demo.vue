<script setup lang="ts">
import { ref } from 'vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const commonIcons = ref([
  'house',
  'search',
  'bell',
  'heart',
  'star',
  'gear',
  'person',
  'chat-dots',
  'envelope',
  'calendar',
  'camera',
  'image',
  'file-earmark',
  'download',
  'upload',
  'trash',
]);

const copyIcon = (name: string) => {
  // #ifdef H5
  if (navigator.clipboard) {
    navigator.clipboard.writeText(name);
    uni.showToast({ title: `已复制: ${name}`, icon: 'none' });
    return;
  }
  // #endif

  // #ifdef MP || APP-PLUS
  uni.setClipboardData({
    data: name,
    success: () => {
      uni.showToast({ title: `已复制: ${name}`, icon: 'none' });
    },
  });
  // #endif

  uni.showToast({ title: name, icon: 'none' });
};
</script>

<template>
  <view class="component-demo">
    <demo-block title="常用图标 (点击复制)">
      <view class="icon-grid">
        <view v-for="icon in commonIcons" :key="icon" class="icon-item" @click="copyIcon(icon)">
          <lk-icon :name="icon" size="36" />
          <text class="icon-label">{{ icon }}</text>
        </view>
      </view>
    </demo-block>

    <demo-block title="图标尺寸">
      <view class="demo-row" style="align-items: flex-end">
        <lk-icon name="star" size="24" color="var(--lk-color-warning)" />
        <lk-icon name="star" size="32" color="var(--lk-color-warning)" />
        <lk-icon name="star" size="40" color="var(--lk-color-warning)" />
        <lk-icon name="star" size="48" color="var(--lk-color-warning)" />
        <lk-icon name="star" size="56" color="var(--lk-color-warning)" />
      </view>
    </demo-block>

    <demo-block title="图标颜色">
      <view class="demo-row">
        <lk-icon name="heart" size="44" color="#ff4757" />
        <lk-icon name="heart" size="44" color="#5352ed" />
        <lk-icon name="heart" size="44" color="#2ed573" />
        <lk-icon name="heart" size="44" color="#ffa502" />
        <lk-icon name="heart" size="44" color="#747d8c" />
      </view>
    </demo-block>

    <demo-block title="图标动画">
      <view class="demo-row">
        <lk-icon
          name="arrow-clockwise"
          size="40"
          class="icon-spin"
          color="var(--lk-color-primary)"
        />
        <lk-icon name="heart" size="40" class="icon-beat" color="#ff4757" />
        <lk-icon name="star" size="40" class="icon-shake" color="var(--lk-color-warning)" />
        <lk-icon name="bell" size="40" class="icon-swing" color="var(--lk-color-info)" />
      </view>
    </demo-block>

    <demo-block title="图标与文本">
      <view class="icon-text-group">
        <view class="icon-text-item">
          <lk-icon name="house" size="32" color="var(--lk-color-primary)" />
          <text>首页</text>
        </view>
        <view class="icon-text-item">
          <lk-icon name="search" size="32" color="var(--lk-color-primary)" />
          <text>搜索</text>
        </view>
        <view class="icon-text-item">
          <lk-icon name="bell" size="32" color="var(--lk-color-primary)" />
          <text>通知</text>
        </view>
        <view class="icon-text-item">
          <lk-icon name="person" size="32" color="var(--lk-color-primary)" />
          <text>我的</text>
        </view>
      </view>
    </demo-block>
  </view>
</template>
<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.demo-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16rpx;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20rpx 12rpx;
  background: var(--lk-color-bg-surface);
  border-radius: var(--lk-radius-md);
  border: 2rpx solid var(--lk-color-border);
  transition: all 0.3s;

  &:active {
    transform: scale(0.95);
    background: var(--lk-color-bg-hover);
    border-color: var(--lk-color-primary);
  }
}

.icon-label {
  font-size: 20rpx;
  color: var(--lk-color-text-tertiary);
  margin-top: 8rpx;
  text-align: center;
  word-break: break-all;
  line-height: 1.3;
}

.icon-text-group {
  display: flex;
  justify-content: space-around;
  gap: 16rpx;
}

.icon-text-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  padding: 20rpx;
  flex: 1;
  background: var(--lk-color-bg-surface);
  border-radius: var(--lk-radius-md);

  text {
    font-size: 24rpx;
    color: var(--lk-color-text-secondary);
  }
}

.icon-spin {
  animation: icon-spin 2s linear infinite;
}

.icon-beat {
  animation: icon-beat 1.5s ease-in-out infinite;
}

.icon-shake {
  animation: icon-shake 2s ease-in-out infinite;
}

.icon-swing {
  animation: icon-swing 1.5s ease-in-out infinite;
}

@keyframes icon-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes icon-beat {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

@keyframes icon-shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4rpx);
  }
  75% {
    transform: translateX(4rpx);
  }
}

@keyframes icon-swing {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-10deg);
  }
  75% {
    transform: rotate(10deg);
  }
}
</style>
