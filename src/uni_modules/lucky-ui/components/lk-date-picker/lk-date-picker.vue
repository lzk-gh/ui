<script setup lang="ts">
import { computed, ref, watch, type StyleValue } from 'vue';
import LkCalendar from '../lk-calendar/lk-calendar.vue';
import {
  CalendarMode,
  CalendarValueType,
  type CalendarDateInput,
  type CalendarModelValue,
} from '../lk-calendar/calendar.props';
import {
  formatDate,
  getMonthLength,
  outputDate,
  pad2,
  parseDate,
  startOfDay,
} from '../lk-calendar/utils/date';
import LkPopup from '../lk-popup/lk-popup.vue';
import {
  DatePickerDisplayMode,
  DatePickerType,
  datePickerEmits,
  datePickerProps,
  type DatePickerDateInput,
  type DatePickerValue,
} from './date-picker.props';

defineOptions({ name: 'LkDatePicker' });

type RangeValue = [Date | null, Date | null];
type TimeTarget = 'start' | 'end';
type TimeUnit = 'hour' | 'minute' | 'second';
type TimeParts = {
  hour: number;
  minute: number;
  second: number;
};
type WheelOption = {
  label: string;
  value: number;
};

const props = defineProps(datePickerProps);
const emit = defineEmits(datePickerEmits);

const now = new Date();
const popupVisible = ref(getControlledVisible());
const draftSingle = ref<Date | null>(null);
const draftRange = ref<RangeValue>([null, null]);
const draftMultiple = ref<Date[]>([]);
const startTime = ref<TimeParts>(getTimeParts(now));
const endTime = ref<TimeParts>(getTimeParts(now));
const dateWheelIndexes = ref<number[]>([0, 0, 0]);
const rootClass = computed(() => ['lk-date-picker', props.customClass]);
const rootStyle = computed(() => props.customStyle as StyleValue);

const isRangeType = computed(
  () => props.type === DatePickerType.Range || props.type === DatePickerType.RangeDateTime
);
const isMultipleType = computed(() => props.type === DatePickerType.Multiple);
const isDateTimeType = computed(
  () => props.type === DatePickerType.DateTime || props.type === DatePickerType.RangeDateTime
);
const isTimeOnly = computed(() => props.type === DatePickerType.Time);
const isYearMonth = computed(() => props.type === DatePickerType.YearMonth);
const resolvedMode = computed(() => {
  if (props.pickerMode !== DatePickerDisplayMode.Auto) return props.pickerMode;
  if (isYearMonth.value || isTimeOnly.value) return DatePickerDisplayMode.Wheel;
  return DatePickerDisplayMode.Calendar;
});
const showDateWheel = computed(
  () =>
    resolvedMode.value === DatePickerDisplayMode.Wheel &&
    !isRangeType.value &&
    !isMultipleType.value &&
    !isTimeOnly.value
);
const showCalendar = computed(
  () =>
    !isTimeOnly.value &&
    !isYearMonth.value &&
    (!showDateWheel.value || isRangeType.value || isMultipleType.value)
);
const showTimeWheel = computed(() => isTimeOnly.value || isDateTimeType.value);
const showEndTimeWheel = computed(() => props.type === DatePickerType.RangeDateTime);
const calendarMode = computed<CalendarMode>(() => {
  if (isMultipleType.value) return CalendarMode.Multiple;
  if (isRangeType.value) return CalendarMode.Range;
  return CalendarMode.Single;
});
const calendarModelValue = computed<CalendarModelValue>(() => {
  if (isMultipleType.value) return draftMultiple.value;
  if (isRangeType.value) return draftRange.value;
  return draftSingle.value;
});
const confirmDisabled = computed(() => {
  if (isRangeType.value) return !(draftRange.value[0] && draftRange.value[1]);
  if (isMultipleType.value || isTimeOnly.value || isYearMonth.value) return false;
  return !draftSingle.value;
});

