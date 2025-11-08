<template>
  <view
    class="app-container"
    :class="theme === 'dark' ? 'lk-theme-dark' : 'lk-theme-light'"
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
      <!-- 组件总览 -->
      <home-page v-show="activeTab === 'overview'" :content-height="contentHeight" />

      <!-- 基础组件 -->
      <basic-page v-show="activeTab === 'basic'" :content-height="contentHeight" />

      <!-- 表单组件 -->
      <form-page v-show="activeTab === 'form'" :content-height="contentHeight" />

      <!-- 反馈组件 -->
      <feedback-page v-show="activeTab === 'feedback'" :content-height="contentHeight" />
    </view>

    <!-- 底部 Tabbar -->
    <lk-tabbar v-model="activeTab" type="CONCISE">
      <lk-tabbar-item name="组件总览" icon="grid" value="overview" />
      <lk-tabbar-item name="基础组件" icon="box" value="basic" />
      <lk-tabbar-item name="表单组件" icon="box" value="form" />
      <lk-tabbar-item name="反馈组件" icon="chat" value="feedback" />
    </lk-tabbar>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useTheme } from '@/uni_modules/lucky-ui/theme';

// 组件导入
import LkNavbar from '@/uni_modules/lucky-ui/components/lk-navbar/lk-navbar.vue';
import LkTabbar from '@/uni_modules/lucky-ui/components/lk-tabbar/lk-tabbar.vue';
import LkTabbarItem from '@/uni_modules/lucky-ui/components/lk-tabbar/lk-tabbar-item.vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';

// 子页面组件
import HomePage from './OverviewPage.vue';
import BasicPage from './BasicPage.vue';
import FormPage from './FormPage.vue';
import FeedbackPage from './FeedbackPage.vue';

// 主题
const { theme, toggleTheme } = useTheme();

// 当前激活的标签页
const activeTab = ref<string>('overview');

// 计算页面标题
const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    overview: 'Lucky UI - 组件总览',
    basic: '基础组件',
    form: '表单组件',
    feedback: '反馈组件',
  };
  return titles[activeTab.value] || 'Lucky UI';
});

// 计算内容区域高度
const contentHeight = computed(() => {
  // navbar 高度约 88rpx + 状态栏, tabbar 高度约 100rpx + 安全区
  // 这里简化处理,实际可通过 uni.getSystemInfo 获取精确值
  return 'calc(100vh - 188rpx)';
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
