<script setup lang="ts">
import { ref, reactive } from 'vue';
import LkForm from '@/uni_modules/lucky-ui/components/lk-form/lk-form.vue';
import LkFormItem from '@/uni_modules/lucky-ui/components/lk-form/lk-form-item.vue';
import LkInput from '@/uni_modules/lucky-ui/components/lk-input/lk-input.vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const listFormRef = ref();
const listData = reactive({
  name: '',
  idType: '二代身份证',
  idNumber: '',
  passengerType: '成人票',
  phone: '',
});

const listRules = {
  name: [{ required: true, message: '请输入乘车人姓名' }],
  idNumber: [{ required: true, message: '请输入证件号码' }],
  phone: [{ required: true, message: '请输入手机号' }],
};

const onListSubmit = async () => {
  try {
    await listFormRef.value?.validate();
    uni.showToast({ title: '提交成功', icon: 'success' });
  } catch {
    uni.showToast({ title: '请完善信息', icon: 'none' });
  }
};
</script>

<template>
  <view class="demo-form">
    <demo-block title="基础列表布局">
      <lk-form
        ref="listFormRef"
        :model="listData"
        :rules="listRules"
        border
        label-width="160rpx"
      >
        <lk-form-item label="乘车人" prop="name">
          <lk-input
            v-model="listData.name"
            placeholder="请输入姓名"
            borderless
            :clearable="false"
          />
        </lk-form-item>

        <lk-form-item label="证件类型" is-link>
          <text class="form-value">{{ listData.idType }}</text>
        </lk-form-item>

        <lk-form-item label="证件号码" prop="idNumber">
          <lk-input
            v-model="listData.idNumber"
            placeholder="请输入证件号码"
            borderless
            :clearable="false"
          />
        </lk-form-item>

        <lk-form-item label="手机号" prop="phone">
          <lk-input
            v-model="listData.phone"
            placeholder="填写手机号码"
            type="tel"
            borderless
            :clearable="false"
          >
            <template #prefix>
              <text class="form-phone-prefix">+86</text>
            </template>
          </lk-input>
        </lk-form-item>
      </lk-form>

      <view class="demo-form__actions">
        <lk-button type="primary" block @click="onListSubmit">提交</lk-button>
      </view>
    </demo-block>
  </view>
</template>

<style scoped lang="scss">
.demo-form {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
  padding-bottom: 100rpx;
  background-color: var(--lk-color-bg-page, #f7f8fa);
  min-height: 100vh;

  &__actions {
    padding: 0 32rpx;
    margin-top: 40rpx;
  }

  .form-value {
    font-size: 28rpx;
    color: var(--lk-text-primary);
  }

  .form-phone-prefix {
    font-size: 28rpx;
    color: var(--lk-text-primary);
    margin-right: 12rpx;
    font-weight: 500;
  }
}
</style>
