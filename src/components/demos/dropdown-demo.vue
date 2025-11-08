<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-dropdown>
        <lk-button>下拉菜单 <lk-icon name="chevron-down" /></lk-button>
        <template #menu>
          <lk-dropdown-item name="1" @click="handleSelect('选项一')">选项一</lk-dropdown-item>
          <lk-dropdown-item name="2" @click="handleSelect('选项二')">选项二</lk-dropdown-item>
          <lk-dropdown-item name="3" @click="handleSelect('选项三')">选项三</lk-dropdown-item>
        </template>
      </lk-dropdown>
    </demo-block>

    <demo-block title="禁用选项">
      <lk-dropdown>
        <lk-button>带禁用项 <lk-icon name="chevron-down" /></lk-button>
        <template #menu>
          <lk-dropdown-item name="1">正常</lk-dropdown-item>
          <lk-dropdown-item name="2" disabled>禁用</lk-dropdown-item>
          <lk-dropdown-item name="3">正常</lk-dropdown-item>
        </template>
      </lk-dropdown>
    </demo-block>

    <demo-block title="带图标">
      <lk-dropdown>
        <lk-button type="primary">操作 <lk-icon name="chevron-down" /></lk-button>
        <template #menu>
          <lk-dropdown-item name="edit"> <lk-icon name="pencil-square" /> 编辑 </lk-dropdown-item>
          <lk-dropdown-item name="delete"> <lk-icon name="trash-fill" /> 删除 </lk-dropdown-item>
          <lk-dropdown-item name="share"> <lk-icon name="share-fill" /> 分享 </lk-dropdown-item>
        </template>
      </lk-dropdown>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import LkDropdown from '@/uni_modules/lucky-ui/components/lk-dropdown/lk-dropdown.vue';
import LkDropdownItem from '@/uni_modules/lucky-ui/components/lk-dropdown/lk-dropdown-item.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const handleSelect = (value: string) => {
  uni.showToast({
    title: `选择了: ${value}`,
    icon: 'none',
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
