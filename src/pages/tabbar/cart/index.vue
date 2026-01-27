<template>
  <view class="page-container" :class="themeClass" :style="brandStyleVars">
    <!-- 页面内容 - 购物车页面不需要 navbar，自带头部 -->
    <cart-content :content-height="contentHeight" />

    <!-- 底部 Tabbar -->
    <custom-tabbar active="cart" />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useThemeStore } from '@/stores/theme';
import CartContent from './components/cart-content.vue';
import CustomTabbar from '@/components/custom-tabbar.vue';

const themeStore = useThemeStore();

const themeClass = computed(() => themeStore.themeClass);
const brandStyleVars = computed(() => themeStore.brandStyleVars);
const contentHeight = computed(() => '100%');

onShow(() => {
  uni.hideTabBar();
});
</script>

<style lang="scss" scoped>
@import '@/styles/test-page.scss';

.page-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: $test-bg-page;
  --tabbar-height: 120rpx;
}
</style>
