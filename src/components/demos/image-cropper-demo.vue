<template>
  <view class="component-demo">
    <demo-block title="图片裁剪">
      <lk-button @click="show = true">选择头像</lk-button>
      <view class="preview" v-if="result">
        <image :src="result" class="avatar" />
      </view>
      <lk-image-cropper v-if="show" :visible="show" :src="src" round @update:visible="v=>show=v" @confirm="onConfirm" />
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkImageCropper from '@/uni_modules/lucky-ui/components/lk-image-cropper/lk-image-cropper.vue';

const show = ref(false);
const src = 'https://picsum.photos/600/400';
const result = ref('');

function onConfirm(dataURL: string){ result.value = dataURL; }
</script>

<style scoped lang="scss">
.component-demo { display:flex; flex-direction:column; gap:24rpx; }
.preview { margin-top: 16rpx; }
.avatar { width: 160rpx; height: 160rpx; border-radius: 50%; border: 2rpx solid var(--lk-color-border); }
</style>
