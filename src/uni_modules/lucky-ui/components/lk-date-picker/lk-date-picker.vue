<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import LkPopup from '../lk-popup/lk-popup.vue';
import LkCalendar from '../lk-calendar/lk-calendar.vue';
import LkButton from '../lk-button/lk-button.vue';
import { datePickerProps, datePickerEmits } from './date-picker.props';

defineOptions({ name: 'LkDatePicker' });

type RangeValue = [Date | null, Date | null];

const props = defineProps(datePickerProps);

const emit = defineEmits(datePickerEmits);

const visible = ref<boolean>(props.modelValue);
watch(
  () => props.modelValue,
  v => (visible.value = v)
);
watch(visible, v => emit('update:modelValue', v));

// 内部暂存选择值
const draftSingle = ref<Date | null>(null);
const draftRange = ref<RangeValue>([null, null]);
const draftMultiple = ref<Date[]>([]);

// 日期时间模式下的时间部分
const h1 = ref<number>(new Date().getHours());
const m1 = ref<number>(new Date().getMinutes());
const s1 = ref<number>(0);
const h2 = ref<number>(new Date().getHours());
const m2 = ref<number>(new Date().getMinutes());
const s2 = ref<number>(0);

const isDateTime = computed(() => props.type === 'date-time' || props.type === 'range-date-time');
const isRangeLike = computed(() => props.type === 'range' || props.type === 'range-date-time');
const isMultiple = computed(() => props.type === 'multiple');
const confirmDisabled = computed(() => {
  if (props.type === 'range' || props.type === 'range-date-time') {
    return !(draftRange.value[0] && draftRange.value[1]);
  }
  if (props.type === 'multiple') return false;
  if (props.type === 'year-month') return false;
  return !draftSingle.value;
});

// 同步外部 value 到内部
function parseDate(val: any): Date | null {
  if (!val) return null;
  if (val instanceof Date) return new Date(val.getFullYear(), val.getMonth(), val.getDate());
  const d = new Date(val);
  return isNaN(+d) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function syncTimeFromDate(target: 'start' | 'end', val: any) {
  if (!(val instanceof Date) || isNaN(+val)) return;
  if (target === 'start') {
    h1.value = val.getHours();
    m1.value = val.getMinutes();
    s1.value = val.getSeconds();
    return;
  }
  h2.value = val.getHours();
  m2.value = val.getMinutes();
  s2.value = val.getSeconds();
}

function syncFromValue() {
  if (props.type === 'range' || props.type === 'range-date-time') {
    if (Array.isArray(props.value)) {
      draftRange.value = [parseDate(props.value[0]), parseDate(props.value[1])];
      if (props.type === 'range-date-time') {
        syncTimeFromDate('start', props.value[0]);
        syncTimeFromDate('end', props.value[1]);
      }
    } else {
      draftRange.value = [null, null];
    }
  } else if (props.type === 'year-month') {
    const d = parseDate(props.value as any);
    if (d) {
      ymYear.value = d.getFullYear();
      ymMonth.value = d.getMonth() + 1;
    }
    draftSingle.value = d;
  } else if (props.type === 'multiple') {
    draftMultiple.value = Array.isArray(props.value)
      ? ((props.value as any[]).map(v => parseDate(v)).filter(Boolean) as Date[])
      : [];
  } else {
    draftSingle.value = parseDate(props.value as any);
    if (props.type === 'date-time') {
      syncTimeFromDate('start', props.value);
    }
  }
}

watch(
  () => props.value,
  () => {
    if (visible.value) syncFromValue();
  }
);
watch(visible, v => {
  if (v) syncFromValue();
});

// 年月模式
const ymYear = ref<number>(new Date().getFullYear());
const ymMonth = ref<number>(new Date().getMonth() + 1); // 1-12
function ymChangeYear(delta: number) {
  ymYear.value += delta;
}
function ymSelectMonth(m: number) {
  ymMonth.value = m;
}

const months = computed(() => [
  { m: 1, label: '1月' },
  { m: 2, label: '2月' },
  { m: 3, label: '3月' },
  { m: 4, label: '4月' },
  { m: 5, label: '5月' },
  { m: 6, label: '6月' },
  { m: 7, label: '7月' },
  { m: 8, label: '8月' },
  { m: 9, label: '9月' },
  { m: 10, label: '10月' },
  { m: 11, label: '11月' },
  { m: 12, label: '12月' },
]);
function isMonthDisabled(y: number, m: number) {
  const min = props.minDate ? parseDate(props.minDate as any) : null;
  const max = props.maxDate ? parseDate(props.maxDate as any) : null;
  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 0);
  if (min && end < min) return true;
  if (max && start > max) return true;
  return false;
}

