<script setup lang="ts">
import { ref, reactive } from 'vue';

const cardFormRef = ref();
const cardData = reactive({
  name: '',
  school: '',
  major: '',
  hobby: '',
});

const cardRules = {
  name: [{ required: true, message: '请输入证件姓名' }],
  school: [{ required: true, message: '请选择院校' }],
};

// Picker 状态
const showSchoolPicker = ref(false);
const schoolOptions = [
  { label: '清华大学', value: '清华大学' },
  { label: '北京大学', value: '北京大学' },
  { label: '中山大学', value: '中山大学' },
];

const showMajorPicker = ref(false);
const majorOptions = [
  { label: '计算机科学', value: '计算机科学' },
  { label: '软件工程', value: '软件工程' },
  { label: '人工智能', value: '人工智能' },
];

const onSchoolConfirm = (val: any) => {
  cardData.school = val;
  showSchoolPicker.value = false;
};

const onMajorConfirm = (val: any) => {
  cardData.major = val;
  showMajorPicker.value = false;
};

const openSchoolPicker = () => {
  showSchoolPicker.value = true;
};

const openMajorPicker = () => {
  showMajorPicker.value = true;
};

const onCardSubmit = async () => {
  try {
    await cardFormRef.value?.validate();
    uni.showToast({ title: '保存成功', icon: 'success' });
  } catch {
    uni.showToast({ title: '请完善信息', icon: 'none' });
  }
};

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
    <demo-block title="卡片单元格布局 (腾讯风格)">
      <lk-form
        ref="cardFormRef"
        :model="cardData"
        :rules="cardRules"
        card
        border
        label-width="180rpx"
      >
        <lk-form-item label="证件姓名" prop="name">
          <lk-input
            v-model="cardData.name"
            placeholder="请输入身份证姓名"
            borderless
            :clearable="false"
          />
        </lk-form-item>

        <lk-form-item
          label="本科院校"
          prop="school"
          is-link
        >
          <view class="form-click-area" @tap="openSchoolPicker">
            <text :class="cardData.school ? 'form-value' : 'form-placeholder'">
              {{ cardData.school || '请选择院校' }}
            </text>
          </view>
        </lk-form-item>

        <lk-form-item
          label="主修专业"
          prop="major"
          is-link
        >
          <view class="form-click-area" @tap="openMajorPicker">
            <text :class="cardData.major ? 'form-value' : 'form-placeholder'">
              {{ cardData.major || '请选择主修专业' }}
            </text>
          </view>
        </lk-form-item>

        <lk-form-item label="兴趣爱好" prop="hobby">
          <lk-input
            v-model="cardData.hobby"
            placeholder="请输入你最喜欢做的事情"
            borderless
            :clearable="false"
          />
        </lk-form-item>
      </lk-form>

      <lk-picker
        v-model:visible="showSchoolPicker"
        :columns="schoolOptions"
        title="选择学校"
        @confirm="onSchoolConfirm"
      />

      <lk-picker
        v-model:visible="showMajorPicker"
        :columns="majorOptions"
        title="选择专业"
        @confirm="onMajorConfirm"
      />

      <view class="demo-form__actions">
        <lk-button type="primary" block @click="onCardSubmit">保存并提交</lk-button>
      </view>
    </demo-block>

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
  gap: 24rpx;
  padding-bottom: 100rpx;
  background-color: var(--lk-color-bg-page, #f7f8fa);
  min-height: 100vh;

  &__actions {
    padding: 0 32rpx;
    margin-top: 40rpx;
  }

  .form-click-area {
    flex: 1;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .form-value {
    font-size: 28rpx;
    color: var(--lk-text-primary);
  }

  .form-placeholder {
    font-size: 28rpx;
    color: var(--lk-text-placeholder);
  }

  .form-phone-prefix {
    font-size: 28rpx;
    color: var(--lk-text-primary);
    margin-right: 12rpx;
    font-weight: 500;
  }
}
</style>
