<template>
  <view class="lk-tabbar-container" :class="containerClass" :style="containerStyle">
    <!-- Tab 内容区域 -->
    <view class="lk-tabbar-container__content">
      <!-- 使用 v-show 保持组件状态，避免重新渲染 -->
      <template v-for="tab in tabs" :key="tab.id">
        <view
          v-if="isVisited(tab.id) || tab.id === activeId"
          v-show="tab.id === activeId"
          class="lk-tabbar-container__panel"
        >
          <!-- 加载中状态 -->
          <view v-if="getTabInstance(tab.id)?.loading" class="lk-tabbar-container__loading">
            <lk-loading type="spinner" size="64" />
            <text class="loading-text">加载中...</text>
          </view>

          <!-- 加载错误状态 -->
          <view v-else-if="getTabInstance(tab.id)?.error" class="lk-tabbar-container__error">
            <lk-icon name="exclamation-circle" size="80" />
            <text class="error-text">加载失败</text>
            <view class="error-retry" @click="retryLoad(tab.id)">点击重试</view>
          </view>

          <!-- Tab 内容组件 -->
          <!-- #ifndef MP-WEIXIN -->
          <component
            :is="getTabInstance(tab.id)!.component"
            v-else-if="getTabInstance(tab.id)?.component"
            :tab-id="tab.id"
            :is-active="tab.id === activeId"
          />
          <!-- #endif -->

          <!-- #ifdef MP-WEIXIN -->
          <view v-else class="lk-tabbar-container__slot">
            <slot :name="`tab-${tab.id}`" :tab-id="tab.id" :is-active="tab.id === activeId" />
          </view>
          <!-- #endif -->
        </view>
      </template>
    </view>

    <!-- 底部 Tabbar -->
    <view class="lk-tabbar-container__tabbar">
      <view class="tabbar-wrapper">
        <view
          v-for="tab in tabs"
          :key="tab.id"
          class="tabbar-item"
          :class="{ 'is-active': tab.id === activeId }"
          @click="handleTabClick(tab)"
        >
          <view class="tabbar-item__icon">
            <lk-icon :name="tab.icon" size="44" />
            <!-- 徽标 -->
            <view v-if="tab.badge && tab.badge > 0" class="tabbar-item__badge">
              {{ tab.badge > 99 ? '99+' : tab.badge }}
            </view>
            <!-- 小红点 -->
            <view v-else-if="tab.dot" class="tabbar-item__dot" />
          </view>
          <view class="tabbar-item__label">{{ tab.label }}</view>
        </view>
      </view>
    </view>

    <!-- 底部安全区占位 -->
    <view class="lk-tabbar-container__placeholder" />
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import LkLoading from '../lk-loading/lk-loading.vue';
import LkIcon from '../lk-icon/lk-icon.vue';
import {
  useTabbarContainer,
  initTabbarContainer,
  setTabbarDebug,
  type TabConfig,
} from '../../core/src/tabbar-container';

const props = withDefaults(defineProps<{
  /** Tab 配置 */
  tabs: TabConfig[];
  /** 默认激活的 Tab ID */
  defaultTab?: string;
  /** 是否开启调试模式 */
  debug?: boolean;
  /** 自定义类名 */
  customClass?: string;
  /** 自定义样式 */
  customStyle?: string | Record<string, string>;
  /** 预加载延迟（毫秒） */
  preloadDelay?: number;
  /** 是否预加载所有 Tab */
  preloadAll?: boolean;
}>(), {
  defaultTab: '',
  debug: false,
  customClass: '',
  customStyle: '',
  preloadDelay: 2000,
  preloadAll: true,
});

const emit = defineEmits<{
  (e: 'change', tabId: string): void;
  (e: 'beforeChange', tabId: string, oldTabId: string): void;
}>();

const {
  activeId,
  tabs,
  switchTab,
  preloadTabs,
  getTabInstance,
  isVisited,
} = useTabbarContainer();

const containerClass = computed(() => [
  'lk-tabbar-container',
  props.customClass,
]);

