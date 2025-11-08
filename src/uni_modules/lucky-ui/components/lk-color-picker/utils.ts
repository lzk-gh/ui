export interface HSV {
  h: number;
  s: number;
  v: number;
  a?: number;
}
export interface RGB {
  r: number;
  g: number;
  b: number;
  a?: number;
}

function clamp(v: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

export function hsvToRgb(hsv: HSV): RGB {
  let { h, s, v, a } = hsv;
  h = ((h % 360) + 360) % 360;
  s = clamp(s, 0, 1);
  v = clamp(v, 0, 1);
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
    a,
  };
}

export function rgbToHsv(rgb: RGB): HSV {
  const r = rgb.r / 255,
    g = rgb.g / 255,
    b = rgb.b / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d === 0) h = 0;
  else if (max === r) h = 60 * (((g - b) / d) % 6);
  else if (max === g) h = 60 * ((b - r) / d + 2);
  else h = 60 * ((r - g) / d + 4);
  if (h < 0) h += 360;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  return { h, s, v, a: rgb.a };
}

export function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  const { r, g, b, a } = rgb;
  if (a === undefined || a >= 1)
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(Math.round(clamp(a, 0, 1) * 255))}`.toUpperCase();
}

export function hexToRgb(hex: string): RGB | null {
  const h = hex.replace('#', '').trim();
  if (!/^([\da-f]{6}|[\da-f]{8})$/i.test(h)) return null;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  let a: number | undefined = undefined;
  if (h.length === 8) a = parseInt(h.slice(6, 8), 16) / 255;
  return { r, g, b, a };
}

export function formatFromHSV(
  hsv: HSV,
  fmt: 'hex' | 'rgb' | 'hsv',
  alpha = false
): string {
  if (fmt === 'hsv')
    return `${Math.round(hsv.h)},${Math.round(hsv.s * 100)}%,${Math.round(hsv.v * 100)}%${alpha ? `,` + (hsv.a ?? 1) : ''}`;
  const rgb = hsvToRgb(hsv);
  if (fmt === 'rgb')
    return `rgb${alpha ? 'a' : ''}(${rgb.r}, ${rgb.g}, ${rgb.b}${alpha ? `, ${hsv.a ?? 1}` : ''})`;
  return rgbToHex({ ...rgb, a: alpha ? hsv.a : undefined });
}

export function parseToHSV(input: string, fmt: 'hex' | 'rgb' | 'hsv'): HSV | null {
  try {
    if (fmt === 'hex') {
      const rgb = hexToRgb(input);
      if (!rgb) return null;
      const hsv = rgbToHsv(rgb);
      hsv.a = rgb.a;
      return hsv;
    }
    if (fmt === 'rgb') {
      const m = input.match(/rgba?\(([^)]+)\)/i);
      if (!m) return null;
      const parts = m[1].split(',').map(s => s.trim());
      const r = parseFloat(parts[0]);
      const g = parseFloat(parts[1]);
      const b = parseFloat(parts[2]);
      const a = parts[3] !== undefined ? parseFloat(parts[3]) : undefined;
      const hsv = rgbToHsv({ r, g, b, a });
      hsv.a = a;
      return hsv;
    }
    if (fmt === 'hsv') {
      const parts = input.split(',').map(s => s.trim().replace('%', ''));
      const h = parseFloat(parts[0]);
      const s = parseFloat(parts[1]) / 100;
      const v = parseFloat(parts[2]) / 100;
      const a = parts[3] !== undefined ? parseFloat(parts[3]) : undefined;
      return { h, s, v, a };
    }
    return null;
  } catch {
    return null;
  }
}
