<script setup lang="ts">
import { computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useThemeStore } from '@/stores/theme';
import LkTabbarContainer from '@/uni_modules/lucky-ui/components/lk-tabbar-container/lk-tabbar-container.vue';
import type { TabConfig } from '@/uni_modules/lucky-ui/core/src/tabbar-container';

// 同步导入首页（首屏需要立即显示）
import HomeTab from './tabs/home-tab.vue';
// #ifdef MP-WEIXIN
import CartTab from './tabs/cart-tab.vue';
import DetailTab from './tabs/detail-tab.vue';
import MineTab from './tabs/mine-tab.vue';
import OverviewTab from './tabs/overview-tab.vue';
// #endif

const themeStore = useThemeStore();
const themeClass = computed(() => themeStore.themeClass);
const brandStyleVars = computed(() => themeStore.brandStyleVars);

// Tab 配置
const tabConfig: TabConfig[] = [
  {
    id: 'home',
    label: '首页',
    icon: 'house',
    keepAlive: true,
  },
  {
    id: 'cart',
    label: '购物车',
    icon: 'cart',
    keepAlive: true,
    badge: 3,
  },
  {
    id: 'detail',
    label: '详情',
    icon: 'list',
    keepAlive: true,
  },
  {
    id: 'mine',
    label: '我的',
    icon: 'gear',
    keepAlive: true,
  },
  {
    id: 'overview',
    label: '预览',
    icon: 'grid',
    keepAlive: true,
  },
];

// #ifndef MP-WEIXIN
tabConfig[0].component = HomeTab;
tabConfig[1].component = () => import('./tabs/cart-tab.vue');
tabConfig[2].component = () => import('./tabs/detail-tab.vue');
tabConfig[3].component = () => import('./tabs/mine-tab.vue');
tabConfig[4].component = () => import('./tabs/overview-tab.vue');
// #endif

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
}
</style>
