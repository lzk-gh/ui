<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <view class="switch-row">
        <text>开关</text>
        <lk-switch v-model="value1" />
      </view>
    </demo-block>

    <demo-block title="禁用状态">
      <view class="switch-row">
        <text>开启禁用</text>
        <lk-switch v-model="value2" disabled />
      </view>
      <view class="switch-row">
        <text>关闭禁用</text>
        <lk-switch v-model="value3" disabled />
      </view>
    </demo-block>

    <demo-block title="不同尺寸">
      <view class="switch-row">
        <text>小号</text>
        <lk-switch v-model="value4" size="sm" />
      </view>
      <view class="switch-row">
        <text>默认</text>
        <lk-switch v-model="value5" />
      </view>
      <view class="switch-row">
        <text>大号</text>
        <lk-switch v-model="value6" size="lg" />
      </view>
    </demo-block>

    <demo-block title="加载状态">
      <view class="switch-row">
        <text>加载中</text>
        <lk-switch v-model="value7" loading />
      </view>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LkSwitch from '@/uni_modules/lucky-ui/components/lk-switch/lk-switch.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const value1 = ref(true);
const value2 = ref(true);
const value3 = ref(false);
const value4 = ref(true);
const value5 = ref(true);
const value6 = ref(true);
const value7 = ref(false);
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 0;

  text {
    font-size: 28rpx;
    color: var(--lk-color-text);
  }
}
</style>
