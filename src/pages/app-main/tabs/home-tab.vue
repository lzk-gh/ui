<template>
  <view class="tab-page home-tab">
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
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useThemeStore } from '@/stores/theme';
import LkNavbar from '@/uni_modules/lucky-ui/components/lk-navbar/lk-navbar.vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import HomeContent from './components/home-content.vue';

defineProps<{
  tabId?: string;
  isActive?: boolean;
}>();

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);
const toggleTheme = () => themeStore.toggleTheme();
const contentHeight = computed(() => '100%');
</script>

<style lang="scss" scoped>
@use '@/styles/test-page.scss' as *;

.tab-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: $test-bg-page;
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
