<script setup lang="ts">
/**
 * Divider 分割线演示
 */
</script>

<template>
  <view class="divider-demo">
    <demo-block title="基础用法">
      <lk-divider />
    </demo-block>

    <demo-block title="展示文字">
      <lk-divider text="默认居中" />
      <lk-divider text="左对齐" text-position="left" />
      <lk-divider text="右对齐" text-position="right" />
    </demo-block>

    <demo-block title="虚线模式">
      <lk-divider dashed text="虚线分割" />
    </demo-block>

    <demo-block title="灵活位置 (比例/像素分配)">
      <lk-divider text="距左 20%" text-position="20%" />
      <lk-divider text="距左 80%" :text-position="80" />
      <lk-divider text="左侧固定 100rpx" text-position="100rpx" />
    </demo-block>

    <demo-block title="垂直分割线">
      <view class="vertical-box">
        <text>文本</text>
        <lk-divider vertical />
        <text>链接</text>
        <lk-divider vertical />
        <text>按钮</text>
      </view>
    </demo-block>

    <demo-block title="复杂背景演示 (透明遮挡)">
      <view class="gradient-bg">
        <text class="bg-text">在渐变背景下文字背景真实透明</text>
        <lk-divider text="TRANSPARENT" />
        <lk-divider text="LEFT ALIGN" text-position="left" />
      </view>
    </demo-block>

    <demo-block title="自定义样式 (themeVars)">
      <lk-divider 
        text="自定义粗细与颜色" 
        :custom-style="{ 
          '--lk-divider-thickness': '4rpx',
          '--lk-divider-color': 'var(--lk-color-primary)',
          '--lk-divider-text-color': 'var(--lk-color-primary)'
        }" 
      />
    </demo-block>
  </view>
</template>

<style lang="scss" scoped>
.divider-demo {
  padding-bottom: 40rpx;
}

.vertical-box {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: var(--lk-text-regular);
}

.gradient-bg {
  padding: 40rpx 20rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16rpx;
  color: white;
  text-align: center;

  .bg-text {
    font-size: 24rpx;
    opacity: 0.8;
    margin-bottom: 20rpx;
    display: block;
  }

  // 局部覆盖分割线颜色以适配深色背景
  :deep(.lk-divider) {
    --lk-divider-color: rgba(255, 255, 255, 0.3);
    --lk-divider-text-color: rgba(255, 255, 255, 0.9);
  }
}
</style>
