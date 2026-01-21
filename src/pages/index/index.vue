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
    <lk-tabbar v-model="activeTab">
      <lk-tabbar-item name="overview" icon="box" label="组件" />
      <lk-tabbar-item name="discover" icon="grid" label="发现" />
      <lk-tabbar-item name="statistics" icon="box" label="统计" />
      <lk-tabbar-item name="showcase" icon="box" label="工作台" />
      <lk-tabbar-item name="mine" icon="box" label="我的" />
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
import DiscoverPage from './DiscoverPage.vue';
import StatisticsPage from './StatisticsPage.vue';
import MinePage from './MinePage.vue';
import ShowcasePage from './ShowcasePage.vue';

// 主题（themeClass 用于小程序端切换主题）
const { theme, themeClass, toggleTheme } = useTheme();

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
@import '@/styles/test-page.scss';

.app-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: $test-bg-page;
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
