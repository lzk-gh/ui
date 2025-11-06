<template>
  <view class="component-demo">
    <demo-block title="内嵌 PickerView">
      <lk-picker-view v-model="val1" :columns="col1" />
    </demo-block>

    <demo-block title="多列 PickerView">
      <lk-picker-view v-model="val2" :columns="col2" />
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';
import LkPickerView from '@/uni_modules/lucky-ui/components/lk-picker-view/lk-picker-view.vue';

const col1 = [
  { label: '红色', value: 'red' },
  { label: '绿色', value: 'green' },
  { label: '蓝色', value: 'blue' },
];

const col2 = [
  [ { label: '周一', value: 'mon' }, { label: '周二', value: 'tue' }, { label: '周三', value: 'wed' } ],
  [ { label: '上午', value: 'am' }, { label: '下午', value: 'pm' } ]
];

const val1 = ref('green');
const val2 = ref<any[]>(['tue','pm']);
</script>

<style scoped lang="scss">
.component-demo { display:flex; flex-direction:column; gap:24rpx; }
</style>
