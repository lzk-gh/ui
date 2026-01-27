<template>
  <view class="page-container" :class="themeClass" :style="brandStyleVars">
    <!-- 页面内容 - 个人中心页面自带顶部装饰，不需要 navbar -->
    <mine-content :content-height="contentHeight" />

    <!-- 底部 Tabbar -->
    <custom-tabbar active="mine" />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useThemeStore } from '@/stores/theme';
import MineContent from './components/mine-content.vue';
import CustomTabbar from '@/components/custom-tabbar.vue';

const themeStore = useThemeStore();

const themeClass = computed(() => themeStore.themeClass);
const brandStyleVars = computed(() => themeStore.brandStyleVars);
const contentHeight = computed(() => '100%');

onShow(() => {
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
</style>
