<template>
  <view class="component-demo">
    <demo-block title="省市区选择">
      <lk-button @click="show = true">选择地区</lk-button>
      <view class="value">当前：{{ value.join(' / ') }}</view>
      <lk-area-picker v-model:visible="show" v-model="value" />
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkAreaPicker from '@/uni_modules/lucky-ui/components/lk-area-picker/lk-area-picker.vue';

const show = ref(false);
const value = ref<string[]>([]);
</script>

<style scoped lang="scss">
.component-demo { display:flex; flex-direction:column; gap:24rpx; }
.value { margin-top: 12rpx; color: var(--lk-color-text-secondary); }
</style>
