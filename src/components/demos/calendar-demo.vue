<script setup lang="ts">
import { ref } from 'vue';

const date1 = ref(new Date());
const date2 = ref(new Date());
const date3 = ref(new Date());
const date4 = ref(new Date());
const date5 = ref(new Date());
const date6 = ref(new Date());
const date7 = ref(new Date());
const dateRange = ref<[Date, Date]>([new Date(), new Date(Date.now() + 7 * 24 * 3600 * 1000)]);

const disabledDate = (date: Date) => {
  // 过去日期禁用
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

// 标记点
const markers = [
  { date: new Date(), color: 'var(--lk-color-primary)', type: 'dot' as const },
  { 
    date: new Date(Date.now() + 2 * 24 * 3600 * 1000), 
    color: 'var(--lk-color-success)', 
    type: 'bar' as const 
  },
  { 
    date: new Date(Date.now() + 5 * 24 * 3600 * 1000), 
    color: 'var(--lk-color-danger)', 
    type: 'dot' as const 
  }
];

// 自定义格式化
const formatter = (day: any) => {
  const date = day.date;
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();

  // 假设 5 月 1 日显示
  if (m === 5 && d === 1) {
    day.topText = '劳动节';
    day.bottomText = '休';
  }
  
  // 给今天加个小文字
  if (day.isToday) {
    day.topText = '今天';
  }

  // 价格示例
  if (d % 5 === 0) {
    day.bottomText = '￥99';
  }

  return day;
};
</script>

<template>
  <view class="component-demo">
    <demo-block title="农历与节假日">
      <lk-calendar v-model="date6" show-lunar show-holiday />
    </demo-block>

    <demo-block title="日期标记点">
      <lk-calendar v-model="date7" :markers="markers" />
    </demo-block>

    <demo-block title="自定义格式化 (价格/备注)">
      <lk-calendar v-model="date1" :formatter="formatter" />
    </demo-block>

    <demo-block title="日期范围选择">
      <lk-calendar v-model="dateRange" type="range" />
    </demo-block>

    <demo-block title="可切换周/月视图">
      <lk-calendar v-model="date5" />
      <view class="demo-tip">支持上下拖拽切换周/月视图，左右滑动切换月份</view>
    </demo-block>

    <demo-block title="快捷选项">
      <lk-calendar v-model="date4" show-shortcuts />
    </demo-block>

    <demo-block title="禁用日期">
      <lk-calendar v-model="date3" :disabled-date="disabledDate" />
    </demo-block>

    <demo-block title="自定义颜色">
      <lk-calendar v-model="date2" color="success" />
    </demo-block>
  </view>
</template>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
  padding-bottom: 40rpx;
}

.demo-tip {
  margin-top: 12rpx;
  padding: 16rpx;
  font-size: 24rpx;
  color: var(--lk-color-text-secondary);
  background-color: var(--lk-color-fill-quaternary);
  border-radius: var(--lk-radius-sm);
}
</style>
