<template>
  <view class="auth-page" :class="themeClass">
    <view class="auth-header">
      <text class="auth-title">{{ isLogin ? 'Welcome Back!' : 'Create Account' }}</text>
      <text class="auth-subtitle">{{ isLogin ? 'Sign in to continue your shopping' : 'Join our premium community today' }}</text>
    </view>

    <lk-card class="auth-card" padding="40rpx" border>
      <lk-space direction="vertical" :gap="40" fill>
        <!-- 表单 -->
        <lk-form :model="form" class="auth-form">
          <lk-form-item>
            <lk-input v-model="form.email" placeholder="Email Address" prefix-icon="envelope" border />
          </lk-form-item>
          <lk-form-item>
            <lk-input v-model="form.password" placeholder="Password" prefix-icon="lock" type="password" border />
          </lk-form-item>

          <lk-form-item v-if="!isLogin">
            <lk-input v-model="form.confirmPassword" placeholder="Confirm Password" prefix-icon="lock" type="password" border />
          </lk-form-item>

          <view v-if="isLogin" class="forgot-row">
            <text class="forgot-text" @click="goToForgot">Forgot Password?</text>
          </view>
        </lk-form>

        <!-- 按钮 -->
        <view class="btn-group">
          <lk-button block type="primary" radius="60" height="110" @click="handleSubmit">
            {{ isLogin ? 'Sign In' : 'Sign Up' }}
          </lk-button>

          <view class="switch-auth" @click="isLogin = !isLogin">
            <text class="switch-label">{{ isLogin ? "Don't have an account?" : "Already have an account?" }}</text>
            <text class="switch-action">{{ isLogin ? ' Sign Up' : ' Sign In' }}</text>
          </view>
        </view>

        <!-- 社交登录 -->
        <view class="social-auth">
          <lk-divider text="OR CONTINUE WITH" />
          <view class="social-icons">
            <view class="social-item"><lk-icon name="google" size="44" /></view>
            <view class="social-item"><lk-icon name="apple" size="44" /></view>
            <view class="social-item"><lk-icon name="facebook" size="44" /></view>
          </view>
        </view>
      </lk-space>
    </lk-card>

    <!-- 验证码弹窗示例 (用于注册或重置) -->
    <lk-popup v-model="showVerify" position="center" round width="80%">
      <view class="verify-content">
        <text class="verify-title">Enter Verification Code</text>
        <text class="verify-desc">We've sent a 6-digit code to your email.</text>
        <lk-verify-code v-model="verifyCode" :length="6" @finish="onVerifyComplete" />
        <view class="resend-row">
          <text class="resend-label">Didn't receive code?</text>
          <text class="resend-btn">Resend</text>
        </view>
      </view>
    </lk-popup>

    <!-- 忘记密码弹窗 -->
    <lk-popup v-model="showForgot" position="bottom" round height="70%">
      <view class="forgot-content">
        <text class="forgot-title">Reset Password</text>
        <text class="forgot-desc">Enter your email and verification code to reset.</text>
        <lk-form :model="forgotForm" class="forgot-form">
          <lk-form-item>
            <lk-input v-model="forgotForm.email" placeholder="Email Address" prefix-icon="envelope" border />
          </lk-form-item>
          <lk-form-item>
            <lk-verify-code v-model="forgotForm.code" :length="6" />
          </lk-form-item>
          <lk-form-item>
            <lk-input v-model="forgotForm.password" placeholder="New Password" prefix-icon="lock" type="password" border />
          </lk-form-item>
        </lk-form>
        <lk-button type="primary" block radius="60" height="110" @click="handleResetPassword">Reset Password</lk-button>
      </view>
    </lk-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, inject } from 'vue';
import LkInput from '@/uni_modules/lucky-ui/components/lk-input/lk-input.vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import LkDivider from '@/uni_modules/lucky-ui/components/lk-divider/lk-divider.vue';
import LkSpace from '@/uni_modules/lucky-ui/components/lk-space/lk-space.vue';
import LkPopup from '@/uni_modules/lucky-ui/components/lk-popup/lk-popup.vue';
import LkVerifyCode from '@/uni_modules/lucky-ui/components/lk-verify-code/lk-verify-code.vue';
import LkForm from '@/uni_modules/lucky-ui/components/lk-form/lk-form.vue';
import LkFormItem from '@/uni_modules/lucky-ui/components/lk-form/lk-form-item.vue';
import LkCard from '@/uni_modules/lucky-ui/components/lk-card/lk-card.vue';

