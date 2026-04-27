<script setup lang="ts">
import type { StyleValue } from 'vue';
import { computed, ref, watch } from 'vue';
import { calendarEmits, calendarProps } from './calendar.props';
import {
  CalendarMode,
  CalendarView,
  type CalendarDateInput,
  type CalendarDay,
  type CalendarModelValue,
  type CalendarShortcutType,
} from './types';
import {
  addDays,
  addMonths,
  diffDays,
  formatDate,
  getMonthGridDates,
  getWeekDates,
  isAfterDay,
  isBeforeDay,
  isBetweenDays,
  isSameDay,
  makeDate,
  normalizeDateList,
  outputDate,
  parseDate,
  startOfDay,
} from './utils/date';
import { getLunarInfo } from './utils/lunar';
import { createHolidayMap } from './utils/holiday';

defineOptions({ name: 'LkCalendar' });

const props = defineProps(calendarProps);
const emit = defineEmits(calendarEmits);

type TouchPoint = {
  clientX: number;
  clientY: number;
};

interface CalendarMonthGroup {
  key: string;
  title: string;
  days: CalendarDay[];
}

const today = startOfDay(new Date());
const singleValue = ref<Date | null>(null);
const rangeValue = ref<[Date | null, Date | null]>([null, null]);
const multipleValue = ref<Date[]>([]);
const panelDate = ref<Date>(today);
const currentView = ref<CalendarView>(props.view);
let swipeStart: TouchPoint | null = null;
let swipeLast: TouchPoint | null = null;

const mode = computed<CalendarMode>(() => (props.mode || props.type) as CalendarMode);
const isReadonly = computed(() => props.readonly || mode.value === CalendarMode.Readonly);
const weekLabels = computed(() => {
  const labels = ['日', '一', '二', '三', '四', '五', '六'];
  return Array.from({ length: 7 }, (_, index) => labels[(props.firstDay + index) % 7]);
});

const panelYear = computed(() => panelDate.value.getFullYear());
const panelMonth = computed(() => panelDate.value.getMonth() + 1);
const isScrollView = computed(() => currentView.value === CalendarView.Scroll);
const holidayMap = computed(() => createHolidayMap(props.holidayData, props.useBuiltinHoliday));
const extraMap = computed(() => {
  const map = new Map<string, (typeof props.extraData)[number]>();
  props.extraData.forEach(item => map.set(item.date, item));
  return map;
});

function getTouchPoint(event: unknown): TouchPoint | null {
  if (!event || typeof event !== 'object') return null;
  const source = event as {
    touches?: TouchPoint[];
    changedTouches?: TouchPoint[];
  };
  const point = source.touches?.[0] || source.changedTouches?.[0];
  if (!point || typeof point.clientX !== 'number' || typeof point.clientY !== 'number') return null;
  return point;
}

function getFirstModelDate() {
  if (mode.value === CalendarMode.Range || mode.value === CalendarMode.Week) {
    return rangeValue.value[0] || rangeValue.value[1];
  }
  if (mode.value === CalendarMode.Multiple) {
    return multipleValue.value[0] || null;
  }
  return singleValue.value;
}

function setPanelByDate(date: Date | null) {
  if (!date) return;
  panelDate.value = makeDate(date.getFullYear(), date.getMonth() + 1, 1);
}

function syncFromModel() {
  if (mode.value === CalendarMode.Range || mode.value === CalendarMode.Week) {
    const list = normalizeDateList(props.modelValue);
    rangeValue.value = [list[0] || null, list[1] || null];
    setPanelByDate(rangeValue.value[0] || rangeValue.value[1]);
    return;
  }
  if (mode.value === CalendarMode.Multiple) {
    multipleValue.value = normalizeDateList(props.modelValue);
    setPanelByDate(multipleValue.value[0] || null);
    return;
  }
  const parsed = Array.isArray(props.modelValue)
    ? parseDate(props.modelValue[0] as CalendarDateInput)
    : parseDate(props.modelValue as CalendarDateInput | null);
  singleValue.value = parsed;
  setPanelByDate(parsed);
}

watch(
  () => [props.modelValue, props.mode, props.type],
  () => syncFromModel(),
  { immediate: true, deep: true }
);

