<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-button type="primary" @click="showPicker1">选择日期</lk-button>
      <text class="result-text">选择的日期: {{ formatDate(date1) }}</text>
      <lk-date-picker v-model="visible1" :value="date1" @confirm="handleConfirm1" />
    </demo-block>

    <demo-block title="年月选择">
      <lk-button type="primary" @click="showPicker2">选择年月</lk-button>
      <text class="result-text">选择的年月: {{ formatDate(date2) }}</text>
      <lk-date-picker
        v-model="visible2"
        :value="date2"
        type="year-month"
        @confirm="handleConfirm2"
      />
    </demo-block>

    <demo-block title="时间范围">
      <lk-button type="primary" @click="showPicker3">选择时间范围</lk-button>
      <text class="result-text">开始: {{ formatDate(startDate) }}</text>
      <text class="result-text">结束: {{ formatDate(endDate) }}</text>
      <lk-date-picker
        v-model="visible3"
        :value="[startDate, endDate]"
        type="range"
        :min-date="minDate"
        :max-date="maxDate"
        :show-shortcuts="true"
        @confirm="handleConfirm3"
      />
    </demo-block>

    <demo-block title="多选日期">
      <lk-button type="primary" @click="showPicker4">选择多个日期</lk-button>
      <text class="result-text"
        >已选: {{ selectedMultiple.map(formatDate).join(', ') }}</text
      >
      <lk-date-picker
        v-model="visible4"
        :value="selectedMultiple"
        type="multiple"
        :min-date="minDate"
        :max-date="maxDate"
        :show-shortcuts="true"
        @confirm="handleConfirm4"
      />
    </demo-block>

    <demo-block title="日期时间（单选）">
      <lk-button type="primary" @click="showPicker5">选择日期时间</lk-button>
      <text class="result-text">选择: {{ formatDateTime(dateTime1) }}</text>
      <lk-date-picker
        v-model="visible5"
        :value="dateTime1"
        type="date-time"
        time-precision="minute"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="handleConfirm5"
      />
    </demo-block>

    <demo-block title="日期时间范围">
      <lk-button type="primary" @click="showPicker6">选择日期时间范围</lk-button>
      <text class="result-text">开始: {{ formatDateTime(startDateTime) }}</text>
      <text class="result-text">结束: {{ formatDateTime(endDateTime) }}</text>
      <lk-date-picker
        v-model="visible6"
        :value="[startDateTime, endDateTime]"
        type="range-date-time"
        time-precision="minute"
        :min-date="minDate"
        :max-date="maxDate"
        :show-shortcuts="true"
        @confirm="handleConfirm6"
      />
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkDatePicker from '@/uni_modules/lucky-ui/components/lk-date-picker/lk-date-picker.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const visible1 = ref(false);
const visible2 = ref(false);
const visible3 = ref(false);
const visible4 = ref(false);
const visible5 = ref(false);
const visible6 = ref(false);

const date1 = ref(new Date());
const date2 = ref(new Date());
const startDate = ref(new Date());
const endDate = ref(new Date(Date.now() + 7 * 24 * 3600 * 1000));
const selectedMultiple = ref<Date[]>([]);
const dateTime1 = ref(new Date());
const startDateTime = ref(new Date());
const endDateTime = ref(new Date(Date.now() + 2 * 3600 * 1000));
const minDate = ref(new Date(2020, 0, 1));
const maxDate = ref(new Date(2030, 11, 31));

const showPicker1 = () => {
  visible1.value = true;
};

const showPicker2 = () => {
  visible2.value = true;
};

const showPicker3 = () => {
  visible3.value = true;
};

const showPicker4 = () => {
  visible4.value = true;
};
const showPicker5 = () => {
  visible5.value = true;
};
const showPicker6 = () => {
  visible6.value = true;
};

const handleConfirm1 = (value: Date | [Date, Date] | Date[] | null) => {
  if (value instanceof Date) {
    date1.value = value;
  }
  visible1.value = false;
};

const handleConfirm2 = (value: Date | [Date, Date] | Date[] | null) => {
  if (value instanceof Date) {
    date2.value = value;
  }
  visible2.value = false;
};

const handleConfirm3 = (value: Date | [Date, Date] | Date[] | null) => {
  if (Array.isArray(value)) {
    startDate.value = value[0];
    endDate.value = value[1];
  }
  visible3.value = false;
};

const handleConfirm4 = (value: Date | [Date, Date] | Date[] | null) => {
  if (Array.isArray(value)) {
    // 多选模式返回 Date[]
    selectedMultiple.value = value as Date[];
  }
  visible4.value = false;
};

const handleConfirm5 = (value: Date | [Date, Date] | Date[] | null) => {
  if (value instanceof Date) {
    dateTime1.value = value;
  }
  visible5.value = false;
};

const handleConfirm6 = (value: Date | [Date, Date] | Date[] | null) => {
  if (Array.isArray(value)) {
    const v = value as [Date, Date];
    startDateTime.value = v[0];
    endDateTime.value = v[1];
  }
  visible6.value = false;
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDateTime = (date: Date) => {
  const base = formatDate(date);
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${base} ${hh}:${mm}:${ss}`;
};
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.result-text {
  display: block;
  margin-top: 16rpx;
  font-size: 28rpx;
  color: var(--lk-color-text-secondary);
}
</style>
