/**
 * Lucky UI 主题管理
 * 支持 H5 和小程序端的亮色/暗色切换
 */
import { ref, computed, readonly } from 'vue';

export type Theme = 'light' | 'dark';

// 全局主题状态
const _theme = ref<Theme>('light');

/**
 * 读取持久化的主题
 */
function loadTheme(): Theme | null {
  try {
    const value = uni.getStorageSync('lk-theme');
    if (value === 'light' || value === 'dark') return value;
  } catch {
    // 存储不可用时静默失败
  }
  return null;
}

/**
 * 持久化主题
 */
function saveTheme(theme: Theme): void {
  try {
    uni.setStorageSync('lk-theme', theme);
  } catch {
    // 存储不可用时静默失败
  }
}

/**
 * 检测系统主题偏好（仅 H5）
 */
function getSystemTheme(): Theme {
  // #ifdef H5
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  // #endif
  return 'light';
}

/**
 * 应用主题到 DOM（H5 端）
 */
function applyThemeToDOM(theme: Theme): void {
  // #ifdef H5
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.classList.remove('lk-theme-light', 'lk-theme-dark');
    root.classList.add(`lk-theme-${theme}`);
    root.setAttribute('data-theme', theme);
  }
  // #endif
}

/**
 * 初始化主题
 */
function initTheme(): Theme {
  const saved = loadTheme();
  const initial = saved ?? getSystemTheme();
  _theme.value = initial;
  applyThemeToDOM(initial);
  return initial;
}

// 自动初始化
initTheme();

/**
 * 主题 composable
 */
export function useTheme() {
  const theme = computed(() => _theme.value);
  const isDark = computed(() => _theme.value === 'dark');

  // 返回给页面根元素使用的 class
  const themeClass = computed(() => `lk-theme-${_theme.value}`);

  function setTheme(t: Theme) {
    if (_theme.value === t) return;
    _theme.value = t;
    applyThemeToDOM(t);
    saveTheme(t);
  }

  function toggleTheme() {
    setTheme(_theme.value === 'light' ? 'dark' : 'light');
  }

  return {
    theme: readonly(theme),
    isDark: readonly(isDark),
    themeClass,
    setTheme,
    toggleTheme,
  };
}

/**
 * 直接访问主题状态（非 setup 环境）
 */
export const themeStore = {
  get theme() {
    return _theme.value;
  },
  get isDark() {
    return _theme.value === 'dark';
  },
  get themeClass() {
    return `lk-theme-${_theme.value}`;
  },
  setTheme(t: Theme) {
    _theme.value = t;
    applyThemeToDOM(t);
    saveTheme(t);
  },
  toggleTheme() {
    this.setTheme(_theme.value === 'light' ? 'dark' : 'light');
  },
};