const containerStyle = computed(() => {
  if (typeof props.customStyle === 'string') {
    return props.customStyle;
  }
  return Object.entries(props.customStyle)
    .map(([k, v]) => `${k}: ${v}`)
    .join('; ');
});

// 处理 Tab 点击
const handleTabClick = async (tab: TabConfig) => {
  if (tab.id === activeId.value) return;

  const oldTabId = activeId.value;
  emit('beforeChange', tab.id, oldTabId);

  await switchTab(tab.id);
  emit('change', tab.id);
};

// 重试加载
const retryLoad = async (tabId: string) => {
  const instance = getTabInstance(tabId);
  if (instance) {
    instance.loaded = false;
    instance.error = null;
  }
  await switchTab(tabId);
};

// 初始化
onMounted(() => {
  if (props.debug) {
    setTabbarDebug(true);
  }

  // 初始化容器
  initTabbarContainer(props.tabs, props.defaultTab || props.tabs[0]?.id);

  // 预加载其他 Tab
  if (props.preloadAll) {
    setTimeout(() => {
      const otherTabs = props.tabs
        .filter((t) => t.id !== activeId.value)
        .map((t) => t.id);
      preloadTabs(otherTabs);
    }, props.preloadDelay);
  }
});

// 监听 tabs 变化
watch(() => props.tabs, (newTabs) => {
  initTabbarContainer(newTabs, activeId.value || props.defaultTab);
}, { deep: true });
</script>

<style lang="scss" scoped>
@use '@/styles/test-page.scss' as *;

$tabbar-height: 120rpx;

.lk-tabbar-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: $test-bg-page;
  overflow: hidden;

  &__content {
    flex: 1;
    overflow: hidden;
    position: relative;
  }

  &__panel {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  &__loading,
  &__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: $test-text-secondary;
  }

  &__slot {
    width: 100%;
    height: 100%;
  }

  &__loading {
    .loading-text {
      margin-top: 24rpx;
      font-size: 28rpx;
    }
  }

  &__error {
    .error-text {
      margin-top: 24rpx;
      font-size: 28rpx;
    }

    .error-retry {
      margin-top: 32rpx;
      padding: 16rpx 48rpx;
      font-size: 28rpx;
      color: $test-primary;
      border: 1px solid $test-primary;
      border-radius: 40rpx;

      &:active {
        background: rgba($test-primary, 0.1);
      }
    }
  }

  &__tabbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 300;
    background: $test-bg-card;
    border-top: 1px solid $test-border-color;
  }

  &__placeholder {
    height: calc(#{$tabbar-height} + env(safe-area-inset-bottom));
    flex-shrink: 0;
  }
}

.tabbar-wrapper {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: $tabbar-height;
  padding-bottom: env(safe-area-inset-bottom);
}

.tabbar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  min-width: 0; // 防止 flex 子元素溢出
  color: $test-text-secondary;
  transition: color 0.15s ease-out;
  // 防止点击时闪烁
  -webkit-tap-highlight-color: transparent;
  user-select: none;

  &.is-active {
    color: $test-primary;
  }

  &__icon {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48rpx;
    height: 48rpx;
    flex-shrink: 0;
    // 防止图标切换时跳动
    transform: translateZ(0);
  }

  &__badge {
    position: absolute;
    top: -8rpx;
    right: -20rpx;
    min-width: 32rpx;
    height: 32rpx;
    padding: 0 8rpx;
    font-size: 20rpx;
    line-height: 32rpx;
    text-align: center;
    color: #fff;
    background: #f56c6c;
    border-radius: 16rpx;
  }

  &__dot {
    position: absolute;
    top: 0;
    right: -4rpx;
    width: 16rpx;
    height: 16rpx;
    background: #f56c6c;
    border-radius: 50%;
  }

  &__label {
    margin-top: 4rpx;
    font-size: 22rpx;
    line-height: 28rpx; // 固定行高防止跳动
    height: 28rpx; // 固定高度
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>
