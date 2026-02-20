<template>
  <view
    class="page-container"
    :class="[themeClass, { 'page-container--ready': isReady }]"
    :style="brandStyleVars"
  >
    <!-- 页面内容 - 购物车页面不需要 navbar，自带头部 -->
    <cart-content :content-height="contentHeight" :skip-animation="!isFirstVisit" />

    <!-- 底部 Tabbar -->
    <custom-tabbar active="cart" />
  </view>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, nextTick } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useThemeStore } from '@/stores/theme';
import CartContent from './components/cart-content.vue';
import CustomTabbar from '@/components/custom-tabbar.vue';
import { usePageCache } from '@/uni_modules/lucky-ui/core/src/cache';

const themeStore = useThemeStore();

const themeClass = computed(() => themeStore.themeClass);
const brandStyleVars = computed(() => themeStore.brandStyleVars);
const contentHeight = computed(() => '100%');

// 页面缓存 - 用于判断是否首次访问
const { isFirstVisit, markRendered, hasRendered } = usePageCache({
  pageId: 'tabbar-cart',
  debug: true,
});

// 页面准备就绪状态
const isReady = ref(hasRendered.value);

onMounted(() => {
  nextTick(() => {
    isReady.value = true;
    markRendered();
    console.log('[Cart] 页面已渲染，isFirstVisit:', isFirstVisit.value);
  });
});

onShow(() => {
  uni.hideTabBar();
});
</script>

<style lang="scss" scoped>
@import url('@/styles/test-page.scss');

.page-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: $test-bg-page;
  --tabbar-height: 120rpx;

  // 页面准备就绪前的状态（减少闪烁）
  opacity: 0;
  transition: opacity 0.15s ease-out;

  &--ready {
    opacity: 1;
  }
}
</style>
