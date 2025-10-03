<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-button type="primary" @click="showPicker1">选择时间</lk-button>
      <text class="result-text">选择的时间: {{ time1 }}</text>
      <lk-time-picker 
        v-model="visible1" 
        :value="time1"
        @confirm="handleConfirm1"
      />
    </demo-block>

    <demo-block title="时间范围">
      <lk-button type="primary" @click="showPicker2">选择时间范围</lk-button>
      <text class="result-text">{{ time2 }}</text>
      <lk-time-picker 
        v-model="visible2" 
        :value="time2"
        :min-time="'08:00'"
        :max-time="'18:00'"
        @confirm="handleConfirm2"
      />
    </demo-block>

    <demo-block title="分钟步长">
      <lk-button type="primary" @click="showPicker3">5分钟步长</lk-button>
      <text class="result-text">{{ time3 }}</text>
      <lk-time-picker 
        v-model="visible3" 
        :value="time3"
        :minute-step="5"
        @confirm="handleConfirm3"
      />
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkTimePicker from '@/uni_modules/lucky-ui/components/lk-time-picker/lk-time-picker.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const visible1 = ref('');
const visible2 = ref('');
const visible3 = ref('');

const time1 = ref('12:00');
const time2 = ref('09:00');
const time3 = ref('14:00');

const showPicker1 = () => {
  visible1.value = time1.value;
};

const showPicker2 = () => {
  visible2.value = time2.value;
};

const showPicker3 = () => {
  visible3.value = time3.value;
};

const handleConfirm1 = (value: string) => {
  time1.value = value;
  visible1.value = '';
};

const handleConfirm2 = (value: string) => {
  time2.value = value;
  visible2.value = '';
};

const handleConfirm3 = (value: string) => {
  time3.value = value;
  visible3.value = '';
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
