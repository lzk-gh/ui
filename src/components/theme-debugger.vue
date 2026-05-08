<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useTheme } from '@/uni_modules/lucky-ui/theme';

defineOptions({ name: 'ThemeDebugger' });

const { theme, isDark, toggleTheme } = useTheme();

const debugVars = ref<Record<string, string>>({});
let observer: MutationObserver | null = null;

const varNames = [
  '--lk-color-primary',
  '--lk-color-primary-bg-soft',
  '--lk-color-bg-page',
  '--lk-color-bg-body',
  '--lk-color-bg-surface',
  '--lk-color-bg-surface-variant',
  '--lk-color-text',
  '--lk-color-border',
  '--color-bg-body',
  '--color-bg-container',
];

const updateDebugVars = () => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const styles = getComputedStyle(root);

  const newVars: Record<string, string> = {};
  varNames.forEach(name => {
    const value = styles.getPropertyValue(name).trim();
    newVars[name] = value || '(未定义)';
  });

  debugVars.value = newVars;
};

onMounted(() => {
  if (typeof document === 'undefined') return;

  updateDebugVars();

  // 监听主题变化
  if (typeof MutationObserver === 'undefined') return;
  observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        setTimeout(updateDebugVars, 50);
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
});

onUnmounted(() => {
  observer?.disconnect();
  observer = null;
});

const currentDataTheme = computed(() => {
  if (typeof document === 'undefined') return 'unknown';
  return document.documentElement.getAttribute('data-theme') || '(无)';
});
</script>

<template>
  <view class="theme-debugger">
    <view class="theme-debugger__header">
      <text class="theme-debugger__title">🎨 主题调试工具</text>
      <button
        class="theme-debugger__toggle"
        @click="
          toggleTheme();
          updateDebugVars();
        "
      >
        切换主题 (当前: {{ theme }})
      </button>
    </view>

    <view class="theme-debugger__section">
      <text class="theme-debugger__label">当前主题模式:</text>
      <text class="theme-debugger__value">{{ theme }}</text>
    </view>

    <view class="theme-debugger__section">
      <text class="theme-debugger__label">是否暗黑:</text>
      <text class="theme-debugger__value">{{ isDark ? '是' : '否' }}</text>
    </view>

    <view class="theme-debugger__section">
      <text class="theme-debugger__label">data-theme 属性:</text>
      <text class="theme-debugger__value">{{ currentDataTheme }}</text>
    </view>

    <view class="theme-debugger__divider"></view>

    <view class="theme-debugger__vars">
      <text class="theme-debugger__vars-title">CSS 变量实际值:</text>
      <view v-for="(value, name) in debugVars" :key="name" class="theme-debugger__var-item">
        <text class="theme-debugger__var-name">{{ name }}</text>
        <text class="theme-debugger__var-value">{{ value }}</text>
      </view>
    </view>

    <view class="theme-debugger__demo">
      <text class="theme-debugger__demo-title">视觉验证:</text>
      <view
        class="theme-debugger__demo-block"
        :style="{ background: 'var(--lk-color-primary-bg-soft)' }"
      >
        --lk-color-primary-bg-soft
      </view>
      <view
        class="theme-debugger__demo-block"
        :style="{ background: 'var(--lk-color-bg-surface)' }"
      >
        --lk-color-bg-surface
      </view>
      <view
        class="theme-debugger__demo-block"
        :style="{ background: 'var(--lk-color-bg-surface-variant)' }"
      >
        --lk-color-bg-surface-variant
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.theme-debugger {
  padding: 32rpx;
  background: var(--lk-color-bg-surface);
  border-radius: var(--lk-radius-md);
  margin: 32rpx;
  font-size: 24rpx;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24rpx;
  }

  &__title {
    font-size: 32rpx;
    font-weight: 600;
    color: var(--lk-color-text);
  }

  &__toggle {
    padding: 16rpx 32rpx;
    background: var(--lk-color-primary);
    color: var(--lk-color-text-inverse);
    border-radius: var(--lk-radius-sm);
    border: none;
    font-size: 24rpx;
  }

  &__section {
    display: flex;
    justify-content: space-between;
    padding: 16rpx 0;
    border-bottom: 1px solid var(--lk-color-border-weak);
  }

  &__label {
    color: var(--lk-color-text-secondary);
    font-weight: 500;
  }

  &__value {
    color: var(--lk-color-primary);
    font-weight: 600;
  }

  &__divider {
    height: 1px;
    background: var(--lk-color-border);
    margin: 24rpx 0;
  }

  &__vars {
    margin-top: 24rpx;
  }

  &__vars-title {
    display: block;
    font-size: 28rpx;
    font-weight: 600;
    color: var(--lk-color-text);
    margin-bottom: 16rpx;
  }

  &__var-item {
    display: flex;
    justify-content: space-between;
    padding: 12rpx 0;
    font-family: monospace;
    font-size: 22rpx;
    line-height: 1.6;
  }

  &__var-name {
    color: var(--lk-color-text-secondary);
    flex-shrink: 0;
    margin-right: 16rpx;
  }

  &__var-value {
    color: var(--lk-color-text);
    word-break: break-all;
    text-align: right;
  }

  &__demo {
    margin-top: 32rpx;
  }

  &__demo-title {
    display: block;
    font-size: 28rpx;
    font-weight: 600;
    color: var(--lk-color-text);
    margin-bottom: 16rpx;
  }

  &__demo-block {
    padding: 32rpx;
    margin-bottom: 16rpx;
    border-radius: var(--lk-radius-sm);
    color: var(--lk-color-text);
    font-size: 24rpx;
    text-align: center;
    border: 2rpx solid var(--lk-color-border);
  }
}
</style>
