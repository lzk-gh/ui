<template>
  <view class="component-demo">
    <demo-block title="基础表单">
      <lk-form ref="formRef" :model="formData" :rules="rules">
        <lk-form-item label="用户名" prop="username">
          <lk-input v-model="formData.username" placeholder="请输入用户名" />
        </lk-form-item>

        <lk-form-item label="密码" prop="password">
          <lk-input v-model="formData.password" type="password" placeholder="请输入密码" />
        </lk-form-item>

        <lk-form-item label="邮箱" prop="email">
          <lk-input v-model="formData.email" placeholder="请输入邮箱" />
        </lk-form-item>

        <lk-form-item label="性别" prop="gender">
          <lk-radio-group v-model="formData.gender">
            <lk-radio label="male">男</lk-radio>
            <lk-radio label="female">女</lk-radio>
          </lk-radio-group>
        </lk-form-item>

        <lk-form-item label="爱好" prop="hobbies">
          <lk-checkbox-group v-model="formData.hobbies">
            <lk-checkbox label="reading">阅读</lk-checkbox>
            <lk-checkbox label="music">音乐</lk-checkbox>
            <lk-checkbox label="sports">运动</lk-checkbox>
          </lk-checkbox-group>
        </lk-form-item>

        <lk-form-item label="接收通知">
          <lk-switch v-model="formData.notification" />
        </lk-form-item>
      </lk-form>

      <view class="form-actions">
        <lk-button @click="handleReset">重置</lk-button>
        <lk-button type="primary" @click="handleSubmit">提交</lk-button>
      </view>
    </demo-block>

    <demo-block title="表单验证">
      <lk-form ref="validateFormRef" :model="validateData" :rules="validateRules">
        <lk-form-item label="手机号" prop="phone">
          <lk-input v-model="validateData.phone" placeholder="请输入手机号" />
        </lk-form-item>

        <lk-form-item label="验证码" prop="code">
          <lk-input v-model="validateData.code" placeholder="请输入验证码" />
        </lk-form-item>
      </lk-form>

      <view class="form-actions">
        <lk-button type="primary" @click="handleValidate">验证表单</lk-button>
      </view>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import LkForm from '@/uni_modules/lucky-ui/components/lk-form/lk-form.vue';
import LkFormItem from '@/uni_modules/lucky-ui/components/lk-form/lk-form-item.vue';
import LkInput from '@/uni_modules/lucky-ui/components/lk-input/lk-input.vue';
import LkRadioGroup from '@/uni_modules/lucky-ui/components/lk-radio/lk-radio-group.vue';
import LkRadio from '@/uni_modules/lucky-ui/components/lk-radio/lk-radio.vue';
import LkCheckboxGroup from '@/uni_modules/lucky-ui/components/lk-checkbox/lk-checkbox-group.vue';
import LkCheckbox from '@/uni_modules/lucky-ui/components/lk-checkbox/lk-checkbox.vue';
import LkSwitch from '@/uni_modules/lucky-ui/components/lk-switch/lk-switch.vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const formRef = ref();
const validateFormRef = ref();

const formData = reactive({
  username: '',
  password: '',
  email: '',
  gender: 'male',
  hobbies: ['reading'],
  notification: true,
});

const validateData = reactive({
  phone: '',
  code: '',
});

const rules = {
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }],
  email: [{ required: true, message: '请输入邮箱' }],
};

const validateRules = {
  phone: [{ required: true, message: '请输入手机号' }],
  code: [{ required: true, message: '请输入验证码' }],
};

const handleSubmit = () => {
  uni.showToast({ title: '提交成功', icon: 'success' });
  console.log('表单数据:', formData);
};

const handleReset = () => {
  Object.assign(formData, {
    username: '',
    password: '',
    email: '',
    gender: 'male',
    hobbies: [],
    notification: false,
  });
  uni.showToast({ title: '已重置', icon: 'none' });
};

const handleValidate = () => {
  if (validateData.phone && validateData.code) {
    uni.showToast({ title: '验证通过', icon: 'success' });
  } else {
    uni.showToast({ title: '请填写完整信息', icon: 'none' });
  }
};
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.form-actions {
  display: flex;
  gap: 16rpx;
  margin-top: 32rpx;

  :deep(.lk-button) {
    flex: 1;
  }
}
</style>
