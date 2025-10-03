<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-button type="primary" @click="showModal1">显示模态框</lk-button>
      <lk-modal v-model="visible1" title="提示">
        <text>这是一段内容</text>
      </lk-modal>
    </demo-block>

    <demo-block title="异步关闭">
      <lk-button type="primary" @click="showModal2">异步关闭</lk-button>
      <lk-modal 
        v-model="visible2" 
        title="确认"
        @confirm="handleConfirm"
      >
        <text>确定要执行此操作吗?</text>
      </lk-modal>
    </demo-block>

    <demo-block title="自定义按钮">
      <lk-button type="primary" @click="showModal3">自定义按钮</lk-button>
      <lk-modal 
        v-model="visible3" 
        title="警告"
        confirm-text="知道了"
        :show-cancel="false"
      >
        <text>这是一个警告提示</text>
      </lk-modal>
    </demo-block>

    <demo-block title="无标题">
      <lk-button type="primary" @click="showModal4">无标题</lk-button>
      <lk-modal v-model="visible4">
        <text>简单的提示内容</text>
      </lk-modal>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkModal from '@/uni_modules/lucky-ui/components/lk-modal/lk-modal.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const visible1 = ref(false);
const visible2 = ref(false);
const visible3 = ref(false);
const visible4 = ref(false);

const showModal1 = () => {
  visible1.value = true;
};

const showModal2 = () => {
  visible2.value = true;
};

const showModal3 = () => {
  visible3.value = true;
};

const showModal4 = () => {
  visible4.value = true;
};

const handleConfirm = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      uni.showToast({
        title: '操作成功',
        icon: 'success'
      });
      resolve(true);
    }, 1000);
  });
};
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
