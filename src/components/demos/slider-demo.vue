<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-slider v-model="value1" />
      <text class="value-text">当前值: {{ value1 }}</text>
    </demo-block>

    <demo-block title="设置步长">
      <lk-slider v-model="value2" :step="10" />
      <text class="value-text">当前值: {{ value2 }}</text>
    </demo-block>

    <demo-block title="范围选择">
      <lk-slider v-model="value3" :min="20" :max="80" />
      <text class="value-text">范围: 20-80, 当前值: {{ value3 }}</text>
    </demo-block>

    <demo-block title="禁用状态">
      <lk-slider v-model="value4" disabled />
    </demo-block>

    <demo-block title="显示标记">
      <lk-slider v-model="value5" show-marks />
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LkSlider from '@/uni_modules/lucky-ui/components/lk-slider/lk-slider.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const value1 = ref(50);
const value2 = ref(50);
const value3 = ref(50);
const value4 = ref(30);
const value5 = ref(60);
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.value-text {
  display: block;
  margin-top: 16rpx;
  font-size: 24rpx;
  color: var(--lk-color-text-secondary);
  text-align: center;
}
</style>
