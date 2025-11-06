<template>
  <view class="component-demo">
    <demo-block title="验证码输入">
      <lk-verify-code v-model="code" :length="6" mask autofocus @finish="onFinish" />
      <view class="value">当前：{{ code }}</view>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';
import LkVerifyCode from '@/uni_modules/lucky-ui/components/lk-verify-code/lk-verify-code.vue';

const code = ref('');
function onFinish(v: string) { uni.showToast({ title: '完成: ' + v, icon: 'none' }); }
</script>

<style scoped lang="scss">
.component-demo { display:flex; flex-direction:column; gap:24rpx; }
.value { margin-top: 12rpx; color: var(--lk-color-text-secondary); }
</style>
