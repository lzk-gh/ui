<script setup lang="ts">
import { ref, computed, watch, toRef } from 'vue';
defineOptions({ name: 'LkCalendar' });

type DateLike = Date | string | null | undefined;
type RangeValue = [Date | null, Date | null];
type MultipleValue = Date[];

const props = defineProps({
  // 支持 Date / [Date,Date] / Date[]，也兼容字符串输入（将被解析为 Date）
  modelValue: {
    type: [Date, Array, String] as unknown as () =>
      | Date
      | string
      | [Date | string, Date | string]
      | Array<Date | string>
      | null,
    default: null,
  },
  type: {
    type: String as () => 'single' | 'range' | 'multiple',
    default: 'single',
  },
  // 主题色：primary/success/warning/danger/info 或自定义 CSS 颜色值
  color: { type: String, default: 'primary' },
  // 禁用日期
  disabledDate: {
    type: Function as unknown as () => (d: Date) => boolean,
    default: undefined,
  },
  // 最小/最大日期（兼容老的 min/max 字符串）
  minDate: {
    type: [Date, String] as unknown as () => Date | string | null,
    default: null,
  },
  maxDate: {
    type: [Date, String] as unknown as () => Date | string | null,
    default: null,
  },
  min: { type: String, default: '' },
  max: { type: String, default: '' },
  // 周起始：0 周日，1 周一（兼容原 firstDay）
  firstDay: { type: Number, default: 1 },
  showHeader: { type: Boolean, default: true },
  showShortcuts: { type: Boolean, default: false },
  // 多选最大选择数量，0 表示不限制
  maxCount: { type: Number, default: 0 },
  // 输出类型：'date' 或 'string'
  valueType: { type: String as () => 'date' | 'string', default: 'date' },
  // 当 valueType 为 'string' 时的格式
  valueFormat: { type: String, default: 'YYYY-MM-DD' },
});

const emit = defineEmits(['update:modelValue', 'change', 'month-change', 'confirm', 'clear']);

// 工具函数
function pad(n: number) {
  return n < 10 ? '0' + n : '' + n;
}
function makeDate(y: number, m: number, d: number) {
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}
function formatDate(d: Date | null, fmt = 'YYYY-MM-DD') {
  if (!d) return '';
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return fmt.replace('YYYY', String(y)).replace('MM', pad(m)).replace('DD', pad(day));
}
function parseDate(input: DateLike): Date | null {
  if (!input) return null;
  if (input instanceof Date)
    return new Date(input.getFullYear(), input.getMonth(), input.getDate());
  // 兼容 'YYYY-MM-DD'
  const m = String(input).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) {
    const y = +m[1];
    const mm = +m[2];
    const dd = +m[3];
    return makeDate(y, mm, dd);
  }
  const d = new Date(input);
  if (!isNaN(+d)) return makeDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
  return null;
}

// 归一化输入值
const normalizedType = toRef(props, 'type');
const today = new Date();

const internalSingle = ref<Date | null>(null);
const internalRange = ref<RangeValue>([null, null]);
const internalMultiple = ref<MultipleValue>([]);

function isInRangeMode() {
  return normalizedType.value === 'range';
}
function isInMultipleMode() {
  return normalizedType.value === 'multiple';
}

function coerceMinMax() {
  const min = parseDate(props.minDate ?? props.min ?? null);
  const max = parseDate(props.maxDate ?? props.max ?? null);
  return { min, max } as { min: Date | null; max: Date | null };
}

function clampToMinMax(d: Date | null) {
  if (!d) return d;
  const { min, max } = coerceMinMax();
  if (min && d < min) return min;
  if (max && d > max) return max;
  return d;
}

function isDisabled(d: Date) {
  const { min, max } = coerceMinMax();
  if (min && d < min) return true;
  if (max && d > max) return true;
  if (typeof props.disabledDate === 'function' && props.disabledDate(d)) return true;
  return false;
}

