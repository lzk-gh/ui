import { describe, expect, it } from 'vitest';
import {
  resolveChartStatCardClass,
  resolveChartStatCardRootStyle,
  resolveChartStatCardTrendIcon,
  resolveChartStatCardTrendLabel,
} from '../../src/uni_modules/lucky-ui/components/lk-chart-stat-card/chart-stat-card.utils';

describe('lk-chart-stat-card status and style rules', () => {
  it('resolves classes and accent color', () => {
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
    expect(resolveChartStatCardRootStyle({
      color: '#123456',
      customStyle: '',
    })).toEqual([
      { '--lk-chart-stat-accent': '#123456' },
      '',
    ]);
  });

  it('resolves trend label and icon', () => {
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
    expect(resolveChartStatCardTrendIcon('down')).toBe('↘');
    expect(resolveChartStatCardTrendIcon('flat')).toBe('→');
  });
});
