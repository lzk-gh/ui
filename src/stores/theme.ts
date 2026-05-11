/**
 * 主题状态管理 (Pinia Store 封装)
 * 内部代理至 lucky-ui 的核心 theme-store 实现，保持逻辑统一且支持 DevTools。
 */
import { defineStore } from 'pinia';
import { themeStore, useTheme } from '@/uni_modules/lucky-ui/theme/src/theme-store';

export const useThemeStore = defineStore('theme', () => {
  // 使用 useTheme hook 获取响应式状态
  const { 
    theme, 
    isDark, 
    themeClass, 
    brandColor, 
    brandStyleVars, 
    setTheme, 
    toggleTheme, 
    setBrandColor 
  } = useTheme();

  /**
   * 初始化
   */
  function init() {
    themeStore.init();
  }

  return {
    // 状态
    theme,
    isDark,
    themeClass,
    brandColor,
    brandStyleVars,
    
    // 方法
    setTheme,
    toggleTheme,
    setBrandColor,
    init,
  };
});
