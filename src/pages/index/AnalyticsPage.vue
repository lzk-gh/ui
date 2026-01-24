<template>
  <view class="analytics-page" :class="themeClass" :style="{ height: contentHeight }">
    <scroll-view scroll-y show-scrollbar="false" class="full-scroll">
      <view v-if="chartDisplay" :class="chartClasses" :style="chartStyles">
        <view class="analytics-header">
          <text class="title">Spending Insights</text>
          <view class="period-tabs">
            <view v-for="p in periods" :key="p" :class="['p-tab', activePeriod === p ? 'active' : '']" @click="setPeriod(p)">
              {{ p }}
            </view>
          </view>
        </view>

        <!-- 总览卡片 -->
        <view class="summary-card">
          <view class="summary-info">
            <text class="label">Total Spent</text>
            <text class="amount">${{ analyticsData.total }}</text>
            <view class="trend" :class="analyticsData.trendPositive ? 'positive' : 'negative'">
              <lk-icon :name="analyticsData.trendPositive ? 'arrow-up-right' : 'arrow-down-right'" size="24" />
              <text>{{ analyticsData.trend }} {{ analyticsData.trendLabel }}</text>
            </view>
          </view>
          <view class="mini-graph">
            <view v-for="(h, idx) in analyticsData.miniBars" :key="idx" class="bar" :style="{ height: h + '%' }"></view>
          </view>
        </view>

        <!-- 折线趋势 -->
        <view class="section-title">Spending Trend</view>
        <view class="line-card">
          <lk-chart-line
            :data="analyticsData.lineData"
            height="320"
            :padding="24"
            :line-width="6"
            area-gradient
            gradient
            show-axis
            show-x-axis-label
            tooltip
            auto-tooltip
          />
        </view>

        <!-- 类别统计 -->
        <view class="section-title">Expense Categories</view>
        <view class="category-list">
          <view v-for="(cat, i) in analyticsData.categories" :key="i" class="category-item">
            <view class="cat-icon" :style="{ backgroundColor: cat.color + '20' }">
              <lk-icon :name="cat.icon" size="40" :color="cat.color" />
            </view>
            <view class="cat-info">
              <view class="cat-top">
                <text class="cat-name">{{ cat.name }}</text>
                <text class="cat-amount">${{ cat.amount }}</text>
              </view>
              <lk-progress :percentage="cat.percent" :stroke-width="12" :color="cat.color" striped />
            </view>
          </view>
        </view>

        <!-- 对比趋势（图表替代方案） -->
        <view class="section-title">Trend Comparison</view>
        <view class="comparison-grid">
          <view v-for="item in analyticsData.compare" :key="item.label" class="compare-item">
            <text class="month">{{ item.label }}</text>
            <view class="bar-wrap">
              <view class="bar-val" :style="{ height: (item.value / compareMax) * 100 + '%' }"></view>
            </view>
            <text class="val">${{ item.value }}</text>
          </view>
        </view>

        <view style="height: 100rpx;"></view>
      </view>
    </scroll-view>
    <lk-toast ref="toastRef" />
  </view>
</template>

<script setup lang="ts">
import { ref, inject, computed } from 'vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import LkProgress from '@/uni_modules/lucky-ui/components/lk-progress/lk-progress.vue';
import LkToast from '@/uni_modules/lucky-ui/components/lk-toast/lk-toast.vue';
import LkChartLine from '@/uni_modules/lucky-ui/components/lk-chart-line/lk-chart-line.vue';
import { useTransition } from '@/uni_modules/lucky-ui/composables/useTransition';

defineProps<{
  contentHeight: string;
}>();

const themeClass = inject('themeClass', ref('lk-theme-light'));

const periods = ['Weekly', 'Monthly', 'Yearly'];
const activePeriod = ref('Monthly');

const toastRef = ref();
const chartVisible = ref(true);

