<template>
  <view
    class="app-container"
    :class="theme === 'dark' ? 'lk-theme-dark' : 'lk-theme-light'"
    :style="themeStyleVars"
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

      <!-- 发现 -->
      <discover-page v-else-if="activeTab === 'discover'" :content-height="contentHeight" />

      <!-- 统计 -->
      <statistics-page v-else-if="activeTab === 'statistics'" :content-height="contentHeight" />

      <!-- 我的 -->
      <mine-page v-else-if="activeTab === 'mine'" :content-height="contentHeight" />

      <!-- 工作台 -->
      <showcase-page v-else-if="activeTab === 'showcase'" :content-height="contentHeight" />
    </view>

    <!-- 底部 Tabbar -->
    <lk-tabbar v-model="activeTab" type="CONCISE">
      <lk-tabbar-item name="组件" icon="box" value="overview" />
      <lk-tabbar-item name="发现" icon="grid" value="discover" />
      <lk-tabbar-item name="统计" icon="box" value="statistics" />
      <lk-tabbar-item name="工作台" icon="box" value="showcase" />
      <lk-tabbar-item name="我的" icon="box" value="mine" />
    </lk-tabbar>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch, provide } from 'vue';
import { useTheme } from '@/uni_modules/lucky-ui/theme';

// 组件导入
import LkNavbar from '@/uni_modules/lucky-ui/components/lk-navbar/lk-navbar.vue';
import LkTabbar from '@/uni_modules/lucky-ui/components/lk-tabbar/lk-tabbar.vue';
import LkTabbarItem from '@/uni_modules/lucky-ui/components/lk-tabbar/lk-tabbar-item.vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';

// 子页面组件
import OverviewPage from './OverviewPage.vue';
import DiscoverPage from './DiscoverPage.vue';
import StatisticsPage from './StatisticsPage.vue';
import MinePage from './MinePage.vue';
import ShowcasePage from './ShowcasePage.vue';

// 主题
const { theme, toggleTheme } = useTheme();

const themeStyleVars = ref('');
provide('updateThemeStyleVars', (styleText: string) => {
  themeStyleVars.value = styleText;
});

// 当前激活的标签页
const activeTab = ref<string>('overview');

// 计算页面标题
const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    overview: '组件预览',
    discover: '发现',
    statistics: '统计',
      showcase: '工作台',
    mine: '我的',
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
</script>

<style scoped lang="scss">
.app-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--lk-color-bg-page);
  padding: 20rpx 20rpx 0;
}

.pages-container {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  height: 64rpx;
  background: var(--lk-color-primary-bg-soft);
  color: var(--lk-color-primary);
  border-radius: 50%;
  transition: all 0.3s;

  &:active {
    background: var(--lk-color-primary);
    color: #fff;
    transform: scale(0.9);
  }
}
</style>
