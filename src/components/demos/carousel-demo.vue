<template>
  <view class="component-demo">
    <demo-block title="基础用法（水平，点状指示器）">
      <lk-carousel
        :carouselList="carouselList"
        v-model:current="curBasic"
        indicator-type="dots"
        @click="handleClick"
        @change="onChange"
      />
    </demo-block>

    <demo-block title="指示器样式：条状（bars）">
      <lk-carousel
        :carouselList="carouselList"
        v-model:current="curBars"
        indicator-type="bars"
        @click="handleClick"
        @change="onChange"
      />
    </demo-block>

    <demo-block title="指示器样式：数字（number）">
      <lk-carousel
        :carouselList="carouselList"
        v-model:current="curNumber"
        indicator-type="number"
        @click="handleClick"
        @change="onChange"
      />
    </demo-block>

    <demo-block title="指示器位置：顶部（点状）">
      <lk-carousel
        :carouselList="carouselList"
        v-model:current="curTop"
        indicator-type="dots"
        indicator-position="top"
        @click="handleClick"
        @change="onChange"
      />
    </demo-block>

    <demo-block title="竖向轮播（vertical），右侧条状指示器">
      <lk-carousel
        :carouselList="carouselList"
        v-model:current="curVertical"
        :vertical="true"
        indicator-type="bars"
        @click="handleClick"
        @change="onChange"
      />
    </demo-block>

    <demo-block title="右侧预览下一张（peek）">
      <lk-carousel
        :carouselList="carouselList"
        v-model:current="curPeek"
        :peek="true"
        peek-prev-margin="0"
        peek-next-margin="80rpx"
        indicator-type="dots"
        @click="handleClick"
        @change="onChange"
      />
    </demo-block>

    <demo-block title="卡片样式（更强层次：圆角/阴影/缩放）">
      <lk-carousel
        :carouselList="carouselList"
        v-model:current="curCard"
        :card="true"
        card-prev-margin="40rpx"
        card-next-margin="40rpx"
        :card-scale="0.88"
        card-radius="18rpx"
        card-shadow="0 16rpx 40rpx rgba(0,0,0,0.22)"
        indicator-type="bars"
        indicator-color="rgba(255,255,255,.35)"
        indicator-active-color="#ffffff"
        @click="handleClick"
        @change="onChange"
      />
    </demo-block>

    <demo-block title="指示器（更小并带动画）">
      <lk-carousel
        :carouselList="carouselList"
        v-model:current="curAnimDot"
        indicator-type="dots"
        :indicator-animated="true"
        @click="handleClick"
        @change="onChange"
      />
    </demo-block>

    <demo-block title="指示器外部显示（不覆盖内容）">
      <lk-carousel
        :carouselList="carouselList"
        v-model:current="curOverlay"
        indicator-type="dots"
        :indicator-overlay="false"
        @click="handleClick"
        @change="onChange"
      />
    </demo-block>

    <demo-block title="自适应内容高度（autoHeight，自定义内容）">
      <lk-carousel
        :carouselList="autoContentSlides"
        v-model:current="curAutoHeight"
        :autoHeight="true"
        indicator-type="dots"
        @click="handleClick"
        @change="onChange"
      >
        <template #default="{ index }">
          <!-- 第一页：两行图标文字 -->
          <view v-if="index === 0" class="grid grid-2rows">
            <view class="row">
              <view class="item" v-for="i in 4" :key="'r1-' + i">
                <view class="icon" />
                <text class="label">功能 {{ i }}</text>
              </view>
            </view>
            <view class="row">
              <view class="item" v-for="i in 4" :key="'r2-' + i">
                <view class="icon" />
                <text class="label">功能 {{ i + 4 }}</text>
              </view>
            </view>
          </view>

          <!-- 第二页：一行图标文字 -->
          <view v-else class="grid grid-1row">
            <view class="row">
              <view class="item" v-for="i in 5" :key="'r3-' + i">
                <view class="icon" />
                <text class="label">快捷 {{ i }}</text>
              </view>
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

const carouselList = ref([
  'https://picsum.photos/400/300?random=1',
  'https://picsum.photos/400/300?random=2',
  'https://picsum.photos/400/300?random=3',
]);

// 自定义内容（两页）：用于 autoHeight 演示
const autoContentSlides = ref([{}, {}]);

const curBasic = ref(0);
const curBars = ref(0);
const curNumber = ref(0);
const curTop = ref(0);
const curVertical = ref(0);
const curCard = ref(0);
const curPeek = ref(0);
const curAnimDot = ref(0);
const curOverlay = ref(0);
const curAutoHeight = ref(0);

const handleClick = (item: any, index: number) => {
  console.log('点击了第', index, '项');
};

const onChange = (index: number) => {
  console.log('切换到第', index, '项');
};
</script>

<style scoped lang="scss">
.grid {
  padding: 24rpx;
  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 16rpx;
  }
  .item {
    width: 22%;
    background: #fff;
    border-radius: 16rpx;
    padding: 20rpx 10rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
  }
  .icon {
    width: 72rpx;
    height: 72rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #8ec5fc 0%, #e0c3fc 100%);
    margin-bottom: 12rpx;
  }
  .label {
    font-size: 26rpx;
    color: #333;
  }
}
.grid-2rows {
  padding-bottom: 24rpx;
}
.grid-1row {
  padding-bottom: 12rpx;
}
</style>
