<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-cascader v-model="value1" :options="options" placeholder="请选择地区" />
    </demo-block>

    <demo-block title="自定义选项">
      <lk-cascader v-model="value2" :options="customOptions" placeholder="请选择" />
    </demo-block>

    <demo-block title="动态加载">
      <lk-cascader
        v-model="value3"
        :options="asyncOptions"
        lazy
        placeholder="动态加载"
        @load="loadData"
      />
    </demo-block>

    <demo-block title="多选">
      <lk-cascader v-model="value4" :options="options" multiple placeholder="请选择多个地区" />
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LkCascader from '@/uni_modules/lucky-ui/components/lk-cascader/lk-cascader.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const value1 = ref([]);
const value2 = ref([]);
const value3 = ref([]);
const value4 = ref([]);

const options = [
  {
    label: '广东省',
    value: 'guangdong',
    children: [
      { label: '广州市', value: 'guangzhou' },
      { label: '深圳市', value: 'shenzhen' },
      { label: '东莞市', value: 'dongguan' },
    ],
  },
  {
    label: '浙江省',
    value: 'zhejiang',
    children: [
      { label: '杭州市', value: 'hangzhou' },
      { label: '宁波市', value: 'ningbo' },
    ],
  },
];

const customOptions = [
  {
    label: '类目1',
    value: 1,
    children: [
      { label: '子类1-1', value: 11 },
      { label: '子类1-2', value: 12 },
    ],
  },
  {
    label: '类目2',
    value: 2,
    children: [
      { label: '子类2-1', value: 21 },
      { label: '子类2-2', value: 22 },
    ],
  },
];

const asyncOptions = ref([
  { label: '选项1', value: 1, isLeaf: false },
  { label: '选项2', value: 2, isLeaf: false },
]);

const loadData = (node: any) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const children = [
        {
          label: `子选项${node.value}-1`,
          value: `${node.value}-1`,
          isLeaf: true,
        },
        {
          label: `子选项${node.value}-2`,
          value: `${node.value}-2`,
          isLeaf: true,
        },
      ];
      resolve(children);
    }, 1000);
  });
};
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
