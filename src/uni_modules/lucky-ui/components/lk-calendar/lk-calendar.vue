<script setup lang="ts">
import type { StyleValue } from 'vue';
import { computed, ref, watch } from 'vue';
import { useLocale } from '../../composables/useLocale';
import {
  CalendarMode,
  CalendarViewMode,
  calendarEmits,
  calendarProps,
  type CalendarDay,
  type CalendarMarker,
  type CalendarValue,
} from './calendar.props';

defineOptions({ name: 'LkCalendar' });

const props = defineProps(calendarProps);
const emit = defineEmits(calendarEmits);
const { t } = useLocale('calendar');

const fallbackMonthNames = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月',
];
const fallbackWeekdayNames = ['日', '一', '二', '三', '四', '五', '六'];
const SWIPE_THRESHOLD = 50;
const SWIPE_LOCK_THRESHOLD = 8;
const SWIPE_MAX_OFFSET = 72;

type CalendarTouchEvent = {
  changedTouches?: ArrayLike<{ clientX?: number; clientY?: number; pageX?: number; pageY?: number }>;
  touches?: ArrayLike<{ clientX?: number; clientY?: number; pageX?: number; pageY?: number }>;
};

function pad(value: number) {
  return value < 10 ? `0${value}` : `${value}`;
}

function formatDate(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseDate(value: string) {
  const match = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(value || '');
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3] || 1);
  const date = new Date(year, month, day);
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return null;
  }
  return date;
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function monthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function clampWeekStart(value: number) {
  return Math.min(6, Math.max(0, Number.isFinite(value) ? value : 1));
}

function normalizeValue(value: CalendarValue): string[] {
  if (Array.isArray(value)) return value.filter(Boolean).sort();
  return value ? [value] : [];
}

function resolveInitialDate() {
  const viewDate = parseDate(props.viewDate);
  if (viewDate) return viewDate;
  const selected = parseDate(normalizeValue(props.modelValue)[0] || '');
  return selected || new Date();
}

const today = formatDate(new Date());
const initialDate = resolveInitialDate();
const cursor = ref(props.viewMode === CalendarViewMode.Week ? initialDate : monthStart(initialDate));
const dragOffset = ref(0);
const isDragging = ref(false);
const isSwitching = ref(false);
const switchDirection = ref<'prev' | 'next'>('next');
const ignoreNextTap = ref(false);
let switchStartTimer: ReturnType<typeof setTimeout> | null = null;
let switchTimer: ReturnType<typeof setTimeout> | null = null;
let ignoreTapTimer: ReturnType<typeof setTimeout> | null = null;
const touchState = {
  startX: 0,
  startY: 0,
  deltaX: 0,
  deltaY: 0,
  tracking: false,
  locked: false,
};

const markerMap = computed(() => {
  const map = new Map<string, CalendarMarker[]>();
  props.markers.forEach(marker => {
    if (!parseDate(marker.date)) return;
    const list = map.get(marker.date) || [];
    list.push({ type: 'dot', ...marker });
    map.set(marker.date, list);
  });
  return map;
});

const selectedValues = computed(() => normalizeValue(props.modelValue));
const monthNames = computed(() => {
  const values = t<string[]>('months');
  return Array.isArray(values) && values.length >= 12 ? values : fallbackMonthNames;
});
const weekdayNames = computed(() => {
  const values = t<string[]>('weekdays');
  return Array.isArray(values) && values.length >= 7 ? values : fallbackWeekdayNames;
});
const weekdays = computed(() => {
  const start = clampWeekStart(props.firstDayOfWeek);
  return Array.from({ length: 7 }, (_, index) => weekdayNames.value[(start + index) % 7]);
});
const viewDateValue = computed(() => `${cursor.value.getFullYear()}-${pad(cursor.value.getMonth() + 1)}`);
const panelTitle = computed(() => props.title || monthNames.value[cursor.value.getMonth()]);
const panelSubTitle = computed(() => {
  if (!props.showYear) return '';
  return `${cursor.value.getFullYear()}`;
});

const selectedSummary = computed(() => {
  const values = selectedValues.value;
  if (!values.length) return t('selectDate');
  if (props.mode === CalendarMode.Range) {
    return values.length > 1 ? `${values[0]} ${t('rangeSeparator')} ${values[1]}` : t('selectEndDate');
  }
  if (props.mode === CalendarMode.Multiple) return t('multipleSelected', { count: values.length });
  return values[0];
});

