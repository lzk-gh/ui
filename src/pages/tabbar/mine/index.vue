<template>
  <view
    class="page-container"
    :class="[themeClass, { 'page-container--ready': isReady }]"
    :style="brandStyleVars"
  >
    <!-- 页面内容 - 个人中心页面自带顶部装饰，不需要 navbar -->
    <mine-content :content-height="contentHeight" :skip-animation="!isFirstVisit" />

    <!-- 底部 Tabbar -->
    <custom-tabbar active="mine" />
  </view>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, nextTick } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useThemeStore } from '@/stores/theme';
import MineContent from './components/mine-content.vue';
import CustomTabbar from '@/components/custom-tabbar.vue';
import { usePageCache } from '@/uni_modules/lucky-ui/core/src/cache';

const themeStore = useThemeStore();

const themeClass = computed(() => themeStore.themeClass);
const brandStyleVars = computed(() => themeStore.brandStyleVars);
const contentHeight = computed(() => '100%');

// 页面缓存
const { isFirstVisit, markRendered, hasRendered } = usePageCache({
  pageId: 'tabbar-mine',
  debug: true,
});

const isReady = ref(hasRendered.value);

onMounted(() => {
  nextTick(() => {
    isReady.value = true;
    markRendered();
    console.log('[Mine] 页面已渲染，isFirstVisit:', isFirstVisit.value);
  });
});

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

  opacity: 0;
  transition: opacity 0.15s ease-out;

  &--ready {
    opacity: 1;
  }
}
</style>
