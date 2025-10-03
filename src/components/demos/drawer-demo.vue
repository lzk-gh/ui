<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-button type="primary" @click="showDrawer1">打开抽屉</lk-button>
      <lk-drawer v-model="visible1">
        <view class="drawer-content">
          <text class="drawer-title">抽屉标题</text>
          <text class="drawer-text">这是抽屉内容</text>
        </view>
      </lk-drawer>
    </demo-block>

    <demo-block title="不同方向">
      <view class="button-row">
        <lk-button @click="showLeft">左侧</lk-button>
        <lk-button @click="showRight">右侧</lk-button>
        <lk-button @click="showTop">顶部</lk-button>
        <lk-button @click="showBottom">底部</lk-button>
      </view>
      <lk-drawer v-model="visibleLeft" position="left">
        <view class="drawer-content">左侧抽屉</view>
      </lk-drawer>
      <lk-drawer v-model="visibleRight" position="right">
        <view class="drawer-content">右侧抽屉</view>
      </lk-drawer>
      <lk-drawer v-model="visibleTop" position="top">
        <view class="drawer-content">顶部抽屉</view>
      </lk-drawer>
      <lk-drawer v-model="visibleBottom" position="bottom">
        <view class="drawer-content">底部抽屉</view>
      </lk-drawer>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkDrawer from '@/uni_modules/lucky-ui/components/lk-drawer/lk-drawer.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const visible1 = ref(false);
const visibleLeft = ref(false);
const visibleRight = ref(false);
const visibleTop = ref(false);
const visibleBottom = ref(false);

const showDrawer1 = () => {
  visible1.value = true;
};

const showLeft = () => {
  visibleLeft.value = true;
};

const showRight = () => {
  visibleRight.value = true;
};

const showTop = () => {
  visibleTop.value = true;
};

const showBottom = () => {
  visibleBottom.value = true;
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

.drawer-content {
  padding: 48rpx;
}

.drawer-title {
  display: block;
  font-size: 32rpx;
  font-weight: 500;
  color: var(--lk-color-text);
  margin-bottom: 24rpx;
}

.drawer-text {
  display: block;
  font-size: 28rpx;
  color: var(--lk-color-text-secondary);
}
</style>
