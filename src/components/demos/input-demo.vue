<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-input v-model="value1" placeholder="请输入内容" />
    </demo-block>

    <demo-block title="输入类型">
      <lk-input v-model="value2" type="text" placeholder="文本输入" />
      <lk-input v-model="value3" type="number" placeholder="数字输入" style="margin-top: 16rpx;" />
      <lk-input v-model="value4" type="password" placeholder="密码输入" style="margin-top: 16rpx;" />
    </demo-block>

    <demo-block title="清除按钮">
      <lk-input v-model="value5" clearable placeholder="可清除内容" />
    </demo-block>

    <demo-block title="禁用状态">
      <lk-input v-model="value6" disabled placeholder="禁用输入框" />
    </demo-block>

    <demo-block title="带图标">
      <lk-input v-model="value7" placeholder="搜索">
        <template #prefix>
          <lk-icon name="search" size="32" />
        </template>
      </lk-input>
      <lk-input v-model="value8" placeholder="用户名" style="margin-top: 16rpx;">
        <template #prefix>
          <lk-icon name="person-fill" size="32" />
        </template>
      </lk-input>
    </demo-block>

    <demo-block title="字数统计">
      <lk-input v-model="value9" :maxlength="20" show-word-limit placeholder="最多20个字" />
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LkInput from '@/uni_modules/lucky-ui/components/lk-input/lk-input.vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const value1 = ref('');
const value2 = ref('');
const value3 = ref('');
const value4 = ref('');
const value5 = ref('可清除的内容');
const value6 = ref('禁用状态');
const value7 = ref('');
const value8 = ref('');
const value9 = ref('');
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
