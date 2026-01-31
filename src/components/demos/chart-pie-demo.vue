<script setup lang="ts">
import { ref, computed } from 'vue';
import LkChartPie from '@/uni_modules/lucky-ui/components/lk-chart-pie/lk-chart-pie.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';
import LkSlider from '@/uni_modules/lucky-ui/components/lk-slider/lk-slider.vue';
import LkSwitch from '@/uni_modules/lucky-ui/components/lk-switch/lk-switch.vue';
import LkSegmented from '@/uni_modules/lucky-ui/components/lk-segmented/lk-segmented.vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkInput from '@/uni_modules/lucky-ui/components/lk-input/lk-input.vue';

type Slice = { label: string; value: number; color?: string };

const dataset = ref<'traffic' | 'budget' | 'many'>('traffic');
const options = [
  { label: '流量来源', value: 'traffic' },
  { label: '预算占比', value: 'budget' },
  { label: '多扇区', value: 'many' },
];

const traffic = ref<Slice[]>([
  { label: 'Search', value: 42 },
  { label: 'Ads', value: 18 },
  { label: 'Direct', value: 26 },
  { label: 'Other', value: 14 },
]);

const budget = ref<Slice[]>([
  { label: 'R&D', value: 35, color: '#6965db' },
  { label: 'Market', value: 25, color: '#4f8cff' },
  { label: 'Ops', value: 18, color: '#27c2a3' },
  { label: 'Other', value: 22, color: '#ff9f43' },
]);

const many = ref<Slice[]>(
  Array.from({ length: 9 }, (_, i) => ({ label: `S${i + 1}`, value: 5 + i }))
);

const donut = ref(true);
const donutWidth = ref(30);
const tooltip = ref(true);
const tooltipAlways = ref(false);
const autoTooltip = ref(false);
const autoTooltipInterval = ref(900);
const duration = ref(700);
const padding = ref(24);

const showTrack = ref(true);
const showCenterText = ref(true);
const centerTitle = ref('Total');
const highlightPulse = ref(true);

const data = computed(() => {
  if (dataset.value === 'budget') return budget.value;
  if (dataset.value === 'many') return many.value;
  return traffic.value;
});

function randomize() {
  const next = data.value.map(it => ({ ...it, value: Math.round(Math.random() * 40) + 5 }));
  if (dataset.value === 'budget') budget.value = next;
  else if (dataset.value === 'many') many.value = next;
  else traffic.value = next;
}

function reset() {
  dataset.value = 'traffic';
  donut.value = true;
  donutWidth.value = 30;
  tooltip.value = true;
  tooltipAlways.value = false;
  autoTooltip.value = false;
  autoTooltipInterval.value = 900;
  duration.value = 700;
  padding.value = 24;
  showTrack.value = true;
  showCenterText.value = true;
  centerTitle.value = 'Total';
  highlightPulse.value = true;
}
</script>

<template>
  <view class="component-demo">
    <demo-block
      title="ChartPie 饼/环图"
      desc="圆环端帽圆润（lineCap=round）+ 触摸 Tooltip + RAF 动画"
    >
      <view class="panel">
        <view class="row">
          <text class="label">数据集</text>
          <lk-segmented v-model="dataset" :options="options" size="sm" />
        </view>
        <view class="row">
          <text class="label">圆环模式</text>
          <lk-switch v-model="donut" />
        </view>
        <view class="row">
          <text class="label">厚度: {{ donutWidth }}rpx</text>
          <view class="slider">
            <lk-slider v-model="donutWidth" :min="10" :max="60" :step="2" show-value />
          </view>
        </view>
        <view class="row">
          <text class="label">底轨</text>
          <lk-switch v-model="showTrack" :disabled="!donut" />
        </view>
        <view class="row">
          <text class="label">Tooltip</text>
          <lk-switch v-model="tooltip" />
        </view>
        <view class="row">
          <text class="label">常驻 Tooltip</text>
          <lk-switch v-model="tooltipAlways" :disabled="!tooltip" />
        </view>
        <view class="row">
          <text class="label">轮播 Tooltip</text>
          <lk-switch v-model="autoTooltip" :disabled="!tooltip" />
        </view>
        <view class="row row--slider">
          <text class="label">轮播间隔: {{ autoTooltipInterval }}ms</text>
          <view class="slider">
            <lk-slider
              v-model="autoTooltipInterval"
              :min="300"
              :max="3000"
              :step="50"
              show-value
              :disabled="!tooltip || !autoTooltip"
            />
          </view>
        </view>
        <view class="row">
          <text class="label">中心信息</text>
          <lk-switch v-model="showCenterText" />
        </view>
        <view class="row">
          <text class="label">中心标题</text>
          <lk-input v-model="centerTitle" :disabled="!showCenterText" placeholder="Title" />
        </view>
        <view class="row">
          <text class="label">动画时长: {{ duration }}ms</text>
          <view class="slider">
            <lk-slider v-model="duration" :min="0" :max="1400" :step="50" show-value />
          </view>
        </view>
        <view class="row">
          <text class="label">Padding: {{ padding }}rpx</text>
          <view class="slider">
            <lk-slider v-model="padding" :min="0" :max="48" :step="2" show-value />
          </view>
        </view>
        <view class="row">
          <text class="label">高亮脉冲</text>
          <lk-switch v-model="highlightPulse" />
        </view>
        <view class="btns">
          <lk-button size="sm" @click="randomize">随机更新数据</lk-button>
          <lk-button size="sm" variant="outline" @click="reset">重置参数</lk-button>
        </view>
      </view>

      <view class="chart-wrap">
        <lk-chart-pie
          :data="data"
          :height="360"
          :donut="donut"
          :donut-width="donutWidth"
          :tooltip="tooltip"
          :tooltip-always="tooltipAlways"
          :auto-tooltip="autoTooltip"
          :auto-tooltip-interval="autoTooltipInterval"
          :animation-duration="duration"
          :padding="padding"
          :show-track="showTrack"
          :show-center-text="showCenterText"
          :center-title="centerTitle"
          :highlight-pulse="highlightPulse"
        />
      </view>
    </demo-block>
  </view>
</template>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding: 24rpx;
  background: var(--lk-color-bg-surface);
  border: 1rpx solid var(--lk-color-border-weak);
  border-radius: 16rpx;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.row--slider {
  align-items: flex-start;
}

.slider {
  flex: 1;
  width: 420rpx;
}

.label {
  font-size: 26rpx;
  color: var(--lk-color-text-secondary);
  flex: 0 0 auto;
}

.btns {
  display: flex;
  gap: 16rpx;
}

.chart-wrap {
  padding: 24rpx;
}
</style>
