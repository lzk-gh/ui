<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-button type="primary" @click="showPopup1">显示弹出层</lk-button>
      <lk-popup v-model="visible1">
        <view class="popup-content"> 这是弹出层内容 </view>
      </lk-popup>
    </demo-block>

    <demo-block title="不同位置（带默认方向动画）">
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
        <view class="popup-content-side">
          <text>左侧弹出</text>
          <text class="desc">高度已自动填满</text>
        </view>
      </lk-popup>
      <lk-popup v-model="visibleRight" position="right">
        <view class="popup-content-side">
          <text>右侧弹出</text>
          <text class="desc">高度已自动填满</text>
        </view>
      </lk-popup>
    </demo-block>

    <demo-block title="标题与关闭按钮">
      <view class="button-row">
        <lk-button @click="visibleWithTitle = true">带标题</lk-button>
        <lk-button @click="visibleWithClose = true">带关闭按钮</lk-button>
        <lk-button @click="visibleWithBoth = true">标题+关闭</lk-button>
      </view>
      <lk-popup v-model="visibleWithTitle" position="bottom" title="弹窗标题">
        <view class="popup-content">这是带标题的弹窗</view>
      </lk-popup>
      <lk-popup v-model="visibleWithClose" position="center" closable>
        <view class="popup-content">带关闭按钮的居中弹窗</view>
      </lk-popup>
      <lk-popup v-model="visibleWithBoth" position="bottom" title="完整示例" closable>
        <view class="popup-content">标题和关闭按钮都有</view>
      </lk-popup>
    </demo-block>

    <demo-block title="自定义标题插槽">
      <lk-button type="primary" @click="visibleCustomTitle = true">自定义标题</lk-button>
      <lk-popup v-model="visibleCustomTitle" position="bottom" closable>
        <template #title>
          <view class="custom-title">
            <lk-icon name="star-fill" size="32" color="warning" />
            <text>自定义标题内容</text>
          </view>
        </template>
        <view class="popup-content">使用插槽自定义标题样式</view>
      </lk-popup>
    </demo-block>

    <demo-block title="预设与自定义动画">
      <view class="button-row">
        <lk-button @click="visiblePreset1 = true">preset: scale</lk-button>
        <lk-button @click="visiblePreset2 = true">preset: bounce</lk-button>
        <lk-button @click="visibleCustom = true">type: fade-up</lk-button>
      </view>
      <lk-popup v-model="visiblePreset1" animation="scale">
        <view class="popup-content">使用预设 scale 显示</view>
      </lk-popup>
      <lk-popup v-model="visiblePreset2" animation="bounce">
        <view class="popup-content">使用预设 bounce 显示</view>
      </lk-popup>
      <lk-popup v-model="visibleCustom" animation-type="fade-up">
        <view class="popup-content">使用自定义动画类型 fade-up</view>
      </lk-popup>
    </demo-block>

    <demo-block title="圆角与自定义圆角">
      <view class="button-row">
        <lk-button type="primary" @click="showPopup2">默认圆角</lk-button>
        <lk-button type="primary" @click="visibleRadius = true">自定义圆角(40rpx)</lk-button>
      </view>
      <lk-popup v-model="visible2" round position="bottom">
        <view class="popup-content"> 默认圆角弹出层内容 </view>
      </lk-popup>
      <lk-popup v-model="visibleRadius" round radius="40rpx" position="bottom">
        <view class="popup-content"> 自定义圆角 40rpx </view>
      </lk-popup>
    </demo-block>

    <demo-block title="可拖拽 (Snap Points)">
      <lk-button type="primary" @click="visibleDraggable = true">可拖拽底部弹窗</lk-button>
      <lk-popup
        v-model="visibleDraggable"
        position="bottom"
        round
        draggable
        title="拖拽示例"
        closable
      >
        <view class="popup-content-large">
          <view class="desc">
            <p>1. 默认打开在半屏位置</p>
            <p>2. 向上拖动可吸附到最高位置（90%）</p>
            <p>3. 向下拖动可关闭</p>
            <p>4. 带有速度检测和阻尼回弹效果</p>
          </view>
          <view v-for="i in 20" :key="i" class="list-item">列表项 {{ i }}</view>
        </view>
      </lk-popup>
    </demo-block>

    <demo-block title="复杂内容示例">
      <lk-button type="primary" @click="visibleComplex = true">复杂内容弹窗</lk-button>
      <lk-popup
        v-model="visibleComplex"
        position="bottom"
        round
        title="选择城市"
        closable
        close-icon-position="top-right"
      >
        <view class="popup-content-complex">
          <view class="city-list">
            <view v-for="city in cities" :key="city" class="city-item" @click="selectCity(city)">
              {{ city }}
            </view>
          </view>
        </view>
      </lk-popup>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkPopup from '@/uni_modules/lucky-ui/components/lk-popup/lk-popup.vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const visible1 = ref(false);
const visible2 = ref(false);
const visibleRadius = ref(false);
const visibleDraggable = ref(false);
const visibleTop = ref(false);
const visibleBottom = ref(false);
const visibleLeft = ref(false);
const visibleRight = ref(false);
const visiblePreset1 = ref(false);
const visiblePreset2 = ref(false);
const visibleCustom = ref(false);
const visibleWithTitle = ref(false);
const visibleWithClose = ref(false);
const visibleWithBoth = ref(false);
const visibleCustomTitle = ref(false);
const visibleComplex = ref(false);

const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '重庆', '武汉'];

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

const selectCity = (city: string) => {
  uni.showToast({
    title: `已选择：${city}`,
    icon: 'none',
  });
  visibleComplex.value = false;
};
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
}

.button-row {
  display: flex;
  gap: 16rpx;
  flex-wrap: wrap;
}

.popup-content {
  padding: 40rpx;
  font-size: 32rpx;
  color: #333;
  background-color: #fff;
  min-width: 200rpx;
  min-height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup-content-side {
  padding: 60rpx 40rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 32rpx;
  color: #333;

  .desc {
    font-size: 24rpx;
    color: #999;
  }
}

.custom-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: var(--lk-color-warning);
}

.popup-content-large {
  padding: 0 40rpx 40rpx;
  height: 100%;
  background-color: #fff;

  .desc {
    font-size: 28rpx;
    color: #666;
    margin-bottom: 30rpx;
    line-height: 1.6;
    background: #f5f5f5;
    padding: 20rpx;
    border-radius: 12rpx;
  }

  .list-item {
    padding: 30rpx 0;
    border-bottom: 1rpx solid #eee;
    font-size: 30rpx;
  }
}

.popup-content-complex {
  padding: 20rpx 0;
  max-height: 600rpx;
  overflow-y: auto;

  .city-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
    padding: 20rpx 40rpx;
  }

  .city-item {
    padding: 20rpx 40rpx;
    background: #f5f5f5;
    border-radius: 12rpx;
    font-size: 28rpx;
    color: #333;
    cursor: pointer;
    transition: all 0.2s;

    &:active {
      background: var(--lk-color-primary-light);
      color: var(--lk-color-primary);
    }
  }
}
</style>
