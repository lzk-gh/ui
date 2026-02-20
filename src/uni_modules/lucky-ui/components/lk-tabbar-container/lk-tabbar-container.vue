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
        <!-- 激活项背景 (滑动指示器类模式) -->
        <view
          v-if="['block', 'marker-top', 'marker-bottom', 'dot-slide'].includes(activeMode)"
          class="tabbar-active-bg"
          :class="[`is-${activeMode}`]"
          :style="activeBgStyle"
        />

        <view
          v-for="tab in tabs"
          :key="tab.id"
          class="tabbar-item"
          :class="{ 'is-active': tab.id === activeId }"
          @click="handleTabClick(tab)"
        >
          <!-- 手电筒模式下的照亮效果 -->
          <view v-if="activeMode === 'flashlight'" class="tabbar-item__flashlight" />

          <!-- 气泡模式下的背景 -->
          <view v-if="activeMode === 'bubble'" class="tabbar-item__bubble" />

          <!-- 遮罩填充背景 -->
          <view v-if="activeMode === 'mask-fill'" class="tabbar-item__mask-fill" />

          <view class="tabbar-item__icon-wrapper">
            <view class="tabbar-item__icon">
              <lk-icon :name="tab.icon" size="44" />
              <!-- 徽标 -->
              <view v-if="tab.badge && tab.badge > 0" class="tabbar-item__badge">
                {{ tab.badge > 99 ? '99+' : tab.badge }}
              </view>
              <!-- 小红点 -->
              <view v-else-if="tab.dot" class="tabbar-item__dot" />
            </view>
            <!-- 涟漪效果点缀 -->
            <view v-if="activeMode === 'ripple'" class="tabbar-item__ripple" />
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
import { useThemeStore } from '@/stores/theme';
import LkLoading from '../lk-loading/lk-loading.vue';
import LkIcon from '../lk-icon/lk-icon.vue';
import {
  useTabbarContainer,
  initTabbarContainer,
  setTabbarDebug,
  type TabConfig,
} from '../../core/src/tabbar-container';

const themeStore = useThemeStore();

const props = withDefaults(
  defineProps<{
    /** Tab 配置 */
    tabs: TabConfig[];
    /** 默认激活的 Tab ID */
    defaultTab?: string;
    /** 是否开启调试模式 */
    debug?: boolean;
    /** Tabbar 模式 */
    mode?:
      | 'plain'
      | 'block'
      | 'flashlight'
      | 'float'
      | 'marker-top'
      | 'marker-bottom'
      | 'dot-slide'
      | 'bubble'
      | 'ripple'
      | 'mask-fill'
      | 'text-raise';
    /** 自定义类名 */
    customClass?: string;
    /** 自定义样式 */
    customStyle?: string | Record<string, string>;
    /** 预加载延迟（毫秒） */
    preloadDelay?: number;
    /** 是否预加载所有 Tab */
    preloadAll?: boolean;
  }>(),
  {
    defaultTab: '',
    debug: false,
    mode: undefined,
    customClass: '',
    customStyle: '',
    preloadDelay: 2000,
    preloadAll: true,
  }
);

const emit = defineEmits<{
  (e: 'change', tabId: string): void;
  (e: 'beforeChange', tabId: string, oldTabId: string): void;
}>();

const { activeId, switchTab, preloadTabs, getTabInstance, isVisited } = useTabbarContainer();

const activeMode = computed(() => props.mode || themeStore.tabbarMode);

const containerClass = computed(() => [
  'lk-tabbar-container',
  `lk-tabbar-container--${activeMode.value}`,
  props.customClass,
]);

const containerStyle = computed(() => {
  if (typeof props.customStyle === 'string') {
    return props.customStyle;
  }
  return Object.entries(props.customStyle || {})
    .map(([k, v]) => `${k}: ${v}`)
    .join('; ');
});

const activeIndex = computed(() => {
  return props.tabs.findIndex(tab => tab.id === activeId.value);
});

const activeBgStyle = computed(() => {
  const count = props.tabs.length;
  if (count === 0 || activeIndex.value === -1) return { display: 'none' };

  const width = 100 / count;
  const left = activeIndex.value * width;

  return {
    '--item-width': `${width}%`,
    '--item-left': `${left}%`,
    '--item-count': count,
    '--active-index': activeIndex.value,
    '--active-center': `${left + width / 2}%`,
  };
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
      const otherTabs = props.tabs.filter(t => t.id !== activeId.value).map(t => t.id);
      preloadTabs(otherTabs);
    }, props.preloadDelay);
  }
});

