<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-button type="primary" @click="showPicker1">选择日期</lk-button>
      <text class="result-text">选择的日期: {{ formatDate(date1) }}</text>
      <lk-date-picker 
        v-model="visible1" 
        :value="date1"
        @confirm="handleConfirm1"
      />
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
        :value="startDate"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="handleConfirm3"
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

const date1 = ref(new Date());
const date2 = ref(new Date());
const startDate = ref(new Date());
const endDate = ref(new Date(Date.now() + 7 * 24 * 3600 * 1000));
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

const handleConfirm1 = (value: Date) => {
  date1.value = value;
  visible1.value = false;
};

const handleConfirm2 = (value: Date) => {
  date2.value = value;
  visible2.value = false;
};

const handleConfirm3 = (value: Date) => {
  startDate.value = value;
  visible3.value = false;
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
