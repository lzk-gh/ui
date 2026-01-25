<template>
  <view
    class="app-container"
    :class="themeClass"
    :style="brandStyleVars"
  >
    <!-- 顶部导航栏 -->
    <lk-navbar :title="pageTitle" :show-back="false">
      <template #right>
        <view class="theme-toggle" @click="toggleTheme">
          <lk-icon :name="theme === 'dark' ? 'sun' : 'moon'" size="28" />
        </view>
      </template>
    </lk-navbar>

    <!-- 子页面容器 -->
      <view class="pages-container">
        <!-- 组件预览（保留之前第一页面） -->
        <overview-page v-if="activeTab === 'overview'" :content-height="contentHeight" />

        <!-- 发现/首页 -->
        <home-page v-else-if="activeTab === 'home'" :content-height="contentHeight" />

        <!-- 购物车/结算 -->
        <cart-page v-else-if="activeTab === 'cart'" :content-height="contentHeight" />

        <!-- 详情 -->
        <detail-page v-else-if="activeTab === 'detail'" :content-height="contentHeight" />

        <!-- 搜索页 -->
        <search-page v-else-if="activeTab === 'search'" :content-height="contentHeight" />

        <!-- 我的 -->
        <mine-page v-else-if="activeTab === 'mine'" :content-height="contentHeight" />

        <!-- 认证页 (登录/注册) -->
        <auth-page v-else-if="activeTab === 'auth'" :content-height="contentHeight" />

        <!-- 编辑个人信息 -->
        <edit-profile-page v-else-if="activeTab === 'edit-profile'" :content-height="contentHeight" />

        <!-- 数据分析 -->
        <analytics-page v-else-if="activeTab === 'analytics'" :content-height="contentHeight" />

        <!-- 福利打卡 -->
        <check-in-page v-else-if="activeTab === 'check-in'" :content-height="contentHeight" />
      </view>

    <!-- 底部 Tabbar -->
    <lk-tabbar
      v-model="activeTab"
      background-color="var(--test-bg-card)"
      active-color="var(--test-text-primary)"
      inactive-color="var(--test-text-tertiary)"
    >
      <lk-tabbar-item name="home" icon="house" label="首页" />
      <lk-tabbar-item name="cart" icon="cart" label="购物车" />
      <lk-tabbar-item name="detail" icon="list" label="详情" />
      <lk-tabbar-item name="mine" icon="gear" label="我的" />
      <lk-tabbar-item name="overview" icon="grid" label="预览" />
    </lk-tabbar>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch, provide, onMounted } from 'vue';
import {
  useTheme,
  loadBrandColor,
  generateBrandVars,
  applyBrandColor,
} from '@/uni_modules/lucky-ui/theme';

// 组件导入
import LkNavbar from '@/uni_modules/lucky-ui/components/lk-navbar/lk-navbar.vue';
import LkTabbar from '@/uni_modules/lucky-ui/components/lk-tabbar/lk-tabbar.vue';
import LkTabbarItem from '@/uni_modules/lucky-ui/components/lk-tabbar/lk-tabbar-item.vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';

// 子页面组件
import OverviewPage from './OverviewPage.vue';
import HomePage from './HomePage.vue';
import CartPage from './CartPage.vue';
import MinePage from './MinePage.vue';
import DetailPage from './DetailPage.vue';
import SearchPage from './SearchPage.vue';
import AuthPage from './AuthPage.vue';
import EditProfilePage from './EditProfilePage.vue';
import AnalyticsPage from './AnalyticsPage.vue';
import CheckInPage from './CheckInPage.vue';

// 主题（themeClass 用于小程序端切换主题）
const { theme, themeClass, toggleTheme } = useTheme();

// 提供给子组件主题状态
provide('theme', theme);
provide('themeClass', themeClass);
provide('toggleTheme', toggleTheme);

// 品牌色样式变量
const brandStyleVars = ref('');

// 序列化 CSS 变量为内联样式
const serializeVars = (vars: Record<string, string>) =>
  Object.entries(vars).map(([k, v]) => `${k}: ${v}`).join('; ');

// 提供给子组件更新品牌色的方法
provide('updateBrandColor', (color: string) => {
  applyBrandColor(color);
  brandStyleVars.value = serializeVars(generateBrandVars(color));
});

// 初始化时恢复保存的品牌色
onMounted(() => {
  const savedColor = loadBrandColor();
  if (savedColor) {
    applyBrandColor(savedColor);
    brandStyleVars.value = serializeVars(generateBrandVars(savedColor));
  }
});

// 当前激活的标签页
const activeTab = ref<string>('home');
provide('activeTab', activeTab);

const tabbarTabs = ['home', 'cart', 'detail', 'mine', 'overview'];
const isTabSwitching = ref(false);
let tabSwitchTimer: number | undefined;

// 计算页面标题
const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    overview: '组件预览',
    home: '发现',
    cart: '购物车',
    detail: '详情',
    mine: '个人中心',
  };
  return titles[activeTab.value] || 'Lucky UI';
});

// 计算内容区域高度
const contentHeight = computed(() => {
  // 子页面容器 pages-container 已通过 flex 自动扣除 navbar/tabbar，
  // 这里直接让各页 scroll-view 填满容器，避免小程序被底部遮挡。
  return '100%';
});

// FAB 按钮点击事件 - 组件搜索
const handleFabClick = () => {
  uni.showToast({
    title: '组件搜索功能开发中...',
    icon: 'none',
    duration: 1500,
  });
};

// 监听标签页切换
watch(activeTab, newTab => {
  console.log('切换到标签页:', newTab);
});

watch(activeTab, (newTab, oldTab) => {
  const shouldSkeleton = tabbarTabs.includes(newTab) && tabbarTabs.includes(oldTab || '');
  if (!shouldSkeleton) {
    isTabSwitching.value = false;
    return;
  }
  isTabSwitching.value = true;
  if (tabSwitchTimer) clearTimeout(tabSwitchTimer);
  tabSwitchTimer = setTimeout(() => {
    isTabSwitching.value = false;
  }, 1600);
});
</script>

<style scoped lang="scss">
@import '@/styles/test-page.scss';

.app-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: $test-bg-page;
  padding: 0;
  --tabbar-height: 120rpx;
}

.pages-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
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
