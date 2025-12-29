<template>
  <scroll-view class="form-page" :style="{ height: contentHeight }" scroll-y>
    <!-- 渐变头部 -->
    <view class="page-header">
      <lk-icon name="ui-checks-grid" size="80" color="#fff" />
      <text class="header-title">表单组件</text>
      <text class="header-desc">18 个常用表单组件</text>
    </view>

    <!-- 组件列表 -->
    <view class="component-list">
      <lk-cell-group>
        <lk-cell
          v-for="comp in components"
          :key="comp.name"
          :title="comp.title"
          :label="comp.desc"
          is-link
          @click="navigateToDetail(comp.name)"
        >
          <template #icon>
            <view class="cell-icon">
              <lk-icon :name="comp.icon" size="40" color="success" />
            </view>
          </template>
        </lk-cell>
      </lk-cell-group>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import LkCellGroup from '@/uni_modules/lucky-ui/components/lk-cell/lk-cell-group.vue';
import LkCell from '@/uni_modules/lucky-ui/components/lk-cell/lk-cell.vue';

defineProps<{
  contentHeight: string;
}>();

const components = [
  {
    name: 'form',
    title: 'Form 表单',
    desc: '用于数据录入和校验',
    icon: 'card-list',
  },
  {
    name: 'input',
    title: 'Input 输入框',
    desc: '输入文本的基础组件',
    icon: 'input-cursor-text',
  },
  {
    name: 'textarea',
    title: 'Textarea 文本域',
    desc: '多行文本输入',
    icon: 'textarea-t',
  },
  {
    name: 'select',
    title: 'Select 选择器',
    desc: '下拉选择组件',
    icon: 'menu-button-wide-fill',
  },
  {
    name: 'radio',
    title: 'Radio 单选框',
    desc: '用于单项选择',
    icon: 'record-circle-fill',
  },
  {
    name: 'checkbox',
    title: 'Checkbox 复选框',
    desc: '用于多项选择',
    icon: 'check-square-fill',
  },
  {
    name: 'switch',
    title: 'Switch 开关',
    desc: '开关选择器',
    icon: 'toggle-on',
  },
  {
    name: 'stepper',
    title: 'Stepper 步进器',
    desc: '数字增减操作',
    icon: 'plus-slash-minus',
  },
  {
    name: 'slider',
    title: 'Slider 滑块',
    desc: '滑动选择数值',
    icon: 'sliders',
  },
  { name: 'rate', title: 'Rate 评分', desc: '用于评分操作', icon: 'star-fill' },
  {
    name: 'upload',
    title: 'Upload 上传',
    desc: '文件上传组件',
    icon: 'cloud-upload-fill',
  },
  {
    name: 'picker',
    title: 'Picker 选择器',
    desc: '弹出选择器',
    icon: 'menu-button-wide',
  },
  {
    name: 'picker-view',
    title: 'PickerView 选择器视图',
    desc: '内联滚动选择',
    icon: 'columns',
  },
  {
    name: 'area-picker',
    title: 'AreaPicker 地区选择',
    desc: '省市区三级联动',
    icon: 'geo-alt',
  },
  {
    name: 'number-keyboard',
    title: 'NumberKeyboard 数字键盘',
    desc: '用于数字输入的键盘',
    icon: '123',
  },
  {
    name: 'verify-code',
    title: 'VerifyCode 验证码',
    desc: '短信/验证码输入',
    icon: 'shield-lock',
  },
  {
    name: 'color-picker',
    title: 'ColorPicker 取色器',
    desc: '支持 HSV/RGB/HEX',
    icon: 'palette',
  },
];

const navigateToDetail = (componentName: string) => {
  uni.navigateTo({
    url: `/pages/component-detail/index?name=${componentName}`,
  });
};
</script>

<style scoped lang="scss">
.form-page {
  width: 100%;
  background: var(--lk-color-bg-page);
}

.page-header {
  background: linear-gradient(
    135deg,
    var(--lk-color-success) 0%,
    var(--lk-color-success-hover) 100%
  );
  padding: 64rpx 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.header-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #fff;
}

.header-desc {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.9);
}

.component-list {
  padding: 0 24rpx 24rpx;
}

.cell-icon {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--lk-color-success-bg-soft);
  border-radius: var(--lk-radius-md);
  margin-right: 24rpx;
}
</style>