// 当前面板年月
const initSelected = isInRangeMode()
  ? Array.isArray(props.modelValue)
    ? parseDate(props.modelValue[0] as DateLike)
    : parseDate(props.modelValue as DateLike)
  : isInMultipleMode()
    ? Array.isArray(props.modelValue) && (props.modelValue as any[]).length > 0
      ? parseDate((props.modelValue as any[])[0] as DateLike)
      : null
    : parseDate(props.modelValue as DateLike);
const initBase = initSelected || today;
const cur = ref<{ y: number; m: number }>({
  y: initBase.getFullYear(),
  m: initBase.getMonth() + 1,
});

// 同步外部 v-model 到内部
function syncFromModel() {
  if (isInRangeMode()) {
    if (Array.isArray(props.modelValue)) {
      internalRange.value = [
        parseDate(props.modelValue[0] as DateLike),
        parseDate(props.modelValue[1] as DateLike),
      ];
    } else {
      internalRange.value = [null, null];
    }
  } else if (isInMultipleMode()) {
    if (Array.isArray(props.modelValue)) {
      internalMultiple.value = (props.modelValue as any[])
        .map(v => parseDate(v as DateLike))
        .filter(Boolean) as Date[];
    } else {
      internalMultiple.value = [];
    }
  } else {
    internalSingle.value = parseDate(props.modelValue as DateLike);
  }
}
syncFromModel();

watch(
  () => props.modelValue,
  () => syncFromModel()
);

// 天格数据
const weekNames = computed(() => ['日', '一', '二', '三', '四', '五', '六'] as const);
const days = computed(() => {
  const { y, m } = cur.value;
  const first = new Date(y, m - 1, 1);
  const startWeek = (first.getDay() - props.firstDay + 7) % 7;
  const len = new Date(y, m, 0).getDate();
  const arr: Array<any> = [];
  for (let i = 0; i < startWeek; i++) {
    arr.push(null);
  }
  for (let d = 1; d <= len; d++) {
    const date = makeDate(y, m, d);
    const tstr = formatDate(today);
    const ds = formatDate(date);

    const singleSelected =
      !isInRangeMode() &&
      !isInMultipleMode() &&
      internalSingle.value &&
      formatDate(internalSingle.value) === ds;
    const [start, end] = internalRange.value;
    const inRange = isInRangeMode() && start && end && date >= start && date <= end;
    const rangeStart = isInRangeMode() && start && formatDate(start) === ds;
    const rangeEnd = isInRangeMode() && end && formatDate(end) === ds;
    const multiSelected =
      isInMultipleMode() && internalMultiple.value.some(x => formatDate(x) === ds);

    arr.push({
      d,
      date,
      isToday: ds === tstr,
      disabled: isDisabled(date),
      singleSelected,
      inRange,
      rangeStart,
      rangeEnd,
      multiSelected,
    });
  }
  return arr;
});

function changeMonth(delta: number) {
  let { y, m } = cur.value;
  m += delta;
  if (m < 1) {
    m = 12;
    y--;
  } else if (m > 12) {
    m = 1;
    y++;
  }
  cur.value = { y, m };
  emit('month-change', { year: y, month: m });
}

function outputValue() {
  if (props.valueType === 'string') {
    if (isInRangeMode()) {
      const [s, e] = internalRange.value;
      return [s ? formatDate(s, props.valueFormat) : '', e ? formatDate(e, props.valueFormat) : ''];
    } else if (isInMultipleMode()) {
      return internalMultiple.value.map(d => formatDate(d, props.valueFormat));
    }
    return internalSingle.value ? formatDate(internalSingle.value, props.valueFormat) : '';
  } else {
    if (isInRangeMode()) return internalRange.value;
    if (isInMultipleMode()) return internalMultiple.value;
    return internalSingle.value;
  }
}

