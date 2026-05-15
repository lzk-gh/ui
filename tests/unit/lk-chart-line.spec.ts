import { describe, expect, it } from 'vitest';
import {
  areChartLineTooltipStatesEqual,
  buildChartLineRenderPoints,
  CHART_LINE_EMPTY_TOOLTIP,
  clampChartLineIndex,
  getChartLineBezierSegments,
  getChartLineHoverIndexFromPoint,
  getChartLineXAxisLabelStride,
  isChartLineAutoAnimating,
  normalizeChartLineValues,
  resolveChartLineAutoTransition,
  resolveChartLineHeightStyle,
  resolveChartLineInitialHoverIndex,
  resolveChartLineInterpolatedTooltip,
  resolveChartLineLayout,
  resolveChartLineRootStyle,
  resolveChartLineTooltipState,
  resolveChartLineTooltipStyle,
  resolveChartLineTooltipText,
  resolveChartLineValueRange,
} from '../../src/uni_modules/lucky-ui/components/lk-chart-line/chart-line.utils';

describe('lk-chart-line geometry and tooltip rules', () => {
  it('normalizes height, root style and indexes', () => {
    expect(resolveChartLineHeightStyle(320)).toBe('320rpx');
    expect(resolveChartLineHeightStyle('240')).toBe('240rpx');
    expect(resolveChartLineHeightStyle('60vh')).toBe('60vh');

    const customStyle = { marginTop: '12rpx' };
    expect(resolveChartLineRootStyle({
      heightStyle: '320rpx',
      customStyle,
    })).toEqual([{ height: '320rpx' }, customStyle]);

    expect(clampChartLineIndex(-1, 3)).toBe(0);
    expect(clampChartLineIndex(9, 3)).toBe(2);
    expect(clampChartLineIndex(0, 0)).toBe(-1);
    expect(resolveChartLineInitialHoverIndex({
      autoTooltip: true,
      tooltipAlways: false,
      defaultIndex: 8,
      length: 3,
    })).toBe(2);
  });

  it('resolves value range, layout and render points', () => {
    const values = normalizeChartLineValues([
      { value: 10 },
      { value: Number.NaN },
      { value: 30 },
    ]);
    expect(values).toEqual([10, 0, 30]);
    expect(resolveChartLineValueRange([10, 20, 30])).toEqual({
      min: 10,
      max: 30,
      span: 20,
    });

    const layout = resolveChartLineLayout({
      width: 300,
      height: 200,
      padding: 24,
      showXAxisLabel: true,
      showAxis: true,
      length: 3,
    });
    expect(layout).toMatchObject({
      innerWidth: 216,
      innerHeight: 134,
      plotLeft: 60,
      plotTop: 24,
      plotBottom: 158,
      step: 108,
    });

    expect(buildChartLineRenderPoints({
      data: [{ value: 10 }, { value: 20, label: 'M' }, { value: 30 }],
      layout,
      min: 10,
      span: 20,
      progress: 1,
    })).toEqual([
      { x: 60, y: 158, v: 10, label: undefined },
      { x: 168, y: 91, v: 20, label: 'M' },
      { x: 276, y: 24, v: 30, label: undefined },
    ]);
  });

  it('builds bezier segments and hover indexes', () => {
    const points = [
      { x: 60, y: 158, v: 10 },
      { x: 168, y: 91, v: 20 },
      { x: 276, y: 24, v: 30 },
    ];

    expect(getChartLineBezierSegments(points)[0]).toEqual({
      cp1x: 78,
      cp1y: 146.83333333333334,
      cp2x: 132,
      cp2y: 113.33333333333333,
      x: 168,
      y: 91,
    });
    expect(getChartLineHoverIndexFromPoint({
      x: 230,
      plotLeft: 60,
      step: 108,
      length: 3,
    })).toBe(2);
    expect(getChartLineXAxisLabelStride(14)).toBe(3);
  });

  it('resolves auto transition and tooltip content', () => {
    expect(isChartLineAutoAnimating({
      autoFrom: 0,
      autoTo: 1,
      autoT: 0.5,
    })).toBe(true);
    expect(resolveChartLineAutoTransition({
      hoverIndex: -1,
      defaultIndex: 1,
      nextIndex: 9,
      length: 3,
    })).toEqual({ from: 1, to: 2 });

    expect(resolveChartLineTooltipText({ label: 'Q1', value: 12 })).toBe('Q1: 12');
    expect(resolveChartLineInterpolatedTooltip({
      from: { x: 0, y: 100, v: 10 },
      to: { x: 100, y: 0, v: 20, label: 'Q2' },
      t: 0.25,
    })).toEqual({
      x: 25,
      y: 75,
      text: 'Q2: 12.5',
    });
  });

  it('builds bounded tooltip state and style', () => {
    const state = resolveChartLineTooltipState({
      x: 150,
      y: 80,
      text: 'Q1: 12',
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
      text: 'Q1: 12',
    });
    expect(resolveChartLineTooltipStyle(state)).toEqual({
      left: '114px',
      top: '80px',
      width: '72px',
      '--lk-chart-tooltip-arrow-x': '36px',
    });
    expect(areChartLineTooltipStatesEqual(state, { ...state })).toBe(true);
    expect(areChartLineTooltipStatesEqual(state, CHART_LINE_EMPTY_TOOLTIP)).toBe(false);
  });
});