function onCalendarChange(val: any) {
  if (isRangeLike.value) {
    draftRange.value = val as RangeValue;
  } else if (isMultiple.value) {
    draftMultiple.value = Array.isArray(val) ? (val as Date[]) : [];
  } else {
    draftSingle.value = val as Date | null;
  }
}

function close() {
  visible.value = false;
  emit('cancel');
}

type TimeUnit = 'hour' | 'minute' | 'second';
type TimeTarget = 'start' | 'end';

const timeUnits = computed(() => {
  const units: Array<{ key: TimeUnit; label: string; max: number }> = [
    { key: 'hour', label: '时', max: 23 },
  ];
  if (props.timePrecision !== 'hour') {
    units.push({ key: 'minute', label: '分', max: 59 });
  }
  if (props.timePrecision === 'second') {
    units.push({ key: 'second', label: '秒', max: 59 });
  }
  return units;
});

function getTimeValue(target: TimeTarget, unit: TimeUnit) {
  if (target === 'start') {
    if (unit === 'hour') return h1.value;
    if (unit === 'minute') return m1.value;
    return s1.value;
  }
  if (unit === 'hour') return h2.value;
  if (unit === 'minute') return m2.value;
  return s2.value;
}

function setTimeValue(target: TimeTarget, unit: TimeUnit, value: number) {
  const normalized = Math.max(0, value);
  if (target === 'start') {
    if (unit === 'hour') h1.value = Math.min(23, normalized);
    if (unit === 'minute') m1.value = Math.min(59, normalized);
    if (unit === 'second') s1.value = Math.min(59, normalized);
    return;
  }
  if (unit === 'hour') h2.value = Math.min(23, normalized);
  if (unit === 'minute') m2.value = Math.min(59, normalized);
  if (unit === 'second') s2.value = Math.min(59, normalized);
}

function stepTime(target: TimeTarget, unit: TimeUnit, max: number, step: number) {
  const current = getTimeValue(target, unit);
  const next = (current + step + max + 1) % (max + 1);
  setTimeValue(target, unit, next);
}

function format2(value: number) {
  return `${value}`.padStart(2, '0');
}

function getTimePreview(target: TimeTarget) {
  const h = format2(getTimeValue(target, 'hour'));
  if (props.timePrecision === 'hour') return `${h}:00`;
  const m = format2(getTimeValue(target, 'minute'));
  if (props.timePrecision === 'minute') return `${h}:${m}`;
  const s = format2(getTimeValue(target, 'second'));
  return `${h}:${m}:${s}`;
}

function confirm() {
  let value: Date | [Date, Date] | Date[] | null = null;
  if (props.type === 'range') {
    const [s, e] = draftRange.value;
    value = s && e ? [s, e] : null;
  } else if (props.type === 'year-month') {
    value = new Date(ymYear.value, ymMonth.value - 1, 1);
  } else if (props.type === 'multiple') {
    value = draftMultiple.value.slice();
  } else if (props.type === 'date-time') {
    const d = draftSingle.value;
    if (d) {
      value = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        h1.value,
        m1.value,
        props.timePrecision === 'second' ? s1.value : 0
      );
    } else value = null;
  } else if (props.type === 'range-date-time') {
    const [s, e] = draftRange.value;
    if (s && e) {
      const sdt = new Date(
        s.getFullYear(),
        s.getMonth(),
        s.getDate(),
        h1.value,
        m1.value,
        props.timePrecision === 'second' ? s1.value : 0
      );
      const edt = new Date(
        e.getFullYear(),
        e.getMonth(),
        e.getDate(),
        h2.value,
        m2.value,
        props.timePrecision === 'second' ? s2.value : 0
      );
      value = sdt <= edt ? [sdt, edt] : [edt, sdt];
    } else value = null;
  } else {
    value = draftSingle.value || null;
  }
  emit('confirm', value);
  visible.value = false;
}
</script>

