<script setup lang="ts">
import { ref } from 'vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';
import LkCalendar from '@/uni_modules/lucky-ui/components/lk-calendar/lk-calendar.vue';
import type {
  CalendarDayExtra,
  CalendarHolidayItem,
} from '@/uni_modules/lucky-ui/components/lk-calendar/calendar.props';

const today = new Date();
const rangeEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6);

const singleDate = ref<Date | null>(today);
const rangeDate = ref<[Date | null, Date | null]>([today, rangeEnd]);
const multipleDate = ref<Date[]>([
  today,
  new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
]);
const weekDate = ref<[Date | null, Date | null]>([null, null]);
const readonlyDate = ref<Date | null>(today);
const travelRange = ref<[Date | null, Date | null]>([null, null]);

const holidayData: CalendarHolidayItem[] = [
  { date: '2026-01-01', name: '元旦', type: 'holiday' },
  { date: '2026-02-17', name: '春节', type: 'holiday' },
  { date: '2026-02-18', name: '春节', type: 'holiday' },
  { date: '2026-02-14', name: '补班', type: 'workday' },
  { date: '2026-04-05', name: '清明', type: 'holiday' },
  { date: '2026-05-01', name: '劳动节', type: 'holiday' },
  { date: '2026-06-19', name: '端午', type: 'holiday' },
  { date: '2026-09-25', name: '中秋', type: 'holiday' },
  { date: '2026-10-01', name: '国庆', type: 'holiday' },
];

const extraData: CalendarDayExtra[] = [
  { date: '2026-04-27', label: '¥399', subLabel: '余12', dot: true },
  { date: '2026-04-28', label: '约满', disabled: true },
  { date: '2026-05-01', label: '热门', badge: '惠' },
  { date: '2026-05-02', label: '¥520', dot: true },
];

const travelData: CalendarDayExtra[] = Array.from({ length: 90 }, (_, index) => {
  const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + index);
  const dateKey = `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}-${`${date.getDate()}`.padStart(2, '0')}`;
  const price = 299 + ((index * 37) % 260);
  return {
    date: dateKey,
    label: `¥${price}`,
    subLabel: index % 9 === 0 ? '紧张' : index % 5 === 0 ? '特惠' : '可订',
    badge: index % 11 === 0 ? '低' : undefined,
    dot: index % 4 === 0,
    disabled: index === 3 || index === 17,
  };
});

function disabledBeforeToday(date: Date) {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const now = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  return day < now;
}
</script>

<template>
  <view class="component-demo">
    <demo-block title="中国日历">
      <lk-calendar
        v-model="singleDate"
        value-type="date"
        :holiday-data="holidayData"
        :extra-data="extraData"
      />
      <view class="demo-tip">移动端点击日期可直接选中，左右滑动仍可切换月份。</view>
    </demo-block>

    <demo-block title="日期区间">
      <lk-calendar
        v-model="rangeDate"
        mode="range"
        show-shortcuts
        :max-range="30"
        :holiday-data="holidayData"
      />
    </demo-block>

    <demo-block title="多选日期">
      <lk-calendar
        v-model="multipleDate"
        mode="multiple"
        :max-count="5"
        :extra-data="extraData"
      />
      <view class="demo-tip">最多选择 5 天，适合打卡、排班、预约多日期。</view>
    </demo-block>

    <demo-block title="整周选择">
      <lk-calendar
        v-model="weekDate"
        mode="week"
        view="week"
        :swipe-threshold="42"
        :swipe-angle-ratio="1.15"
      />
      <view class="demo-tip">横滑切月阈值可按业务手感微调，组件也内置了 H5 / 小程序 / App 默认差异。</view>
    </demo-block>

    <demo-block title="酒店/机票价格日历">
      <lk-calendar
        v-model="travelRange"
        mode="range"
        view="scroll"
        :visible-month-count="4"
        :scroll-height="760"
        :extra-data="travelData"
        :holiday-data="holidayData"
        :max-range="30"
      />
      <view class="demo-tip">连续多月纵向滚动，适合酒店入住离店、机票低价日历、预约库存日历。</view>
    </demo-block>

    <demo-block title="禁用过去日期">
      <lk-calendar
        v-model="singleDate"
        :disabled-date="disabledBeforeToday"
        :disabled-week-days="[0]"
      />
      <view class="demo-tip">禁用今天以前的日期和每周日。</view>
    </demo-block>

    <demo-block title="只读业务日历">
      <lk-calendar
        v-model="readonlyDate"
        mode="readonly"
        :extra-data="extraData"
        :holiday-data="holidayData"
      />
    </demo-block>
  </view>
</template>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.demo-tip {
  margin-top: var(--lk-spacing-sm);
  font-size: var(--lk-font-size-sm);
  color: var(--lk-color-text-secondary);
}
</style>
