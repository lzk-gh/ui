<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-button type="primary" @click="showPopup1">显示弹出层</lk-button>
      <lk-popup v-model="visible1">
        <view class="popup-content"> 这是弹出层内容 </view>
      </lk-popup>
    </demo-block>

    <demo-block title="不同位置">
      <view class="button-row">
        <lk-button @click="showTop">顶部</lk-button>
        <lk-button @click="showBottom">底部</lk-button>
        <lk-button @click="showLeft">左侧</lk-button>
        <lk-button @click="showRight">右侧</lk-button>
      </view>
      <lk-popup v-model="visibleTop" position="top">
        <view class="popup-content">顶部弹出</view>
      </lk-popup>
      <lk-popup v-model="visibleBottom" position="bottom">
        <view class="popup-content">底部弹出</view>
      </lk-popup>
      <lk-popup v-model="visibleLeft" position="left">
        <view class="popup-content">左侧弹出</view>
      </lk-popup>
      <lk-popup v-model="visibleRight" position="right">
        <view class="popup-content">右侧弹出</view>
      </lk-popup>
    </demo-block>

    <demo-block title="圆角">
      <lk-button type="primary" @click="showPopup2">圆角弹出层</lk-button>
      <lk-popup v-model="visible2" round>
        <view class="popup-content"> 圆角弹出层内容 </view>
      </lk-popup>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkPopup from '@/uni_modules/lucky-ui/components/lk-popup/lk-popup.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const visible1 = ref(false);
const visible2 = ref(false);
const visibleTop = ref(false);
const visibleBottom = ref(false);
const visibleLeft = ref(false);
const visibleRight = ref(false);

const showPopup1 = () => {
  visible1.value = true;
};

const showPopup2 = () => {
  visible2.value = true;
};

const showTop = () => {
  visibleTop.value = true;
};

const showBottom = () => {
  visibleBottom.value = true;
};

const showLeft = () => {
  visibleLeft.value = true;
};

const showRight = () => {
  visibleRight.value = true;
};
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.popup-content {
  padding: 48rpx;
  font-size: 28rpx;
  color: var(--lk-color-text);
}
</style>
