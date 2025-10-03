<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-upload 
        v-model="fileList1"
        :max-count="3"
        @change="handleChange"
      />
    </demo-block>

    <demo-block title="文件预览">
      <lk-upload 
        v-model="fileList2"
        :max-count="5"
        preview
      />
    </demo-block>

    <demo-block title="上传前校验">
      <lk-upload 
        v-model="fileList3"
        :before-upload="beforeUpload"
      />
    </demo-block>

    <demo-block title="禁用状态">
      <lk-upload 
        v-model="fileList4"
        disabled
      />
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LkUpload from '@/uni_modules/lucky-ui/components/lk-upload/lk-upload.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const fileList1 = ref([]);
const fileList2 = ref([]);
const fileList3 = ref([]);
const fileList4 = ref([]);

const handleChange = (files: any) => {
  console.log('文件变化:', files);
};

const beforeUpload = (file: any) => {
  if (file.size > 1024 * 1024 * 2) {
    uni.showToast({
      title: '文件大小不能超过2MB',
      icon: 'none'
    });
    return false;
  }
  return true;
};
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
