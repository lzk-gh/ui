<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import LkPopup from '../lk-popup/lk-popup.vue';
import LkButton from '../lk-button/lk-button.vue';
import LkCalendar from '../lk-calendar/lk-calendar.vue';
import LkTimePicker from '../lk-time-picker/lk-time-picker.vue';
import { parseDate, formatDate } from '@/uni_modules/lucky-ui/utils/date-utils';
import { dateTimePickerProps, dateTimePickerEmits } from './date-time-picker.props';

defineOptions({ name: 'LkDateTimePicker' });

const props = defineProps(dateTimePickerProps);
const emit = defineEmits(dateTimePickerEmits);

const show = ref(false);
const dateValue = ref('');
const timeValue = ref('');
watch(
  () => props.modelValue,
  v => {
    if (!v) {
      dateValue.value = '';
      timeValue.value = '';
      return;
    }
    const parts = v.split(' ');
    dateValue.value = parts[0] || '';
    timeValue.value = parts[1] || '';
  },
  { immediate: true }
);

const display = computed(() => props.modelValue);

function open() {
  if (props.disabled) return;
  show.value = true;
  emit('open');
}
function close() {
  show.value = false;
  emit('close');
}
function clear() {
  dateValue.value = '';
  timeValue.value = '';
  emit('update:modelValue', '');
  emit('change', '');
  emit('clear');
  close();
}
function confirm() {
  if (!dateValue.value || !timeValue.value) return;
  const val = `${dateValue.value} ${timeValue.value}`;
  emit('update:modelValue', val);
  emit('change', val);
  close();
}
</script>

<template>
  <view class="lk-date-time-picker" :class="{ 'is-disabled': disabled }" @click="open">
    <text v-if="display" class="lk-date-time-picker__value">{{ display }}</text>
    <text v-else class="lk-date-time-picker__placeholder">{{ placeholder }}</text>
    <view v-if="clearable && display" class="lk-date-time-picker__clear" @click.stop="clear"
      >×</view
    >
  </view>
  <lk-popup v-model="show" position="bottom">
    <view class="lk-date-time-picker__panel">
      <view class="lk-date-time-picker__section">
        <text class="lk-date-time-picker__section-title">日期</text>
        <lk-calendar v-model="dateValue" />
      </view>
      <view class="lk-date-time-picker__section">
        <text class="lk-date-time-picker__section-title">时间</text>
        <lk-time-picker v-model="timeValue" :format="timeFormat" />
      </view>
      <view class="lk-date-time-picker__actions">
        <lk-button size="sm" variant="outline" @click="close">取消</lk-button>
        <lk-button size="sm" :disabled="!dateValue || !timeValue" @click="confirm"
          >确定</lk-button
        >
      </view>
    </view>
  </lk-popup>
</template>

<style lang="scss">
@use './index.scss';
</style>
