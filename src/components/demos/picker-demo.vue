<template>
  <view class="component-demo">
    <demo-block title="弹出层 Picker">
      <lk-button @click="show = true">选择颜色</lk-button>
      <view class="result">当前：{{ display }}</view>
      <lk-picker
        v-model:visible="show"
        v-model="value"
        title="请选择颜色"
        :columns="columns"
        @confirm="onConfirm"
      />
    </demo-block>

    <demo-block title="多列 Picker">
      <lk-button @click="show2 = true">选择日期时段</lk-button>
      <view class="result">当前：{{ value2.join(' / ') }}</view>
      <lk-picker
        v-model:visible="show2"
        v-model="value2"
        title="日期/时段"
        :columns="columns2"
      />
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkPicker from '@/uni_modules/lucky-ui/components/lk-picker/lk-picker.vue';

const show = ref(false);
const value = ref('green');
const columns = [
  { label: '红色', value: 'red' },
  { label: '绿色', value: 'green' },
  { label: '蓝色', value: 'blue' },
];
const display = computed(()=> {
  const m = new Map(columns.map(o=>[o.value,o.label]));
  return m.get(value.value);
});

function onConfirm(v: any) {
  uni.showToast({ title: '已选择: ' + (display.value || ''), icon: 'none' });
}

const show2 = ref(false);
const value2 = ref<any[]>(['tue','pm']);
const columns2 = [
  [ { label: '周一', value: 'mon' }, { label: '周二', value: 'tue' }, { label: '周三', value: 'wed' } ],
  [ { label: '上午', value: 'am' }, { label: '下午', value: 'pm' } ]
];
</script>

<style scoped lang="scss">
.component-demo { display:flex; flex-direction:column; gap:24rpx; }
.result { margin-top: 12rpx; color: var(--lk-color-text-secondary); }
</style>
