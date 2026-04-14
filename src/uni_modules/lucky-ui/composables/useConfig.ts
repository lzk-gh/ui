import { inject, provide, computed, type InjectionKey, type Ref, ref } from 'vue';

export type Theme = 'light' | 'dark';

export interface LkConfig {
  theme?: Theme;
  brandColor?: string;
  themeVars?: Record<string, string | number>;
  safeAreaInsetBottom?: boolean;
  [key: string]: any;
}

const CONFIG_KEY: InjectionKey<Ref<LkConfig>> = Symbol('lk-config');

/**
 * 将 themeVars 转换为 CSS 变量字符串
 */
export function serializeThemeVars(vars?: Record<string, string | number>): string {
  if (!vars) return '';
  return Object.entries(vars)
    .map(([k, v]) => {
      const key = k.startsWith('--') ? k : `--lk-${k}`;
      return `${key}: ${v}`;
    })
    .join('; ');
}

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
 * 生成色阶 (100-900)
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
 * 生成品牌色 CSS 变量对象
 */
export function generateBrandVars(color: string): Record<string, string> {
  const vars: Record<string, string> = {};
  const rgb = hexToRgb(color);
  const levels = [100, 200, 300, 400, 500, 600, 700, 800, 900];
  
  levels.forEach(level => {
    vars[`--lk-brand-${level}`] = generateShade(color, level);
  });

  if (rgb) {
    vars['--lk-brand-rgb'] = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
  }
  
  vars['--lk-brand-600'] = color; // 确保 600 是基准色
  return vars;
}

/**
 * 序列化 CSS 变量为内联样式字符串
 */
export function serializeVars(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([k, v]) => `${k}: ${v}`)
    .join('; ');
}

/**
 * 提供全局配置 (由 ConfigProvider 调用)
 */
export function provideConfig(config: Ref<LkConfig>) {
  provide(CONFIG_KEY, config);
}

/**
 * 获取全局配置 (由内部组件调用)
 */
export function useConfig() {
  const config = inject(CONFIG_KEY, ref<LkConfig>({
    theme: 'light',
    brandColor: '#6965db'
  }));

  const themeClass = computed(() => `lk-theme-${config.value.theme || 'light'}`);
  
  const brandStyleVars = computed(() => {
    if (!config.value.brandColor) return '';
    return serializeVars(generateBrandVars(config.value.brandColor));
  });

  return {
    config,
    themeClass,
    brandStyleVars
  };
}
