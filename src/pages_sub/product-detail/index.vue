<template>
  <view class="page-container" :class="themeClass" :style="brandStyleVars">
    <lk-navbar title="商品详情" @back="goBack" />

    <scroll-view scroll-y class="product-detail-page">
      <!-- 商品图片 -->
      <view class="product-image">
        <lk-image src="https://picsum.photos/800/800?random=product" width="100%" height="600rpx" fit="cover" />
      </view>

      <!-- 商品信息 -->
      <view class="product-info">
        <text class="product-title">高品质时尚连衣裙</text>
        <view class="price-row">
          <text class="current-price">¥299</text>
          <text class="original-price">¥599</text>
        </view>
        <text class="product-desc">这是一款高品质的时尚连衣裙，采用优质面料制作，舒适透气，适合各种场合穿着。</text>
      </view>

      <!-- 操作按钮 -->
      <view class="action-bar">
        <lk-button type="default" radius="40">加入购物车</lk-button>
        <lk-button type="primary" radius="40">立即购买</lk-button>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useThemeStore } from '@/stores/theme';
import LkNavbar from '@/uni_modules/lucky-ui/components/lk-navbar/lk-navbar.vue';
import LkImage from '@/uni_modules/lucky-ui/components/lk-image/lk-image.vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';

const themeStore = useThemeStore();
const themeClass = computed(() => themeStore.themeClass);
const brandStyleVars = computed(() => themeStore.brandStyleVars);

const goBack = () => {
  uni.navigateBack();
};
</script>

<style lang="scss" scoped>
@import '@/styles/test-page.scss';

.page-container {
  width: 100%;
  min-height: 100vh;
  background: $test-bg-page;
  display: flex;
  flex-direction: column;
}

.product-detail-page {
  flex: 1;
}

.product-image {
  width: 100%;
}

.product-info {
  padding: 30rpx;

  .product-title {
    font-size: 36rpx;
    font-weight: bold;
    color: $test-text-primary;
    display: block;
    margin-bottom: 16rpx;
  }

  .price-row {
    margin-bottom: 24rpx;

    .current-price {
      font-size: 40rpx;
      font-weight: bold;
      color: #f5222d;
    }

    .original-price {
      font-size: 26rpx;
      color: $test-text-tertiary;
      text-decoration: line-through;
      margin-left: 16rpx;
    }
  }

  .product-desc {
    font-size: 28rpx;
    color: $test-text-secondary;
    line-height: 1.6;
  }
}

.action-bar {
  display: flex;
  gap: 24rpx;
  padding: 30rpx;
  background: $test-bg-card;
  border-top: 1px solid $test-border-color;
}
</style>