watch(
  () => props.view,
  view => {
    currentView.value = view;
  }
);

function isDateDisabled(date: Date) {
  const min = parseDate(props.minDate || props.min || null);
  const max = parseDate(props.maxDate || props.max || null);
  if (min && isBeforeDay(date, min)) return true;
  if (max && isAfterDay(date, max)) return true;
  if (props.disabledWeekDays.includes(date.getDay())) return true;
  if (props.disabledDate?.(date)) return true;
  const extra = extraMap.value.get(formatDate(date));
  return extra?.disabled === true;
}

function getDateSource() {
  if (currentView.value === CalendarView.Week) {
    return getWeekDates(getFirstModelDate() || panelDate.value, props.firstDay);
  }
  return getMonthGridDates(panelYear.value, panelMonth.value, props.firstDay, true);
}

function isSelected(date: Date) {
  if (mode.value === CalendarMode.Range || mode.value === CalendarMode.Week) {
    const [start, end] = rangeValue.value;
    return isSameDay(date, start) || isSameDay(date, end);
  }
  if (mode.value === CalendarMode.Multiple) {
    return multipleValue.value.some(item => isSameDay(item, date));
  }
  return isSameDay(singleValue.value, date);
}

function createDay(date: Date, index: number, year: number, month: number): CalendarDay {
  const dateKey = formatDate(date);
  const monthOffset =
    date.getMonth() + 1 < month || date.getFullYear() < year
      ? -1
      : date.getMonth() + 1 > month || date.getFullYear() > year
        ? 1
        : 0;
  const lunar = getLunarInfo(date);
  const holiday = holidayMap.value.get(dateKey);
  const extra = extraMap.value.get(dateKey);
  const [start, end] = rangeValue.value;

  return {
    date,
    dateKey,
    day: date.getDate(),
    monthOffset,
    weekIndex: Math.floor(index / 7),
    isToday: isSameDay(date, today),
    isWeekend: date.getDay() === 0 || date.getDay() === 6,
    isDisabled: isDateDisabled(date) || (monthOffset !== 0 && !props.showAdjacentDays),
    isSelected: isSelected(date),
    isRangeStart: isSameDay(date, start),
    isRangeEnd: isSameDay(date, end),
    isInRange: isBetweenDays(date, start, end),
    isHoliday: holiday?.type === 'holiday',
    isWorkday: holiday?.type === 'workday',
    holidayName: holiday?.name || '',
    lunar,
    extra,
  };
}

const days = computed<CalendarDay[]>(() => {
  const source = getDateSource();
  return source.map((date, index) => createDay(date, index, panelYear.value, panelMonth.value));
});

const monthGroups = computed<CalendarMonthGroup[]>(() => {
  if (!isScrollView.value) {
    return [{
      key: formatDate(panelDate.value, 'YYYY-MM'),
      title: `${panelYear.value}年${panelMonth.value}月`,
      days: days.value,
    }];
  }

  return Array.from({ length: Math.max(1, props.visibleMonthCount) }, (_, index) => {
    const monthDate = addMonths(panelDate.value, index);
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth() + 1;
    const source = getMonthGridDates(year, month, props.firstDay, false);
    return {
      key: formatDate(monthDate, 'YYYY-MM'),
      title: `${year}年${month}月`,
      days: source.map((date, dayIndex) => createDay(date, dayIndex, year, month)),
    };
  });
});

function getDaySubText(day: CalendarDay) {
  if (day.extra?.subLabel) return day.extra.subLabel;
  if (props.showHoliday && day.holidayName) return day.holidayName;
  if (props.showFestival && day.lunar.festival) return day.lunar.festival;
  if (props.showSolarTerm && day.lunar.solarTerm) return day.lunar.solarTerm;
  if (props.showLunar) return day.lunar.text;
  return '';
}

function getOutputValue(): CalendarModelValue | null {
  if (mode.value === CalendarMode.Range || mode.value === CalendarMode.Week) {
    return [
      outputDate(rangeValue.value[0], props.valueType, props.valueFormat),
      outputDate(rangeValue.value[1], props.valueType, props.valueFormat),
    ];
  }
  if (mode.value === CalendarMode.Multiple) {
    return multipleValue.value.map(item => outputDate(item, props.valueType, props.valueFormat));
  }
  return outputDate(singleValue.value, props.valueType, props.valueFormat);
}

