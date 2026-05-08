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

defineOptions({ name: 'LkTabbarContainer' });

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

/** 未传 mode 时使用 block，与历史默认一致；宿主可通过 :mode 绑定全局状态 */
const activeMode = computed(() => props.mode ?? 'block');

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

function resolveFillIconName(iconName: string) {
  if (!iconName || iconName.endsWith('-fill')) return iconName;
  return `${iconName}-fill`;
}

function resolveTabIcon(tab: TabConfig) {
  if (tab.id !== activeId.value) return tab.icon;
  if (tab.selectedIcon) return tab.selectedIcon;
  if (tab.activeIconFill) return resolveFillIconName(tab.icon);
  return tab.icon;
}

// 处理 Tab 点击
async function handleTabClick(tab: TabConfig) {
  if (tab.id === activeId.value) return;

  const oldTabId = activeId.value;
  emit('beforeChange', tab.id, oldTabId);

  await switchTab(tab.id);
  emit('change', tab.id);
}

// 重试加载
async function retryLoad(tabId: string) {
  const instance = getTabInstance(tabId);
  if (instance) {
    instance.loaded = false;
    instance.error = null;
  }
  await switchTab(tabId);
}

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

<template>
  <view class="lk-tabbar-container" :class="containerClass" :style="containerStyle">
    <!-- Tab 内容区域 -->
    <view class="lk-tabbar-container__content">
      <!-- 使用 v-show 保持组件状态，避免重新渲染 -->
      <template v-for="tab in tabs" :key="tab.id">
        <scroll-view
          v-if="isVisited(tab.id) || tab.id === activeId"
          v-show="tab.id === activeId"
          class="lk-tabbar-container__panel"
          scroll-y
          :show-scrollbar="false"
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
          <!-- #ifdef H5 || APP-PLUS -->
          <component
            :is="getTabInstance(tab.id)!.component"
            v-else-if="getTabInstance(tab.id)?.component"
            :tab-id="tab.id"
            :is-active="tab.id === activeId"
          />
          <!-- #endif -->

          <!-- #ifdef MP -->
          <view v-else class="lk-tabbar-container__slot">
            <slot :name="`tab-${tab.id}`" :tab-id="tab.id" :is-active="tab.id === activeId" />
          </view>
          <!-- #endif -->
        </scroll-view>
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
              <lk-icon :name="resolveTabIcon(tab)" size="44" />
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

<style lang="scss" scoped>
@use './index.scss';

$tabbar-height: var(--lk-control-height-lg);