<template>
  <lk-popup v-model="visible" position="bottom">
    <view class="lk-date-picker__panel">
      <view class="lk-date-picker__header">
        <text class="lk-date-picker__title">{{ title }}</text>
        <view class="lk-date-picker__spacer" />
        <lk-button variant="text" @click="close">取消</lk-button>
        <lk-button :disabled="confirmDisabled" @click="confirm">确定</lk-button>
      </view>

      <template v-if="type !== 'year-month'">
        <lk-calendar
          :type="
            type === 'multiple'
              ? 'multiple'
              : type === 'range' || type === 'range-date-time'
                ? 'range'
                : 'single'
          "
          :color="color"
          :first-day="firstDay"
          :show-shortcuts="showShortcuts"
          :disabled-date="disabledDate"
          :min-date="minDate as any"
          :max-date="maxDate as any"
          :model-value="
            type === 'multiple'
              ? (draftMultiple as any)
              : type === 'range' || type === 'range-date-time'
                ? (draftRange as any)
                : (draftSingle as any)
          "
          @update:model-value="onCalendarChange"
        />

        <template v-if="isDateTime">
          <view class="lk-date-picker__time">
            <view v-if="type === 'date-time'" class="lk-date-picker__time-card">
              <view class="lk-date-picker__time-head">
                <text class="lk-date-picker__time-label">时间</text>
                <text class="lk-date-picker__time-value">{{ getTimePreview('start') }}</text>
              </view>
              <view class="lk-date-picker__time-grid">
                <view v-for="unit in timeUnits" :key="'single-' + unit.key" class="lk-date-picker__time-unit">
                  <text class="lk-date-picker__time-unit-label">{{ unit.label }}</text>
                  <view class="lk-date-picker__time-unit-main">
                    <view class="lk-date-picker__time-btn" @click="stepTime('start', unit.key, unit.max, -1)">-</view>
                    <view class="lk-date-picker__time-num">{{ format2(getTimeValue('start', unit.key)) }}</view>
                    <view class="lk-date-picker__time-btn" @click="stepTime('start', unit.key, unit.max, 1)">+</view>
                  </view>
                </view>
              </view>
            </view>

            <view v-if="type === 'range-date-time'" class="lk-date-picker__time-card">
              <view class="lk-date-picker__time-head">
                <text class="lk-date-picker__time-label">开始时间</text>
                <text class="lk-date-picker__time-value">{{ getTimePreview('start') }}</text>
              </view>
              <view class="lk-date-picker__time-grid">
                <view v-for="unit in timeUnits" :key="'start-' + unit.key" class="lk-date-picker__time-unit">
                  <text class="lk-date-picker__time-unit-label">{{ unit.label }}</text>
                  <view class="lk-date-picker__time-unit-main">
                    <view class="lk-date-picker__time-btn" @click="stepTime('start', unit.key, unit.max, -1)">-</view>
                    <view class="lk-date-picker__time-num">{{ format2(getTimeValue('start', unit.key)) }}</view>
                    <view class="lk-date-picker__time-btn" @click="stepTime('start', unit.key, unit.max, 1)">+</view>
                  </view>
                </view>
              </view>
            </view>

            <view v-if="type === 'range-date-time'" class="lk-date-picker__time-card">
              <view class="lk-date-picker__time-head">
                <text class="lk-date-picker__time-label">结束时间</text>
                <text class="lk-date-picker__time-value">{{ getTimePreview('end') }}</text>
              </view>
              <view class="lk-date-picker__time-grid">
                <view v-for="unit in timeUnits" :key="'end-' + unit.key" class="lk-date-picker__time-unit">
                  <text class="lk-date-picker__time-unit-label">{{ unit.label }}</text>
                  <view class="lk-date-picker__time-unit-main">
                    <view class="lk-date-picker__time-btn" @click="stepTime('end', unit.key, unit.max, -1)">-</view>
                    <view class="lk-date-picker__time-num">{{ format2(getTimeValue('end', unit.key)) }}</view>
                    <view class="lk-date-picker__time-btn" @click="stepTime('end', unit.key, unit.max, 1)">+</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </template>
      </template>

      <template v-else>
        <view class="lk-date-picker__ym">
          <view class="lk-date-picker__ym-head">
            <view class="lk-date-picker__nav" @click="ymChangeYear(-1)">‹</view>
            <text class="lk-date-picker__ym-text">{{ ymYear }} 年</text>
            <view class="lk-date-picker__nav" @click="ymChangeYear(1)">›</view>
          </view>
          <view class="lk-date-picker__ym-grid">
            <view
              v-for="mm in months"
              :key="mm.m"
              class="lk-date-picker__ym-cell"
              :class="{
                'is-active': ymMonth === mm.m,
                'is-disabled': isMonthDisabled(ymYear, mm.m),
              }"
              @click="!isMonthDisabled(ymYear, mm.m) && ymSelectMonth(mm.m)"
            >
              {{ mm.label }}
            </view>
          </view>
        </view>
      </template>
    </view>
  </lk-popup>
</template>

<style lang="scss">
@use './index.scss';
</style>
