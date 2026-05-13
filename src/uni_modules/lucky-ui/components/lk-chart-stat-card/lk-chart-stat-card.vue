<script setup lang="ts">
import type { StyleValue } from 'vue';
import { computed } from 'vue';
import LkChartSparkline from '../lk-chart-sparkline/lk-chart-sparkline.vue';
import { chartStatCardProps, StatCardTrend } from './chart-stat-card.props';
import { useLocale } from '../../composables/useLocale';

defineOptions({ name: 'LkChartStatCard' });

const props = defineProps(chartStatCardProps);
const { t } = useLocale('chartStatCard');

const classes = computed(() => [
  'lk-chart-stat-card',
  `is-${props.trend}`,
  {
    'is-chartless': !props.showChart,
  },
  props.customClass,
]);

const rootStyle = computed<StyleValue>(() => [
  {
    '--lk-chart-stat-accent': props.color === 'primary' ? 'var(--lk-color-primary)' : props.color,
  },
  props.customStyle as StyleValue,
]);

const trendLabel = computed(() => {
  if (props.trendText) return props.trendText;
  if (props.trend === StatCardTrend.Up) return t('trendUp');
  if (props.trend === StatCardTrend.Down) return t('trendDown');
  return t('trendFlat');
});

const trendIcon = computed(() => {
  if (props.trend === StatCardTrend.Up) return '↗';
  if (props.trend === StatCardTrend.Down) return '↘';
  return '→';
});
</script>

<template>
  <view :class="classes" :style="rootStyle">
    <view class="lk-chart-stat-card__header">
      <view class="lk-chart-stat-card__copy">
        <text class="lk-chart-stat-card__title">{{ title }}</text>
        <view class="lk-chart-stat-card__value-row">
          <text class="lk-chart-stat-card__value">{{ value }}</text>
          <text v-if="unit" class="lk-chart-stat-card__unit">{{ unit }}</text>
        </view>
      </view>
      <view class="lk-chart-stat-card__trend">
        <text class="lk-chart-stat-card__trend-icon">{{ trendIcon }}</text>
        <text>{{ trendLabel }}</text>
      </view>
    </view>

    <text v-if="description" class="lk-chart-stat-card__desc">{{ description }}</text>

    <view v-if="showChart" class="lk-chart-stat-card__chart">
      <lk-chart-sparkline
        :data="data"
        :height="chartHeight"
        :color="props.color"
        :tooltip="false"
        :show-end-point="true"
        :padding="8"
      />
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