const cls = computed(() => [
  'lk-calendar',
  `lk-calendar--${props.size}`,
  `lk-calendar--${props.mode}`,
  `lk-calendar--${props.viewMode}`,
  {
    'is-disabled': props.disabled,
    'is-readonly': props.readonly,
  },
  props.customClass,
]);
const style = computed(() => props.customStyle as StyleValue);
const gridStyle = computed(
  () =>
    ({
      transform: `translate3d(${dragOffset.value}px, 0, 0)`,
      transition: isDragging.value || isSwitching.value ? 'none' : '',
    }) as StyleValue
);
const gridClass = computed(() => [
  'lk-calendar__grid',
  {
    'is-dragging': isDragging.value,
    'is-switching': isSwitching.value,
    'is-switching-prev': isSwitching.value && switchDirection.value === 'prev',
    'is-switching-next': isSwitching.value && switchDirection.value === 'next',
  },
]);

function isOutOfBounds(date: string) {
  return Boolean((props.minDate && date < props.minDate) || (props.maxDate && date > props.maxDate));
}

function isInRange(date: string, values: string[]) {
  if (props.mode !== CalendarMode.Range || values.length < 2) return false;
  return date > values[0] && date < values[1];
}

function isBlockedDate(date: string) {
  return isOutOfBounds(date) || props.disabledDates.includes(date);
}

function hasBlockedDateBetween(start: string, end: string) {
  const startDate = parseDate(start);
  const endDate = parseDate(end);
  if (!startDate || !endDate) return false;

  const cursorDate = addDays(startDate < endDate ? startDate : endDate, 1);
  const limit = startDate < endDate ? endDate : startDate;
  while (cursorDate < limit) {
    if (isBlockedDate(formatDate(cursorDate))) return true;
    cursorDate.setDate(cursorDate.getDate() + 1);
  }
  return false;
}

function startOfWeek(date: Date) {
  const offset = (date.getDay() - clampWeekStart(props.firstDayOfWeek) + 7) % 7;
  return addDays(date, -offset);
}

function createDay(date: Date): CalendarDay {
  const dateText = formatDate(date);
  const currentMonth = cursor.value.getMonth();
  const currentYear = cursor.value.getFullYear();
  const values = selectedValues.value;
  const isRangeStart = props.mode === CalendarMode.Range && values[0] === dateText;
  const isRangeEnd = props.mode === CalendarMode.Range && values[1] === dateText;
  const inRange = isInRange(dateText, values);
  const weekStart = clampWeekStart(props.firstDayOfWeek);
  const weekEnd = (weekStart + 6) % 7;

  return {
    date: dateText,
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
    weekday: date.getDay(),
    isToday: dateText === today,
    isCurrentMonth: date.getMonth() === currentMonth && date.getFullYear() === currentYear,
    isSelected:
      props.mode === CalendarMode.Range
        ? isRangeStart || isRangeEnd
        : values.includes(dateText),
    isRangeStart,
    isRangeEnd,
    isRangeRowStart: (isRangeStart || inRange) && date.getDay() === weekStart,
    isRangeRowEnd: (isRangeEnd || inRange) && date.getDay() === weekEnd,
    isInRange: inRange,
    isDisabled:
      props.disabled ||
      isBlockedDate(dateText) ||
      (props.viewMode === CalendarViewMode.Month &&
        !props.showAdjacentDays &&
        (date.getMonth() !== currentMonth || date.getFullYear() !== currentYear)),
    markers: markerMap.value.get(dateText) || [],
  };
}

const days = computed(() => {
  if (props.viewMode === CalendarViewMode.Week) {
    const weekStart = startOfWeek(cursor.value);
    return Array.from({ length: 7 }, (_, index) => createDay(addDays(weekStart, index)));
  }

  const first = monthStart(cursor.value);
  const offset = (first.getDay() - clampWeekStart(props.firstDayOfWeek) + 7) % 7;
  const gridStart = addDays(first, -offset);

  return Array.from({ length: 42 }, (_, index) => createDay(addDays(gridStart, index)));
});

function emitPanelChange() {
  const value = viewDateValue.value;
  emit('update:viewDate', value);
  emit('month-change', value);
  if (props.viewMode === CalendarViewMode.Week && days.value.length) {
    emit('week-change', {
      start: days.value[0].date,
      end: days.value[days.value.length - 1].date,
      viewDate: value,
    });
  }
  emit('panel-change', {
    year: cursor.value.getFullYear(),
    month: cursor.value.getMonth() + 1,
  });
}

function playSwitchAnimation(amount: number) {
  if (!amount) return;
  switchDirection.value = amount > 0 ? 'next' : 'prev';
  isSwitching.value = false;
  if (switchStartTimer) clearTimeout(switchStartTimer);
  if (switchTimer) clearTimeout(switchTimer);
  switchStartTimer = setTimeout(() => {
    isSwitching.value = true;
    switchStartTimer = null;
    switchTimer = setTimeout(() => {
      isSwitching.value = false;
      switchTimer = null;
    }, 260);
  }, 0);
}

