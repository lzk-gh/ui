import type { StyleValue } from 'vue';
import { LiteChartEffect } from '../../core/src/chart';

export function resolveChartSparklineHeightStyle(height: string | number): string {
  if (typeof height === 'number') return `${height}rpx`;
  if (/^\d+$/.test(String(height))) return `${height}rpx`;
  return String(height);
}

export function resolveChartSparklineRootStyle(options: {
  heightStyle: string;
  customStyle: StyleValue;
}): StyleValue {
  return [{ height: options.heightStyle }, options.customStyle];
}

export function resolveChartSparklineClass(options: {
  tooltip: boolean;
  customClass?: unknown;
}) {
  return [
    'lk-chart-sparkline',
    {
      'is-interactive': options.tooltip,
    },
    options.customClass,
  ];
}

export function getChartSparklineEffectStrength(effect: string): number {
  if (effect === LiteChartEffect.None) return 0;
  if (effect === LiteChartEffect.Subtle) return 0.65;
  return 1;
}

export function resolveChartSparklineActiveIndex(options: {
  hoverIndex: number;
  pointCount: number;
  showEndPoint: boolean;
}): number {
  if (options.hoverIndex >= 0 && options.hoverIndex < options.pointCount) {
    return options.hoverIndex;
  }
  return options.showEndPoint && options.pointCount > 0 ? options.pointCount - 1 : -1;
}
