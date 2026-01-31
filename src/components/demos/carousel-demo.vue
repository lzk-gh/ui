<template>
  <view class="component-demo">
    <!-- 1. 基础用法 -->
    <demo-block title="基础用法（默认底部居中，点状）">
      <lk-carousel
        v-model:current="current1"
        :carousel-list="imageList"
        indicator-type="dots"
        :circular="true"
        @click="handleClick"
      />
    </demo-block>

    <!-- 2. 指示器样式升级 -->
    <demo-block title="指示器样式：圆润条形（Bars）">
      <lk-carousel
        v-model:current="current2"
        :carousel-list="imageList"
        indicator-type="bars"
        indicator-active-color="#fff"
        indicator-color="rgba(255,255,255,0.4)"
      />
    </demo-block>

    <!-- 3. 新增位置：角落定位 -->
    <demo-block title="位置：左下角 (Bottom Left)">
      <lk-carousel
        v-model:current="current3"
        :carousel-list="imageList"
        indicator-position="bottom-left"
        indicator-type="dots"
      />
    </demo-block>

    <demo-block title="位置：右上角 (Top Right) + 数字">
      <lk-carousel
        v-model:current="current4"
        :carousel-list="imageList"
        indicator-position="top-right"
        indicator-type="number"
      />
    </demo-block>

    <!-- 4. 新增位置：侧边垂直居中 -->
    <demo-block title="位置：左侧居中 (Left) + 垂直排列">
      <lk-carousel
        v-model:current="current5"
        :carousel-list="imageList"
        indicator-position="left"
        indicator-type="bars"
      />
    </demo-block>

    <!-- 5. 竖向轮播 + 右侧指示器 -->
    <demo-block title="竖向轮播 + 右侧居中 (Right)">
      <lk-carousel
        v-model:current="current6"
        :carousel-list="imageList"
        :vertical="true"
        indicator-position="right"
        indicator-type="dots"
        height="360rpx"
      />
    </demo-block>

    <!-- 6. 卡片模式增强 -->
    <demo-block title="卡片模式（圆润/阴影/缩放）">
      <view class="card-demo-bg">
        <lk-carousel
          v-model:current="current7"
          :carousel-list="imageList"
          :card="true"
          height="380rpx"
          card-prev-margin="50rpx"
          card-next-margin="50rpx"
          :card-scale="0.9"
          card-radius="24rpx"
          card-shadow="0 8rpx 24rpx rgba(0,0,0,0.15)"
          indicator-type="bars"
          indicator-position="bottom"
        />
      </view>
    </demo-block>

    <!-- 7. 自适应高度 -->
    <demo-block title="自适应高度 (AutoHeight)">
      <lk-carousel
        v-model:current="current8"
        :carousel-list="[1, 2]"
        :auto-height="true"
        indicator-type="dots"
        indicator-active-color="#1989fa"
        indicator-color="#ebedf0"
      >
        <template #default="{ index }">
          <view class="custom-content" :class="`bg-${index}`">
            <view class="content-text">
              <text class="title">第 {{ index + 1 }} 页内容</text>
              <text class="desc">高度由内容撑开，不固定。</text>
              <view
                v-if="index === 0"
                style="height: 100rpx; background: rgba(0, 0, 0, 0.05); margin-top: 20rpx"
              ></view>
              <view
                v-if="index === 1"
                style="height: 240rpx; background: rgba(0, 0, 0, 0.05); margin-top: 20rpx"
              ></view>
            </view>
          </view>
        </template>
      </lk-carousel>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';
import LkCarousel from '@/uni_modules/lucky-ui/components/lk-carousel/lk-carousel.vue';
import { ref } from 'vue';

// 模拟图片数据
const imageList = ref([
  // 网络图片
  'https://img01.yzcdn.cn/vant/cat.jpeg',
  'https://img01.yzcdn.cn/vant/cat.jpeg',
  'https://img01.yzcdn.cn/vant/cat.jpeg',
  'https://img01.yzcdn.cn/vant/cat.jpeg',
  'https://img01.yzcdn.cn/vant/cat.jpeg',
]);

const current1 = ref(0);
const current2 = ref(0);
const current3 = ref(0);
const current4 = ref(0);
const current5 = ref(0);
const current6 = ref(0);
const current7 = ref(0);
const current8 = ref(0);

const handleClick = (item: any, index: number) => {
  console.log('点击了:', index, item);
  uni.showToast({ title: `点击第 ${index + 1} 张`, icon: 'none' });
};
</script>

<style scoped lang="scss">
.component-demo {
  padding-bottom: 60rpx;
  background-color: #f7f8fa;
  min-height: 100vh;
}

.card-demo-bg {
  /* 给卡片模式加个背景，凸显阴影效果 */
  padding: 20rpx 0;
  // background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
}

.custom-content {
  width: 100%;
  padding: 40rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;

  &.bg-0 {
    background-color: #ffffff;
  }
  &.bg-1 {
    background-color: #ffffff;
  }

  .content-text {
    width: 100%;
    display: flex;
    flex-direction: column;

    .title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 12rpx;
    }
    .desc {
      font-size: 26rpx;
      color: #666;
    }
  }
}
</style>
