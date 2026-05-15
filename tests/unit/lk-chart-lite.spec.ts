import { describe, expect, it } from 'vitest';
import {
  formatCompactNumber,
  getLiteChartPositions,
  getLiteChartRange,
  getNearestPointIndex,
  LiteChartEffect,
  movingWindow,
  oscillate,
} from '../../src/uni_modules/lucky-ui/core/src/chart';
import {
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
  buildRadarLitePoints,
} from '../../src/uni_modules/lucky-ui/components/lk-chart-radar-lite/chart-radar-lite.utils';
import {
  getChartRingCapSweep,
  getChartRingEffectStrength,
  getChartRingOverlapAngle,
  getChartRingTotal,
  normalizeChartRingSegments,
  resolveChartRingCenterSubtitle,
  resolveChartRingCenterTitle,
  resolveChartRingClass,
  resolveChartRingGeometry,
  resolveChartRingHeightStyle,
  resolveChartRingRootStyle,
  resolveChartRingSegmentColor,
} from '../../src/uni_modules/lucky-ui/components/lk-chart-ring/chart-ring.utils';
import {
  resolveChartStatCardClass,
  resolveChartStatCardRootStyle,
  resolveChartStatCardTrendIcon,
  resolveChartStatCardTrendLabel,
} from '../../src/uni_modules/lucky-ui/components/lk-chart-stat-card/chart-stat-card.utils';

describe('chart-lite aggregate chart rules', () => {
  it('maps lite chart ranges, positions, nearest points and compact numbers', () => {
    expect(getLiteChartRange([
      { value: 10 },
      { value: Number.NaN },
      { value: 30 },
    ])).toEqual({ min: 0, max: 30, span: 30 });

    const positions = getLiteChartPositions([
      { label: 'A', value: 10 },
      { label: 'B', value: 20 },
      { label: 'C', value: 30 },
    ], 300, 160, 20);

    expect(positions).toEqual([
      { label: 'A', value: 10, x: 20, y: 140 },
      { label: 'B', value: 20, x: 150, y: 80 },
      { label: 'C', value: 30, x: 280, y: 20 },
    ]);
    expect(getNearestPointIndex(positions, 170)).toBe(1);
    expect(formatCompactNumber(12345)).toBe('1.2w');
    expect(formatCompactNumber(1288)).toBe('1.3k');
    expect(formatCompactNumber(12.34)).toBe('12.3');

    expect(oscillate(0.5)).toBe(1);
    expect(movingWindow(0.5, 0.5, 0.2)).toBe(1);
  });

  it('resolves stat card classes, accent, trend label and icon', () => {
    expect(resolveChartStatCardClass({
      trend: 'up',
      showChart: false,
      customClass: 'revenue-card',
    })).toEqual([
      'lk-chart-stat-card',
      'is-up',
      { 'is-chartless': true },
      'revenue-card',
    ]);

    expect(resolveChartStatCardRootStyle({
      color: 'primary',
      customStyle: { marginTop: '8rpx' },
    })).toEqual([
      { '--lk-chart-stat-accent': 'var(--lk-color-primary)' },
      { marginTop: '8rpx' },
    ]);
    expect(resolveChartStatCardTrendLabel({
      trendText: '',
      trend: 'down',
      t: key => `i18n:${key}`,
    })).toBe('i18n:trendDown');
    expect(resolveChartStatCardTrendLabel({
      trendText: '自定义',
      trend: 'flat',
      t: key => key,
    })).toBe('自定义');
    expect(resolveChartStatCardTrendIcon('up')).toBe('↗');
    expect(resolveChartStatCardTrendIcon('flat')).toBe('→');
  });

  it('normalizes ring data, center text and arc geometry', () => {
    const single = normalizeChartRingSegments({
      segments: [],
      value: 120,
      max: 100,
      title: '',
    });
    expect(single).toEqual([{ label: 'Progress', value: 100 }]);

    const segments = normalizeChartRingSegments({
      segments: [
        { label: 'A', value: 10 },
        { label: 'B', value: 0 },
        { label: 'C', value: 20, color: '#123456' },
      ],
      value: 0,
      max: 100,
      title: '',
    });
    expect(segments).toEqual([
      { label: 'A', value: 10 },
      { label: 'C', value: 20, color: '#123456' },
    ]);
    expect(resolveChartRingCenterTitle({
      title: '',
      segments,
      normalizedSegments: segments,
      value: 0,
      max: 100,
    })).toBe('30');
    expect(resolveChartRingCenterSubtitle({ subtitle: '', segments })).toBe('Total');

    expect(resolveChartRingHeightStyle('240')).toBe('240rpx');
    expect(resolveChartRingRootStyle({
      heightStyle: '240rpx',
      customStyle: { opacity: 0.9 },
    })).toEqual([{ height: '240rpx' }, { opacity: 0.9 }]);
    expect(resolveChartRingClass('ring-card')).toEqual(['lk-chart-ring', 'ring-card']);
    expect(resolveChartRingGeometry({
      width: 240,
      height: 200,
      padding: 20,
      strokeWidth: 24,
    })).toEqual({ cx: 120, cy: 100, radius: 68 });
    expect(getChartRingTotal({ hasSegments: true, segments, max: 100 })).toBe(30);
    expect(getChartRingEffectStrength(LiteChartEffect.Subtle)).toBe(0.65);
    expect(getChartRingOverlapAngle({
      segmentCount: 2,
      strokeWidth: 24,
      radius: 68,
    })).toBeCloseTo(Math.PI / 8);
    expect(getChartRingCapSweep({
      overlapAngle: 0.3,
      sweep: 0.2,
      fullSweep: 1,
    })).toBe(0.2);

    const palette = {
      brand300: '#0',
      brand400: '#1',
      brand600: '#2',
      brand700: '#3',
    };
    expect(resolveChartRingSegmentColor({ value: 1 }, 2, palette)).toBe('#3');
    expect(resolveChartRingSegmentColor({ value: 1, color: '#abc' }, 2, palette)).toBe('#abc');
  });

  it('normalizes radar data, geometry, loop phase and points', () => {
    expect(resolveChartRadarLiteHeightStyle(320)).toBe('320rpx');
    expect(resolveChartRadarLiteRootStyle({
      heightStyle: '320rpx',
      customStyle: { padding: '8rpx' },
    })).toEqual([{ height: '320rpx' }, { padding: '8rpx' }]);
    expect(resolveChartRadarLiteClass('wellness')).toEqual([
      'lk-chart-radar-lite',
      'wellness',
    ]);

    const data = normalizeRadarLiteData([
      { label: 'Sleep', value: 80 },
      { label: '', value: 20 },
      { label: 'Move', value: Number.NaN },
      { label: 'Mind', value: 50, max: 0 },
    ], 100);
    expect(data).toEqual([
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