function emitChange(day?: CalendarDay) {
  const value = getOutputValue();
  emit('update:modelValue', value);
  emit('change', value);
  if (day) {
    emit('select', { date: day.date, dateKey: day.dateKey, day });
  }
  if (props.confirmOnSelect) {
    emit('confirm', value);
  }
}

function selectRange(day: CalendarDay) {
  let [start, end] = rangeValue.value;
  if (!start || end) {
    rangeValue.value = [day.date, null];
    emit('range-progress', [outputDate(day.date, props.valueType, props.valueFormat), null]);
    emitChange(day);
    return;
  }

  if (isBeforeDay(day.date, start)) {
    end = start;
    start = day.date;
  } else {
    end = day.date;
  }

  if (props.maxRange > 0 && diffDays(start, end) + 1 > props.maxRange) {
    end = addDays(start, props.maxRange - 1);
  }
  rangeValue.value = [start, end];
  emitChange(day);
}

function selectWeek(day: CalendarDay) {
  const week = getWeekDates(day.date, props.firstDay).filter(item => !isDateDisabled(item));
  rangeValue.value = [week[0] || null, week[week.length - 1] || null];
  emitChange(day);
}

function selectMultiple(day: CalendarDay) {
  const index = multipleValue.value.findIndex(item => isSameDay(item, day.date));
  if (index >= 0) {
    multipleValue.value.splice(index, 1);
  } else if (props.maxCount <= 0 || multipleValue.value.length < props.maxCount) {
    multipleValue.value.push(day.date);
  }
  emitChange(day);
}

function selectDay(day: CalendarDay) {
  if (isReadonly.value || day.isDisabled) return;
  if (day.monthOffset !== 0) {
    panelDate.value = makeDate(day.date.getFullYear(), day.date.getMonth() + 1, 1);
  }
  if (mode.value === CalendarMode.Range) {
    selectRange(day);
    return;
  }
  if (mode.value === CalendarMode.Week) {
    selectWeek(day);
    return;
  }
  if (mode.value === CalendarMode.Multiple) {
    selectMultiple(day);
    return;
  }
  if (mode.value === CalendarMode.Month) {
    singleValue.value = makeDate(day.date.getFullYear(), day.date.getMonth() + 1, 1);
    emitChange(day);
    return;
  }
  singleValue.value = day.date;
  emitChange(day);
}

function changeMonth(delta: number) {
  panelDate.value = addMonths(panelDate.value, delta);
  emit('month-change', { year: panelYear.value, month: panelMonth.value });
}

function switchView(view: CalendarView) {
  currentView.value = view;
  emit('view-change', view);
}

function formatUnit(value: string | number) {
  return typeof value === 'number' ? `${value}rpx` : value;
}

function clearSelection() {
  singleValue.value = null;
  rangeValue.value = [null, null];
  multipleValue.value = [];
  emit('clear');
  emitChange();
}

function applyShortcut(type: CalendarShortcutType) {
  const current = today;
  if (type === 'clear') {
    clearSelection();
    return;
  }
  if (type === 'today') {
    singleValue.value = current;
  }
  if (type === 'tomorrow') {
    singleValue.value = addDays(current, 1);
  }
  if (type === 'yesterday') {
    singleValue.value = addDays(current, -1);
  }
  if (type === 'thisWeek') {
    const week = getWeekDates(current, props.firstDay);
    rangeValue.value = [week[0], week[6]];
  }
  if (type === 'last7') {
    rangeValue.value = [addDays(current, -6), current];
  }
  if (type === 'last30') {
    rangeValue.value = [addDays(current, -29), current];
  }
  if (type === 'thisMonth') {
    const start = makeDate(current.getFullYear(), current.getMonth() + 1, 1);
    const end = makeDate(current.getFullYear(), current.getMonth() + 2, 0);
    if (mode.value === CalendarMode.Range || mode.value === CalendarMode.Week) {
      rangeValue.value = [start, end];
    } else {
      singleValue.value = start;
    }
  }
  setPanelByDate(getFirstModelDate() || current);
  emitChange();
}