const minDateValue = computed(() => parseDate(props.minDate));
const maxDateValue = computed(() => parseDate(props.maxDate));
const minYear = computed(() => minDateValue.value?.getFullYear() ?? now.getFullYear() - 80);
const maxYear = computed(() => maxDateValue.value?.getFullYear() ?? now.getFullYear() + 20);
const yearOptions = computed(() => createNumberOptions(minYear.value, maxYear.value, '年'));
const monthOptions = computed(() => createNumberOptions(1, 12, '月'));
const dayOptions = computed(() => {
  const date = draftSingle.value ?? now;
  const maxDay = getMonthLength(date.getFullYear(), date.getMonth() + 1);
  return createNumberOptions(1, maxDay, '日');
});
const dateWheelColumns = computed(() => {
  if (isYearMonth.value) return [yearOptions.value, monthOptions.value];
  return [yearOptions.value, monthOptions.value, dayOptions.value];
});
const timeUnits = computed(() => {
  const units: Array<{ key: TimeUnit; label: string; step: number; max: number }> = [
    { key: 'hour', label: '时', step: props.stepHour, max: 23 },
  ];
  if (props.timePrecision !== 'hour') {
    units.push({ key: 'minute', label: '分', step: props.stepMinute, max: 59 });
  }
  if (props.timePrecision === 'second') {
    units.push({ key: 'second', label: '秒', step: props.stepSecond, max: 59 });
  }
  return units;
});
const timePresets = computed(() => {
  const current = getTimeParts(new Date());
  return [
    { label: '现在', value: current },
    { label: '09:00', value: { hour: 9, minute: 0, second: 0 } },
    { label: '12:00', value: { hour: 12, minute: 0, second: 0 } },
    { label: '18:00', value: { hour: 18, minute: 0, second: 0 } },
  ];
});

watch(
  () => props.modelValue,
  () => {
    if (props.show === undefined) syncVisibleFromProps();
  }
);
watch(
  () => props.show,
  () => syncVisibleFromProps()
);
watch(
  () => props.value,
  () => {
    if (popupVisible.value) syncFromValue();
  },
  { deep: true }
);
watch(
  () => [props.type, props.minDate, props.maxDate, props.timePrecision],
  () => {
    if (popupVisible.value) syncFromValue();
  }
);

function getControlledVisible() {
  return props.show ?? props.modelValue;
}

function syncVisibleFromProps() {
  popupVisible.value = getControlledVisible();
  if (popupVisible.value) syncFromValue();
}

function setVisible(visible: boolean) {
  if (popupVisible.value === visible) return;
  popupVisible.value = visible;
  emit('update:modelValue', visible);
  emit('update:show', visible);
  if (visible) {
    emit('open');
  } else {
    emit('close');
  }
  if (visible) syncFromValue();
}

function getTimeParts(date: Date): TimeParts {
  return {
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
  };
}

function parseDateTime(input: DatePickerDateInput | null | undefined): Date | null {
  if (input === null || input === undefined || input === '') return null;
  if (input instanceof Date) return Number.isNaN(input.getTime()) ? null : new Date(input);
  const date = new Date(input);
  return Number.isNaN(date.getTime()) ? parseDate(input) : date;
}

function syncFromValue() {
  if (isRangeType.value) {
    const range = Array.isArray(props.value) ? props.value : [];
    const start = parseDateTime(range[0] as DatePickerDateInput | null | undefined);
    const end = parseDateTime(range[1] as DatePickerDateInput | null | undefined);
    draftRange.value = [start ? startOfDay(start) : null, end ? startOfDay(end) : null];
    if (start) startTime.value = getTimeParts(start);
    if (end) endTime.value = getTimeParts(end);
  } else if (isMultipleType.value) {
    draftMultiple.value = Array.isArray(props.value)
      ? props.value
          .map(item => parseDate(item as CalendarDateInput))
          .filter((item): item is Date => item !== null)
      : [];
  } else if (isTimeOnly.value) {
    const date = parseDateTime(props.value as DatePickerDateInput | null);
    startTime.value = date ? getTimeParts(date) : parseTimeString(props.value);
  } else {
    const date = parseDateTime(props.value as DatePickerDateInput | null);
    draftSingle.value = date ? startOfDay(date) : startOfDay(now);
    if (date) startTime.value = getTimeParts(date);
  }
  syncWheelIndexes();
}

function parseTimeString(value: DatePickerValue): TimeParts {
  if (typeof value !== 'string') return getTimeParts(now);
  const matched = value.match(/^(\d{1,2})(?::(\d{1,2}))?(?::(\d{1,2}))?$/);
  if (!matched) return getTimeParts(now);
  return {
    hour: clamp(Number(matched[1]), 0, 23),
    minute: clamp(Number(matched[2] ?? 0), 0, 59),
    second: clamp(Number(matched[3] ?? 0), 0, 59),
  };
}

