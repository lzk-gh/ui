<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-breadcrumb>
        <lk-breadcrumb-item>首页</lk-breadcrumb-item>
        <lk-breadcrumb-item>列表</lk-breadcrumb-item>
        <lk-breadcrumb-item>详情</lk-breadcrumb-item>
      </lk-breadcrumb>
    </demo-block>

    <demo-block title="带图标">
      <lk-breadcrumb>
        <lk-breadcrumb-item> <lk-icon name="house-fill" size="28" /> 首页 </lk-breadcrumb-item>
        <lk-breadcrumb-item> <lk-icon name="folder-fill" size="28" /> 产品 </lk-breadcrumb-item>
        <lk-breadcrumb-item>详情</lk-breadcrumb-item>
      </lk-breadcrumb>
    </demo-block>

    <demo-block title="自定义分隔符">
      <lk-breadcrumb separator=">">
        <lk-breadcrumb-item>首页</lk-breadcrumb-item>
        <lk-breadcrumb-item>列表</lk-breadcrumb-item>
        <lk-breadcrumb-item>详情</lk-breadcrumb-item>
      </lk-breadcrumb>
    </demo-block>

    <demo-block title="可点击">
      <lk-breadcrumb>
        <lk-breadcrumb-item @click="handleClick('首页')">首页</lk-breadcrumb-item>
        <lk-breadcrumb-item @click="handleClick('列表')">列表</lk-breadcrumb-item>
        <lk-breadcrumb-item>详情</lk-breadcrumb-item>
      </lk-breadcrumb>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import LkBreadcrumb from '@/uni_modules/lucky-ui/components/lk-breadcrumb/lk-breadcrumb.vue';
import LkBreadcrumbItem from '@/uni_modules/lucky-ui/components/lk-breadcrumb/lk-breadcrumb-item.vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const handleClick = (name: string) => {
  uni.showToast({
    title: `点击了: ${name}`,
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
