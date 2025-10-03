<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-progress :percentage="50" />
    </demo-block>

    <demo-block title="线条粗细">
      <lk-progress :percentage="50" :stroke-width="8" />
      <lk-progress :percentage="70" :stroke-width="12" style="margin-top: 16rpx;" />
      <lk-progress :percentage="90" :stroke-width="16" style="margin-top: 16rpx;" />
    </demo-block>

    <demo-block title="不同状态">
      <lk-progress :percentage="30" />
      <lk-progress :percentage="70" status="success" style="margin-top: 16rpx;" />
      <lk-progress :percentage="50" status="warning" style="margin-top: 16rpx;" />
      <lk-progress :percentage="100" status="error" style="margin-top: 16rpx;" />
    </demo-block>

    <demo-block title="显示文字">
      <lk-progress :percentage="percentage1" show-text />
    </demo-block>

    <demo-block title="动态进度">
      <lk-progress :percentage="percentage2" show-text />
      <view class="button-group">
        <lk-button @click="decrease">-10</lk-button>
        <lk-button type="primary" @click="increase">+10</lk-button>
      </view>
    </demo-block>

    <demo-block title="圆形进度条">
      <view class="circle-progress-group">
        <lk-progress :percentage="60" type="circle" />
        <lk-progress :percentage="80" type="circle" status="success" />
        <lk-progress :percentage="100" type="circle" status="warning" />
      </view>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LkProgress from '@/uni_modules/lucky-ui/components/lk-progress/lk-progress.vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const percentage1 = ref(70);
const percentage2 = ref(50);

const increase = () => {
  if (percentage2.value < 100) {
    percentage2.value += 10;
  }
};

const decrease = () => {
  if (percentage2.value > 0) {
    percentage2.value -= 10;
  }
};
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.button-group {
  display: flex;
  gap: 16rpx;
  margin-top: 24rpx;
}

.circle-progress-group {
  display: flex;
  gap: 32rpx;
  justify-content: space-around;
}
</style>
