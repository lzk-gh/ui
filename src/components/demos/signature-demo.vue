<template>
  <view class="component-demo">
    <demo-block title="手写签名">
      <lk-signature ref="sign" :width="650" :height="300" />
      <view class="ops">
        <lk-button @click="onClear">清空</lk-button>
        <lk-button @click="onUndo">撤销</lk-button>
        <lk-button @click="onExport">导出</lk-button>
      </view>
      <image v-if="img" :src="img" class="preview" />
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkSignature from '@/uni_modules/lucky-ui/components/lk-signature/lk-signature.vue';

const sign = ref<any>(null);
const img = ref('');

function onClear(){ sign.value?.clear?.(); }
function onUndo(){ sign.value?.undo?.(); }
function onExport(){ img.value = sign.value?.toDataURL?.() || ''; }
</script>

<style scoped lang="scss">
.component-demo { display:flex; flex-direction:column; gap:24rpx; }
.ops { display:flex; gap: 12rpx; margin-top: 12rpx; }
.preview { width: 650rpx; height: 300rpx; border: 2rpx solid var(--lk-color-border); margin-top: 12rpx; }
</style>
