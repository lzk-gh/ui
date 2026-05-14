<script setup lang="ts">
import type { StyleValue } from 'vue';
import { computed, ref, watch } from 'vue';
import { useLocale } from '../../composables/useLocale';
import LkButton from '../lk-button/lk-button.vue';
import LkCalendar from '../lk-calendar/lk-calendar.vue';
import { CalendarMode, type CalendarDay, type CalendarValue } from '../lk-calendar/calendar.props';
import LkIcon from '../lk-icon/lk-icon.vue';
import LkPopup from '../lk-popup/lk-popup.vue';
import LkSlider from '../lk-slider/lk-slider.vue';
import {
  CalendarPickerTimePrecision,
  calendarPickerEmits,
  calendarPickerProps,
  type CalendarPickerValue,
} from './calendar-picker.props';

defineOptions({ name: 'LkCalendarPicker' });

const props = defineProps(calendarPickerProps);
const emit = defineEmits(calendarPickerEmits);
const { t } = useLocale('calendarPicker');

const DATE_TIME_RE = /^(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}:\d{2}(?::\d{2})?))?$/;
const innerShow = ref(props.show);
const tempValue = ref<CalendarValue>(normalizePickerValue(props.modelValue));
const startTime = ref(parseTime(props.defaultStartTime, 0));
const endTime = ref(parseTime(props.defaultEndTime, 86399));
const panelDate = ref(props.viewDate);

const cls = computed(() => [
  'lk-calendar-picker',
  {
    'is-disabled': props.disabled,
    'is-readonly': props.readonly,
  },
  props.customClass,
]);
const style = computed(() => props.customStyle as StyleValue);
const resolvedTitle = computed(() => props.title || t('title'));
const resolvedPlaceholder = computed(() => props.placeholder || t('placeholder'));
const resolvedConfirmText = computed(() => props.confirmText || t('confirm'));
const resolvedResetText = computed(() => props.resetText || t('reset'));
const hasValue = computed(() => normalizePickerValue(props.modelValue).length > 0);
const displayValue = computed(() => {
  const values = normalizePickerValue(props.modelValue);
  if (!values.length) return resolvedPlaceholder.value;
  if (props.mode === CalendarMode.Range && values.length > 1) {
    return `${values[0]} ${t('rangeSeparator')} ${values[1]}`;
  }
  if (props.mode === CalendarMode.Multiple) return t('multipleSelected', { count: values.length });
  return values[0] || resolvedPlaceholder.value;
});
const confirmDisabled = computed(() => normalizePickerValue(tempValue.value).length === 0);
const timeUnit = computed(() => {
  if (props.timePrecision === CalendarPickerTimePrecision.Hour) return 3600;
  if (props.timePrecision === CalendarPickerTimePrecision.Second) return 1;
  return 60;
});
const timeMax = computed(() => 86400 - timeUnit.value);
const timeStep = computed(() => Math.max(1, props.timeStep) * timeUnit.value);
const shouldShowEndTime = computed(() => props.showTime && props.mode === CalendarMode.Range);
const endTimeDisabled = computed(() => normalizePickerValue(tempValue.value).length < 2);

function normalizePickerValue(value: CalendarPickerValue): string[] {
  if (Array.isArray(value)) return value.filter(Boolean);
  return value ? [value] : [];
}

function datePart(value: string) {
  return DATE_TIME_RE.exec(value)?.[1] || value;
}

function timePart(value: string) {
  return DATE_TIME_RE.exec(value)?.[2] || '';
}

function parseTime(value: string, fallback: number) {
  const parts = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value || '');
  if (!parts) return fallback;
  const hour = Math.min(23, Math.max(0, Number(parts[1])));
  const minute = Math.min(59, Math.max(0, Number(parts[2])));
  const second = Math.min(59, Math.max(0, Number(parts[3] || 0)));
  return hour * 3600 + minute * 60 + second;
}

function formatTime(value: number) {
  const total = Math.min(86399, Math.max(0, Math.round(value)));
  const hour = Math.floor(total / 3600);
  const minute = Math.floor((total % 3600) / 60);
  const second = total % 60;
  const hh = hour < 10 ? `0${hour}` : `${hour}`;
  const mm = minute < 10 ? `0${minute}` : `${minute}`;
  const ss = second < 10 ? `0${second}` : `${second}`;
  if (props.timePrecision === CalendarPickerTimePrecision.Hour) return `${hh}:00`;
  if (props.timePrecision === CalendarPickerTimePrecision.Second) return `${hh}:${mm}:${ss}`;
  return `${hh}:${mm}`;
}

function mergeTime(value: CalendarValue): CalendarPickerValue {
  const values = normalizePickerValue(value);
  if (!props.showTime) return Array.isArray(value) ? values : values[0] || '';

  const withTime = values.map((item, index) => {
    const seconds = index === 1 && props.mode === CalendarMode.Range ? endTime.value : startTime.value;
    return `${datePart(item)} ${formatTime(seconds)}`;
  });
  return Array.isArray(value) ? withTime : withTime[0] || '';
}

