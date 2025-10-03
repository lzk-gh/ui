<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-button type="primary" @click="showToast1">显示提示</lk-button>
    </demo-block>

    <demo-block title="不同类型">
      <view class="button-row">
        <lk-button @click="showSuccess">成功</lk-button>
        <lk-button @click="showError">失败</lk-button>
        <lk-button @click="showWarning">警告</lk-button>
        <lk-button @click="showInfo">提示</lk-button>
      </view>
    </demo-block>

    <demo-block title="加载状态">
      <lk-button type="primary" @click="showLoading">加载中</lk-button>
    </demo-block>

    <demo-block title="自定义位置">
      <view class="button-row">
        <lk-button @click="showTop">顶部</lk-button>
        <lk-button @click="showCenter">中间</lk-button>
        <lk-button @click="showBottom">底部</lk-button>
      </view>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const showToast1 = () => {
  uni.showToast({
    title: '这是一条提示',
    icon: 'none'
  });
};

const showSuccess = () => {
  uni.showToast({
    title: '操作成功',
    icon: 'success'
  });
};

const showError = () => {
  uni.showToast({
    title: '操作失败',
    icon: 'error'
  });
};

const showWarning = () => {
  uni.showToast({
    title: '警告提示',
    icon: 'none'
  });
};

const showInfo = () => {
  uni.showToast({
    title: '提示信息',
    icon: 'none'
  });
};

const showLoading = () => {
  uni.showLoading({
    title: '加载中...'
  });
  
  setTimeout(() => {
    uni.hideLoading();
  }, 2000);
};

const showTop = () => {
  uni.showToast({
    title: '顶部提示',
    icon: 'none'
  });
};

const showCenter = () => {
  uni.showToast({
    title: '中间提示',
    icon: 'none'
  });
};

const showBottom = () => {
  uni.showToast({
    title: '底部提示',
    icon: 'none'
  });
};
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
</style>
