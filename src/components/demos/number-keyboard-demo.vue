<template>
  <view class="component-demo">
    <demo-block title="数字键盘">
      <lk-button @click="show = true">弹出数字键盘</lk-button>
      <view class="value">当前输入：{{ value }}</view>
      <lk-number-keyboard
        v-model:visible="show"
        :random="true"
        extra-key="."
        :allow-decimal="true"
        @input="onInput"
        @delete="onDelete"
        @confirm="onConfirm"
      />
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkNumberKeyboard from '@/uni_modules/lucky-ui/components/lk-number-keyboard/lk-number-keyboard.vue';

const show = ref(false);
const value = ref('');

function onInput(ch: string) {
  value.value += ch;
}
function onDelete() {
  value.value = value.value.slice(0, -1);
}
function onConfirm() {
  show.value = false;
}
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
