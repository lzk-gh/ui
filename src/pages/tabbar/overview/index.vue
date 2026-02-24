<template>
  <view
    class="page-container"
    :class="[themeClass, { 'page-container--ready': isReady }]"
    :style="brandStyleVars"
  >
    <!-- 顶部导航栏 -->
    <lk-navbar title="组件预览" :show-back="false">
      <template #right>
        <view class="theme-toggle" @click="toggleTheme">
          <lk-icon :name="isDark ? 'sun' : 'moon'" size="28" />
        </view>
      </template>
    </lk-navbar>

    <!-- 页面内容 -->
    <overview-content :content-height="contentHeight" :skip-animation="!isFirstVisit" />

    <!-- 底部 Tabbar -->
    <custom-tabbar active="overview" />
  </view>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, nextTick } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useThemeStore } from '@/stores/theme';
import LkNavbar from '@/uni_modules/lucky-ui/components/lk-navbar/lk-navbar.vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import OverviewContent from './components/overview-content.vue';
import CustomTabbar from '@/components/custom-tabbar.vue';
import { usePageCache } from '@/uni_modules/lucky-ui/core/src/cache';

const themeStore = useThemeStore();

const themeClass = computed(() => themeStore.themeClass);
const brandStyleVars = computed(() => themeStore.brandStyleVars);
const isDark = computed(() => themeStore.isDark);
const toggleTheme = () => themeStore.toggleTheme();
const contentHeight = computed(() => '100%');

// 页面缓存
const { isFirstVisit, markRendered, hasRendered } = usePageCache({
  pageId: 'tabbar-overview',
  debug: true,
});

const isReady = ref(hasRendered.value);

onMounted(() => {
  nextTick(() => {
    isReady.value = true;
    markRendered();
    console.log('[Overview] 页面已渲染，isFirstVisit:', isFirstVisit.value);
  });
});

onShow(() => {
  uni.hideTabBar({ fail: () => {} });
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
  background: $test-primary-soft;
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
