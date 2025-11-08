<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-segmented v-model="value1" :options="options1" />
    </demo-block>

    <demo-block title="禁用选项">
      <lk-segmented v-model="value2" :options="options2" />
    </demo-block>

    <demo-block title="块级元素">
      <lk-segmented v-model="value3" :options="options1" block />
    </demo-block>

    <demo-block title="不同尺寸">
      <lk-segmented v-model="value4" :options="options1" size="small" />
      <lk-segmented v-model="value5" :options="options1" style="margin-top: 16rpx" />
      <lk-segmented v-model="value6" :options="options1" size="large" style="margin-top: 16rpx" />
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LkSegmented from '@/uni_modules/lucky-ui/components/lk-segmented/lk-segmented.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const value1 = ref('daily');
const value2 = ref('daily');
const value3 = ref('daily');
const value4 = ref('daily');
const value5 = ref('daily');
const value6 = ref('daily');

const options1 = [
  { label: '每日', value: 'daily' },
  { label: '每周', value: 'weekly' },
  { label: '每月', value: 'monthly' },
];

const options2 = [
  { label: '每日', value: 'daily' },
  { label: '每周', value: 'weekly', disabled: true },
  { label: '每月', value: 'monthly' },
];
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