// 监听 tabs 变化
watch(
  () => props.tabs,
  newTabs => {
    initTabbarContainer(newTabs, activeId.value || props.defaultTab);
  },
  { deep: true }
);
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
        background: $test-primary-soft;
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
    padding-bottom: env(safe-area-inset-bottom);
    overflow: visible;
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
  position: relative;
}

.tabbar-active-bg {
  position: absolute;
  top: 0;
  bottom: 0;
  width: var(--item-width);
  left: var(--item-left);
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 0;

  &.is-block {
    top: 15rpx;
    bottom: 15rpx;
    background: $test-primary;
    border-radius: 40rpx;
    margin: 0 12rpx;
    width: calc(var(--item-width) - 24rpx);
    left: calc(var(--item-left) + 12rpx);
    box-shadow: 0 8rpx 20rpx rgba(var(--test-primary-rgb), 0.3);
    opacity: 0.85; // Lighten it slightly as requested
  }

  &.is-marker-top {
    height: 6rpx;
    background: $test-primary;
    border-radius: 0 0 6rpx 6rpx;
    box-shadow: 0 4rpx 15rpx rgba(var(--test-primary-rgb), 0.6);
  }

  &.is-marker-bottom {
    top: auto;
    bottom: 0;
    height: 8rpx;
    background: $test-primary;
    border-radius: 8rpx 8rpx 0 0;
    box-shadow: 0 -4rpx 15rpx rgba(var(--test-primary-rgb), 0.6);
  }

  &.is-dot-slide {
    top: auto;
    bottom: 12rpx;
    height: 12rpx;
    width: 12rpx;
    background: $test-primary;
    border-radius: 50%;
    left: var(--active-center);
    transform: translateX(-50%);
    box-shadow: 0 0 15rpx $test-primary;
  }
}

.tabbar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: $tabbar-height;
  min-width: 0;
  color: $test-text-secondary;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  position: relative;
  z-index: 1;

  &__flashlight {
    position: absolute;
    bottom: -20rpx;
    left: 50%;
    transform: translateX(-50%) scale(0);
    width: 200rpx;
    height: 120rpx;
    background: radial-gradient(
      ellipse at bottom,
      rgba(var(--test-primary-rgb), 0.5) 0%,
      rgba(var(--test-primary-rgb), 0.2) 40%,
      transparent 70%
    );
    filter: blur(8rpx);
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    opacity: 0;
    z-index: -1;
    pointer-events: none;
  }

  &__bubble {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 120rpx;
    height: 120rpx;
    background: $test-primary-soft;
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    z-index: -1;
  }

  &__mask-fill {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 0;
    background: linear-gradient(to top, rgba(var(--test-primary-rgb), 0.2), transparent);
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    z-index: -1;
  }

  &__ripple {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60rpx;
    height: 60rpx;
    border: 3rpx solid $test-primary;
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
    pointer-events: none;
  }

  &__icon-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  &.is-active {
    color: var(--test-primary);

    // Common Icon Animations
    .tabbar-item__icon {
      transform: translateY(-2rpx);
    }

    // Mode Specifics
    .lk-tabbar-container--flashlight & .tabbar-item__flashlight {
      opacity: 1;
      transform: translateX(-50%) scale(1);
      bottom: -10rpx;
    }

    .lk-tabbar-container--bubble & .tabbar-item__bubble {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }

    .lk-tabbar-container--mask-fill & .tabbar-item__mask-fill {
      height: 100%;
    }

    .lk-tabbar-container--ripple & .tabbar-item__ripple {
      animation: tabbar-ripple 0.6s ease-out;
    }

    .lk-tabbar-container--text-raise & {
      .tabbar-item__icon {
        transform: translateY(-50rpx);
        opacity: 0;
      }
      .tabbar-item__label {
        transform: translateY(-20rpx) scale(1.2);
        color: var(--test-primary);
      }
    }

    .lk-tabbar-container--float & {
      color: var(--test-primary);
      .tabbar-item__icon-wrapper {
        transform: translateY(-30rpx);
        background: $test-primary;
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10rpx 25rpx rgba(var(--test-primary-rgb), 0.5);
        color: #ffffff !important;
      }
      .tabbar-item__label {
        transform: translateY(0);
        color: var(--test-primary);
      }
    }

    .lk-tabbar-container--block & {
      color: #ffffff;
      .tabbar-item__icon,
      .tabbar-item__label {
        color: #ffffff !important;
      }
    }
  }

  &__icon {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44rpx;
    height: 44rpx;
    flex-shrink: 0;
    color: inherit;
    transform: translateZ(0);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

    :deep(.lk-icon) {
      color: inherit;
    }
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
    line-height: 28rpx;
    height: 28rpx;
    white-space: nowrap;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  }
}

@keyframes tabbar-ripple {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2.5);
    opacity: 0;
  }
}
</style>
