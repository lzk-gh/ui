<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-checkbox-group v-model="value1">
        <lk-checkbox label="1">选项一</lk-checkbox>
        <lk-checkbox label="2">选项二</lk-checkbox>
        <lk-checkbox label="3">选项三</lk-checkbox>
      </lk-checkbox-group>
    </demo-block>

    <demo-block title="禁用状态">
      <lk-checkbox-group v-model="value2">
        <lk-checkbox label="1">正常</lk-checkbox>
        <lk-checkbox label="2" disabled>禁用</lk-checkbox>
        <lk-checkbox label="3">正常</lk-checkbox>
      </lk-checkbox-group>
    </demo-block>

    <demo-block title="全选">
      <view class="checkbox-all">
        <lk-checkbox :model-value="isAllSelected" @change="handleCheckAll">全选</lk-checkbox>
      </view>
      <lk-checkbox-group v-model="value3">
        <lk-checkbox label="1">选项一</lk-checkbox>
        <lk-checkbox label="2">选项二</lk-checkbox>
        <lk-checkbox label="3">选项三</lk-checkbox>
        <lk-checkbox label="4">选项四</lk-checkbox>
      </lk-checkbox-group>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import LkCheckboxGroup from '@/uni_modules/lucky-ui/components/lk-checkbox/lk-checkbox-group.vue';
import LkCheckbox from '@/uni_modules/lucky-ui/components/lk-checkbox/lk-checkbox.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const value1 = ref(['1']);
const value2 = ref(['1']);
const value3 = ref(['1', '2']);

const isAllSelected = computed(() => value3.value.length === 4);

const handleCheckAll = (checked: boolean) => {
  value3.value = checked ? ['1', '2', '3', '4'] : [];
};
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.checkbox-all {
  margin-bottom: 16rpx;
  padding-bottom: 16rpx;
  border-bottom: 2rpx solid var(--lk-color-border);
}
</style>
