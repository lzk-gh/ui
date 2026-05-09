<script setup lang="ts">
import { ref } from 'vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkDatePicker from '@/uni_modules/lucky-ui/components/lk-date-picker/lk-date-picker.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';
import type { DatePickerValue } from '@/uni_modules/lucky-ui/components/lk-date-picker/date-picker.props';
import type {
  CalendarDayExtra,
  CalendarHolidayItem,
} from '@/uni_modules/lucky-ui/components/lk-calendar/calendar.props';

const showBasic = ref(false);
const showBirth = ref(false);
const showRange = ref(false);
const showMultiple = ref(false);
const showDateTime = ref(false);
const showRangeDateTime = ref(false);
const showTime = ref(false);

const today = new Date();
const basicDate = ref<DatePickerValue>(today);
const birthMonth = ref<DatePickerValue>(new Date(1998, 4, 1));
const rangeValue = ref<DatePickerValue>([
  today,
  new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
]);
const selectedMultiple = ref<Date[]>([]);
const dateTimeValue = ref<DatePickerValue>(today);
const rangeDateTimeValue = ref<DatePickerValue>([
  today,
  new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 18, 30),
]);
const timeValue = ref<DatePickerValue>('09:30');
const minDate = ref(new Date(2020, 0, 1));
const maxDate = ref(new Date(2030, 11, 31));

const holidayData: CalendarHolidayItem[] = [
  { date: '2026-01-01', name: '元旦', type: 'holiday' },
  { date: '2026-05-01', name: '劳动节', type: 'holiday' },
  { date: '2026-10-01', name: '国庆', type: 'holiday' },
];

const priceData: CalendarDayExtra[] = Array.from({ length: 45 }, (_, index) => {
  const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + index);
  return {
    date: formatDate(date),
    label: `¥${288 + ((index * 31) % 180)}`,
    badge: index % 8 === 0 ? '低' : undefined,
    dot: index % 5 === 0,
  };
});

function updateBasic(value: DatePickerValue) {
  basicDate.value = value;
}

function updateBirth(value: DatePickerValue) {
  birthMonth.value = value;
}

function updateRange(value: DatePickerValue) {
  rangeValue.value = value;
}

function updateMultiple(value: DatePickerValue) {
  selectedMultiple.value = Array.isArray(value)
    ? value.filter((item): item is Date => item instanceof Date)
    : [];
}

function updateDateTime(value: DatePickerValue) {
  dateTimeValue.value = value;
}

function updateRangeDateTime(value: DatePickerValue) {
  rangeDateTimeValue.value = value;
}

function updateTime(value: DatePickerValue) {
  timeValue.value = value;
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateTime(date: Date) {
  const base = formatDate(date);
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${base} ${hh}:${mm}:${ss}`;
}

function formatValue(value: DatePickerValue) {
  if (value === null) return '未选择';
  if (value instanceof Date) return formatDate(value);
  if (Array.isArray(value)) {
    return value
      .map(item => {
        if (item instanceof Date) return formatDate(item);
        return item === null ? '空' : String(item);
      })
      .join(' 至 ');
  }
  return String(value);
}

function formatDateTimeValue(value: DatePickerValue) {
  if (value instanceof Date) return formatDateTime(value);
  if (Array.isArray(value)) {
    return value
      .map(item => {
        if (item instanceof Date) return formatDateTime(item);
        return item === null ? '空' : String(item);
      })
      .join(' 至 ');
  }
  return formatValue(value);
}

function disabledBeforeToday(date: Date) {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const current = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  return day < current;
}
</script>

<template>
  <view class="component-demo">
    <demo-block title="基础日期">
      <lk-button type="primary" @tap="showBasic = true">选择日期</lk-button>
      <text class="result-text">选择结果：{{ formatValue(basicDate) }}</text>
      <lk-date-picker
        v-model:show="showBasic"
        :value="basicDate"
        :holiday-data="holidayData"
        @confirm="updateBasic"
      />
    </demo-block>

    <demo-block title="滚轮年月">
      <lk-button type="primary" @tap="showBirth = true">选择出生年月</lk-button>
      <text class="result-text">选择结果：{{ formatValue(birthMonth) }}</text>
      <lk-date-picker
        v-model:show="showBirth"
        :value="birthMonth"
        type="year-month"
        picker-mode="wheel"
        value-type="string"
        value-format="YYYY-MM"
        @confirm="updateBirth"
      />
    </demo-block>

    <demo-block title="入住离店">
      <lk-button type="primary" @tap="showRange = true">选择日期范围</lk-button>
      <text class="result-text">选择结果：{{ formatValue(rangeValue) }}</text>
      <lk-date-picker
        v-model:show="showRange"
        :value="rangeValue"
        type="range"
        view="scroll"
        :visible-month-count="4"
        :scroll-height="760"
        :min-date="minDate"
        :max-date="maxDate"
        :extra-data="priceData"
        :holiday-data="holidayData"
        :show-shortcuts="true"
        :max-range="30"
        @confirm="updateRange"
      />
    </demo-block>

    <demo-block title="多选日期">
      <lk-button type="primary" @tap="showMultiple = true">选择多个日期</lk-button>
      <text class="result-text">已选: {{ selectedMultiple.map(formatDate).join(', ') }}</text>
      <lk-date-picker
        v-model:show="showMultiple"
        :value="selectedMultiple"
        type="multiple"
        :min-date="minDate"
        :max-date="maxDate"
        :max-count="5"
        :show-shortcuts="true"
        @confirm="updateMultiple"
      />
    </demo-block>

    <demo-block title="日期时间">
      <lk-button type="primary" @tap="showDateTime = true">选择日期时间</lk-button>
      <text class="result-text">选择结果：{{ formatDateTimeValue(dateTimeValue) }}</text>
      <lk-date-picker
        v-model:show="showDateTime"
        :value="dateTimeValue"
        type="date-time"
        time-precision="minute"
        :min-date="minDate"
        :max-date="maxDate"
        :disabled-date="disabledBeforeToday"
        @confirm="updateDateTime"
      />
    </demo-block>

    <demo-block title="日期时间范围">
      <lk-button type="primary" @tap="showRangeDateTime = true">选择日期时间范围</lk-button>
      <text class="result-text">选择结果：{{ formatDateTimeValue(rangeDateTimeValue) }}</text>
      <lk-date-picker
        v-model:show="showRangeDateTime"
        :value="rangeDateTimeValue"
        type="range-date-time"
        time-precision="minute"
        :min-date="minDate"
        :max-date="maxDate"
        :show-shortcuts="true"
        @confirm="updateRangeDateTime"
      />
    </demo-block>

    <demo-block title="仅时间滚轮">
      <lk-button type="primary" @tap="showTime = true">选择提醒时间</lk-button>
      <text class="result-text">选择结果：{{ formatValue(timeValue) }}</text>
      <lk-date-picker
        v-model:show="showTime"
        :value="timeValue"
        type="time"
        picker-mode="wheel"
        time-precision="second"
        :step-minute="5"
        @confirm="updateTime"
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

.result-text {
  display: block;
  margin-top: var(--lk-spacing-sm);
  font-size: var(--lk-font-size-sm);
  color: var(--lk-color-text-secondary);
}
</style>