type Category = { name: string; amount: string; percent: number; icon: string; color: string };
type CompareItem = { label: string; value: number };
type LinePoint = { label: string; value: number };
type AnalyticsData = {
  total: string;
  trend: string;
  trendLabel: string;
  trendPositive: boolean;
  miniBars: number[];
  lineData: LinePoint[];
  categories: Category[];
  compare: CompareItem[];
};

const periodDataMap: Record<string, AnalyticsData> = {
  Weekly: {
    total: '940.20',
    trend: '+4.2%',
    trendLabel: 'from last week',
    trendPositive: true,
    miniBars: [30, 40, 20, 50, 60, 45, 35],
    lineData: [
      { label: 'Mon', value: 120 },
      { label: 'Tue', value: 180 },
      { label: 'Wed', value: 90 },
      { label: 'Thu', value: 210 },
      { label: 'Fri', value: 160 },
      { label: 'Sat', value: 200 },
      { label: 'Sun', value: 140 }
    ],
    categories: [
      { name: 'Apparel', amount: '320', percent: 55, icon: 'tag', color: '#6366f1' },
      { name: 'Accessories', amount: '210', percent: 38, icon: 'watch', color: '#f59e0b' },
      { name: 'Footwear', amount: '160', percent: 28, icon: 'truck', color: '#10b981' },
      { name: 'Other', amount: '90', percent: 16, icon: 'grid', color: '#64748b' }
    ],
    compare: [
      { label: 'Mon', value: 140 },
      { label: 'Tue', value: 180 },
      { label: 'Wed', value: 120 },
      { label: 'Thu', value: 200 },
      { label: 'Fri', value: 160 }
    ]
  },
  Monthly: {
    total: '2,840.50',
    trend: '+12.5%',
    trendLabel: 'from last month',
    trendPositive: true,
    miniBars: [40, 60, 30, 80, 50, 90, 70],
    lineData: [
      { label: 'W1', value: 320 },
      { label: 'W2', value: 480 },
      { label: 'W3', value: 360 },
      { label: 'W4', value: 520 }
    ],
    categories: [
      { name: 'Apparel', amount: '1,240', percent: 75, icon: 'tag', color: '#6366f1' },
      { name: 'Accessories', amount: '820', percent: 45, icon: 'watch', color: '#f59e0b' },
      { name: 'Footwear', amount: '450', percent: 30, icon: 'truck', color: '#10b981' },
      { name: 'Other', amount: '330', percent: 20, icon: 'grid', color: '#64748b' }
    ],
    compare: [
      { label: 'Oct', value: 820 },
      { label: 'Nov', value: 980 },
      { label: 'Dec', value: 1040 }
    ]
  },
  Yearly: {
    total: '31,420.80',
    trend: '-3.1%',
    trendLabel: 'from last year',
    trendPositive: false,
    miniBars: [70, 60, 80, 50, 90, 75, 65],
    lineData: [
      { label: 'Q1', value: 8400 },
      { label: 'Q2', value: 9200 },
      { label: 'Q3', value: 7800 },
      { label: 'Q4', value: 6020 }
    ],
    categories: [
      { name: 'Apparel', amount: '12,400', percent: 68, icon: 'tag', color: '#6366f1' },
      { name: 'Accessories', amount: '8,200', percent: 45, icon: 'watch', color: '#f59e0b' },
      { name: 'Footwear', amount: '6,100', percent: 32, icon: 'truck', color: '#10b981' },
      { name: 'Other', amount: '4,720', percent: 25, icon: 'grid', color: '#64748b' }
    ],
    compare: [
      { label: '2023', value: 11200 },
      { label: '2024', value: 10850 },
      { label: '2025', value: 9420 }
    ]
  }
};

const analyticsData = ref<AnalyticsData>(periodDataMap[activePeriod.value]);

const compareMax = computed(() => {
  const values = analyticsData.value?.compare?.map((i) => i.value) || [1];
  return Math.max(...values, 1);
});

const { classes: chartClasses, styles: chartStyles, display: chartDisplay } = useTransition(
  () => chartVisible.value,
  { name: 'fade-up', duration: 260 }
);

