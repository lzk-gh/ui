<script setup lang="ts">
import { ref } from 'vue';
import LkRate from '@/uni_modules/lucky-ui/components/lk-rate/lk-rate.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const value1 = ref(3);
const value3 = ref(4);
const value4 = ref(2);
const value5 = ref(5);
const value6 = ref(4);
const value7 = ref(3);
</script>

<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-rate v-model="value1" />
    </demo-block>

    <demo-block title="只读">
      <lk-rate v-model="value3" readonly />
    </demo-block>

    <demo-block title="禁用">
      <lk-rate v-model="value4" disabled />
    </demo-block>

    <demo-block title="自定义数量">
      <lk-rate v-model="value5" :count="8" />
    </demo-block>

    <demo-block title="自定义颜色">
      <lk-rate v-model="value6" color="#ff6b6b" />
    </demo-block>

    <demo-block title="自定义尺寸">
      <lk-rate v-model="value7" size="40" />
    </demo-block>

    <demo-block title="自定义图标（lk-icon）">
      <lk-rate v-model="value7" allow-half icon="star-fill" color="#f5a623" :size="48" />
    </demo-block>
  </view>
</template>
<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