function select(day: any) {
  if (!day || day.disabled) return;
  if (isInRangeMode()) {
    let [start, end] = internalRange.value;
    if (!start || (start && end)) {
      // 重新选择起点
      start = day.date;
      end = null;
    } else {
      // 选择终点（自动调整顺序）
      if (day.date < start) {
        end = start;
        start = day.date;
      } else {
        end = day.date;
      }
    }
    // clamp 并校验禁用日期
    start = clampToMinMax(start);
    end = clampToMinMax(end);
    internalRange.value = [start, end];
  } else if (isInMultipleMode()) {
    const key = formatDate(day.date);
    const idx = internalMultiple.value.findIndex(d => formatDate(d) === key);
    if (idx >= 0) {
      internalMultiple.value.splice(idx, 1);
    } else {
      if (props.maxCount > 0 && internalMultiple.value.length >= props.maxCount) return;
      internalMultiple.value.push(day.date);
    }
  } else {
    internalSingle.value = clampToMinMax(day.date);
  }

  const val = outputValue();
  emit('update:modelValue', val as any);
  emit('change', val as any);
}

function applyShortcut(type: string) {
  const now = new Date();
  const todayD = makeDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const setSingle = (d: Date | null) => {
    internalSingle.value = d;
  };
  const setRange = (s: Date | null, e: Date | null) => {
    internalRange.value = [s, e];
  };

  switch (type) {
    case 'today':
      if (isInRangeMode()) setRange(todayD, todayD);
      else setSingle(todayD);
      break;
    case 'yesterday': {
      const yest = new Date(todayD);
      yest.setDate(yest.getDate() - 1);
      if (isInRangeMode()) setRange(yest, yest);
      else setSingle(yest);
      break;
    }
    case 'last7': {
      const end = todayD;
      const start = new Date(end);
      start.setDate(start.getDate() - 6);
      setRange(start, end);
      break;
    }
    case 'thisMonth': {
      const s = makeDate(todayD.getFullYear(), todayD.getMonth() + 1, 1);
      const e = makeDate(
        todayD.getFullYear(),
        todayD.getMonth() + 1,
        new Date(todayD.getFullYear(), todayD.getMonth() + 1, 0).getDate()
      );
      if (isInRangeMode()) setRange(s, e);
      else setSingle(todayD);
      cur.value = { y: s.getFullYear(), m: s.getMonth() + 1 };
      break;
    }
    case 'prevMonth': {
      const pm = new Date(todayD);
      pm.setMonth(pm.getMonth() - 1);
      const s = makeDate(pm.getFullYear(), pm.getMonth() + 1, 1);
      const e = makeDate(
        pm.getFullYear(),
        pm.getMonth() + 1,
        new Date(pm.getFullYear(), pm.getMonth() + 1, 0).getDate()
      );
      if (isInRangeMode()) setRange(s, e);
      else setSingle(s);
      cur.value = { y: s.getFullYear(), m: s.getMonth() + 1 };
      break;
    }
    case 'clear':
      if (isInRangeMode()) internalRange.value = [null, null];
      else internalSingle.value = null;
      emit('clear');
      break;
  }

  const val = outputValue();
  emit('update:modelValue', val as any);
  emit('change', val as any);
}

// 主题色变量
const accentStyle = computed(() => {
  const c = props.color;
  // 如果是主题关键字，转成主题变量；否则当作直接颜色值
  const map: Record<string, string> = {
    primary: 'var(--lk-color-primary)',
    success: 'var(--lk-color-success, #16a34a)',
    warning: 'var(--lk-color-warning, #f59e0b)',
    danger: 'var(--lk-color-danger, #ef4444)',
    info: 'var(--lk-color-info, #0ea5e9)',
  };
  const bgSoftMap: Record<string, string> = {
    primary: 'var(--lk-color-primary-bg-soft, rgba(59,130,246,.08))',
    success: 'var(--lk-color-success-bg-soft, rgba(22,163,74,.08))',
    warning: 'var(--lk-color-warning-bg-soft, rgba(245,158,11,.08))',
    danger: 'var(--lk-color-danger-bg-soft, rgba(239,68,68,.08))',
    info: 'var(--lk-color-info-bg-soft, rgba(14,165,233,.08))',
  };
  const colorVar = map[c] || c;
  const bgVar = bgSoftMap[c] || 'rgba(0,0,0,.05)';
  return {
    '--lk-calendar-accent': colorVar,
    '--lk-calendar-accent-bg': bgVar,
  } as any;
});
</script>

