<script setup lang="ts">
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';
import LkChartArea from '@/uni_modules/lucky-ui/components/lk-chart-area/lk-chart-area.vue';
import LkChartRadarLite from '@/uni_modules/lucky-ui/components/lk-chart-radar-lite/lk-chart-radar-lite.vue';
import LkChartRing from '@/uni_modules/lucky-ui/components/lk-chart-ring/lk-chart-ring.vue';
import LkChartSparkline from '@/uni_modules/lucky-ui/components/lk-chart-sparkline/lk-chart-sparkline.vue';
import LkChartStatCard from '@/uni_modules/lucky-ui/components/lk-chart-stat-card/lk-chart-stat-card.vue';
import type { LiteChartPoint } from '@/uni_modules/lucky-ui/core/src/chart';
import type { RadarLiteItem } from '@/uni_modules/lucky-ui/components/lk-chart-radar-lite/chart-radar-lite.props';
import type { RingChartSegment } from '@/uni_modules/lucky-ui/components/lk-chart-ring/chart-ring.props';

const steps: LiteChartPoint[] = [
  { label: 'Mon', value: 6800 },
  { label: 'Tue', value: 7600 },
  { label: 'Wed', value: 7300 },
  { label: 'Thu', value: 9100 },
  { label: 'Fri', value: 10200 },
  { label: 'Sat', value: 11800 },
  { label: 'Sun', value: 12600 },
];

const sleep: LiteChartPoint[] = [
  { label: 'Mon', value: 6.8 },
  { label: 'Tue', value: 7.2 },
  { label: 'Wed', value: 6.4 },
  { label: 'Thu', value: 7.8 },
  { label: 'Fri', value: 7.6 },
  { label: 'Sat', value: 8.1 },
  { label: 'Sun', value: 7.9 },
];

const revenue: LiteChartPoint[] = [
  { label: '1', value: 28 },
  { label: '2', value: 34 },
  { label: '3', value: 32 },
  { label: '4', value: 45 },
  { label: '5', value: 52 },
  { label: '6', value: 49 },
  { label: '7', value: 64 },
  { label: '8', value: 71 },
];

const activitySegments: RingChartSegment[] = [
  { label: 'Move', value: 52 },
  { label: 'Exercise', value: 28 },
  { label: 'Stand', value: 20 },
];

const marketTrend: LiteChartPoint[] = [
  { label: '09:30', value: 62 },
  { label: '10:00', value: 66 },
  { label: '10:30', value: 64 },
  { label: '11:00', value: 73 },
  { label: '13:00', value: 76 },
  { label: '14:00', value: 82 },
  { label: '15:00', value: 88 },
];

const wellness: RadarLiteItem[] = [
  { label: '睡眠', value: 88 },
  { label: '活力', value: 76 },
  { label: '专注', value: 82 },
  { label: '恢复', value: 72 },
  { label: '压力', value: 62 },
  { label: '运动', value: 91 },
];
</script>