function syncWheelIndexes() {
  const date = draftSingle.value ?? startOfDay(now);
  dateWheelIndexes.value = [
    findOptionIndex(yearOptions.value, date.getFullYear()),
    findOptionIndex(monthOptions.value, date.getMonth() + 1),
    findOptionIndex(dayOptions.value, date.getDate()),
  ];
}

function createNumberOptions(start: number, end: number, unit: string): WheelOption[] {
  const options: WheelOption[] = [];
  for (let value = start; value <= end; value += 1) {
    options.push({ label: `${value}${unit}`, value });
  }
  return options;
}

function findOptionIndex(options: WheelOption[], value: number) {
  return Math.max(
    0,
    options.findIndex(option => option.value === value)
  );
}

function clamp(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function onCalendarChange(value: CalendarModelValue | null) {
  if (isRangeType.value) {
    const range = Array.isArray(value) ? value : [];
    draftRange.value = [
      parseDate(range[0] as CalendarDateInput | null | undefined),
      parseDate(range[1] as CalendarDateInput | null | undefined),
    ];
  } else if (isMultipleType.value) {
    draftMultiple.value = Array.isArray(value)
      ? value
          .map(item => parseDate(item as CalendarDateInput))
          .filter((item): item is Date => item !== null)
      : [];
  } else {
    draftSingle.value = parseDate(value as CalendarDateInput | null | undefined);
    syncWheelIndexes();
  }
  emit('select', buildOutputValue());
  if (props.confirmOnSelect && !confirmDisabled.value) confirm();
}

function onDateWheelChange(event: { detail: { value: number[] } }) {
  const indexes = event.detail.value;
  const year = yearOptions.value[indexes[0]]?.value ?? now.getFullYear();
  const month = monthOptions.value[indexes[1]]?.value ?? 1;
  const maxDay = getMonthLength(year, month);
  const currentDay = dayOptions.value[indexes[2]]?.value ?? 1;
  const day = isYearMonth.value ? 1 : Math.min(currentDay, maxDay);
  draftSingle.value = startOfDay(new Date(year, month - 1, day));
  dateWheelIndexes.value = [
    findOptionIndex(yearOptions.value, year),
    findOptionIndex(monthOptions.value, month),
    findOptionIndex(dayOptions.value, day),
  ];
  emit('select', buildOutputValue());
}

function getTimeValue(target: TimeTarget, unit: TimeUnit) {
  const source = target === 'start' ? startTime.value : endTime.value;
  return source[unit];
}

function setTimeValue(target: TimeTarget, unit: TimeUnit, value: number) {
  const source = target === 'start' ? startTime.value : endTime.value;
  const next = { ...source, [unit]: value };
  if (target === 'start') {
    startTime.value = next;
    return;
  }
  endTime.value = next;
}

function getEventValue(event: unknown) {
  if (!event || typeof event !== 'object') return '';
  const source = event as {
    detail?: { value?: unknown };
    target?: { value?: unknown };
  };
  const value = source.detail?.value ?? source.target?.value;
  return typeof value === 'string' || typeof value === 'number' ? String(value) : '';
}

function inputTime(target: TimeTarget, unit: TimeUnit, max: number, event: unknown) {
  const raw = getEventValue(event).replace(/\D/g, '');
  if (!raw) {
    setTimeValue(target, unit, 0);
    emit('select', buildOutputValue());
    return;
  }
  setTimeValue(target, unit, clamp(Number(raw), 0, max));
  emit('select', buildOutputValue());
}

function stepTime(target: TimeTarget, unit: TimeUnit, max: number, step: number, direction: 1 | -1) {
  const safeStep = Math.max(1, step);
  const current = getTimeValue(target, unit);
  const next = (current + safeStep * direction + max + 1) % (max + 1);
  setTimeValue(target, unit, next);
  emit('select', buildOutputValue());
}

function applyTimePreset(target: TimeTarget, value: TimeParts) {
  const next = { ...value };
  if (target === 'start') {
    startTime.value = next;
    emit('select', buildOutputValue());
    return;
  }
  endTime.value = next;
  emit('select', buildOutputValue());
}

function close() {
  emit('cancel', buildOutputValue());
  setVisible(false);
}

function confirm() {
  const value = buildOutputValue();
  emit('update:value', value);
  emit('change', value);
  emit('confirm', value);
  setVisible(false);
}

function buildOutputValue(): DatePickerValue {
  if (props.type === DatePickerType.Range) {
    const [start, end] = normalizeRange(draftRange.value[0], draftRange.value[1]);
    return start && end ? [toOutputDate(start), toOutputDate(end)] : null;
  }
  if (props.type === DatePickerType.RangeDateTime) {
    const [startDate, endDate] = normalizeRange(draftRange.value[0], draftRange.value[1]);
    if (!startDate || !endDate) return null;
    const start = mergeDateTime(startDate, startTime.value);
    const end = mergeDateTime(endDate, endTime.value);
    const range = start.getTime() <= end.getTime() ? [start, end] : [end, start];
    return [toOutputDate(range[0]), toOutputDate(range[1])];
  }
  if (props.type === DatePickerType.Multiple) {
    return draftMultiple.value.map(item => toOutputDate(item));
  }
  if (props.type === DatePickerType.Time) {
    return formatTime(startTime.value);
  }
  if (props.type === DatePickerType.DateTime) {
    return draftSingle.value ? toOutputDate(mergeDateTime(draftSingle.value, startTime.value)) : null;
  }
  if (props.type === DatePickerType.YearMonth) {
    return draftSingle.value ? toOutputDate(new Date(draftSingle.value.getFullYear(), draftSingle.value.getMonth(), 1)) : null;
  }
  return draftSingle.value ? toOutputDate(draftSingle.value) : null;
}

function normalizeRange(start: Date | null, end: Date | null): RangeValue {
  if (!start || !end) return [start, end];
  return start.getTime() <= end.getTime() ? [start, end] : [end, start];
}

function mergeDateTime(date: Date, time: TimeParts) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.hour,
    props.timePrecision === 'hour' ? 0 : time.minute,
    props.timePrecision === 'second' ? time.second : 0
  );
}

