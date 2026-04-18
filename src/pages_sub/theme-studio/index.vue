<script setup lang="ts">
import { ref, computed } from 'vue';

// 主题状态
const brandColor = ref('#6965db');
const baseRadius = ref(16);
const baseFontSize = ref(28);
const iconFollowBrand = ref(true);
const isDark = ref(false);

// 模拟预设颜色
const presets = [
  '#6965db', '#1890ff', '#52c41a', '#fa8c16', '#f5222d', '#eb2f96'
];

// 计算动态主题变量
const themeVars = computed(() => {
  const vars: Record<string, string> = {
    'radius-base': `${baseRadius.value}rpx`,
    'radius-sm': `${baseRadius.value / 2}rpx`,
    'radius-lg': `${baseRadius.value * 1.5}rpx`,
    'font-size-base': `${baseFontSize.value}rpx`,
    'font-size-sm': `${baseFontSize.value - 4}rpx`,
    'font-size-lg': `${baseFontSize.value + 4}rpx`,
  };
  return vars;
});

// 计算图标颜色
const iconColor = computed(() => iconFollowBrand.value ? 'primary' : '#999');

function toggleTheme() {
  isDark.value = !isDark.value;
}
</script>

<template>
  <lk-config-provider
    :theme="isDark ? 'dark' : 'light'"
    :brand-color="brandColor"
    :theme-vars="themeVars"
    class="theme-studio"
  >
    <lk-navbar title="主题实验室" back />

    <scroll-view scroll-y class="content">
      <!-- 预览区 -->
      <view class="section preview-card">
        <view class="section-title">实时预览</view>
        <view class="preview-content">
          <lk-button block>主要按钮 (Main Button)</lk-button>
          <view class="row">
            <lk-button variant="outline" size="sm">描边按钮</lk-button>
            <lk-tag type="primary">标签展示</lk-tag>
            <lk-badge :content="8">
              <lk-icon name="bell" :color="iconColor" size="48" />
            </lk-badge>
          </view>
          <lk-card title="卡片容器" sub-title="受到全局圆角和字号影响">
            这是一段正文内容，它的字号会随着你的调整而改变。
          </lk-card>
        </view>
      </view>

      <!-- 控制区 -->
      <view class="section controls">
        <view class="section-title">全局调整</view>

        <lk-cell title="深色模式">
          <template #right-icon>
            <lk-switch :model-value="isDark" @update:model-value="isDark = $event" />
          </template>
        </lk-cell>

        <view class="control-item">
          <text class="label">品牌颜色</text>
          <view class="color-presets">
            <view
              v-for="c in presets"
              :key="c"
              class="color-dot"
              :style="{ backgroundColor: c, border: brandColor === c ? '4rpx solid #333' : 'none' }"
              @tap="brandColor = c"
            />
          </view>
        </view>

        <view class="control-item">
          <view class="label-row">
            <text class="label">基础圆角</text>
            <text class="value">{{ baseRadius }}rpx</text>
          </view>
          <lk-slider v-model="baseRadius" :min="0" :max="40" />
        </view>

        <view class="control-item">
          <view class="label-row">
            <text class="label">正文字号</text>
            <text class="value">{{ baseFontSize }}rpx</text>
          </view>
          <lk-slider v-model="baseFontSize" :min="20" :max="40" />
        </view>

        <lk-cell title="图标跟随品牌色">
          <template #right-icon>
            <lk-switch v-model="iconFollowBrand" />
          </template>
        </lk-cell>
      </view>

      <!-- 局部覆盖演示 -->
      <view class="section">
        <view class="section-title">局部覆盖演示 (Nested Provider)</view>
        <view class="desc">下面的卡片被嵌套的 ConfigProvider 包裹，强制使用直角。</view>
        <lk-config-provider :theme-vars="{ 'radius-base': '0rpx' }">
          <lk-card title="我是硬派直角卡片" status="不受全局圆角控制" />
        </lk-config-provider>
      </view>

      <view class="safe-area-bottom" />
    </scroll-view>
  </lk-config-provider>
</template>

<style lang="scss" scoped>
.theme-studio {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--lk-bg-page);
}

.content {
  flex: 1;
  padding: 30rpx;
  box-sizing: border-box;
}

.section {
  margin-bottom: 40rpx;

  &-title {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
    color: var(--lk-text-primary);
  }
}

.preview-card {
  padding: 30rpx;
  background-color: var(--lk-bg-container);
  border-radius: var(--lk-radius-lg);
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.row {
  display: flex;
  align-items: center;
  gap: 30rpx;
}

.control-item {
  margin: 30rpx 0;

  .label-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15rpx;
  }

  .label {
    font-size: 28rpx;
    color: var(--lk-text-regular);
  }

  .value {
    font-size: 24rpx;
    color: var(--lk-color-primary);
  }
}

.color-presets {
  display: flex;
  gap: 20rpx;
  margin-top: 15rpx;
}

.color-dot {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
}

.desc {
  font-size: 24rpx;
  color: var(--lk-text-secondary);
  margin-bottom: 20rpx;
}

.safe-area-bottom {
  height: env(safe-area-inset-bottom);
}
</style>
