<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-tree :data="treeData1" />
    </demo-block>

    <demo-block title="可勾选">
      <lk-tree :data="treeData2" checkable v-model:checked-keys="checkedKeys" />
      <text class="result-text">已选择: {{ checkedKeys.join(', ') }}</text>
    </demo-block>

    <demo-block title="默认展开">
      <lk-tree :data="treeData3" :default-expanded-keys="['1', '2']" />
    </demo-block>

    <demo-block title="禁用节点">
      <lk-tree :data="treeData4" checkable />
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LkTree from '@/uni_modules/lucky-ui/components/lk-tree/lk-tree.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const checkedKeys = ref(['1-1']);

const treeData1 = [
  {
    label: '父节点1',
    value: '1',
    children: [
      { label: '子节点1-1', value: '1-1' },
      { label: '子节点1-2', value: '1-2' }
    ]
  },
  {
    label: '父节点2',
    value: '2',
    children: [
      { label: '子节点2-1', value: '2-1' },
      { label: '子节点2-2', value: '2-2' }
    ]
  }
];

const treeData2 = [
  {
    label: '文档',
    value: '1',
    children: [
      { label: '项目文档.docx', value: '1-1' },
      { label: '需求文档.docx', value: '1-2' }
    ]
  },
  {
    label: '图片',
    value: '2',
    children: [
      { label: 'photo1.jpg', value: '2-1' },
      { label: 'photo2.jpg', value: '2-2' }
    ]
  }
];

const treeData3 = [
  {
    label: '展开的节点',
    value: '1',
    children: [
      { label: '子节点1', value: '1-1' },
      { label: '子节点2', value: '1-2' }
    ]
  },
  {
    label: '也展开的节点',
    value: '2',
    children: [
      { label: '子节点1', value: '2-1' },
      { label: '子节点2', value: '2-2' }
    ]
  }
];

const treeData4 = [
  {
    label: '正常节点',
    value: '1',
    children: [
      { label: '子节点1', value: '1-1' },
      { label: '禁用节点', value: '1-2', disabled: true }
    ]
  },
  {
    label: '正常节点',
    value: '2',
    children: [
      { label: '子节点1', value: '2-1' }
    ]
  }
];
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.result-text {
  display: block;
  margin-top: 16rpx;
  font-size: 24rpx;
  color: var(--lk-color-text-secondary);
}
</style>
