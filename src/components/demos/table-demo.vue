<template>
  <view class="component-demo">
    <demo-block title="基础表格">
      <lk-table :columns="columns" :data="data" />
    </demo-block>

    <demo-block title="带边框">
      <lk-table :columns="columns" :data="data" border />
    </demo-block>

    <demo-block title="斑马纹">
      <lk-table :columns="columns" :data="data" stripe />
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LkTable from '@/uni_modules/lucky-ui/components/lk-table/lk-table.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const columns = ref([
  { key: 'name', prop: 'name', label: '姓名', width: '200' },
  { key: 'age', prop: 'age', label: '年龄', width: '150' },
  { key: 'address', prop: 'address', label: '地址', width: '300' }
]);

const data = ref([
  { name: '张三', age: 25, address: '北京市朝阳区' },
  { name: '李四', age: 30, address: '上海市浦东新区' },
  { name: '王五', age: 28, address: '广州市天河区' }
]);
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