function movePanel(amount: number, animate = true) {
  if (props.disabled) return;
  cursor.value =
    props.viewMode === CalendarViewMode.Week
      ? addDays(cursor.value, amount * 7)
      : addMonths(cursor.value, amount);
  if (animate) playSwitchAnimation(amount);
  emitPanelChange();
}

function moveMonth(amount: number) {
  movePanel(amount);
}

function goToday() {
  if (props.disabled) return;
  const now = new Date();
  const direction = now.getTime() >= cursor.value.getTime() ? 1 : -1;
  cursor.value = props.viewMode === CalendarViewMode.Week ? now : monthStart(now);
  playSwitchAnimation(direction);
  emitPanelChange();
}

function getTouchPoint(event: CalendarTouchEvent) {
  const touch = event.changedTouches?.[0] || event.touches?.[0];
  if (!touch) return null;
  return {
    x: touch.clientX ?? touch.pageX ?? 0,
    y: touch.clientY ?? touch.pageY ?? 0,
  };
}

function resetSwipe() {
  touchState.tracking = false;
  touchState.locked = false;
  touchState.deltaX = 0;
  touchState.deltaY = 0;
  isDragging.value = false;
  dragOffset.value = 0;
}

function suppressNextTap() {
  ignoreNextTap.value = true;
  if (ignoreTapTimer) clearTimeout(ignoreTapTimer);
  ignoreTapTimer = setTimeout(() => {
    ignoreNextTap.value = false;
    ignoreTapTimer = null;
  }, 120);
}

function onTouchStart(event: CalendarTouchEvent) {
  if (!props.swipeable || props.disabled) return;
  const point = getTouchPoint(event);
  if (!point) return;
  touchState.startX = point.x;
  touchState.startY = point.y;
  touchState.deltaX = 0;
  touchState.deltaY = 0;
  touchState.tracking = true;
  touchState.locked = false;
}

function onTouchMove(event: CalendarTouchEvent) {
  if (!touchState.tracking || !props.swipeable || props.disabled) return;
  const point = getTouchPoint(event);
  if (!point) return;

  touchState.deltaX = point.x - touchState.startX;
  touchState.deltaY = point.y - touchState.startY;
  const absX = Math.abs(touchState.deltaX);
  const absY = Math.abs(touchState.deltaY);

  if (!touchState.locked) {
    if (absX < SWIPE_LOCK_THRESHOLD && absY < SWIPE_LOCK_THRESHOLD) return;
    if (absX <= absY * 1.15) {
      resetSwipe();
      return;
    }
    touchState.locked = true;
  }

  isDragging.value = true;
  dragOffset.value = Math.max(
    -SWIPE_MAX_OFFSET,
    Math.min(SWIPE_MAX_OFFSET, touchState.deltaX * 0.36)
  );
}

function onTouchEnd() {
  if (!touchState.tracking || !props.swipeable || props.disabled) {
    resetSwipe();
    return;
  }

  const shouldMove =
    touchState.locked &&
    Math.abs(touchState.deltaX) >= SWIPE_THRESHOLD &&
    Math.abs(touchState.deltaX) > Math.abs(touchState.deltaY) * 1.15;
  const direction = touchState.deltaX < 0 ? 1 : -1;

  resetSwipe();
  if (shouldMove) {
    suppressNextTap();
    movePanel(direction);
  }
}

function nextValue(day: CalendarDay): CalendarValue {
  if (props.mode === CalendarMode.Multiple) {
    const exists = selectedValues.value.includes(day.date);
    return exists
      ? selectedValues.value.filter(item => item !== day.date)
      : [...selectedValues.value, day.date].sort();
  }

  if (props.mode === CalendarMode.Range) {
    const [start, end] = selectedValues.value;
    if (!start || end) return [day.date];
    if (day.date < start) {
      if (hasBlockedDateBetween(day.date, start)) return [day.date];
      return [day.date, start];
    }
    if (hasBlockedDateBetween(start, day.date)) return [day.date];
    return [start, day.date];
  }

  return day.date;
}

function selectDay(day: CalendarDay) {
  if (ignoreNextTap.value) {
    ignoreNextTap.value = false;
    return;
  }
  if (day.isDisabled) {
    emit('click-disabled', day);
    return;
  }
  if (props.readonly) return;

  const value = nextValue(day);
  emit('update:modelValue', value);
  emit('select', day);
  emit('change', value, day);
}