const setPeriod = (p: string) => {
  if (p === activePeriod.value) return;
  activePeriod.value = p;
  chartVisible.value = false;
  setTimeout(() => {
    analyticsData.value = periodDataMap[p];
    chartVisible.value = true;
    toastRef.value?.show({ message: `${p} insights updated`, type: 'info' });
  }, 350);
};
</script>

<style lang="scss" scoped>
@import '@/styles/test-page.scss';

.analytics-page {
  background-color: $test-bg-page;
}

.full-scroll {
  height: 100%;
}

.analytics-header {
  padding: 40rpx;

  .title {
    font-size: 48rpx;
    font-weight: 800;
    color: $test-text-primary;
    display: block;
    margin-bottom: 30rpx;
  }
}

.period-tabs {
  display: flex;
  background: $test-gray-100;
  padding: 8rpx;
  border-radius: 40rpx;
  width: fit-content;

  .p-tab {
    padding: 16rpx 40rpx;
    font-size: 24rpx;
    color: $test-text-secondary;
    border-radius: 32rpx;
    transition: all 0.3s;

    &.active {
      background: $test-bg-card;
      color: $test-text-primary;
      box-shadow: $test-shadow-sm;
      font-weight: bold;
    }
  }
}

.summary-card {
  margin: 0 40rpx 40rpx;
  background: $test-text-primary;
  border-radius: 48rpx;
  padding: 50rpx;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  color: #fff;
  box-shadow: $test-shadow-md;

  .label {
    font-size: 28rpx;
    opacity: 0.7;
    display: block;
    margin-bottom: 10rpx;
  }

  .amount {
    font-size: 56rpx;
    font-weight: 800;
    display: block;
    margin-bottom: 20rpx;
  }

  .trend {
    display: flex;
    align-items: center;
    gap: 8rpx;
    font-size: 22rpx;
    &.positive { color: #4ade80; }
    &.negative { color: #f87171; }
  }

  .mini-graph {
    height: 120rpx;
    display: flex;
    align-items: flex-end;
    gap: 12rpx;

    .bar {
      width: 12rpx;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 6rpx;
      &:last-child {
        background: #fff;
      }
    }
  }
}

.section-title {
  padding: 0 40rpx;
  font-size: 32rpx;
  font-weight: bold;
  color: $test-text-primary;
  margin-bottom: 30rpx;
}

.line-card {
  margin: 0 40rpx 50rpx;
  background: $test-bg-card;
  border-radius: 32rpx;
  padding: 20rpx 10rpx 10rpx;
  box-shadow: $test-shadow-sm;
}

.category-list {
  padding: 0 40rpx;
  margin-bottom: 60rpx;

  .category-item {
    display: flex;
    gap: 30rpx;
    margin-bottom: 40rpx;

    .cat-icon {
      width: 100rpx;
      height: 100rpx;
      border-radius: 30rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .cat-info {
      flex: 1;

      .cat-top {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12rpx;

        .cat-name { font-size: 28rpx; font-weight: bold; color: $test-text-primary; }
        .cat-amount { font-size: 28rpx; color: $test-text-secondary; }
      }
    }
  }
}

.comparison-grid {
  padding: 0 40rpx;
  display: flex;
  justify-content: space-between;
  text-align: center;

  .compare-item {
    width: 200rpx;
    background: $test-bg-card;
    padding: 30rpx;
    border-radius: 32rpx;

    .month { font-size: 24rpx; color: $test-text-secondary; }

    .bar-wrap {
      height: 150rpx;
      background: $test-gray-100;
      margin: 20rpx auto;
      width: 16rpx;
      border-radius: 8rpx;
      display: flex;
      align-items: flex-end;

      .bar-val {
        width: 100%;
        background: $test-primary;
        border-radius: 8rpx;
      }
    }

    .val { font-size: 24rpx; font-weight: bold; color: $test-text-primary; }
  }
}
</style>