function syncDraftFromValue(value: CalendarPickerValue) {
  const values = normalizePickerValue(value);
  tempValue.value = Array.isArray(value) ? values.map(item => datePart(item)) : datePart(values[0] || '');
  const firstTime = timePart(values[0] || '');
  const secondTime = timePart(values[1] || '');
  startTime.value = firstTime ? parseTime(firstTime, startTime.value) : parseTime(props.defaultStartTime, 0);
  endTime.value = secondTime ? parseTime(secondTime, endTime.value) : parseTime(props.defaultEndTime, 86399);
  panelDate.value = props.viewDate || datePart(values[0] || '') || '';
}

function open() {
  if (props.disabled || props.readonly) return;
  syncDraftFromValue(props.modelValue);
  innerShow.value = true;
}

function close() {
  innerShow.value = false;
}

function reset() {
  tempValue.value = props.mode === CalendarMode.Single ? '' : [];
  startTime.value = parseTime(props.defaultStartTime, 0);
  endTime.value = parseTime(props.defaultEndTime, 86399);
  emit('update:modelValue', props.mode === CalendarMode.Single ? '' : []);
  emit('change', props.mode === CalendarMode.Single ? '' : []);
  emit('reset');
}

function confirm() {
  const value = mergeTime(tempValue.value);
  emit('update:modelValue', value);
  emit('change', value);
  emit('confirm', value);
  if (props.closeOnConfirm) close();
}

function onSelect(day: CalendarDay) {
  emit('select', day);
}

watch(
  () => props.show,
  value => {
    innerShow.value = value;
    if (value) syncDraftFromValue(props.modelValue);
  }
);

watch(
  () => props.modelValue,
  value => {
    if (!innerShow.value) syncDraftFromValue(value);
  },
  { deep: true }
);

watch(innerShow, value => {
  emit('update:show', value);
  if (value) {
    emit('open');
  } else {
    emit('close');
  }
});
</script>

<template>
  <view :id="id" :class="cls" :style="style">
    <slot name="trigger" :open="open" :value="modelValue" :display-value="displayValue">
      <view class="lk-calendar-picker__trigger" :class="{ 'is-empty': !hasValue }" @tap="open">
        <text class="lk-calendar-picker__trigger-text">{{ displayValue }}</text>
      </view>
    </slot>

    <lk-popup
      v-model="innerShow"
      :position="popupPosition"
      :height="popupHeight"
      :round="true"
      :closable="false"
      :close-on-overlay="closeOnOverlay"
      animation="slide-up"
    >
      <view class="lk-calendar-picker__panel">
        <view class="lk-calendar-picker__header">
          <text v-if="showReset" class="lk-calendar-picker__reset" @tap="reset">
            {{ resolvedResetText }}
          </text>
          <text v-else class="lk-calendar-picker__reset"></text>
          <text class="lk-calendar-picker__title">{{ resolvedTitle }}</text>
          <view class="lk-calendar-picker__close" @tap="close">
            <lk-icon name="x-lg" size="30" />
          </view>
        </view>

        <lk-calendar
          v-model="tempValue"
          v-model:view-date="panelDate"
          :mode="mode"
          :size="size"
          :view-mode="viewMode"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled-dates="disabledDates"
          :markers="markers"
          :first-day-of-week="firstDayOfWeek"
          :show-adjacent-days="showAdjacentDays"
          :show-today="showToday"
          :show-year="showYear"
          :swipeable="swipeable"
          @select="onSelect"
        />

        <view v-if="showTime" class="lk-calendar-picker__time">
          <view class="lk-calendar-picker__time-row">
            <text class="lk-calendar-picker__time-label">
              {{ mode === CalendarMode.Range ? t('start') : t('time') }}
            </text>
            <view class="lk-calendar-picker__slider">
              <lk-slider
                v-model="startTime"
                :min="0"
                :max="timeMax"
                :step="timeStep"
                show-value
                :show-value-text="false"
                :format-value="formatTime"
                active-color="var(--lk-color-primary)"
              />
            </view>
          </view>
          <view v-if="shouldShowEndTime" class="lk-calendar-picker__time-row">
            <text class="lk-calendar-picker__time-label">{{ t('end') }}</text>
            <view class="lk-calendar-picker__slider" :class="{ 'is-disabled': endTimeDisabled }">
              <lk-slider
                v-model="endTime"
                :min="0"
                :max="timeMax"
                :step="timeStep"
                :disabled="endTimeDisabled"
                show-value
                :show-value-text="false"
                :format-value="formatTime"
                active-color="var(--lk-color-primary)"
              />
            </view>
          </view>
        </view>

        <view class="lk-calendar-picker__footer">
          <lk-button
            block
            shape="round"
            size="lg"
            :disabled="confirmDisabled"
            hover-class="none"
            @click="confirm"
          >
            {{ resolvedConfirmText }}
          </lk-button>
        </view>
      </view>
    </lk-popup>
  </view>
</template>

<style lang="scss">
@use './lk-calendar-picker.scss';
</style>
