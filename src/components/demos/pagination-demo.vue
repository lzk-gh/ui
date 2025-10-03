<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-pagination 
        v-model="currentPage1" 
        :total="100" 
        :page-size="10"
      />
    </demo-block>

    <demo-block title="显示总数">
      <lk-pagination 
        v-model="currentPage2" 
        :total="100" 
        :page-size="10"
        show-total
      />
    </demo-block>

    <demo-block title="简洁模式">
      <lk-pagination 
        v-model="currentPage3" 
        :total="100" 
        :page-size="10"
        simple
      />
    </demo-block>

    <demo-block title="每页数量">
      <lk-pagination 
        v-model="currentPage4" 
        :total="100" 
        :page-size="pageSize"
        show-size-changer
        @size-change="handleSizeChange"
      />
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LkPagination from '@/uni_modules/lucky-ui/components/lk-pagination/lk-pagination.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const currentPage1 = ref(1);
const currentPage2 = ref(1);
const currentPage3 = ref(1);
const currentPage4 = ref(1);
const pageSize = ref(10);

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage4.value = 1;
};
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
