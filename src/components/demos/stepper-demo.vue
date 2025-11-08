<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-stepper v-model="value1" />
    </demo-block>

    <demo-block title="步长设置">
      <lk-stepper v-model="value2" :step="5" />
    </demo-block>

    <demo-block title="最大最小值">
      <lk-stepper v-model="value3" :min="1" :max="10" />
    </demo-block>

    <demo-block title="禁用状态">
      <lk-stepper v-model="value4" disabled />
    </demo-block>

    <demo-block title="不同尺寸">
      <lk-stepper v-model="value5" size="small" />
      <lk-stepper v-model="value6" style="margin-top: 16rpx" />
      <lk-stepper v-model="value7" size="large" style="margin-top: 16rpx" />
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LkStepper from '@/uni_modules/lucky-ui/components/lk-stepper/lk-stepper.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const value1 = ref(1);
const value2 = ref(0);
const value3 = ref(5);
const value4 = ref(3);
const value5 = ref(1);
const value6 = ref(1);
const value7 = ref(1);
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
