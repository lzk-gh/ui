<script setup lang="ts">
import { ref } from 'vue';

const customThemeVars = {
  'color-primary': '#07c160',
  'radius-base': '40rpx',
};
</script>

<template>
  <view class="config-provider-demo">
    <lk-card title="默认主题 (Default)">
      <lk-button type="primary" block>默认主色按钮</lk-button>
      <view class="demo-row">
        <lk-tag type="primary">默认标签</lk-tag>
        <lk-badge content="99">
          <lk-icon name="bell" size="40" />
        </lk-badge>
      </view>
    </lk-card>

    <lk-config-provider theme="dark">
      <lk-card title="深色模式覆盖 (Dark Mode)">
        <text class="demo-text">这里的组件自动适配深色模式</text>
        <lk-button type="primary" block>深色按钮</lk-button>
        <view class="demo-row">
          <lk-tag type="primary">深色标签</lk-tag>
          <lk-switch :model-value="true" />
        </view>
      </lk-card>
    </lk-config-provider>

    <lk-config-provider :theme-vars="customThemeVars">
      <lk-card title="自定义变量覆盖 (Custom Vars)">
        <text class="demo-text">通过 theme-vars 修改了主色和圆角</text>
        <lk-button type="primary" block>绿色大圆角按钮</lk-button>
        <view class="demo-row">
          <lk-tag type="primary">绿色标签</lk-tag>
          <lk-slider :model-value="50" />
        </view>
      </lk-card>
    </lk-config-provider>

    <lk-config-provider brand-color="#eb2f96">
      <lk-card title="品牌色自动色阶 (Brand Color)">
        <text class="demo-text">设置 brand-color 后自动生成所有色阶变量</text>
        <lk-button type="primary" block>粉色按钮</lk-button>
        <view class="demo-row">
          <lk-tag type="primary">粉色标签</lk-tag>
          <lk-badge dot>
            <lk-icon name="heart-fill" color="primary" size="40" />
          </lk-badge>
        </view>
      </lk-card>
    </lk-config-provider>
  </view>
</template>

<style lang="scss" scoped>
.config-provider-demo {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.demo-row {
  display: flex;
  align-items: center;
  gap: 30rpx;
  margin-top: 20rpx;
}

.demo-text {
  font-size: 24rpx;
  color: var(--lk-text-secondary);
  margin-bottom: 16rpx;
  display: block;
}
</style>
