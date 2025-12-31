<template>
  <view class="curtain-demo">
    <lk-navbar title="Curtain 幕帘" />
    <demo-block title="基础用法">
      <lk-button @click="show1 = true">显示幕帘</lk-button>
      <lk-curtain
        v-model:show="show1"
        image-url="https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      />
    </demo-block>

    <demo-block title="关闭按钮位置">
      <view class="button-group">
        <lk-button @click="showTopLeft">左上角</lk-button>
        <lk-button @click="showTopRight">右上角</lk-button>
        <lk-button @click="showBottomLeft">左下角</lk-button>
        <lk-button @click="showBottomRight">右下角</lk-button>
      </view>
      <lk-curtain
        v-model:show="show2"
        :close-position="closePosition"
        image-url="https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg"
      />
    </demo-block>

    <demo-block title="点击遮罩关闭">
      <lk-button @click="show3 = true">开启点击遮罩关闭</lk-button>
      <lk-curtain
        v-model:show="show3"
        close-on-click-overlay
        image-url="https://fastly.jsdelivr.net/npm/@vant/assets/apple-3.jpeg"
      />
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LkNavbar from '@/uni_modules/lucky-ui/components/lk-navbar/lk-navbar.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkCurtain from '@/uni_modules/lucky-ui/components/lk-curtain/lk-curtain.vue';
import type { CurtainClosePosition } from '@/uni_modules/lucky-ui/components/lk-curtain/curtain.props';

const show1 = ref(false);
const show2 = ref(false);
const show3 = ref(false);
const closePosition = ref<CurtainClosePosition>('bottom');

const showTopLeft = () => {
  closePosition.value = 'top-left';
  show2.value = true;
};
const showTopRight = () => {
  closePosition.value = 'top-right';
  show2.value = true;
};
const showBottomLeft = () => {
  closePosition.value = 'bottom-left';
  show2.value = true;
};
const showBottomRight = () => {
  closePosition.value = 'bottom-right';
  show2.value = true;
};
</script>

<style lang="scss" scoped>
.curtain-demo {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 40rpx;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}
</style>