function toOutputDate(date: Date): DatePickerDateInput {
  if (props.valueType === CalendarValueType.String) return formatDateTime(date, resolvedValueFormat());
  return outputDate(date, props.valueType, resolvedValueFormat()) as DatePickerDateInput;
}

function resolvedValueFormat() {
  if (props.valueFormat !== 'YYYY-MM-DD') return props.valueFormat;
  if (props.type === DatePickerType.YearMonth) return 'YYYY-MM';
  if (props.type === DatePickerType.Time) return props.timePrecision === 'second' ? 'HH:mm:ss' : 'HH:mm';
  if (isDateTimeType.value) {
    return props.timePrecision === 'second' ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD HH:mm';
  }
  return props.valueFormat;
}

function formatDateTime(date: Date, format: string) {
  return formatDate(date, format)
    .replace('HH', pad2(date.getHours()))
    .replace('mm', pad2(date.getMinutes()))
    .replace('ss', pad2(date.getSeconds()));
}

function formatTime(time: TimeParts) {
  const hour = pad2(time.hour);
  if (props.timePrecision === 'hour') return `${hour}:00`;
  const minute = pad2(time.minute);
  if (props.timePrecision === 'minute') return `${hour}:${minute}`;
  return `${hour}:${minute}:${pad2(time.second)}`;
}

syncFromValue();
</script>

