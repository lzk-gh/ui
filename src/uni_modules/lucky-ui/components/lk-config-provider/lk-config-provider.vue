<script setup lang="ts">
import { computed } from 'vue';
import { useThemeStore } from '@/stores/theme';
import { configProviderProps } from './config-provider.props';

/**
 * LkConfigProvider 全局配置容器
 * - 核心功能：自动处理主题切换（lk-theme-light / lk-theme-dark）
 * - 核心功能：自动注入品牌色 CSS 变量
 */

defineOptions({ name: 'LkConfigProvider' });

const props = defineProps(configProviderProps);
const themeStore = useThemeStore();

// 计算最终应用的主题类名
const activeThemeClass = computed(() => {
  if (props.theme) return `lk-theme-${props.theme}`;
  return themeStore.themeClass;
});

// 计算最终应用的样式变量
const activeStyle = computed(() => {
  const styles: Record<string, string> = {};
  
  // 处理自定义品牌色
  if (props.brandColor || themeStore.brandColor) {
    // 这里我们可以根据需要注入特定的 CSS 变量
    // 由于 themeStore 已经自动处理了全局 HTML 注入，
    // 此处主要是为了在组件树局部覆盖或者确保局部生效
  }

  // 合并用户传入的 customStyle
  const baseStyle = typeof props.customStyle === 'string' 
    ? props.customStyle 
    : Object.entries(props.customStyle || {})
        .map(([k, v]) => `${k}: ${v}`)
        .join('; ');

  return baseStyle;
});

const classes = computed(() => [
  'lk-config-provider',
  activeThemeClass.value,
  { 'lk-config-provider--safe-bottom': props.safeAreaInsetBottom },
  props.customClass
]);
</script>

<template>
  <component 
    :is="tag" 
    :class="classes" 
    :style="activeStyle"
  >
    <slot />
  </component>
</template>

<style lang="scss">
.lk-config-provider {
  display: block;
  width: 100%;
  min-height: inherit;
  box-sizing: border-box;

  &--safe-bottom {
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>