<template>
  <view class="lk-calendar" :style="accentStyle">
    <view v-if="showHeader" class="lk-calendar__header">
      <view class="lk-calendar__nav" @click="changeMonth(-1)">‹</view>
      <text class="lk-calendar__ym">{{ cur.y }} - {{ cur.m }}</text>
      <view class="lk-calendar__nav" @click="changeMonth(1)">›</view>
    </view>

    <view v-if="showShortcuts" class="lk-calendar__shortcuts">
      <view class="lk-calendar__chip" @click="applyShortcut('today')">今天</view>
      <view class="lk-calendar__chip" @click="applyShortcut('yesterday')">昨天</view>
      <view v-if="type === 'range'" class="lk-calendar__chip" @click="applyShortcut('last7')"
        >近7天</view
      >
      <view class="lk-calendar__chip" @click="applyShortcut('thisMonth')">本月</view>
      <view class="lk-calendar__chip" @click="applyShortcut('prevMonth')">上个月</view>
      <view class="lk-calendar__chip is-plain" @click="applyShortcut('clear')">清除</view>
    </view>

    <view class="lk-calendar__week">
      <text v-for="w in 7" :key="w">{{ weekNames[(w - 1 + firstDay) % 7] }}</text>
    </view>

    <view class="lk-calendar__grid">
      <view
        v-for="(d, i) in days"
        :key="i"
        class="lk-calendar__cell"
        :class="{
          'is-empty': !d,
          'is-today': d?.isToday,
          'is-disabled': d?.disabled,
          'is-selected': d?.singleSelected,
          'is-in-range': d?.inRange,
          'is-range-start': d?.rangeStart,
          'is-range-end': d?.rangeEnd,
          'is-multi-selected': d?.multiSelected,
        }"
        @click="select(d)"
      >
        <template v-if="d">
          <text class="lk-calendar__day-text">{{ d.d }}</text>
        </template>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.lk-calendar {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  font-size: 26rpx;
  --accent: var(--lk-calendar-accent, var(--lk-color-primary));
  --accent-bg: var(--lk-calendar-accent-bg, var(--lk-color-primary-bg-soft));
  --text-inverse: var(--lk-color-text-inverse, #fff);
  --text-secondary: var(--lk-color-text-secondary, rgba(0, 0, 0, 0.52));
  --radius-md: var(--lk-radius-md, 12rpx);
  --radius-pill: var(--lk-radius-pill, 9999rpx);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;
  }
  &__nav {
    width: 64rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--accent-bg);
    color: var(--accent);
    border-radius: var(--radius-pill);
    &:active {
      background: var(--accent);
      color: var(--text-inverse);
    }
  }
  &__ym {
    font-weight: 700;
  }

  &__shortcuts {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;
  }
  &__chip {
    padding: 8rpx 16rpx;
    border-radius: var(--radius-pill);
    background: var(--accent-bg);
    color: var(--accent);
    font-size: 22rpx;
    &.is-plain {
      background: transparent;
      color: var(--text-secondary);
      border: 2rpx solid var(--accent-bg);
    }
    &:active {
      filter: brightness(0.95);
    }
  }

  &__week {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    font-size: 22rpx;
    color: var(--text-secondary);
  }
  &__grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8rpx;
  }
  &__cell {
    position: relative;
    height: 84rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-md);
    background: var(--accent-bg);
    color: var(--lk-color-text, #111827);

    &.is-empty {
      background: transparent;
    }
    &.is-disabled {
      opacity: 0.4;
    }

    &.is-today {
      box-shadow: 0 0 0 2rpx var(--accent);
    }

    &.is-selected {
      background: var(--accent);
      color: var(--text-inverse);
      font-weight: 600;
    }
    &.is-multi-selected {
      background: var(--accent);
      color: var(--text-inverse);
      font-weight: 600;
    }

    // 区间样式
    &.is-in-range {
      background: rgba(0, 0, 0, 0.04);
    }
    &.is-range-start,
    &.is-range-end {
      background: var(--accent);
      color: var(--text-inverse);
      font-weight: 600;
    }

    &:active:not(.is-empty):not(.is-disabled) {
      filter: brightness(0.92);
    }
  }
}
</style>
