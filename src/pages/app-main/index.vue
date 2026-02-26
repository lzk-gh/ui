<script setup lang="ts">
import { computed, ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useThemeStore } from '@/stores/theme';
import LkTabbarContainer from '@/uni_modules/lucky-ui/components/lk-tabbar-container/lk-tabbar-container.vue';
import LkSteps from '@/uni_modules/lucky-ui/components/lk-steps/lk-steps.vue';
import type { TabConfig } from '@/uni_modules/lucky-ui/core/src/tabbar-container';
import type { StepCardItem } from '@/uni_modules/lucky-ui/components/lk-steps/steps.props';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';

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

// ── 欢迎引导页面 ──
const showIntro = ref(true);
const introCurrent = ref(0);
const introItems: StepCardItem[] = [
  {
    title: '探索极简美学',
    subtitle: '全新的交互设计语言',
    description: '每一个像素都经过精心雕琢，流畅的动画效果，带给你前所未有的丝滑交互体验。',
    tag: 'NEW DESIGN',
    bgImage: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop',
  },
  {
    title: '组件驱动设计',
    subtitle: '快速搭建跨端引用',
    description: 'Lucky UI 提供了丰富的原子化组件，让你能够通过简单的堆叠就能构建出复杂的业务应用。',
    tag: 'FLEXIBLE',
    bgImage: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1964&auto=format&fit=crop',
  },
  {
    title: '即刻开始您的旅程',
    subtitle: '开启创作之门',
    description: '现在点击开始，体验 Lucky UI 带来的高效与便捷，让您的想法迅速落地。',
    tag: 'READY TO GO',
    bgImage: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?q=80&w=2070&auto=format&fit=crop',
  },
];

const skipIntro = () => {
  showIntro.value = false;
};

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
    <!-- 欢迎引导全屏覆盖 -->
    <view v-if="showIntro" class="intro-screen">
      <lk-steps
        v-model:current="introCurrent"
        type="story"
        :items="introItems"
        :autoplay="5000"
      />
      <!-- 底部跳过/进入按钮 -->
      <view class="intro-actions">
        <lk-button
          v-if="introCurrent === introItems.length - 1"
          size="lg"
          variant="solid"
          @click="skipIntro"
          style="width: 80%;"
        >
          立即进入应用
        </lk-button>
        <view v-else class="skip-btn" @click="skipIntro">跳过广告</view>
      </view>
    </view>

    <lk-tabbar-container v-else :tabs="tabConfig" default-tab="home" @change="handleTabChange">
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

.intro-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background: var(--lk-bg-container);
  display: flex;
  flex-direction: column;

  :deep(.lk-steps--story) {
    height: 100vh;
    --_story-radius: 0;
    --_story-safe-top: var(--status-bar-height);
  }
}

.intro-actions {
  position: absolute;
  bottom: calc(80rpx + env(safe-area-inset-bottom));
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.skip-btn {
  color: #fff;
  font-size: 24rpx;
  background: rgba(0, 0, 0, 0.4);
  padding: 8rpx 24rpx;
  border-radius: 999rpx;
  backdrop-filter: blur(4px);
  position: fixed;
  top: calc(40rpx + var(--status-bar-height));
  right: 40rpx;
  z-index: 101;
}
</style>
