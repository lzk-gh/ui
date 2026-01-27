<template>
  <view class="custom-tabbar">
    <view class="tabbar-wrapper">
      <view
        v-for="item in tabs"
        :key="item.name"
        class="tabbar-item"
        :class="{ 'is-active': currentTab === item.name }"
        @click="switchTab(item)"
      >
        <view class="tabbar-item__icon">
          <lk-icon :name="item.icon" size="44" />
        </view>
        <view class="tabbar-item__label">{{ item.label }}</view>
      </view>
    </view>
  </view>
  <!-- 占位元素，避免内容被遮挡 -->
  <view class="tabbar-placeholder" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';

interface TabItem {
  name: string;
  path: string;
  icon: string;
  label: string;
}

const props = defineProps<{
  /** 当前激活的 tab name */
  active: string;
}>();

const tabs: TabItem[] = [
  { name: 'home', path: '/pages/tabbar/home/index', icon: 'house', label: '首页' },
  { name: 'cart', path: '/pages/tabbar/cart/index', icon: 'cart', label: '购物车' },
  { name: 'detail', path: '/pages/tabbar/detail/index', icon: 'list', label: '详情' },
  { name: 'mine', path: '/pages/tabbar/mine/index', icon: 'gear', label: '我的' },
  { name: 'overview', path: '/pages/tabbar/overview/index', icon: 'grid', label: '预览' },
];

/**
 * 根据当前路由判断高亮项
 * 优先使用 props.active，若未传则从 getCurrentPages 获取
 */
const currentTab = computed(() => {
  if (props.active) return props.active;

  // 从 getCurrentPages 获取当前路由
  const pages = getCurrentPages();
  if (pages.length === 0) return 'home';

  const currentPage = pages[pages.length - 1];
  const route = `/${  currentPage.route || ''}`;

  const matchedTab = tabs.find((tab) => route === tab.path);
  return matchedTab?.name || 'home';
});

/**
 * 切换 Tab
 */
function switchTab(item: TabItem) {
  if (item.name === currentTab.value) return;

  uni.switchTab({
    url: item.path,
    fail: (err) => {
      console.error('switchTab 失败:', err);
      // 如果 switchTab 失败，尝试使用 reLaunch
      uni.reLaunch({ url: item.path });
    },
  });
}
</script>

<style lang="scss" scoped>
@import '@/styles/test-page.scss';

$tabbar-height: 120rpx;

.custom-tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 300; // 低于 popup (1000)、modal (1500)、toast (2000)
  background: $test-bg-card;
  border-top: 1px solid $test-border-color;
  padding-bottom: env(safe-area-inset-bottom);
}

.tabbar-wrapper {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: $tabbar-height;
}

.tabbar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
  color: $test-text-tertiary;
  transition: color 0.2s;

  &.is-active {
    color: $test-primary;
  }

  &__icon {
    position: relative;
  }

  &__label {
    font-size: 20rpx;
  }
}

.tabbar-placeholder {
  height: calc(#{$tabbar-height} + env(safe-area-inset-bottom));
  flex-shrink: 0;
}
</style>
