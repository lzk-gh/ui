<script setup lang="ts">
import { computed } from 'vue';
import MineContent from './components/mine-content.vue';

defineProps<{
  tabId?: string;
  isActive?: boolean;
}>();

const contentHeight = computed(() => '100%');
</script>

<template>
  <view class="tab-page mine-tab">
    <!-- 页面内容 -->
    <mine-content :content-height="contentHeight" />
  </view>
</template>
<style lang="scss" scoped>
@use '@/styles/test-page.scss' as *;

.tab-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: $test-bg-page;
}
</style>