.lk-tabbar-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--lk-bg-page);
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
    overflow: hidden;
  }

  &__loading,
  &__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--lk-text-secondary);
  }

  &__slot {
    width: 100%;
    height: 100%;
  }

  &__loading {
    .loading-text {
      margin-top: var(--lk-spacing-lg);
      font-size: var(--lk-font-size-base);
    }
  }

  &__error {
    .error-text {
      margin-top: var(--lk-spacing-lg);
      font-size: var(--lk-font-size-base);
    }

    .error-retry {
      margin-top: var(--lk-spacing-xl);
      padding: var(--lk-spacing-md) var(--lk-spacing-xxl);
      font-size: var(--lk-font-size-base);
      color: var(--lk-color-primary);
      border: 1px solid var(--lk-color-primary);
      border-radius: var(--lk-radius-full);

      &:active {
        background: var(--lk-color-primary-soft);
      }
    }
  }

  &__tabbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 300;
    background: var(--lk-color-bg-container);
    border-top: 1px solid var(--lk-color-border);
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
    top: var(--lk-spacing-sm);
    bottom: var(--lk-spacing-sm);
    background: var(--lk-color-primary);
    border-radius: var(--lk-radius-full);
    margin: 0 var(--lk-spacing-sm);
    width: calc(var(--item-width) - var(--lk-spacing-lg));
    left: calc(var(--item-left) + var(--lk-spacing-sm));
    box-shadow: 0 var(--lk-spacing-xs) calc(var(--lk-spacing-md) + var(--lk-spacing-xs))
      rgba(var(--lk-brand-rgb), 0.3);
    opacity: 0.85; // Lighten it slightly as requested
  }

  &.is-marker-top {
    height: var(--lk-spacing-xxs);
    background: var(--lk-color-primary);
    border-radius: 0 0 var(--lk-radius-xs) var(--lk-radius-xs);
    box-shadow: 0 var(--lk-spacing-xxs) calc(var(--lk-spacing-sm) + var(--lk-spacing-xxs))
      rgba(var(--lk-brand-rgb), 0.6);
  }

  &.is-marker-bottom {
    top: auto;
    bottom: 0;
    height: var(--lk-spacing-xs);
    background: var(--lk-color-primary);
    border-radius: var(--lk-radius-xs) var(--lk-radius-xs) 0 0;
    box-shadow: 0 calc(var(--lk-spacing-xxs) * -1) calc(var(--lk-spacing-sm) + var(--lk-spacing-xxs))
      rgba(var(--lk-brand-rgb), 0.6);
  }

  &.is-dot-slide {
    top: auto;
    bottom: var(--lk-spacing-sm);
    height: var(--lk-spacing-sm);
    width: var(--lk-spacing-sm);
    background: var(--lk-color-primary);
    border-radius: 50%;
    left: var(--active-center);
    transform: translateX(-50%);
    box-shadow: 0 0 calc(var(--lk-spacing-sm) + var(--lk-spacing-xxs)) var(--lk-color-primary);
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
  color: var(--lk-text-secondary);
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  position: relative;
  z-index: 1;

  &__flashlight {
    position: absolute;
    bottom: calc(var(--lk-spacing-md) * -1);
    left: 50%;
    transform: translateX(-50%) scale(0);
    width: calc(var(--lk-control-height-lg) * 2 + var(--lk-spacing-xs));
    height: calc(var(--lk-control-height-lg) + var(--lk-spacing-lg));
    background: radial-gradient(
      ellipse at bottom,
      rgba(var(--lk-brand-rgb), 0.5) 0%,
      rgba(var(--lk-brand-rgb), 0.2) 40%,
      transparent 70%
    );
    filter: blur(var(--lk-spacing-xs));
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    opacity: 0;
    z-index: -1;
    pointer-events: none;
  }

  &__bubble {
    position: absolute;
    top: 50%;
    left: 50%;
    width: calc(var(--lk-control-height-lg) + var(--lk-spacing-lg));
    height: calc(var(--lk-control-height-lg) + var(--lk-spacing-lg));
    background: var(--lk-color-primary-soft);
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
    background: linear-gradient(to top, rgba(var(--lk-brand-rgb), 0.2), transparent);
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    z-index: -1;
  }

  &__ripple {
    position: absolute;
    top: 50%;
    left: 50%;
    width: calc(var(--lk-control-height-xs) + var(--lk-spacing-xs));
    height: calc(var(--lk-control-height-xs) + var(--lk-spacing-xs));
    border: var(--lk-rpx-3) solid var(--lk-color-primary);
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
    color: var(--lk-color-primary);

    // Common Icon Animations
    .tabbar-item__icon {
      transform: translateY(calc(var(--lk-rpx-2) * -1));
    }

    // Mode Specifics
    .lk-tabbar-container--flashlight & .tabbar-item__flashlight {
      opacity: 1;
      transform: translateX(-50%) scale(1);
      bottom: calc(var(--lk-spacing-sm) * -1);
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
        transform: translateY(calc(var(--lk-rpx-50) * -1));
        opacity: 0;
      }
      .tabbar-item__label {
        transform: translateY(calc(var(--lk-rpx-20) * -1)) scale(1.2);
        color: var(--lk-color-primary);
      }
    }

    .lk-tabbar-container--float & {
      color: var(--lk-color-primary);
      .tabbar-item__icon-wrapper {
        transform: translateY(calc(var(--lk-spacing-xxl) * -1));
        background: var(--lk-color-primary);
        width: calc(var(--lk-control-height-lg) + var(--lk-spacing-xxs));
        height: calc(var(--lk-control-height-lg) + var(--lk-spacing-xxs));
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 calc(var(--lk-spacing-xs) + var(--lk-spacing-xxs))
          calc(var(--lk-spacing-lg) + var(--lk-spacing-xxs)) rgba(var(--lk-brand-rgb), 0.5);
        color: var(--lk-color-text-inverse) !important;
      }
      .tabbar-item__label {
        transform: translateY(0);
        color: var(--lk-color-primary);
      }
    }

    .lk-tabbar-container--block & {
      color: var(--lk-color-text-inverse);
      .tabbar-item__icon,
      .tabbar-item__label {
        color: var(--lk-color-text-inverse) !important;
      }
    }
  }

  &__icon {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(var(--lk-control-height-xs) - var(--lk-spacing-xxs));
    height: calc(var(--lk-control-height-xs) - var(--lk-spacing-xxs));
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
    top: calc(var(--lk-spacing-xs) * -1);
    right: calc(var(--lk-spacing-md) * -1 + var(--lk-spacing-xxs));
    min-width: calc(var(--lk-spacing-md) * 2);
    height: calc(var(--lk-spacing-md) * 2);
    padding: 0 var(--lk-spacing-xs);
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    font-size: var(--lk-font-size-xs);
    line-height: calc(var(--lk-spacing-md) * 2);
    text-align: center;
    color: var(--lk-color-text-inverse);
    background: var(--lk-color-danger);
    border-radius: var(--lk-radius-md);
  }

  &__dot {
    position: absolute;
    top: 0;
    right: calc(var(--lk-spacing-xxs) * -1);
    width: var(--lk-spacing-md);
    height: var(--lk-spacing-md);
    background: var(--lk-color-danger);
    border-radius: 50%;
  }

  &__label {
    margin-top: var(--lk-spacing-xxs);
    font-size: var(--lk-font-size-sm);
    line-height: var(--lk-line-height-base);
    height: auto;
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
