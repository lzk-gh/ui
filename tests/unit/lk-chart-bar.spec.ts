import { describe, expect, it } from 'vitest';
import {
  areChartBarTooltipStatesEqual,
  CHART_BAR_EMPTY_TOOLTIP,
  clampChartBarIndex,
  getChartBarEffectiveIndex,
  getChartBarHoverIndexFromPoint,
  getChartBarMaxValue,
  getChartBarNextAutoTooltipIndex,
  getChartBarXAxisLabelInterval,
  normalizeChartBarValues,
  resolveChartBarHeightStyle,
  resolveChartBarInitialHoverIndex,
  resolveChartBarItemColor,
  resolveChartBarLayout,
  resolveChartBarRootStyle,
  resolveChartBarTooltipState,
  resolveChartBarTooltipStyle,
  resolveChartBarTooltipText,
} from '../../src/uni_modules/lucky-ui/components/lk-chart-bar/chart-bar.utils';

describe('lk-chart-bar layout and tooltip rules', () => {
  it('normalizes height and root style', () => {
    expect(resolveChartBarHeightStyle(320)).toBe('320rpx');
    expect(resolveChartBarHeightStyle('240')).toBe('240rpx');
    expect(resolveChartBarHeightStyle('50vh')).toBe('50vh');

    const customStyle = { marginTop: '16rpx' };
    expect(resolveChartBarRootStyle({
      heightStyle: '320rpx',
      customStyle,
    })).toEqual([{ height: '320rpx' }, customStyle]);
  });

  it('clamps and resolves effective hover indexes', () => {
    expect(clampChartBarIndex(4, 3)).toBe(2);
    expect(clampChartBarIndex(-2, 3)).toBe(0);
    expect(clampChartBarIndex(0, 0)).toBe(-1);

    expect(getChartBarEffectiveIndex({
      tooltip: false,
      hoverIndex: 1,
      autoTooltip: true,
      tooltipAlways: true,
      defaultIndex: 0,
      length: 3,
    })).toBe(-1);
    expect(getChartBarEffectiveIndex({
      tooltip: true,
      hoverIndex: 2,
      autoTooltip: false,
      tooltipAlways: false,
      defaultIndex: 0,
      length: 3,
    })).toBe(2);
    expect(getChartBarEffectiveIndex({
      tooltip: true,
      hoverIndex: -1,
      autoTooltip: false,
      tooltipAlways: true,
      defaultIndex: 9,
      length: 3,
    })).toBe(2);

    expect(resolveChartBarInitialHoverIndex({
      autoTooltip: false,
      tooltipAlways: false,
      defaultIndex: 1,
      length: 3,
    })).toBe(-1);
    expect(getChartBarNextAutoTooltipIndex({ hoverIndex: 2, length: 3 })).toBe(0);
  });

  it('normalizes values and chart geometry', () => {
    expect(normalizeChartBarValues([
      { value: 10 },
      { value: -5 },
      { value: Number.NaN },
    ])).toEqual([10, 0, 0]);
    expect(getChartBarMaxValue([0, 2, 8])).toBe(8);
    expect(getChartBarMaxValue([])).toBe(1);

    expect(resolveChartBarLayout({
      width: 300,
      height: 200,
      padding: 24,
      showXAxisLabel: true,
      showAxis: true,
      length: 3,
      maxBarWidth: 40,
    })).toMatchObject({
      xLabelHeight: 18,
      yLabelWidth: 36,
      innerWidth: 216,
      innerHeight: 134,
      plotLeft: 60,
      plotTop: 24,
      plotBottom: 158,
      step: 72,
      barWidth: 40,
    });

    expect(getChartBarHoverIndexFromPoint({
      x: 210,
      plotLeft: 60,
      step: 72,
      length: 3,
    })).toBe(2);
    expect(getChartBarXAxisLabelInterval(13)).toBe(3);
  });

  it('resolves palette color and tooltip text', () => {
    const palette = {
      brand400: '#a',
      brand500: '#b',
      brand600: '#c',
      brand700: '#d',
      brand800: '#e',
      brand900: '#f',
    };

    expect(resolveChartBarItemColor({ value: 1, color: '#123456' }, 0, palette)).toBe('#123456');
    expect(resolveChartBarItemColor({ value: 1 }, 4, palette)).toBe('#e');
    expect(resolveChartBarTooltipText({ label: 'Q1', value: 12 }, 12)).toBe('Q1: 12');
    expect(resolveChartBarTooltipText({ value: 12 }, 12)).toBe('12');
  });

  it('builds bounded tooltip state and style', () => {
    const state = resolveChartBarTooltipState({
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
    expect(resolveChartBarTooltipStyle(state)).toEqual({
      left: '114px',
      top: '80px',
      width: '72px',
      '--lk-chart-tooltip-arrow-x': '36px',
    });
    expect(areChartBarTooltipStatesEqual(state, { ...state })).toBe(true);
    expect(areChartBarTooltipStatesEqual(state, CHART_BAR_EMPTY_TOOLTIP)).toBe(false);
  });
});