const themeClass = inject('themeClass', ref('lk-theme-light'));
const activeTab = inject('activeTab', ref('home'));

const isLogin = ref(true);
const showVerify = ref(false);
const verifyCode = ref('');
const showForgot = ref(false);

const form = reactive({
  email: '',
  password: '',
  confirmPassword: ''
});

const forgotForm = reactive({
  email: '',
  code: '',
  password: ''
});

const handleSubmit = () => {
  if (!isLogin.value) {
    showVerify.value = true;
  } else {
    uni.showToast({ title: 'Welcome Albert!', icon: 'success' });
    activeTab.value = 'home';
  }
};

const onVerifyComplete = (code: string) => {
  uni.showLoading({ title: 'Verifying...' });
  setTimeout(() => {
    uni.hideLoading();
    showVerify.value = false;
    isLogin.value = true;
    uni.showToast({ title: 'Registered successfully!', icon: 'success' });
  }, 1500);
};

const goToForgot = () => {
  showForgot.value = true;
};

const handleResetPassword = () => {
  if (!forgotForm.email || !forgotForm.code || !forgotForm.password) {
    uni.showToast({ title: 'Please complete all fields', icon: 'none' });
    return;
  }
  uni.showLoading({ title: 'Resetting...' });
  setTimeout(() => {
    uni.hideLoading();
    showForgot.value = false;
    uni.showToast({ title: 'Password reset successfully', icon: 'success' });
  }, 1200);
};
</script>

<style lang="scss" scoped>
@import '@/styles/test-page.scss';

.auth-page {
  min-height: 100vh;
  background-color: $test-bg-page;
  padding: 120rpx 60rpx;
}

.auth-header {
  margin-bottom: 80rpx;

  .auth-title {
    font-size: 60rpx;
    font-weight: 800;
    color: $test-text-primary;
    display: block;
    margin-bottom: 16rpx;
  }

  .auth-subtitle {
    font-size: 28rpx;
    color: $test-text-secondary;
  }
}

.auth-card {
  :deep(.lk-form-item) {
    margin-bottom: 30rpx;
  }

  :deep(.lk-form-item:last-child) {
    margin-bottom: 0;
  }
}

.forgot-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 20rpx;

  .forgot-text {
    font-size: 26rpx;
    color: $test-primary;
    font-weight: 500;
  }
}

.switch-auth {
  display: flex;
  justify-content: center;
  margin-top: 40rpx;

  .switch-label {
    font-size: 26rpx;
    color: $test-text-secondary;
  }

  .switch-action {
    font-size: 26rpx;
    color: $test-text-primary;
    font-weight: bold;
  }
}

.social-auth {
  margin-top: 60rpx;

  .social-icons {
    display: flex;
    justify-content: center;
    gap: 40rpx;
    margin-top: 40rpx;
  }

  .social-item {
    width: 100rpx;
    height: 100rpx;
    background: $test-bg-card;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: $test-shadow-sm;
    color: $test-text-primary;
  }
}

.verify-content {
  padding: 60rpx 40rpx;
  background: $test-bg-card;
  text-align: center;

  .verify-title {
    font-size: 40rpx;
    font-weight: bold;
    color: $test-text-primary;
    display: block;
  }

  .verify-desc {
    font-size: 26rpx;
    color: $test-text-secondary;
    margin: 20rpx 0 60rpx;
    display: block;
  }

  .resend-row {
    margin-top: 40rpx;
    font-size: 26rpx;

    .resend-label {
      color: $test-text-secondary;
    }

    .resend-btn {
      color: $test-primary;
      font-weight: bold;
      margin-left: 10rpx;
    }
  }
}

.forgot-content {
  padding: 60rpx 40rpx 80rpx;
  background: $test-bg-page;

  .forgot-title {
    font-size: 40rpx;
    font-weight: bold;
    color: $test-text-primary;
    display: block;
  }

  .forgot-desc {
    font-size: 26rpx;
    color: $test-text-secondary;
    margin: 16rpx 0 40rpx;
    display: block;
  }

  .forgot-form {
    margin-bottom: 40rpx;

    :deep(.lk-form-item) {
      margin-bottom: 30rpx;
    }

    :deep(.lk-form-item:last-child) {
      margin-bottom: 0;
    }
  }
}
</style>
