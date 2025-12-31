export type RGB = { r: number; g: number; b: number };

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function toHexChannel(n: number) {
  const v = Math.max(0, Math.min(255, Math.round(n)));
  return v.toString(16).padStart(2, '0');
}

export function rgbToHex(rgb: RGB) {
  return `#${toHexChannel(rgb.r)}${toHexChannel(rgb.g)}${toHexChannel(rgb.b)}`;
}

export function hexToRgb(hex: string): RGB | null {
  const raw = hex.trim();
  const m = raw.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (!m) return null;
  let v = m[1];
  if (v.length === 3) v = v.split('').map(c => c + c).join('');
  const n = parseInt(v, 16);
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255,
  };
}

export function mixRgb(a: RGB, b: RGB, aWeight: number): RGB {
  const w = clamp01(aWeight);
  return {
    r: a.r * w + b.r * (1 - w),
    g: a.g * w + b.g * (1 - w),
    b: a.b * w + b.b * (1 - w),
  };
}

export function rgbaFromHex(hex: string, alpha: number) {
  const rgb = hexToRgb(hex) ?? { r: 0, g: 0, b: 0 };
  const a = clamp01(alpha);
  return `rgba(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)}, ${a})`;
}

export function generateBrandShade(brandBaseHex: string, level: number): string {
  // 对齐 theme/src/tokens/_colors.scss 的算法：以 600 为基准色
  const base = hexToRgb(brandBaseHex) ?? { r: 105, g: 101, b: 219 }; // #6965db
  const white: RGB = { r: 255, g: 255, b: 255 };
  const black: RGB = { r: 0, g: 0, b: 0 };

  if (level === 600) return rgbToHex(base);

  if (level < 600) {
    const ratio = ((600 - level) / 500) * 0.85; // 100 级别混合 85% 白色
    return rgbToHex(mixRgb(white, base, ratio));
  }

  const ratio = ((level - 600) / 400) * 0.7; // 1000 级别混合 70% 黑色
  return rgbToHex(mixRgb(black, base, ratio));
}

export function getCssVarColor(varName: string): string | null {
  try {
    if (typeof window === 'undefined' || typeof document === 'undefined') return null;
    const val = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    if (!val) return null;
    return val;
  } catch {
    return null;
  }
}

export function resolveBrandBaseColor(): string {
  // H5: 尝试读取真实主题色；其他端 fallback 到设计令牌默认品牌基色
  const css = getCssVarColor('--color-brand-primary') || getCssVarColor('--lk-color-primary');
  const rgb = css ? css.trim() : '';
  // 只在能解析成 hex 时才用（避免返回 rgb()/var() 导致 canvas 不识别）
  if (rgb && rgb.startsWith('#')) return rgb;
  return '#6965db';
}

export function buildBrandPalette(brandBaseHex: string) {
  const base = brandBaseHex || '#6965db';
  return {
    brand100: generateBrandShade(base, 100),
    brand200: generateBrandShade(base, 200),
    brand300: generateBrandShade(base, 300),
    brand400: generateBrandShade(base, 400),
    brand500: generateBrandShade(base, 500),
    brand600: generateBrandShade(base, 600),
    brand700: generateBrandShade(base, 700),
    brand800: generateBrandShade(base, 800),
  };
}
