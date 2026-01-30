<template>
  <view
    class="page-container"
    :class="[themeClass, { 'page-container--ready': isReady }]"
    :style="brandStyleVars"
  >
    <!-- 顶部导航栏 -->
    <lk-navbar title="发现" :show-back="false">
      <template #right>
        <view class="theme-toggle" @click="toggleTheme">
          <lk-icon :name="isDark ? 'sun' : 'moon'" size="28" />
        </view>
      </template>
    </lk-navbar>

    <!-- 页面内容 -->
    <home-content :content-height="contentHeight" :skip-animation="!isFirstVisit" />

    <!-- 底部 Tabbar -->
    <custom-tabbar active="home" />
  </view>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, nextTick } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useThemeStore } from '@/stores/theme';
import LkNavbar from '@/uni_modules/lucky-ui/components/lk-navbar/lk-navbar.vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import HomeContent from './components/home-content.vue';
import CustomTabbar from '@/components/custom-tabbar.vue';
import { usePageCache } from '@/uni_modules/lucky-ui/core/src/cache';

const themeStore = useThemeStore();

const themeClass = computed(() => themeStore.themeClass);
const brandStyleVars = computed(() => themeStore.brandStyleVars);
const isDark = computed(() => themeStore.isDark);
const toggleTheme = () => themeStore.toggleTheme();

// 内容区高度（扣除 navbar + tabbar）
const contentHeight = computed(() => '100%');

// 页面缓存 - 用于判断是否首次访问，减少动画闪烁
const { isFirstVisit, markRendered, hasRendered } = usePageCache({
  pageId: 'tabbar-home',
  debug: true,
});

// 页面准备就绪状态
const isReady = ref(hasRendered.value);

onMounted(() => {
  // 页面挂载后立即标记为准备就绪
  nextTick(() => {
    isReady.value = true;
    markRendered();
    console.log('[Home] 页面已渲染，isFirstVisit:', isFirstVisit.value);
  });
});

onShow(() => {
  // 隐藏原生 tabbar
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

  // 页面准备就绪前的状态（减少闪烁）
  opacity: 0;
  transition: opacity 0.15s ease-out;

  &--ready {
    opacity: 1;
  }
}

.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  height: 64rpx;
  background: rgba($test-primary, 0.1);
  color: $test-primary;
  border-radius: 50%;
  transition: all 0.3s;

  &:active {
    background: $test-primary;
    color: $test-text-inverse;
    transform: scale(0.9);
  }
}
</style>
