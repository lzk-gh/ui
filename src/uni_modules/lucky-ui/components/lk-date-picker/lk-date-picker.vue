<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import LkPopup from '../lk-popup/lk-popup.vue';
import LkCalendar from '../lk-calendar/lk-calendar.vue';
import LkButton from '../lk-button/lk-button.vue';

defineOptions({ name: 'LkDatePicker' });

type PickerType = 'date' | 'range' | 'year-month' | 'multiple' | 'date-time' | 'range-date-time';
type RangeValue = [Date | null, Date | null];

const props = defineProps({
  // v-model: 控制弹窗显隐
  modelValue: { type: Boolean, default: false },
  // 选中值（单选/范围/年月/多选/日期时间）
  value: {
    type: [Date, Array] as unknown as () => Date | [Date, Date] | Date[] | null,
    default: null,
  },
  type: { type: String as () => PickerType, default: 'date' },
  title: { type: String, default: '选择日期' },
  color: { type: String, default: 'primary' },
  firstDay: { type: Number, default: 1 },
  showShortcuts: { type: Boolean, default: false },
  disabledDate: {
    type: Function as unknown as () => (d: Date) => boolean,
    default: undefined,
  },
  minDate: {
    type: [Date, String] as unknown as () => Date | string | null,
    default: null,
  },
  maxDate: {
    type: [Date, String] as unknown as () => Date | string | null,
    default: null,
  },
  // 时间精度（仅 *date-time 模式下生效）
  timePrecision: {
    type: String as () => 'hour' | 'minute' | 'second',
    default: 'minute',
  },
});

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void;
  (e: 'confirm', v: Date | [Date, Date] | Date[] | null): void;
  (e: 'cancel'): void;
}>();

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

// 同步外部 value 到内部
function parseDate(val: any): Date | null {
  if (!val) return null;
  if (val instanceof Date) return new Date(val.getFullYear(), val.getMonth(), val.getDate());
  const d = new Date(val);
  return isNaN(+d) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function syncFromValue() {
  if (props.type === 'range' || props.type === 'range-date-time') {
    if (Array.isArray(props.value)) {
      draftRange.value = [parseDate(props.value[0]), parseDate(props.value[1])];
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
      value = [sdt, edt];
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
        <view class="spacer" />
        <lk-button variant="text" @click="close">取消</lk-button>
        <lk-button @click="confirm">确定</lk-button>
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
          @update:modelValue="onCalendarChange"
        />

        <template v-if="isDateTime">
          <view class="lk-date-picker__time">
            <view class="time-row" v-if="type === 'date-time' || type === 'range-date-time'">
              <text class="time-label">开始时间</text>
              <view class="time-cols">
                <view class="col">
                  <view
                    v-for="n in 24"
                    :key="'h1-' + n"
                    class="cell"
                    :class="{ 'is-active': h1 === n - 1 }"
                    @click="h1 = n - 1"
                    >{{ (n - 1).toString().padStart(2, '0') }}</view
                  >
                </view>
                <view class="col" v-if="timePrecision !== 'hour'">
                  <view
                    v-for="n in 60"
                    :key="'m1-' + n"
                    class="cell"
                    :class="{ 'is-active': m1 === n - 1 }"
                    @click="m1 = n - 1"
                    >{{ (n - 1).toString().padStart(2, '0') }}</view
                  >
                </view>
                <view class="col" v-if="timePrecision === 'second'">
                  <view
                    v-for="n in 60"
                    :key="'s1-' + n"
                    class="cell"
                    :class="{ 'is-active': s1 === n - 1 }"
                    @click="s1 = n - 1"
                    >{{ (n - 1).toString().padStart(2, '0') }}</view
                  >
                </view>
              </view>
            </view>
            <view class="time-row" v-if="type === 'range-date-time'">
              <text class="time-label">结束时间</text>
              <view class="time-cols">
                <view class="col">
                  <view
                    v-for="n in 24"
                    :key="'h2-' + n"
                    class="cell"
                    :class="{ 'is-active': h2 === n - 1 }"
                    @click="h2 = n - 1"
                    >{{ (n - 1).toString().padStart(2, '0') }}</view
                  >
                </view>
                <view class="col" v-if="timePrecision !== 'hour'">
                  <view
                    v-for="n in 60"
                    :key="'m2-' + n"
                    class="cell"
                    :class="{ 'is-active': m2 === n - 1 }"
                    @click="m2 = n - 1"
                    >{{ (n - 1).toString().padStart(2, '0') }}</view
                  >
                </view>
                <view class="col" v-if="timePrecision === 'second'">
                  <view
                    v-for="n in 60"
                    :key="'s2-' + n"
                    class="cell"
                    :class="{ 'is-active': s2 === n - 1 }"
                    @click="s2 = n - 1"
                    >{{ (n - 1).toString().padStart(2, '0') }}</view
                  >
                </view>
              </view>
            </view>
          </view>
        </template>
      </template>

      <template v-else>
        <view class="lk-date-picker__ym">
          <view class="lk-date-picker__ym-head">
            <view class="nav" @click="ymChangeYear(-1)">‹</view>
            <text class="ym-text">{{ ymYear }} 年</text>
            <view class="nav" @click="ymChangeYear(1)">›</view>
          </view>
          <view class="lk-date-picker__ym-grid">
            <view
              v-for="mm in months"
              :key="mm.m"
              class="ym-cell"
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

<style scoped lang="scss">
.lk-date-picker__panel {
  padding: 24rpx 24rpx 32rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.lk-date-picker__header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  .spacer {
    flex: 1;
  }
  .lk-date-picker__title {
    font-weight: 700;
    font-size: 30rpx;
  }
}

.lk-date-picker__ym {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  &-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .nav {
    width: 64rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--lk-color-primary-bg-soft);
    color: var(--lk-color-primary);
    border-radius: var(--lk-radius-pill);
  }
  .ym-text {
    font-weight: 700;
  }
  &-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12rpx;
  }
  .ym-cell {
    height: 96rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--lk-radius-md);
    background: var(--lk-color-primary-bg-soft);
    color: var(--lk-color-text);
    &.is-active {
      background: var(--lk-color-primary);
      color: var(--lk-color-text-inverse);
      font-weight: 600;
    }
    &.is-disabled {
      opacity: 0.4;
    }
  }
}

.lk-date-picker__time {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  .time-row {
    display: flex;
    align-items: flex-start;
    gap: 16rpx;
  }
  .time-label {
    width: 160rpx;
    color: var(--lk-color-text-secondary);
    font-size: 24rpx;
    line-height: 1.6;
  }
  .time-cols {
    display: flex;
    gap: 12rpx;
    flex: 1;
  }
  .col {
    flex: 1;
    max-height: 280rpx;
    overflow: auto;
    background: var(--lk-color-primary-bg-soft);
    border-radius: var(--lk-radius-md);
    .cell {
      padding: 10rpx 16rpx;
      text-align: center;
      color: var(--lk-color-text);
    }
    .cell.is-active {
      background: var(--lk-color-primary);
      color: var(--lk-color-text-inverse);
      font-weight: 600;
    }
  }
}
</style>
