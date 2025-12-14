<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <view class="roller-card">
        <lk-number-roller :value="dailyActive" />
        <text class="roller-label">今日活跃用户</text>
      </view>
      <lk-button size="sm" type="primary" @click="refreshDaily">刷新数据</lk-button>
    </demo-block>

    <demo-block title="动画速率调节">
      <view class="roller-card">
        <lk-number-roller :value="transactionVolume" :speed="rollerSpeed" />
        <text class="roller-label">交易成功次数</text>
      </view>
      <view class="slider-row">
        <text class="slider-tip">动画时长: {{ rollerSpeed }}ms</text>
        <lk-slider v-model="rollerSpeed" :min="200" :max="2000" :step="100" />
      </view>
    </demo-block>

    <demo-block title="货币风格 (两位小数)">
      <view class="currency-line">
        <text class="currency-symbol">¥</text>
        <lk-number-roller :value="revenue" :decimals="2" :digit-height="64" :speed="600" />
      </view>
      <lk-button size="sm" type="success" plain @click="boostRevenue">追加订单</lk-button>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import LkNumberRoller from '@/uni_modules/lucky-ui/components/lk-number-roller/lk-number-roller.vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkSlider from '@/uni_modules/lucky-ui/components/lk-slider/lk-slider.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const dailyActive = ref(12890);
const transactionVolume = ref(3560);
const revenue = ref(482345.78);
const rollerSpeed = ref(900);

let timer: ReturnType<typeof setInterval> | null = null;

const randomDelta = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const refreshDaily = () => {
  dailyActive.value += randomDelta(120, 420);
};

const boostRevenue = () => {
  revenue.value += randomDelta(200, 1200) * 1.2;
};

onMounted(() => {
  timer = setInterval(() => {
    dailyActive.value += randomDelta(50, 180);
    transactionVolume.value += randomDelta(30, 90);
  }, 2400);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.roller-card {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  padding: 24rpx;
  border-radius: var(--lk-radius-lg);
  background: var(--lk-color-bg-surface);
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.roller-label {
  font-size: 24rpx;
  color: var(--lk-color-text-secondary);
}

.slider-row {
  margin-top: 16rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.slider-tip {
  font-size: 24rpx;
  color: var(--lk-color-text-tertiary);
}

.currency-line {
  display: flex;
  align-items: flex-end;
  gap: 8rpx;
  padding: 24rpx;
  border-radius: var(--lk-radius-lg);
  background: linear-gradient(135deg, rgba(105, 101, 219, 0.12), rgba(105, 101, 219, 0.04));
}

.currency-symbol {
  font-size: 48rpx;
  color: var(--lk-color-primary);
  font-weight: 600;
  margin-bottom: 4rpx;
}
</style>
