<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import LkPopup from '../lk-popup/lk-popup.vue';
import LkButton from '../lk-button/lk-button.vue';
import LkCalendar from '../lk-calendar/lk-calendar.vue';
import { dateRangeArray, parseDate, formatDate } from '@/uni_modules/lucky-ui/utils/date-utils';
import { dateRangePickerProps, dateRangePickerEmits } from './date-range-picker.props';

defineOptions({ name: 'LkDateRangePicker' });

const props = defineProps(dateRangePickerProps);
const emit = defineEmits(dateRangePickerEmits);

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

const leftMonthAnchor = ref<Date>(start.value ? parseDate(start.value) : new Date());

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
        <view class="lk-date-range-picker__range-cal">
          <lk-calendar
            :first-day="firstDay"
            :model-value="start"
            @update:modelValue="val => select(val)"
            @change="onHover"
          />
        </view>
        <view class="lk-date-range-picker__range-cal">
          <lk-calendar
            :first-day="firstDay"
            :model-value="end"
            @update:modelValue="val => select(val)"
            @change="onHover"
          />
        </view>
      </view>
      <view v-if="start && !end" class="lk-date-range-picker__range-preview">
        选择结束日期中：{{ start }} → (悬停显示预览)
      </view>
      <view v-if="previewRange.length && end" class="lk-date-range-picker__range-preview">
        范围天数：{{ previewRange.length }}
      </view>
      <view class="lk-date-range-picker__actions">
        <lk-button size="sm" variant="outline" @click="close">取消</lk-button>
        <lk-button size="sm" @click="confirm" :disabled="!start || !end">确定</lk-button>
      </view>
    </view>
  </lk-popup>
</template>

<style lang="scss">
@use './index.scss';
</style>
