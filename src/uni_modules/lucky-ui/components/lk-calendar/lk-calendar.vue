<script setup lang="ts">
import { ref, computed, watch, toRef, nextTick, onMounted, getCurrentInstance } from 'vue';
import { calendarProps, calendarEmits } from './calendar.props';
defineOptions({ name: 'LkCalendar' });

type DateLike = Date | string | null | undefined;
type RangeValue = [Date | null, Date | null];
type MultipleValue = Date[];

const props = defineProps(calendarProps);

const emit = defineEmits(calendarEmits);

// 工具函数
function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
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

const totalRows = computed(() => Math.ceil(days.value.length / 7));

function getFocusDate() {
  if (isInRangeMode()) return internalRange.value[0] || today;
  if (isInMultipleMode()) return internalMultiple.value[0] || today;
  return internalSingle.value || today;
}

function getFocusWeekIndex() {
  const focus = getFocusDate();
  const { y, m } = cur.value;
  const first = new Date(y, m - 1, 1);
  const startWeek = (first.getDay() - props.firstDay + 7) % 7;
  const dayNum = focus.getDate();
  return Math.floor((startWeek + dayNum - 1) / 7);
}

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

// --- 拖拽折叠/展开（周视图） ---
const gridHeightPx = ref(0);
const gridHeightCurrent = ref(0);
const isGridDragging = ref(false);
let dragStartY = 0;
let dragStartHeight = 0;
let dragLastY = 0;
let dragLastTime = 0;
let dragVelocity = 0;

const instance = getCurrentInstance();

function measureGridHeight() {
  nextTick(() => {
    const query = uni.createSelectorQuery().in(instance?.proxy as any);
    query
      .select('.lk-calendar__grid')
      .boundingClientRect((rect: any) => {
        if (rect && rect.height) {
          gridHeightPx.value = rect.height;
          if (!gridHeightCurrent.value) gridHeightCurrent.value = rect.height;
        }
      })
      .exec();
  });
}

onMounted(() => {
  measureGridHeight();
});

watch(
  () => [cur.value.y, cur.value.m, days.value.length],
  () => {
    measureGridHeight();
    if (gridHeightPx.value) gridHeightCurrent.value = gridHeightPx.value;
  }
);

const rowHeightPx = computed(() => {
  if (gridHeightPx.value && totalRows.value > 0) {
    return gridHeightPx.value / totalRows.value;
  }
  return uni.upx2px(92);
});

const isCollapsed = computed(() => gridHeightCurrent.value <= rowHeightPx.value + 1);
const gridOffsetPx = computed(() =>
  isCollapsed.value ? getFocusWeekIndex() * rowHeightPx.value : 0
);

const gridWrapperStyle = computed(() => {
  const height = gridHeightCurrent.value || rowHeightPx.value * totalRows.value;
  return {
    height: `${height}px`,
    transition: isGridDragging.value ? 'none' : 'height 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  } as any;
});

const gridStyle = computed(() => {
  if (!isCollapsed.value) return {};
  return {
    transform: `translateY(-${gridOffsetPx.value}px)`,
    transition: isGridDragging.value ? 'none' : 'transform 0.25s ease',
  } as any;
});

function onGridDragStart(e: any) {
  isGridDragging.value = true;
  dragStartY = e.touches[0].clientY;
  dragStartHeight = gridHeightCurrent.value || gridHeightPx.value;
  dragLastY = dragStartY;
  dragLastTime = Date.now();
  dragVelocity = 0;
}

function onGridDragMove(e: any) {
  if (!isGridDragging.value) return;
  const currentY = e.touches[0].clientY;
  const currentTime = Date.now();
  const timeDelta = currentTime - dragLastTime;
  if (timeDelta > 0) {
    dragVelocity = (currentY - dragLastY) / timeDelta;
  }
  dragLastY = currentY;
  dragLastTime = currentTime;

  const delta = currentY - dragStartY;
  const minH = rowHeightPx.value;
  const maxH = gridHeightPx.value || rowHeightPx.value * totalRows.value;
  let nextH = dragStartHeight + delta;

  // 阻尼效果：超出边界时增加阻力
  if (nextH < minH) {
    nextH = minH - (minH - nextH) * 0.3;
  } else if (nextH > maxH) {
    nextH = maxH + (nextH - maxH) * 0.3;
  }
  gridHeightCurrent.value = nextH;
}

// --- 左右滑动切月 ---
let swipeStartX = 0;
let swipeStartY = 0;
let swipeLastX = 0;
let swipeLastY = 0;

function onSwipeStart(e: any) {
  swipeStartX = e.touches[0].clientX;
  swipeStartY = e.touches[0].clientY;
  swipeLastX = swipeStartX;
  swipeLastY = swipeStartY;
}

function onSwipeMove(e: any) {
  swipeLastX = e.touches[0].clientX;
  swipeLastY = e.touches[0].clientY;
}

function onSwipeEnd() {
  const dx = swipeLastX - swipeStartX;
  const dy = swipeLastY - swipeStartY;
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);
  if (absX >= 40 && absX > absY * 1.2) {
    changeMonth(dx < 0 ? 1 : -1);
  }
}

function onGridDragEnd() {
  if (!isGridDragging.value) return;
  isGridDragging.value = false;
  const minH = rowHeightPx.value;
  const maxH = gridHeightPx.value || rowHeightPx.value * totalRows.value;
  const velocityThreshold = 0.3; // px/ms

  // 先修正超出边界的情况
  if (gridHeightCurrent.value < minH) {
    gridHeightCurrent.value = minH;
    return;
  }
  if (gridHeightCurrent.value > maxH) {
    gridHeightCurrent.value = maxH;
    return;
  }

  // 根据速度判断方向
  if (Math.abs(dragVelocity) > velocityThreshold) {
    gridHeightCurrent.value = dragVelocity > 0 ? maxH : minH;
    return;
  }

  // 根据位置吸附
  const mid = (minH + maxH) / 2;
  gridHeightCurrent.value = gridHeightCurrent.value < mid ? minH : maxH;
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
  function setSingle(d: Date | null) {
    internalSingle.value = d;
  }
  function setRange(s: Date | null, e: Date | null) {
    internalRange.value = [s, e];
  }

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

    <view
      class="lk-calendar__grid-wrapper"
      :style="gridWrapperStyle"
      @touchstart.stop="onSwipeStart"
      @touchmove.stop="onSwipeMove"
      @touchend.stop="onSwipeEnd"
    >
      <view class="lk-calendar__grid" :style="gridStyle">
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

    <view
      class="lk-calendar__drag-handle"
      @touchstart.stop.prevent="onGridDragStart"
      @touchmove.stop.prevent="onGridDragMove"
      @touchend.stop.prevent="onGridDragEnd"
    >
      <view class="lk-calendar__drag-bar" />
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