<template>
  <lk-popup
    :model-value="popupVisible"
    position="bottom"
    round
    @update:model-value="setVisible"
  >
    <view :id="id" :class="rootClass" :style="rootStyle">
      <view class="lk-date-picker__header">
        <view class="lk-date-picker__action lk-date-picker__action--cancel" @tap="close">
          取消
        </view>
        <text class="lk-date-picker__title">{{ title }}</text>
        <view
          class="lk-date-picker__action lk-date-picker__action--confirm"
          :class="{ 'is-disabled': confirmDisabled }"
          @tap="!confirmDisabled && confirm()"
        >
          确定
        </view>
      </view>

      <view class="lk-date-picker__body">
        <lk-calendar
          v-if="showCalendar"
          :model-value="calendarModelValue"
          :mode="calendarMode"
          :view="view"
          :color="color"
          :first-day="firstDay"
          :show-view-toggle="showViewToggle"
          :show-shortcuts="showShortcuts"
          :show-lunar="showLunar"
          :show-festival="showFestival"
          :show-solar-term="showSolarTerm"
          :show-holiday="showHoliday"
          :use-builtin-holiday="useBuiltinHoliday"
          :holiday-data="holidayData"
          :extra-data="extraData"
          :disabled-date="disabledDate"
          :disabled-week-days="disabledWeekDays"
          :min-date="minDate"
          :max-date="maxDate"
          :max-count="maxCount"
          :min-range="minRange"
          :max-range="maxRange"
          :visible-month-count="visibleMonthCount"
          :scroll-height="scrollHeight"
          value-type="date"
          @update:model-value="onCalendarChange"
        />

        <view v-if="showDateWheel" class="lk-date-picker__wheel-card">
          <view class="lk-date-picker__section-head">
            <text class="lk-date-picker__section-title">
              {{ isYearMonth ? '选择年月' : '选择日期' }}
            </text>
          </view>
          <picker-view
            class="lk-date-picker__wheel"
            :value="dateWheelIndexes"
            indicator-class="lk-date-picker__wheel-indicator"
            @change="onDateWheelChange"
          >
            <picker-view-column
              v-for="(column, columnIndex) in dateWheelColumns"
              :key="columnIndex"
            >
              <view
                v-for="option in column"
                :key="option.value"
                class="lk-date-picker__wheel-item"
              >
                {{ option.label }}
              </view>
            </picker-view-column>
          </picker-view>
        </view>

        <view v-if="showTimeWheel" class="lk-date-picker__time">
          <view class="lk-date-picker__time-card">
            <view class="lk-date-picker__section-head">
              <text class="lk-date-picker__section-title">
                {{ showEndTimeWheel ? '开始时间' : '选择时间' }}
              </text>
              <text class="lk-date-picker__section-value">{{ formatTime(startTime) }}</text>
            </view>
            <view class="lk-date-picker__time-preview">{{ formatTime(startTime) }}</view>
            <view class="lk-date-picker__time-grid">
              <view v-for="unit in timeUnits" :key="'start-' + unit.key" class="lk-date-picker__time-unit">
                <text class="lk-date-picker__time-unit-label">{{ unit.label }}</text>
                <view class="lk-date-picker__time-stepper">
                  <view class="lk-date-picker__time-step" @tap="stepTime('start', unit.key, unit.max, unit.step, -1)">
                    -
                  </view>
                  <input
                    class="lk-date-picker__time-num"
                    type="number"
                    maxlength="2"
                    :value="pad2(getTimeValue('start', unit.key))"
                    @input="inputTime('start', unit.key, unit.max, $event)"
                  />
                  <view class="lk-date-picker__time-step" @tap="stepTime('start', unit.key, unit.max, unit.step, 1)">
                    +
                  </view>
                </view>
              </view>
            </view>
            <view class="lk-date-picker__time-presets">
              <view
                v-for="preset in timePresets"
                :key="'start-' + preset.label"
                class="lk-date-picker__time-preset"
                @tap="applyTimePreset('start', preset.value)"
              >
                {{ preset.label }}
              </view>
            </view>
          </view>

          <view v-if="showEndTimeWheel" class="lk-date-picker__time-card">
            <view class="lk-date-picker__section-head">
              <text class="lk-date-picker__section-title">结束时间</text>
              <text class="lk-date-picker__section-value">{{ formatTime(endTime) }}</text>
            </view>
            <view class="lk-date-picker__time-preview">{{ formatTime(endTime) }}</view>
            <view class="lk-date-picker__time-grid">
              <view v-for="unit in timeUnits" :key="'end-' + unit.key" class="lk-date-picker__time-unit">
                <text class="lk-date-picker__time-unit-label">{{ unit.label }}</text>
                <view class="lk-date-picker__time-stepper">
                  <view class="lk-date-picker__time-step" @tap="stepTime('end', unit.key, unit.max, unit.step, -1)">
                    -
                  </view>
                  <input
                    class="lk-date-picker__time-num"
                    type="number"
                    maxlength="2"
                    :value="pad2(getTimeValue('end', unit.key))"
                    @input="inputTime('end', unit.key, unit.max, $event)"
                  />
                  <view class="lk-date-picker__time-step" @tap="stepTime('end', unit.key, unit.max, unit.step, 1)">
                    +
                  </view>
                </view>
              </view>
            </view>
            <view class="lk-date-picker__time-presets">
              <view
                v-for="preset in timePresets"
                :key="'end-' + preset.label"
                class="lk-date-picker__time-preset"
                @tap="applyTimePreset('end', preset.value)"
              >
                {{ preset.label }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </lk-popup>
</template>

<style lang="scss">
@use './index.scss';
</style>
