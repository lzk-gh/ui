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
      <view class="button-group button-group--small-gap">
        <lk-button size="sm" variant="soft" @click="setCloseNear">图标更贴近</lk-button>
        <lk-button size="sm" variant="soft" @click="setCloseFar">图标更远</lk-button>
      </view>
      <lk-curtain
        v-model:show="show2"
        :close-position="closePosition"
        :close-offset="closeOffset"
        :close-offset-bottom="closeOffsetBottom"
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

    <demo-block title="图片模式">
      <view class="button-group">
        <lk-button @click="showFit">aspectFit</lk-button>
        <lk-button @click="showFill">aspectFill</lk-button>
      </view>
      <lk-curtain
        v-model:show="show4"
        :image-mode="imageMode"
        width="620rpx"
        height="680rpx"
        image-url="https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      />
    </demo-block>

    <demo-block title="插槽自定义内容">
      <lk-button @click="show5 = true">显示自定义幕帘</lk-button>
      <lk-curtain v-model:show="show5" width="620rpx" height="460rpx">
        <view class="slot-card">
          <text class="slot-card__title">新人专享礼包</text>
          <text class="slot-card__desc">限时 24 小时 · 下单立减</text>
          <lk-button size="sm" @click.stop="show5 = false">立即领取</lk-button>
        </view>
      </lk-curtain>
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
const show4 = ref(false);
const show5 = ref(false);
const imageMode = ref<'aspectFit' | 'aspectFill'>('aspectFit');
const closePosition = ref<CurtainClosePosition>('bottom');
const closeOffset = ref('24rpx');
const closeOffsetBottom = ref('36rpx');

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

const showFit = () => {
  imageMode.value = 'aspectFit';
  show4.value = true;
};

const showFill = () => {
  imageMode.value = 'aspectFill';
  show4.value = true;
};

const setCloseNear = () => {
  closeOffset.value = '12rpx';
  closeOffsetBottom.value = '20rpx';
};

const setCloseFar = () => {
  closeOffset.value = '36rpx';
  closeOffsetBottom.value = '52rpx';
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

  &--small-gap {
    margin-top: 16rpx;
    gap: 12rpx;
  }
}

.slot-card {
  width: 100%;
  height: 100%;
  border-radius: 24rpx;
  background: linear-gradient(135deg, #6965db 0%, #8b88ff 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  padding: 32rpx;
  box-sizing: border-box;

  &__title {
    font-size: 40rpx;
    font-weight: 700;
    color: #fff;
  }

  &__desc {
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.9);
  }
}
</style>
