<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-navbar title="页面标题" />
    </demo-block>

    <demo-block title="带返回按钮">
      <lk-navbar title="详情页" left-arrow @click-left="handleBack" />
    </demo-block>

    <demo-block title="自定义左侧">
      <lk-navbar title="标题">
        <template #left>
          <lk-icon name="house-fill" size="36" />
        </template>
      </lk-navbar>
    </demo-block>

    <demo-block title="自定义右侧">
      <lk-navbar title="标题">
        <template #right>
          <lk-icon name="search" size="36" style="margin-right: 16rpx" />
          <lk-icon name="three-dots-vertical" size="36" />
        </template>
      </lk-navbar>
    </demo-block>

    <demo-block title="自定义背景色">
      <lk-navbar title="标题" background="linear-gradient(to right, #667eea, #764ba2)" />
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import LkNavbar from '@/uni_modules/lucky-ui/components/lk-navbar/lk-navbar.vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const handleBack = () => {
  uni.showToast({
    title: '点击了返回',
    icon: 'none',
  });
};
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
