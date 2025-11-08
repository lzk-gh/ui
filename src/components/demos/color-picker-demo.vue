<template>
  <view class="component-demo">
    <demo-block title="取色器">
      <lk-color-picker v-model="val" :alpha="true" :preset="presets" />
      <view class="value">当前：{{ val }}</view>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';
import LkColorPicker from '@/uni_modules/lucky-ui/components/lk-color-picker/lk-color-picker.vue';

const val = ref('#4FACFE');
const presets = [
  '#4FACFE',
  '#00F2FE',
  '#667EEA',
  '#764BA2',
  '#F093FB',
  '#F5576C',
  '#34C759',
  '#FFCC00',
];
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.value {
  margin-top: 12rpx;
  color: var(--lk-color-text-secondary);
}
</style>
