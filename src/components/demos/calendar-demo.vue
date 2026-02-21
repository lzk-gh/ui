<script setup lang="ts">
import { ref } from 'vue';
import LkCalendar from '@/uni_modules/lucky-ui/components/lk-calendar/lk-calendar.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const date1 = ref(new Date());
const date2 = ref(new Date());
const date3 = ref(new Date());
const date4 = ref(new Date());
const date5 = ref(new Date());
const dateRange = ref<[Date, Date]>([new Date(), new Date(Date.now() + 7 * 24 * 3600 * 1000)]);

const disabledDate = (date: Date) => {
  return date < new Date();
};
</script>

<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-calendar v-model="date1" />
    </demo-block>

    <demo-block title="日期范围">
      <lk-calendar v-model="dateRange" type="range" />
    </demo-block>

    <demo-block title="自定义颜色">
      <lk-calendar v-model="date2" color="success" />
    </demo-block>

    <demo-block title="禁用日期">
      <lk-calendar v-model="date3" :disabled-date="disabledDate" />
    </demo-block>

    <demo-block title="快捷选项">
      <lk-calendar v-model="date4" show-shortcuts />
    </demo-block>

    <demo-block title="可拖拽周视图">
      <lk-calendar v-model="date5" />
      <view class="demo-tip">向上拖拽收起为本周，向下拖拽展开整月</view>
    </demo-block>
  </view>
</template>
<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.demo-tip {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #666;
}
</style>