function onTouchStart(event: unknown) {
  swipeStart = getTouchPoint(event);
  swipeLast = swipeStart;
}

function onTouchMove(event: unknown) {
  const point = getTouchPoint(event);
  if (point) swipeLast = point;
}

function onTouchEnd() {
  if (isScrollView.value) {
    swipeStart = null;
    swipeLast = null;
    return;
  }
  if (!swipeStart || !swipeLast) return;
  const dx = swipeLast.clientX - swipeStart.clientX;
  const dy = swipeLast.clientY - swipeStart.clientY;
  const config = gestureConfig.value;
  if (Math.abs(dx) > config.threshold && Math.abs(dx) > Math.abs(dy) * config.angleRatio) {
    changeMonth(dx < 0 ? 1 : -1);
  }
  swipeStart = null;
  swipeLast = null;
}

const gestureConfig = computed(() => {
  let threshold = 48;
  let angleRatio = 1.2;
  // ⚠️可能存在平台差异：不同端 touch 坐标采样频率和滚动冲突不同，使用条件编译提供默认手势阈值。
  // #ifdef H5
  threshold = 48;
  angleRatio = 1.2;
  // #endif
  // #ifdef MP-WEIXIN
  threshold = 36;
  angleRatio = 1.12;
  // #endif
  // #ifdef APP-PLUS
  threshold = 56;
  angleRatio = 1.35;
  // #endif

  return {
    threshold: props.swipeThreshold > 0 ? props.swipeThreshold : threshold,
    angleRatio: props.swipeAngleRatio > 0 ? props.swipeAngleRatio : angleRatio,
  };
});

const rootStyle = computed(() => {
  const themeColorMap: Record<string, string> = {
    primary: 'var(--lk-color-primary)',
    success: 'var(--lk-color-success)',
    warning: 'var(--lk-color-warning)',
    danger: 'var(--lk-color-danger)',
    info: 'var(--lk-color-info)',
  };
  return {
    '--lk-calendar-accent': themeColorMap[props.color] || props.color,
  };
});
const mergedStyle = computed<StyleValue>(() => [rootStyle.value, props.customStyle as StyleValue]);
const scrollStyle = computed<StyleValue>(() => ({
  height: formatUnit(props.scrollHeight),
}));
</script>

