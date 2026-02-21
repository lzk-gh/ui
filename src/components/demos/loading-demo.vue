<script setup lang="ts">
import LkLoading from '@/uni_modules/lucky-ui/components/lk-loading/lk-loading.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';
</script>

<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-loading />
    </demo-block>

    <demo-block title="加载文案">
      <lk-loading text="加载中..." />
    </demo-block>

    <demo-block title="不同尺寸">
      <view class="loading-row">
        <lk-loading size="60" />
        <lk-loading />
        <lk-loading size="30" />
      </view>
    </demo-block>

    <demo-block title="自定义颜色">
      <view class="loading-row">
        <lk-loading color="#f00" />
        <lk-loading color="#0f0" />
        <lk-loading color="#00f" />
        <lk-loading color="#000" />
      </view>
    </demo-block>

    <demo-block title="弹跳样式">
      <view class="loading-row">
        <lk-loading type="bounce" text="弹跳加载" />
      </view>
    </demo-block>

    <demo-block title="波浪样式">
      <view class="loading-row">
        <lk-loading type="wave" text="波浪加载" />
      </view>
    </demo-block>

    <demo-block title="环形样式">
      <view class="loading-row">
        <lk-loading type="ring" text="环形加载" />
      </view>
    </demo-block>

    <demo-block title="省略号样式">
      <view class="loading-row">
        <lk-loading type="ellipsis" text="省略号加载" />
      </view>
    </demo-block>

    <demo-block title="文字闪光样式">
      <view class="loading-row">
        <lk-loading type="text" text="Loading..." />
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

.loading-row {
  display: flex;
  gap: 48rpx;
  justify-content: space-around;
  align-items: center;
}
</style>
