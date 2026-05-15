import type { StyleValue } from 'vue';
import type { RadarLiteItem } from './chart-radar-lite.props';
import { LiteChartEffect } from '../../core/src/chart';

export interface NormalizedRadarLiteItem extends RadarLiteItem {
  max: number;
}

export interface RadarLitePoint {
  label: string;
  value: number;
  ratio: number;
  angle: number;
  x: number;
  y: number;
}

export function resolveChartRadarLiteHeightStyle(height: string | number): string {
  if (typeof height === 'number') return `${height}rpx`;
  if (/^\d+$/.test(String(height))) return `${height}rpx`;
  return String(height);
}

export function resolveChartRadarLiteRootStyle(options: {
  heightStyle: string;
  customStyle: StyleValue;
}): StyleValue {
  return [{ height: options.heightStyle }, options.customStyle];
}

export function resolveChartRadarLiteClass(customClass: unknown) {
  return ['lk-chart-radar-lite', customClass];
}

export function normalizeRadarLiteData(
  data: RadarLiteItem[],
  fallbackMax: number
): NormalizedRadarLiteItem[] {
  return data
    .filter(item => item.label && Number.isFinite(item.value))
    .map(item => ({
      ...item,
      max: Math.max(1, item.max ?? fallbackMax),
    }));
}

export function getChartRadarLiteEffectStrength(effect: string): number {
  if (effect === LiteChartEffect.None) return 0;
  if (effect === LiteChartEffect.Subtle) return 0.65;
  return 1;
}

export function getRadarLitePoint(options: {
  cx: number;
  cy: number;
  radius: number;
  angle: number;
  ratio: number;
}) {
  return {
    x: options.cx + Math.cos(options.angle) * options.radius * options.ratio,
    y: options.cy + Math.sin(options.angle) * options.radius * options.ratio,
  };
}

export function normalizeRadarLiteLoopPhase(value: number): number {
  const phase = value % 1;
  return phase < 0 ? phase + 1 : phase;
}

export function getRadarLiteLoopDistance(a: number, b: number): number {
  const start = normalizeRadarLiteLoopPhase(a);
  const end = normalizeRadarLiteLoopPhase(b);
  const forward = Math.abs(end - start);
  return Math.min(forward, 1 - forward);
}

export function buildRadarLitePoints(options: {
  data: NormalizedRadarLiteItem[];
  cx: number;
  cy: number;
  radius: number;
}): RadarLitePoint[] {
  const count = options.data.length;
  return options.data.map((item, index): RadarLitePoint => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / count;
    const ratio = Math.max(0, Math.min(1, item.value / item.max));
    const point = getRadarLitePoint({
      cx: options.cx,
      cy: options.cy,
      radius: options.radius,
      angle,
      ratio,
    });
    return {
      label: item.label,
      value: item.value,
      ratio,
      angle,
      x: point.x,
      y: point.y,
    };
  });
}

export function resolveChartRadarLiteGeometry(options: {
  width: number;
  height: number;
  padding: number;
}) {
  return {
    cx: options.width / 2,
    cy: options.height / 2,
    radius: Math.max(1, Math.min(options.width, options.height) / 2 - options.padding),
  };
}

export function getChartRadarLiteLevels(levels: number): number {
  return Math.max(2, Math.round(levels));
}
