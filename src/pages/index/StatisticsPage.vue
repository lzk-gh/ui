<template>
  <scroll-view class="statistics-page" :style="{ height: contentHeight }" scroll-y>
    <lk-sticky :offset-top="0">
      <lk-tabs v-model="activeTab" background="#fff">
        <lk-tab-pane name="day" label="日报" />
        <lk-tab-pane name="week" label="周报" />
        <lk-tab-pane name="month" label="月报" />
      </lk-tabs>
    </lk-sticky>

    <lk-space direction="vertical" :gap="24">
      <!-- 核心指标 -->
      <lk-card shadow="base">
        <template #header>
          <lk-space align="center" justify="between" fill>
            <text style="font-weight: bold; font-size: 30rpx;">核心指标</text>
          </lk-space>
        </template>

        <template #header-extra>
          <lk-segmented v-model="statType" :options="statOptions" size="sm" />
        </template>

        <lk-grid :columns="2" :border="false">
          <lk-space direction="vertical" align="center" :gap="8">
            <lk-number-roller :value="kpi.totalVisit" :digit-height="40" color="var(--lk-color-primary)" />
            <text style="font-size: 24rpx; color: var(--lk-color-text-secondary);">总访问量</text>
          </lk-space>
          <lk-space direction="vertical" align="center" :gap="8">
            <lk-number-roller :value="kpi.activeUser" :digit-height="40" color="var(--lk-color-primary)" />
            <text style="font-size: 24rpx; color: var(--lk-color-text-secondary);">活跃用户</text>
          </lk-space>
        </lk-grid>
      </lk-card>

      <!-- 项目进度 -->
      <lk-card title="项目进度" shadow="base">
        <lk-space direction="vertical" :gap="32">
          <lk-space direction="vertical" :gap="12">
            <lk-space justify="between" fill>
              <text style="font-size: 26rpx;">前端开发</text>
              <lk-tag type="light" size="sm" bg-color="var(--lk-color-primary-bg-soft)" text-color="var(--lk-color-primary)">进行中</lk-tag>
            </lk-space>
            <lk-progress :percentage="85" :stroke="12" show-pivot />
          </lk-space>

          <lk-space direction="vertical" :gap="12">
            <lk-space justify="between" fill>
              <text style="font-size: 26rpx;">后端接口</text>
              <lk-tag type="light" size="sm" bg-color="var(--lk-color-warning-bg-soft)" text-color="var(--lk-color-warning)">延迟</lk-tag>
            </lk-space>
            <lk-progress :percentage="60" :stroke="12" color="var(--lk-color-warning)" show-pivot />
          </lk-space>

          <lk-space direction="vertical" :gap="12">
            <lk-space justify="between" fill>
              <text style="font-size: 26rpx;">UI 设计</text>
              <lk-tag type="light" size="sm" bg-color="var(--lk-color-success-bg-soft)" text-color="var(--lk-color-success)">已完成</lk-tag>
            </lk-space>
            <lk-progress :percentage="100" :stroke="12" color="var(--lk-color-success)" show-pivot />
          </lk-space>
        </lk-space>
      </lk-card>

      <!-- 访问趋势 -->
      <lk-card title="访问趋势" shadow="base">
        <template #header-extra>
          <lk-button size="sm" plain icon="download">导出</lk-button>
        </template>
        <lk-chart-line :data="lineChartData" height="400rpx" />
      </lk-card>

      <!-- 最近动态 -->
      <lk-card title="最近动态" shadow="base">
        <lk-timeline>
          <lk-timeline-item time="2026-01-02 10:00" title="发布 v1.0.0 正式版" color="var(--lk-color-primary)" />
          <lk-timeline-item time="2026-01-01 15:30" title="完成所有基础组件开发" />
          <lk-timeline-item time="2025-12-25 09:00" title="项目立项" />
        </lk-timeline>
      </lk-card>
    </lk-space>

    <lk-backtop />
  </scroll-view>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch } from 'vue';

// 组件导入
import LkTabs from '@/uni_modules/lucky-ui/components/lk-tabs/lk-tabs.vue';
import LkTabPane from '@/uni_modules/lucky-ui/components/lk-tabs/lk-tab-pane.vue';
import LkCard from '@/uni_modules/lucky-ui/components/lk-card/lk-card.vue';
import LkProgress from '@/uni_modules/lucky-ui/components/lk-progress/lk-progress.vue';
import LkChartLine from '@/uni_modules/lucky-ui/components/lk-chart-line/lk-chart-line.vue';
import LkSpace from '@/uni_modules/lucky-ui/components/lk-space/lk-space.vue';
import LkGrid from '@/uni_modules/lucky-ui/components/lk-grid/lk-grid.vue';
import LkTimeline from '@/uni_modules/lucky-ui/components/lk-timeline/lk-timeline.vue';
import LkTimelineItem from '@/uni_modules/lucky-ui/components/lk-timeline/lk-timeline-item.vue';
import LkSegmented from '@/uni_modules/lucky-ui/components/lk-segmented/lk-segmented.vue';
import LkBacktop from '@/uni_modules/lucky-ui/components/lk-backtop/lk-backtop.vue';
import LkNumberRoller from '@/uni_modules/lucky-ui/components/lk-number-roller/lk-number-roller.vue';
import LkSticky from '@/uni_modules/lucky-ui/components/lk-sticky/lk-sticky.vue';
import LkTag from '@/uni_modules/lucky-ui/components/lk-tag/lk-tag.vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';

defineProps<{ contentHeight: string }>();

const activeTab = ref<string | number>('day');
const statType = ref('visit');
const statOptions = [
  { label: '访问', value: 'visit' },
  { label: '用户', value: 'user' },
];

const kpi = ref({
  totalVisit: 12580,
  activeUser: 3240,
  conversion: 2.1,
});

const lineChartData = ref([
  { label: '周一', value: 120 },
  { label: '周二', value: 200 },
  { label: '周三', value: 150 },
  { label: '周四', value: 80 },
  { label: '周五', value: 70 },
  { label: '周六', value: 110 },
  { label: '周日', value: 130 },
]);

let timer: ReturnType<typeof setInterval> | null = null;

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startMock() {
  if (timer) return;
  timer = setInterval(() => {
    if (statType.value === 'visit') {
      kpi.value.totalVisit += rand(30, 180);
      kpi.value.activeUser += rand(8, 45);
    } else {
      kpi.value.totalVisit += rand(10, 80);
      kpi.value.activeUser += rand(15, 65);
    }
    kpi.value.conversion = Math.max(0.5, Math.min(9.9, Math.round((kpi.value.conversion + (Math.random() - 0.45) * 0.3) * 10) / 10));

    const next = lineChartData.value.map((p) => {
      const v = Math.max(20, p.value + rand(-25, 35));
      return { ...p, value: v };
    });
    lineChartData.value = next;
  }, 1800);
}

function stopMock() {
  if (!timer) return;
  clearInterval(timer);
  timer = null;
}

watch([activeTab, statType], () => {
  // 切换日报/周报/月报 或 指标类型时，给一点“跳变”更像真实数据
  const boost = activeTab.value === 'day' ? 1 : activeTab.value === 'week' ? 3 : 6;
  kpi.value.totalVisit += rand(120, 380) * boost;
  kpi.value.activeUser += rand(30, 120) * boost;
});

startMock();

onUnmounted(() => {
  stopMock();
});
</script>

<style scoped lang="scss">
.statistics-page {
  background-color: var(--lk-color-bg-layout);
}
</style>
