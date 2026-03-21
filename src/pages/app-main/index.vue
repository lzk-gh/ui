<script setup lang="ts">
import { computed, markRaw } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useThemeStore } from '@/stores/theme';
import LkTabbarContainer from '@/uni_modules/lucky-ui/components/lk-tabbar-container/lk-tabbar-container.vue';
import type { TabConfig } from '@/uni_modules/lucky-ui/core/src/tabbar-container';

// 同步导入首页（首屏需要立即显示）
import HomeTab from './tabs/home-tab.vue';
// 非 H5 平台不支持动态 import()（App 使用 iife 格式不兼容代码分包），统一静态导入
import CartTab from './tabs/cart-tab.vue';
import DetailTab from './tabs/detail-tab.vue';
import MineTab from './tabs/mine-tab.vue';
import OverviewTab from './tabs/overview-tab.vue';

const themeStore = useThemeStore();
const themeClass = computed(() => themeStore.themeClass);
const brandStyleVars = computed(() => themeStore.brandStyleVars);

// Tab 配置
const tabConfig: TabConfig[] = [
  {
    id: 'home',
    label: '首页',
    icon: 'house',
    activeIconFill: true,
    keepAlive: true,
  },
  {
    id: 'cart',
    label: '购物车',
    icon: 'cart',
    activeIconFill: true,
    keepAlive: true,
    badge: 3,
  },
  {
    id: 'detail',
    label: '详情',
    icon: 'list',
    activeIconFill: false,
    keepAlive: true,
  },
  {
    id: 'mine',
    label: '我的',
    icon: 'gear',
    activeIconFill: true,
    keepAlive: true,
  },
  {
    id: 'overview',
    label: '预览',
    icon: 'grid',
    activeIconFill: true,
    keepAlive: true,
  },
];

// 所有平台统一使用静态导入，避免 App 端 iife 格式不兼容 code-splitting
tabConfig[0].component = markRaw(HomeTab);
tabConfig[1].component = markRaw(CartTab);
tabConfig[2].component = markRaw(DetailTab);
tabConfig[3].component = markRaw(MineTab);
tabConfig[4].component = markRaw(OverviewTab);

const handleTabChange = (tabId: string) => {
  console.log('[App] Tab changed to:', tabId);
};

onShow(() => {
  // 隐藏原生 tabbar
  uni.hideTabBar({ animation: false, fail: () => {} });
});
</script>

<template>
  <view class="app-main" :class="themeClass" :style="brandStyleVars">
    <lk-tabbar-container :tabs="tabConfig" default-tab="home" @change="handleTabChange">
      <!-- #ifdef MP-WEIXIN -->
      <template #tab-home>
        <home-tab />
      </template>
      <template #tab-cart>
        <cart-tab />
      </template>
      <template #tab-detail>
        <detail-tab />
      </template>
      <template #tab-mine>
        <mine-tab />
      </template>
      <template #tab-overview>
        <overview-tab />
      </template>
      <!-- #endif -->
    </lk-tabbar-container>
  </view>
</template>

<style lang="scss" scoped>
.app-main {
  width: 100%;
  height: 100vh;
  position: relative;
}
</style>
