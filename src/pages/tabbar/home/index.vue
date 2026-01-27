<template>
  <view class="page-container" :class="themeClass" :style="brandStyleVars">
    <!-- 顶部导航栏 -->
    <lk-navbar title="发现" :show-back="false">
      <template #right>
        <view class="theme-toggle" @click="toggleTheme">
          <lk-icon :name="isDark ? 'sun' : 'moon'" size="28" />
        </view>
      </template>
    </lk-navbar>

    <!-- 页面内容 -->
    <home-content :content-height="contentHeight" />

    <!-- 底部 Tabbar -->
    <custom-tabbar active="home" />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useThemeStore } from '@/stores/theme';
import LkNavbar from '@/uni_modules/lucky-ui/components/lk-navbar/lk-navbar.vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import HomeContent from './components/home-content.vue';
import CustomTabbar from '@/components/custom-tabbar.vue';

const themeStore = useThemeStore();

const themeClass = computed(() => themeStore.themeClass);
const brandStyleVars = computed(() => themeStore.brandStyleVars);
const isDark = computed(() => themeStore.isDark);
const toggleTheme = () => themeStore.toggleTheme();

// 内容区高度（扣除 navbar + tabbar）
const contentHeight = computed(() => '100%');

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
