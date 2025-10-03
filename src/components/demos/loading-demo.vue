<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-loading />
    </demo-block>

    <demo-block title="加载文案">
      <lk-loading text="加载中..." />
    </demo-block>

    <demo-block title="不同类型">
      <view class="loading-row">
        <lk-loading type="spinner" />
        <lk-loading type="circular" />
        <lk-loading type="dots" />
      </view>
    </demo-block>

    <demo-block title="不同尺寸">
      <view class="loading-row">
        <lk-loading size="small" />
        <lk-loading />
        <lk-loading size="large" />
      </view>
    </demo-block>

    <demo-block title="自定义颜色">
      <view class="loading-row">
        <lk-loading color="primary" />
        <lk-loading color="success" />
        <lk-loading color="warning" />
        <lk-loading color="danger" />
      </view>
    </demo-block>

    <demo-block title="垂直排列">
      <lk-loading vertical text="加载中..." />
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import LkLoading from '@/uni_modules/lucky-ui/components/lk-loading/lk-loading.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.loading-row {
  display: flex;
  gap: 48rpx;
  justify-content: space-around;
  align-items: center;
}
</style>
