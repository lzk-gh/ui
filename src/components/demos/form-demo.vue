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
const topFormRef = ref();
const scrollFormRef = ref();

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

// 顶部标签布局表单数据
const topFormData = reactive({
  name: '',
  company: '',
  remark: '',
});

// 用于测试 scrollToError 的长表单
const scrollFormData = reactive({
  field1: '',
  field2: '',
  field3: '',
  field4: '',
  field5: '',
});

const rules = {
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }],
  email: [
    { required: true, message: '请输入邮箱' },
    { pattern: /^[\w.-]+@[\w.-]+\.\w+$/, message: '邮箱格式不正确' },
  ],
};

const validateRules = {
  phone: [{ required: true, message: '请输入手机号' }, { min: 11, max: 11, message: '手机号为11位' }],
  code: [{ required: true, message: '请输入验证码' }],
};

const topFormRules = {
  name: [{ required: true, message: '请输入姓名' }],
  company: [{ required: true, message: '请输入公司名称' }],
};

const scrollFormRules = {
  field1: [{ required: true, message: '字段1不能为空' }],
  field2: [{ required: true, message: '字段2不能为空' }],
  field3: [{ required: true, message: '字段3不能为空' }],
  field4: [{ required: true, message: '字段4不能为空' }],
  field5: [{ required: true, message: '字段5不能为空' }],
};

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    uni.showToast({ title: '提交成功', icon: 'success' });
  } catch {
    uni.showToast({ title: '请检查表单', icon: 'none' });
  }
};

const handleReset = () => {
  formRef.value?.resetFields();
  uni.showToast({ title: '已重置', icon: 'none' });
};

const handleClearValidate = () => {
  formRef.value?.clearValidate();
  uni.showToast({ title: '已清除校验', icon: 'none' });
};

const handleValidate = async () => {
  try {
    await validateFormRef.value?.validate();
    uni.showToast({ title: '验证通过', icon: 'success' });
  } catch {
    uni.showToast({ title: '请填写完整信息', icon: 'none' });
  }
};

const handleScrollValidate = async () => {
  try {
    await scrollFormRef.value?.validate();
    uni.showToast({ title: '验证通过', icon: 'success' });
  } catch {
    // scrollToError 会自动滚动到第一个错误字段
    uni.showToast({ title: '自动滚动到错误位置', icon: 'none' });
  }
};
</script>

<template>
  <view class="component-demo">
    <demo-block title="基础表单（左对齐标签）">
      <lk-form ref="formRef" :model="formData" :rules="rules" label-width="160rpx">
        <lk-form-item label="用户名" prop="username">
          <lk-input v-model="formData.username" placeholder="请输入用户名" prop="username" />
        </lk-form-item>

        <lk-form-item label="密码" prop="password">
          <lk-input
            v-model="formData.password"
            type="password"
            show-password
            placeholder="请输入密码"
            prop="password"
          />
        </lk-form-item>

        <lk-form-item label="邮箱" prop="email">
          <lk-input v-model="formData.email" placeholder="请输入邮箱" prop="email" />
        </lk-form-item>

        <lk-form-item label="性别" prop="gender">
          <lk-radio-group v-model="formData.gender" prop="gender">
            <lk-radio label="male">男</lk-radio>
            <lk-radio label="female">女</lk-radio>
          </lk-radio-group>
        </lk-form-item>

        <lk-form-item label="爱好" prop="hobbies">
          <lk-checkbox-group v-model="formData.hobbies" prop="hobbies">
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
        <lk-button @click="handleClearValidate">清除校验</lk-button>
        <lk-button type="primary" @click="handleSubmit">提交验证</lk-button>
      </view>
    </demo-block>

    <demo-block title="顶部标签布局">
      <lk-form ref="topFormRef" :model="topFormData" :rules="topFormRules" label-align="top">
        <lk-form-item label="姓名" prop="name">
          <lk-input v-model="topFormData.name" placeholder="请输入姓名" />
        </lk-form-item>
        <lk-form-item label="公司" prop="company">
          <lk-input v-model="topFormData.company" placeholder="请输入公司名称" />
        </lk-form-item>
        <lk-form-item label="备注">
          <lk-input v-model="topFormData.remark" placeholder="选填备注" />
        </lk-form-item>
      </lk-form>
      <view class="form-actions">
        <lk-button type="primary" @click="topFormRef?.validate().catch(() => {})">触发验证</lk-button>
      </view>
    </demo-block>

    <demo-block title="表单验证（滚动到错误）">
      <lk-form
        ref="scrollFormRef"
        :model="scrollFormData"
        :rules="scrollFormRules"
        scroll-to-error
      >
        <lk-form-item v-for="i in 5" :key="i" :label="`字段 ${i}`" :prop="`field${i}`">
          <lk-input
            v-model="(scrollFormData as any)[`field${i}`]"
            :placeholder="`请输入字段 ${i}`"
          />
        </lk-form-item>
      </lk-form>
      <view class="form-actions">
        <lk-button type="primary" @click="handleScrollValidate">提交（自动滚到错误）</lk-button>
      </view>
    </demo-block>

    <demo-block title="实时验证（blur/change 触发）">
      <lk-form ref="validateFormRef" :model="validateData" :rules="validateRules">
        <lk-form-item label="手机号" prop="phone">
          <lk-input
            v-model="validateData.phone"
            type="number"
            :maxlength="11"
            placeholder="请输入11位手机号"
            prop="phone"
          />
        </lk-form-item>

        <lk-form-item label="验证码" prop="code">
          <lk-input v-model="validateData.code" placeholder="请输入验证码" prop="code" />
        </lk-form-item>
      </lk-form>

      <view class="form-actions">
        <lk-button type="primary" @click="handleValidate">验证表单</lk-button>
      </view>
    </demo-block>
  </view>
</template>
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
  flex-wrap: wrap;

  :deep(.lk-button) {
    flex: 1;
    min-width: 160rpx;
  }
}
</style>
