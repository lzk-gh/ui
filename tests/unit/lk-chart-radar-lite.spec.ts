import { describe, expect, it } from 'vitest';
import { LiteChartEffect } from '../../src/uni_modules/lucky-ui/core/src/chart';
import {
  buildRadarLitePoints,
  getChartRadarLiteEffectStrength,
  getChartRadarLiteLevels,
  getRadarLiteLoopDistance,
  getRadarLitePoint,
  normalizeRadarLiteData,
  normalizeRadarLiteLoopPhase,
  resolveChartRadarLiteClass,
  resolveChartRadarLiteGeometry,
  resolveChartRadarLiteHeightStyle,
  resolveChartRadarLiteRootStyle,
} from '../../src/uni_modules/lucky-ui/components/lk-chart-radar-lite/chart-radar-lite.utils';

describe('lk-chart-radar-lite geometry and data rules', () => {
  it('builds root style and class', () => {
    expect(resolveChartRadarLiteHeightStyle(320)).toBe('320rpx');
    expect(resolveChartRadarLiteRootStyle({
      heightStyle: '320rpx',
      customStyle: { padding: '8rpx' },
    })).toEqual([{ height: '320rpx' }, { padding: '8rpx' }]);
    expect(resolveChartRadarLiteClass('wellness')).toEqual([
      'lk-chart-radar-lite',
      'wellness',
    ]);
  });

  it('normalizes radar data and geometry', () => {
    expect(normalizeRadarLiteData([
      { label: 'Sleep', value: 80 },
      { label: '', value: 20 },
      { label: 'Move', value: Number.NaN },
      { label: 'Mind', value: 50, max: 0 },
    ], 100)).toEqual([
      { label: 'Sleep', value: 80, max: 100 },
      { label: 'Mind', value: 50, max: 1 },
    ]);

    expect(resolveChartRadarLiteGeometry({
      width: 320,
      height: 240,
      padding: 42,
    })).toEqual({ cx: 160, cy: 120, radius: 78 });
    expect(getChartRadarLiteLevels(1.2)).toBe(2);
    expect(getChartRadarLiteEffectStrength(LiteChartEffect.Premium)).toBe(1);
  });

  it('resolves loop phase, point and polygon points', () => {
    expect(normalizeRadarLiteLoopPhase(-0.25)).toBe(0.75);
    expect(getRadarLiteLoopDistance(0.9, 0.1)).toBeCloseTo(0.2);
    expect(getRadarLitePoint({
      cx: 100,
      cy: 100,
      radius: 50,
      angle: 0,
      ratio: 0.5,
    })).toEqual({ x: 125, y: 100 });

    expect(buildRadarLitePoints({
      data: [
        { label: 'A', value: 50, max: 100 },
        { label: 'B', value: 100, max: 100 },
        { label: 'C', value: 150, max: 100 },
      ],
      cx: 100,
      cy: 100,
      radius: 60,
    })).toMatchObject([
      { label: 'A', ratio: 0.5, x: 100, y: 70 },
      { label: 'B', ratio: 1 },
      { label: 'C', ratio: 1 },
    ]);
  });
});
