<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-textarea v-model="value1" placeholder="请输入多行文本" />
    </demo-block>

    <demo-block title="字数限制">
      <lk-textarea v-model="value2" :maxlength="200" show-word-limit placeholder="最多200字" />
    </demo-block>

    <demo-block title="自动高度">
      <lk-textarea v-model="value3" autosize placeholder="自动调整高度" />
    </demo-block>

    <demo-block title="禁用状态">
      <lk-textarea v-model="value4" disabled placeholder="禁用输入" />
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LkTextarea from '@/uni_modules/lucky-ui/components/lk-textarea/lk-textarea.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const value1 = ref('');
const value2 = ref('');
const value3 = ref('');
const value4 = ref('禁用状态');
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
