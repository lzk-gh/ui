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
  areChartAreaTooltipStatesEqual,
  CHART_AREA_EMPTY_TOOLTIP,
  getChartAreaEffectStrength,
  resolveChartAreaClass,
  resolveChartAreaHeightStyle,
  resolveChartAreaRootStyle,
  resolveChartAreaTooltipState,
  resolveChartAreaTooltipStyle,
} from '../../src/uni_modules/lucky-ui/components/lk-chart-area/chart-area.utils';

describe('lk-chart-area layout and tooltip rules', () => {
  it('maps chart ranges, positions, nearest point and compact numbers', () => {
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

  it('builds height, root style, class and effect strength', () => {
    expect(resolveChartAreaHeightStyle(300)).toBe('300rpx');
    expect(resolveChartAreaHeightStyle('240')).toBe('240rpx');
    expect(resolveChartAreaHeightStyle('50vh')).toBe('50vh');
    expect(resolveChartAreaRootStyle({
      heightStyle: '300rpx',
      customStyle: { marginTop: '8rpx' },
    })).toEqual([{ height: '300rpx' }, { marginTop: '8rpx' }]);
    expect(resolveChartAreaClass({
      tooltip: true,
      customClass: 'sales-area',
    })).toEqual([
      'lk-chart-area',
      { 'is-interactive': true },
      'sales-area',
    ]);
    expect(getChartAreaEffectStrength(LiteChartEffect.None)).toBe(0);
    expect(getChartAreaEffectStrength(LiteChartEffect.Subtle)).toBe(0.65);
    expect(getChartAreaEffectStrength(LiteChartEffect.Premium)).toBe(1);
  });

  it('builds bounded tooltip state and style', () => {
    const state = resolveChartAreaTooltipState({
      x: 150,
      y: 80,
      text: '1.2w',
      textWidth: 40,
      chartWidth: 200,
      px: value => value,
    });

    expect(state).toEqual({
      visible: true,
      x: 114,
      y: 80,
      width: 72,
      arrowX: 36,
      text: '1.2w',
    });
    expect(resolveChartAreaTooltipStyle(state)).toEqual({
      left: '114px',
      top: '80px',
      width: '72px',
      '--lk-chart-tooltip-arrow-x': '36px',
    });
    expect(areChartAreaTooltipStatesEqual(state, { ...state })).toBe(true);
    expect(areChartAreaTooltipStatesEqual(state, CHART_AREA_EMPTY_TOOLTIP)).toBe(false);
  });
});