<template>
  <view class="component-demo">
    <demo-block title="Apple 风格指标卡" desc="轻量趋势线 + 指标摘要，适合首页、健康、财务卡片。">
      <view class="stat-grid">
        <view class="stat-item">
          <lk-chart-stat-card
            title="今日步数"
            value="12,680"
            unit="steps"
            description="比上周同日更活跃"
            trend="up"
            trend-text="+18%"
            :data="steps"
          />
        </view>
        <view class="stat-item">
          <lk-chart-stat-card
            title="睡眠"
            value="7.9"
            unit="h"
            description="深睡占比稳定"
            trend="flat"
            trend-text="稳定"
            :data="sleep"
          />
        </view>
      </view>
    </demo-block>

    <demo-block title="Sparkline 迷你趋势">
      <view class="spark-panel">
        <view class="spark-copy">
          <text class="spark-title">净收入趋势</text>
          <text class="spark-value">¥71k</text>
          <text class="spark-desc">去掉坐标轴，仅保留趋势和末端高亮。</text>
        </view>
        <lk-chart-sparkline :data="revenue" :height="160" :padding="16" />
      </view>
    </demo-block>

    <demo-block title="Area 面积趋势">
      <view class="area-panel">
        <view class="spark-copy">
          <text class="spark-title">Stock-like Intraday</text>
          <text class="spark-value">+8.6%</text>
          <text class="spark-desc"
            >保留 Apple Stocks 风格的大面积渐变与轻网格，触摸可查看点位。</text
          >
        </view>
        <lk-chart-area
          :data="marketTrend"
          :height="300"
          :default-index="marketTrend.length - 1"
          show-x-axis-label
        />
      </view>
    </demo-block>

    <demo-block title="Ring 轻量环图">
      <view class="ring-card">
        <view class="ring-chart">
          <lk-chart-ring
            title="92%"
            subtitle="Activity"
            :segments="activitySegments"
            :height="260"
            :stroke-width="26"
          />
        </view>
        <view class="ring-list">
          <view v-for="item in activitySegments" :key="item.label" class="ring-row">
            <text class="ring-label">{{ item.label }}</text>
            <text class="ring-value">{{ item.value }}%</text>
          </view>
        </view>
      </view>
    </demo-block>

    <demo-block title="RadarLite 能力雷达">
      <view class="radar-card">
        <view class="radar-chart">
          <lk-chart-radar-lite :data="wellness" :height="320" />
        </view>
        <view class="radar-copy">
          <text class="spark-title">Wellness Score</text>
          <text class="spark-value">82</text>
          <text class="spark-desc">适合健康维度、能力模型、评分分布等移动端轻量展示。</text>
        </view>
      </view>
    </demo-block>
  </view>
</template>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: var(--lk-spacing-lg);
}

.stat-grid {
  display: flex;
  gap: var(--lk-spacing-md);
}

.stat-item {
  flex: 1;
  min-width: 0;
}

.spark-panel,
.area-panel,
.radar-card,
.ring-card {
  padding: var(--lk-spacing-lg);
  border: var(--lk-rpx-2) solid var(--lk-color-border-light);
  border-radius: var(--lk-radius-xl);
  background: var(--lk-color-bg-container);
  box-shadow: var(--lk-shadow-sm);
  animation: chart-lite-card-in 420ms ease-out both;
}

.spark-copy {
  display: flex;
  flex-direction: column;
  gap: var(--lk-rpx-8);
  margin-bottom: var(--lk-spacing-md);
}

.spark-title,
.spark-desc,
.ring-label {
  color: var(--lk-color-text-secondary);
  font-size: var(--lk-font-size-sm);
}

.spark-value {
  color: var(--lk-color-text);
  font-size: var(--lk-rpx-48);
  font-weight: 800;
  line-height: 1;
}

.ring-card {
  display: flex;
  align-items: center;
  gap: var(--lk-spacing-lg);
  animation-delay: 120ms;
}

.radar-card {
  display: flex;
  align-items: center;
  gap: var(--lk-spacing-lg);
  animation-delay: 180ms;
}

.spark-panel {
  animation-delay: 40ms;
}

.area-panel {
  animation-delay: 80ms;
}

.ring-chart {
  flex: none;
  width: 280rpx;
  height: 260rpx;
}

.radar-chart {
  flex: none;
  width: 340rpx;
  height: 320rpx;
}

.radar-copy {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--lk-rpx-8);
}

.ring-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--lk-spacing-sm);
}

.ring-row {
  display: flex;
  justify-content: space-between;
  padding-bottom: var(--lk-spacing-xs);
  border-bottom: var(--lk-rpx-2) solid var(--lk-color-border-light);
  animation: chart-lite-fade-up 520ms ease-out both;
}

.ring-row:nth-child(1) {
  animation-delay: 240ms;
}

.ring-row:nth-child(2) {
  animation-delay: 320ms;
}

.ring-row:nth-child(3) {
  animation-delay: 400ms;
}

.ring-value {
  color: var(--lk-color-text);
  font-size: var(--lk-font-size-sm);
  font-weight: 700;
}

@keyframes chart-lite-card-in {
  0% {
    opacity: 0;
    transform: translateY(var(--lk-rpx-18)) scale(0.98);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes chart-lite-fade-up {
  0% {
    opacity: 0;
    transform: translateY(var(--lk-rpx-10));
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
