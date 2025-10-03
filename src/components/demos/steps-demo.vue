<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-steps :current="current1">
        <lk-step title="步骤一" description="描述信息" />
        <lk-step title="步骤二" description="描述信息" />
        <lk-step title="步骤三" description="描述信息" />
      </lk-steps>
    </demo-block>

    <demo-block title="完成状态">
      <lk-steps :current="current2" status="finish">
        <lk-step title="已完成" />
        <lk-step title="已完成" />
        <lk-step title="已完成" />
      </lk-steps>
    </demo-block>

    <demo-block title="错误状态">
      <lk-steps :current="current3" status="error">
        <lk-step title="步骤一" />
        <lk-step title="步骤二" />
        <lk-step title="出现错误" />
      </lk-steps>
    </demo-block>

    <demo-block title="可操作">
      <lk-steps :current="currentStep">
        <lk-step title="步骤一" description="这是描述" />
        <lk-step title="步骤二" description="这是描述" />
        <lk-step title="步骤三" description="这是描述" />
        <lk-step title="步骤四" description="这是描述" />
      </lk-steps>
      <view class="button-group">
        <lk-button @click="prevStep" :disabled="currentStep === 0">上一步</lk-button>
        <lk-button type="primary" @click="nextStep" :disabled="currentStep === 3">下一步</lk-button>
      </view>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LkSteps from '@/uni_modules/lucky-ui/components/lk-steps/lk-steps.vue';
import LkStep from '@/uni_modules/lucky-ui/components/lk-steps/lk-step.vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const current1 = ref(1);
const current2 = ref(2);
const current3 = ref(2);
const currentStep = ref(0);

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++;
  }
};
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.button-group {
  display: flex;
  gap: 16rpx;
  margin-top: 48rpx;
  justify-content: center;
}
</style>
