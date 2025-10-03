<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-radio-group v-model="value1">
        <lk-radio label="1">选项一</lk-radio>
        <lk-radio label="2">选项二</lk-radio>
        <lk-radio label="3">选项三</lk-radio>
      </lk-radio-group>
    </demo-block>

    <demo-block title="禁用状态">
      <lk-radio-group v-model="value2">
        <lk-radio label="1">正常</lk-radio>
        <lk-radio label="2" disabled>禁用</lk-radio>
        <lk-radio label="3">正常</lk-radio>
      </lk-radio-group>
    </demo-block>

    <demo-block title="按钮样式">
      <lk-radio-group v-model="value3">
        <lk-radio label="small">小</lk-radio>
        <lk-radio label="medium">中</lk-radio>
        <lk-radio label="large">大</lk-radio>
      </lk-radio-group>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LkRadioGroup from '@/uni_modules/lucky-ui/components/lk-radio/lk-radio-group.vue';
import LkRadio from '@/uni_modules/lucky-ui/components/lk-radio/lk-radio.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const value1 = ref('1');
const value2 = ref('1');
const value3 = ref('medium');
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
