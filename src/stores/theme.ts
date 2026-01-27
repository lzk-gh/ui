/**
 * 主题状态管理 (Pinia Store)
 * 支持跨页面的主题/品牌色状态共享
 */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type Theme = 'light' | 'dark';

// 色阶常量
const LEVELS = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

/**
 * HEX 转 RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return match
    ? { r: parseInt(match[1], 16), g: parseInt(match[2], 16), b: parseInt(match[3], 16) }
    : null;
}

/**
 * 生成色阶
 */
function generateShade(baseColor: string, level: number): string {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return baseColor;

  const { r, g, b } = rgb;
  if (level === 600) return baseColor;

  if (level < 600) {
    const ratio = ((600 - level) / 500) * 0.85;
    return `rgb(${Math.round(r + (255 - r) * ratio)}, ${Math.round(g + (255 - g) * ratio)}, ${Math.round(b + (255 - b) * ratio)})`;
  } else {
    const ratio = ((level - 600) / 300) * 0.6;
    return `rgb(${Math.round(r * (1 - ratio))}, ${Math.round(g * (1 - ratio))}, ${Math.round(b * (1 - ratio))})`;
  }
}

/**
 * 生成品牌色 CSS 变量
 */
function generateBrandVars(color: string): Record<string, string> {
  const vars: Record<string, string> = {};
  LEVELS.forEach((level) => {
    vars[`--lk-brand-${level}`] = generateShade(color, level);
  });
  return vars;
}

/**
 * 序列化 CSS 变量为内联样式
 */
function serializeVars(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([k, v]) => `${k}: ${v}`)
    .join('; ');
}

/**
 * 默认品牌色
 */
export const DEFAULT_BRAND_COLOR = '#6965db';

/**
 * 预设品牌色
 */
export const PRESET_COLORS = [
  { name: '幻紫', value: '#6965db' },
  { name: '极光蓝', value: '#1890ff' },
  { name: '翠绿', value: '#52c41a' },
  { name: '活力橙', value: '#fa8c16' },
  { name: '中国红', value: '#f5222d' },
  { name: '玫瑰粉', value: '#eb2f96' },
  { name: '极客青', value: '#13c2c2' },
] as const;

export const useThemeStore = defineStore('theme', () => {
  // ======================== 主题状态 ========================
  const theme = ref<Theme>('light');

  const isDark = computed(() => theme.value === 'dark');
  const themeClass = computed(() => `lk-theme-${theme.value}`);

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
  function saveTheme(t: Theme): void {
    try {
      uni.setStorageSync('lk-theme', t);
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
  function applyThemeToDOM(t: Theme): void {
    // #ifdef H5
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('lk-theme-light', 'lk-theme-dark');
      root.classList.add(`lk-theme-${t}`);
      root.setAttribute('data-theme', t);
    }
    // #endif
  }

  /**
   * 设置主题
   */
  function setTheme(t: Theme) {
    if (theme.value === t) return;
    theme.value = t;
    applyThemeToDOM(t);
    saveTheme(t);
  }

  /**
   * 切换主题
   */
  function toggleTheme() {
    setTheme(theme.value === 'light' ? 'dark' : 'light');
  }

  /**
   * 初始化主题
   */
  function initTheme(): Theme {
    const saved = loadTheme();
    const initial = saved ?? getSystemTheme();
    theme.value = initial;
    applyThemeToDOM(initial);
    return initial;
  }

  // ======================== 品牌色状态 ========================
  const brandColor = ref<string>(DEFAULT_BRAND_COLOR);
  const brandStyleVars = ref<string>('');

  /**
   * 加载保存的品牌色
   */
  function loadBrandColor(): string | null {
    try {
      return uni.getStorageSync('lk-brand-color') || null;
    } catch {
      return null;
    }
  }

  /**
   * 保存品牌色
   */
  function saveBrandColor(color: string): void {
    try {
      uni.setStorageSync('lk-brand-color', color);
    } catch {
      // 静默失败
    }
  }

  /**
   * 应用品牌色到 DOM
   */
  function applyBrandColorToDOM(color: string): void {
    // #ifdef H5
    if (typeof document === 'undefined') return;
    const vars = generateBrandVars(color);
    const root = document.documentElement;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
    // #endif
  }

  /**
   * 设置品牌色
   */
  function setBrandColor(color: string) {
    brandColor.value = color;
    applyBrandColorToDOM(color);
    brandStyleVars.value = serializeVars(generateBrandVars(color));
    saveBrandColor(color);
  }

  /**
   * 初始化品牌色
   */
  function initBrandColor() {
    const saved = loadBrandColor();
    if (saved) {
      setBrandColor(saved);
    } else {
      brandStyleVars.value = serializeVars(generateBrandVars(DEFAULT_BRAND_COLOR));
    }
  }

  // ======================== 初始化 ========================
  /**
   * 初始化所有主题相关状态
   */
  function init() {
    initTheme();
    initBrandColor();
  }

  return {
    // 主题状态
    theme,
    isDark,
    themeClass,
    setTheme,
    toggleTheme,

    // 品牌色状态
    brandColor,
    brandStyleVars,
    setBrandColor,

    // 初始化
    init,
    initTheme,
    initBrandColor,
  };
});