<template>
  <view :class="['lk-calendar', customClass]" :style="mergedStyle">
    <view v-if="showHeader" class="lk-calendar__header">
      <view class="lk-calendar__nav" @tap="changeMonth(-1)">‹</view>
      <view class="lk-calendar__title">
        <text class="lk-calendar__ym">{{ panelYear }}年{{ panelMonth }}月</text>
        <text class="lk-calendar__subtitle">
          {{ currentView === 'week' ? '周视图' : currentView === 'scroll' ? '连续滚动' : '月视图' }}
        </text>
      </view>
      <view class="lk-calendar__nav" @tap="changeMonth(1)">›</view>
    </view>

    <view v-if="showViewToggle" class="lk-calendar__view-switch">
      <view
        class="lk-calendar__switch-item"
        :class="{ 'is-active': currentView === 'month' }"
        @tap="switchView(CalendarView.Month)"
      >
        月
      </view>
      <view
        class="lk-calendar__switch-item"
        :class="{ 'is-active': currentView === 'week' }"
        @tap="switchView(CalendarView.Week)"
      >
        周
      </view>
      <view
        class="lk-calendar__switch-item"
        :class="{ 'is-active': currentView === 'scroll' }"
        @tap="switchView(CalendarView.Scroll)"
      >
        滚动
      </view>
    </view>

    <view v-if="showShortcuts" class="lk-calendar__shortcuts">
      <view class="lk-calendar__chip" @tap="applyShortcut('today')">今天</view>
      <view class="lk-calendar__chip" @tap="applyShortcut('tomorrow')">明天</view>
      <view class="lk-calendar__chip" @tap="applyShortcut('thisWeek')">本周</view>
      <view class="lk-calendar__chip" @tap="applyShortcut('thisMonth')">本月</view>
      <view v-if="mode === 'range'" class="lk-calendar__chip" @tap="applyShortcut('last7')">近7天</view>
      <view v-if="mode === 'range'" class="lk-calendar__chip" @tap="applyShortcut('last30')">近30天</view>
      <view class="lk-calendar__chip is-plain" @tap="applyShortcut('clear')">清除</view>
    </view>

    <view class="lk-calendar__week">
      <text v-for="item in weekLabels" :key="item">{{ item }}</text>
    </view>

    <scroll-view
      v-if="isScrollView"
      class="lk-calendar__scroll"
      scroll-y
      :show-scrollbar="false"
      :style="scrollStyle"
    >
      <view v-for="group in monthGroups" :key="group.key" class="lk-calendar__month-section">
        <text class="lk-calendar__month-title">{{ group.title }}</text>
        <view class="lk-calendar__grid">
          <view
            v-for="day in group.days"
            :key="day.dateKey"
            class="lk-calendar__cell"
            :class="[
              day.extra?.className,
              {
                'is-muted': day.monthOffset !== 0,
                'is-today': showToday && day.isToday,
                'is-weekend': day.isWeekend,
                'is-disabled': day.isDisabled,
                'is-selected': day.isSelected,
                'is-in-range': day.isInRange,
                'is-range-start': day.isRangeStart,
                'is-range-end': day.isRangeEnd,
                'is-holiday': showHoliday && day.isHoliday,
                'is-workday': showHoliday && day.isWorkday,
                'is-hidden-adjacent': day.monthOffset !== 0 && !showAdjacentDays,
              },
            ]"
            @tap="selectDay(day)"
          >
            <slot name="day" :day="day">
              <view class="lk-calendar__day-main">
                <text class="lk-calendar__day-text">{{ day.day }}</text>
                <text v-if="showHoliday && (day.isHoliday || day.isWorkday)" class="lk-calendar__tag">
                  {{ day.isWorkday ? '班' : '休' }}
                </text>
              </view>
              <text class="lk-calendar__day-sub">{{ getDaySubText(day) }}</text>
              <view v-if="day.extra?.label || day.extra?.badge" class="lk-calendar__extra-row">
                <text v-if="day.extra?.badge" class="lk-calendar__badge">{{ day.extra.badge }}</text>
                <text v-if="day.extra?.label" class="lk-calendar__extra">{{ day.extra.label }}</text>
              </view>
              <view v-if="day.extra?.dot" class="lk-calendar__dot" />
            </slot>
          </view>
        </view>
      </view>
    </scroll-view>

    <view
      v-else
      class="lk-calendar__grid"
      :class="{ 'is-week': currentView === 'week' }"
      @touchstart.stop="onTouchStart"
      @touchmove.stop="onTouchMove"
      @touchend.stop="onTouchEnd"
    >
      <view
        v-for="day in days"
        :key="day.dateKey"
        class="lk-calendar__cell"
        :class="[
          day.extra?.className,
          {
            'is-muted': day.monthOffset !== 0,
            'is-today': showToday && day.isToday,
            'is-weekend': day.isWeekend,
            'is-disabled': day.isDisabled,
            'is-selected': day.isSelected,
            'is-in-range': day.isInRange,
            'is-range-start': day.isRangeStart,
            'is-range-end': day.isRangeEnd,
            'is-holiday': showHoliday && day.isHoliday,
            'is-workday': showHoliday && day.isWorkday,
            'is-hidden-adjacent': day.monthOffset !== 0 && !showAdjacentDays,
          },
        ]"
        @tap="selectDay(day)"
      >
        <slot name="day" :day="day">
          <view class="lk-calendar__day-main">
            <text class="lk-calendar__day-text">{{ day.day }}</text>
            <text v-if="showHoliday && (day.isHoliday || day.isWorkday)" class="lk-calendar__tag">
              {{ day.isWorkday ? '班' : '休' }}
            </text>
          </view>
          <text class="lk-calendar__day-sub">{{ getDaySubText(day) }}</text>
          <view v-if="day.extra?.label || day.extra?.badge" class="lk-calendar__extra-row">
            <text v-if="day.extra?.badge" class="lk-calendar__badge">{{ day.extra.badge }}</text>
            <text v-if="day.extra?.label" class="lk-calendar__extra">{{ day.extra.label }}</text>
          </view>
          <view v-if="day.extra?.dot" class="lk-calendar__dot" />
        </slot>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
