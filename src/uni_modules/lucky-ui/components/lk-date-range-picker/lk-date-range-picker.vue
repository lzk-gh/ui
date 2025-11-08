<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import LkPopup from '../lk-popup/lk-popup.vue';
import LkButton from '../lk-button/lk-button.vue';
import LkCalendar from '../lk-calendar/lk-calendar.vue';
import { dateRangeArray, parseDate, formatDate } from '@/uni_modules/lucky-ui/utils/date-utils';

defineOptions({ name: 'LkDateRangePicker' });

const props = defineProps({
  modelValue: { type: Array as () => [string, string] | [], default: () => [] },
  placeholder: { type: String, default: '选择日期范围' },
  clearable: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  linked: { type: Boolean, default: true }, // 是否第二个日历跟随第一个月份
  firstDay: { type: Number, default: 1 },
});
const emit = defineEmits(['update:modelValue', 'change', 'open', 'close', 'clear']);

const show = ref(false);
const start = ref('');
const end = ref('');
const hoverDate = ref('');
const selecting = ref<'start' | 'end' | ''>('');
watch(
  () => props.modelValue,
  v => {
    start.value = v?.[0] || '';
    end.value = v?.[1] || '';
  },
  { immediate: true }
);

const display = computed(() => {
  return start.value && end.value ? `${start.value} ~ ${end.value}` : '';
});

function open() {
  if (props.disabled) return;
  show.value = true;
  emit('open');
  selecting.value = start.value && !end.value ? 'end' : 'start';
}
function close() {
  show.value = false;
  emit('close');
}
function clear() {
  start.value = '';
  end.value = '';
  emit('update:modelValue', []);
  emit('change', []);
  emit('clear');
  close();
}
function select(val: string) {
  if (!selecting.value || selecting.value === 'start') {
    start.value = val;
    end.value = '';
    selecting.value = 'end';
  } else {
    const s = parseDate(start.value);
    const e = parseDate(val);
    if (+e < +s) {
      end.value = start.value;
      start.value = val;
    } else {
      end.value = val;
    }
    selecting.value = '';
  }
}
function confirm() {
  if (start.value && end.value) {
    emit('update:modelValue', [start.value, end.value]);
    emit('change', [start.value, end.value]);
    close();
  }
}
const previewRange = computed(() => {
  if (!start.value || (!end.value && !hoverDate.value)) return [];
  const tail = end.value || hoverDate.value;
  if (!tail) return [];
  return dateRangeArray(start.value, tail);
});
function onHover(val: string) {
  if (selecting.value === 'end' && !end.value) {
    hoverDate.value = val;
  }
}

const leftMonthAnchor = ref<Date>(() => {
  return start.value ? parseDate(start.value) : new Date();
});

const rightMonthAnchor = computed(() => {
  if (!props.linked) {
    return leftMonthAnchor.value;
  }
  const d = new Date(leftMonthAnchor.value);
  d.setMonth(d.getMonth() + 1);
  return d;
});
</script>

<template>
  <view class="lk-date-range-picker" :class="{ 'is-disabled': disabled }" @click="open">
    <text v-if="display" class="lk-date-range-picker__value">{{ display }}</text>
    <text v-else class="lk-date-range-picker__placeholder">{{ placeholder }}</text>
    <view v-if="clearable && display" class="lk-date-range-picker__clear" @click.stop="clear"
      >×</view
    >
  </view>

  <lk-popup v-model="show" position="bottom">
    <view class="lk-date-range-picker__panel">
      <view class="lk-date-range-picker__cal-wrap">
        <view class="range-cal">
          <lk-calendar
            :first-day="firstDay"
            :model-value="start"
            @update:modelValue="val => select(val)"
            @change="onHover"
          />
        </view>
        <view class="range-cal">
          <lk-calendar
            :first-day="firstDay"
            :model-value="end"
            @update:modelValue="val => select(val)"
            @change="onHover"
          />
        </view>
      </view>
      <view v-if="start && !end" class="range-preview">
        选择结束日期中：{{ start }} → (悬停显示预览)
      </view>
      <view v-if="previewRange.length && end" class="range-preview">
        范围天数：{{ previewRange.length }}
      </view>
      <view class="lk-date-range-picker__actions">
        <lk-button size="small" variant="outline" @click="close">取消</lk-button>
        <lk-button size="small" @click="confirm" :disabled="!start || !end">确定</lk-button>
      </view>
    </view>
  </lk-popup>
</template>

<style scoped lang="scss">
.lk-date-range-picker {
  min-height: var(--lk-control-height-md);
  padding: 0 32rpx;
  display: flex;
  align-items: center;
  background: var(--lk-input-bg);
  border: 2rpx solid var(--lk-input-border-color);
  border-radius: var(--lk-radius-lg);
  font-size: 28rpx;
  &__placeholder {
    color: var(--lk-color-text-placeholder);
  }
  &__clear {
    margin-left: auto;
    padding: 8rpx;
    font-size: 36rpx;
    color: var(--lk-color-text-secondary);
  }
  &:active:not(.is-disabled) {
    border-color: var(--lk-input-border-color-active);
  }
  &.is-disabled {
    opacity: 0.5;
  }
}
.lk-date-range-picker__panel {
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}
.lk-date-range-picker__cal-wrap {
  display: flex;
  gap: 32rpx;
  flex-wrap: wrap;
}
.range-cal {
  width: 560rpx;
  max-width: 100%;
  background: var(--lk-color-bg-surface);
  border-radius: var(--lk-radius-lg);
  padding: 12rpx;
}
.range-preview {
  font-size: 24rpx;
  color: var(--lk-color-text-secondary);
}
.lk-date-range-picker__actions {
  display: flex;
  justify-content: flex-end;
  gap: 24rpx;
}
</style>
