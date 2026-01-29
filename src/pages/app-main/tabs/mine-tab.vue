<template>
  <view class="tab-page mine-tab">
    <!-- 页面内容 -->
    <mine-content :content-height="contentHeight" />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MineContent from '@/pages/tabbar/mine/components/mine-content.vue';

defineProps<{
  tabId?: string;
  isActive?: boolean;
}>();

const contentHeight = computed(() => '100%');
</script>

<style lang="scss" scoped>
@import '@/styles/test-page.scss';

.tab-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: $test-bg-page;
}
</style>
