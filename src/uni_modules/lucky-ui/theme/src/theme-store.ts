/**
 * Lucky UI 主题管理 (核心实现)
 * 提供主题切换、品牌色动态修改、以及针对小程序性能优化的瞬间切换机制。
 */
import { ref, computed, readonly } from 'vue';

export type Theme = 'light' | 'dark';

// ======================== 内部状态 ========================
const _theme = ref<Theme>('light');
const _isSwitching = ref(false);
const _brandColor = ref<string>('#6965db');
let switchingTimer: any = null;
let saveTimer: any = null;

// ======================== 工具函数 ========================

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
  const rgb = hexToRgb(color);
  const levels = [100, 200, 300, 400, 500, 600, 700, 800, 900];
  
  levels.forEach(level => {
    vars[`--lk-brand-${level}`] = generateShade(color, level);
  });

  if (rgb) {
    vars['--lk-brand-rgb'] = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
  }
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
 * 持久化数据 (带防抖)
 */
function persistData() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      uni.setStorageSync('lk-theme', _theme.value);
      uni.setStorageSync('lk-brand-color', _brandColor.value);
    } catch (e) {
      console.error('Theme persistence failed', e);
    }
  }, 500);
}

/**
 * 检测系统主题偏好
 */
function getSystemTheme(): Theme {
  // #ifdef MP
  try {
    const systemInfo = uni.getSystemInfoSync();
    if (systemInfo.theme === 'dark' || systemInfo.theme === 'light') {
      return systemInfo.theme;
    }
  } catch {}
  // #endif

  // #ifdef H5
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  // #endif
  return 'light';
}

/**
 * 应用样式到 DOM (H5 端)
 */
function applyToDOM() {
  // #ifdef H5
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    
    // 应用主题类名
    root.classList.remove('lk-theme-light', 'lk-theme-dark');
    root.classList.add(`lk-theme-${_theme.value}`);
    
    if (_isSwitching.value) {
      root.classList.add('lk-theme-switching');
    } else {
      root.classList.remove('lk-theme-switching');
    }
    
    root.setAttribute('data-theme', _theme.value);
    root.style.colorScheme = _theme.value;

    // 应用品牌色变量
    const brandVars = generateBrandVars(_brandColor.value);
    Object.entries(brandVars).forEach(([k, v]) => {
      root.style.setProperty(k, v);
    });
  }
  // #endif
}

/**
 * 应用系统 UI 设置 (小程序端)
 */
function applySystemUI() {
  // #ifdef MP
  const isDark = _theme.value === 'dark';
  const bg = isDark ? '#111827' : '#f5f5f7';
  const frontColor = isDark ? '#ffffff' : '#000000';

  uni.setBackgroundColor?.({
    backgroundColor: bg,
    backgroundColorTop: bg,
    backgroundColorBottom: bg,
    fail: () => {},
  });

  uni.setNavigationBarColor?.({
    frontColor,
    backgroundColor: bg,
    animation: { duration: 0, timingFunc: 'linear' },
    fail: () => {},
  });
  // #endif
}

// ======================== 核心方法 ========================

/**
 * 执行主题切换 (分步原子操作以优化性能)
 */
function performSetTheme(t: Theme) {
  if (_theme.value === t) return;

  if (switchingTimer) {
    clearTimeout(switchingTimer);
    switchingTimer = null;
  }

  // 第一步：进入切换状态，应用禁用过渡的类名
  _isSwitching.value = true;
  applyToDOM();

  // 第二步：延迟一帧（给浏览器/WebView 时间渲染切换状态），然后真正修改颜色
  const switchDelay = 32; 

  setTimeout(() => {
    _theme.value = t;
    applyToDOM();
    applySystemUI();
    persistData();

    // 第三步：等待渲染完成，移除禁用过渡的类名
    switchingTimer = setTimeout(() => {
      _isSwitching.value = false;
      applyToDOM();
      switchingTimer = null;
    }, 250);
  }, switchDelay);
}

/**
 * 初始化主题系统
 */
function initTheme() {
  const savedTheme = uni.getStorageSync('lk-theme');
  const savedColor = uni.getStorageSync('lk-brand-color');

  if (savedTheme === 'light' || savedTheme === 'dark') {
    _theme.value = savedTheme;
  } else {
    _theme.value = getSystemTheme();
  }

  if (savedColor) {
    _brandColor.value = savedColor;
  }

  applyToDOM();
  applySystemUI();
}

/**
 * 设置品牌色
 */
function setBrandColor(color: string) {
  if (_brandColor.value === color) return;
  _brandColor.value = color;
  applyToDOM();
  persistData();
}

// ======================== 导出接口 ========================

/**
 * 主题 Composable
 */
export function useTheme() {
  const theme = computed(() => _theme.value);
  const isDark = computed(() => _theme.value === 'dark');
  const themeClass = computed(() => {
    const base = `lk-theme-${_theme.value}`;
    return _isSwitching.value ? `${base} lk-theme-switching` : base;
  });
  
  // 品牌色 CSS 变量字符串，用于内联 style 绑定
  const brandStyleVars = computed(() => {
    return serializeVars(generateBrandVars(_brandColor.value));
  });

  return {
    theme: readonly(theme),
    isDark: readonly(isDark),
    themeClass,
    brandStyleVars,
    setTheme: performSetTheme,
    toggleTheme: () => performSetTheme(_theme.value === 'light' ? 'dark' : 'light'),
    brandColor: readonly(_brandColor),
    setBrandColor,
  };
}

/**
 * 全局 Store 对象 (非 setup 环境)
 */
export const themeStore = {
  get theme() { return _theme.value; },
  get isDark() { return _theme.value === 'dark'; },
  get themeClass() {
    const base = `lk-theme-${_theme.value}`;
    return _isSwitching.value ? `${base} lk-theme-switching` : base;
  },
  get brandColor() { return _brandColor.value; },
  get brandStyleVars() {
    return serializeVars(generateBrandVars(_brandColor.value));
  },
  setTheme: performSetTheme,
  toggleTheme() { performSetTheme(_theme.value === 'light' ? 'dark' : 'light'); },
  setBrandColor,
  init: initTheme,
};

// 自动初始化
// #ifdef H5
if (typeof window !== 'undefined') {
  initTheme();
}
// #endif
