<script setup lang="ts">
import { computed, toRef } from 'vue';
import { 
  provideConfig, 
  generateBrandVars, 
  serializeVars, 
  serializeThemeVars, 
  type LkConfig 
} from '../../composables/useConfig';
import { configProviderProps } from './config-provider.props';

/**
 * LkConfigProvider 全局配置容器
 * - 核心功能：自动处理主题切换（lk-theme-light / lk-theme-dark）
 * - 核心功能：自动注入品牌色 CSS 变量
 * - 核心功能：支持通过 themeVars 注入自定义设计令牌
 * - 核心功能：通过 provideConfig 向下传递配置
 */

defineOptions({ name: 'LkConfigProvider' });

const props = defineProps(configProviderProps);

// 将 props 转换为 LkConfig 格式并 provide
const config = computed<LkConfig>(() => ({
  theme: props.theme,
  brandColor: props.brandColor,
  themeVars: props.themeVars,
  safeAreaInsetBottom: props.safeAreaInsetBottom,
  customStyle: props.customStyle,
  customClass: props.customClass
}));

provideConfig(toRef(config));

// 计算最终应用的主题类名
const activeThemeClass = computed(() => {
  return props.theme ? `lk-theme-${props.theme}` : '';
});

// 计算最终应用的样式变量
const activeStyle = computed(() => {
  let styleStr = '';
  
  // 1. 处理品牌色并生成色阶
  if (props.brandColor) {
    styleStr += serializeVars(generateBrandVars(props.brandColor));
  }

  // 2. 处理自定义主题变量 (优先级高于默认令牌)
  if (props.themeVars && Object.keys(props.themeVars).length > 0) {
    styleStr += (styleStr ? '; ' : '') + serializeThemeVars(props.themeVars);
  }

  // 3. 合并用户传入的 customStyle
  const baseStyle = typeof props.customStyle === 'string' 
    ? props.customStyle 
    : Object.entries(props.customStyle || {})
        .map(([k, v]) => `${k}: ${v}`)
        .join('; ');

  return `${styleStr}${styleStr && baseStyle ? '; ' : ''}${baseStyle}`;
});

const classes = computed(() => [
  'lk-config-provider',
  activeThemeClass.value,
  { 'lk-config-provider--safe-bottom': props.safeAreaInsetBottom },
  props.customClass
]);
</script>

<template>
  <view 
    :class="classes" 
    :style="activeStyle"
  >
    <slot />
  </view>
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