function dayClass(day: CalendarDay) {
  return [
    'lk-calendar__day',
    {
      'is-hidden': !props.showAdjacentDays && !day.isCurrentMonth,
      'is-muted': !day.isCurrentMonth,
      'is-week-mode': props.viewMode === CalendarViewMode.Week,
      'is-today': day.isToday,
      'is-selected': day.isSelected,
      'is-in-range': day.isInRange,
      'is-range-start': day.isRangeStart,
      'is-range-end': day.isRangeEnd,
      'is-range-row-start': day.isRangeRowStart,
      'is-range-row-end': day.isRangeRowEnd,
      'is-weekend': day.weekday === 0 || day.weekday === 6,
      'is-disabled': day.isDisabled,
      'has-marker': day.markers.length,
    },
  ];
}

function dateClass(day: CalendarDay) {
  return [
    'lk-calendar__date',
    {
      'is-muted': !day.isCurrentMonth,
      'is-disabled': day.isDisabled,
      'is-week-mode': props.viewMode === CalendarViewMode.Week,
      'is-weekend': day.weekday === 0 || day.weekday === 6,
      'is-selected': day.isSelected,
      'is-in-range': day.isInRange,
      'is-today': day.isToday,
    },
  ];
}

function shouldShowMarkers(day: CalendarDay) {
  return Boolean((props.showAdjacentDays || day.isCurrentMonth) && day.markers.length && !day.isDisabled);
}

function markerType(day: CalendarDay, marker: CalendarMarker) {
  if (day.isToday && (marker.label === t('today') || marker.label === '今')) return 'dot';
  if (day.isSelected && marker.type === 'badge') return 'dot';
  return marker.type || 'dot';
}

watch(
  () => props.viewDate,
  value => {
    const next = parseDate(value);
    if (next) cursor.value = props.viewMode === CalendarViewMode.Week ? next : monthStart(next);
  }
);
</script>

<template>
  <view :id="id" :class="cls" :style="style">
    <slot
      v-if="showHeader"
      name="header"
      :title="panelTitle"
      :subtitle="panelSubTitle"
      :view-date="viewDateValue"
      :summary="selectedSummary"
      :prev="() => moveMonth(-1)"
      :next="() => moveMonth(1)"
      :today="goToday"
    >
      <view class="lk-calendar__header">
        <view class="lk-calendar__header-main">
          <view class="lk-calendar__heading">
            <text class="lk-calendar__title">{{ panelTitle }}</text>
            <text v-if="panelSubTitle" class="lk-calendar__subtitle">{{ panelSubTitle }}</text>
          </view>
        </view>
        <view class="lk-calendar__actions">
          <text class="lk-calendar__summary">{{ selectedSummary }}</text>
          <view v-if="showToday" class="lk-calendar__today" @tap="goToday">{{ t('today') }}</view>
        </view>
      </view>
    </slot>

    <view v-if="viewMode === CalendarViewMode.Month" class="lk-calendar__weekdays">
      <text v-for="weekday in weekdays" :key="weekday" class="lk-calendar__weekday">
        {{ weekday }}
      </text>
    </view>

    <view
      class="lk-calendar__grid-wrap"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
    >
      <view :class="gridClass" :style="gridStyle">
        <view
          v-for="day in days"
          :key="day.date"
          :class="dayClass(day)"
          @tap="selectDay(day)"
        >
          <slot name="day" :day="day">
            <view class="lk-calendar__day-core">
              <text v-if="viewMode === CalendarViewMode.Week" class="lk-calendar__week-label">
                {{ weekdayNames[day.weekday] }}
              </text>
              <text
                v-if="viewMode === CalendarViewMode.Week || showAdjacentDays || day.isCurrentMonth"
                :class="dateClass(day)"
              >
                {{ day.day }}
              </text>
              <view v-if="shouldShowMarkers(day)" class="lk-calendar__markers">
                <slot name="marker" :markers="day.markers" :day="day">
                  <view
                    v-for="(marker, index) in day.markers.slice(0, 3)"
                    :key="`${day.date}-${index}`"
                    class="lk-calendar__marker"
                    :class="`lk-calendar__marker--${markerType(day, marker)}`"
                    :style="{ backgroundColor: marker.color || '' }"
                  >
                    <text
                      v-if="markerType(day, marker) === 'badge' && marker.label"
                      class="lk-calendar__marker-label"
                    >
                      {{ marker.label }}
                    </text>
                  </view>
                </slot>
              </view>
            </view>
          </slot>
        </view>
      </view>
    </view>

    <slot name="footer" :value="modelValue" :view-date="viewDateValue" />
  </view>
</template>

<style lang="scss">
@use './lk-calendar.scss';
</style>
