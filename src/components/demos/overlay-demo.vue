<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-button type="primary" @click="showOverlay1">显示遮罩</lk-button>
      <lk-overlay v-model="visible1" @click="visible1 = false" />
    </demo-block>

    <demo-block title="嵌入内容">
      <lk-button type="primary" @click="showOverlay2">嵌入内容</lk-button>
      <lk-overlay v-model="visible2">
        <view class="overlay-content" @click.stop>
          <text class="overlay-text">这是内容区域</text>
          <lk-button type="primary" @click="visible2 = false">关闭</lk-button>
        </view>
      </lk-overlay>
    </demo-block>

    <demo-block title="自定义透明度">
      <lk-button type="primary" @click="showOverlay3">自定义透明度</lk-button>
      <lk-overlay v-model="visible3" :opacity="0.8" @click="visible3 = false" />
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkOverlay from '@/uni_modules/lucky-ui/components/lk-overlay/lk-overlay.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const visible1 = ref(false);
const visible2 = ref(false);
const visible3 = ref(false);

const showOverlay1 = () => {
  visible1.value = true;
};

const showOverlay2 = () => {
  visible2.value = true;
};

const showOverlay3 = () => {
  visible3.value = true;
};
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.overlay-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
  padding: 48rpx;
  background: white;
  border-radius: 16rpx;
}

.overlay-text {
  font-size: 28rpx;
  color: var(--lk-color-text);
}
</style>
