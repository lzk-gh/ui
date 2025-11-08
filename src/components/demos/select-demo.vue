<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-select v-model="value1" :options="options1" placeholder="请选择" />
    </demo-block>

    <demo-block title="禁用选项">
      <lk-select v-model="value2" :options="options2" placeholder="请选择" />
    </demo-block>

    <demo-block title="禁用状态">
      <lk-select v-model="value3" :options="options1" disabled />
    </demo-block>

    <demo-block title="多选">
      <lk-select v-model="value4" :options="options1" multiple placeholder="请选择" />
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LkSelect from '@/uni_modules/lucky-ui/components/lk-select/lk-select.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const value1 = ref('');
const value2 = ref('');
const value3 = ref('option1');
const value4 = ref([]);

const options1 = [
  { label: '选项一', value: 'option1' },
  { label: '选项二', value: 'option2' },
  { label: '选项三', value: 'option3' },
  { label: '选项四', value: 'option4' },
];

const options2 = [
  { label: '选项一', value: 'option1' },
  { label: '选项二', value: 'option2', disabled: true },
  { label: '选项三', value: 'option3' },
  { label: '选项四', value: 'option4', disabled: true },
];
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
