<script setup lang="ts">
import { ref, computed } from 'vue';
import { useThemeStore } from '@/stores/theme';
import LkNavbar from '@/uni_modules/lucky-ui/components/lk-navbar/lk-navbar.vue';
import LkInput from '@/uni_modules/lucky-ui/components/lk-input/lk-input.vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';

const themeStore = useThemeStore();
const themeClass = computed(() => themeStore.themeClass);
const brandStyleVars = computed(() => themeStore.brandStyleVars);

const phone = ref('');
const password = ref('');

const goBack = () => {
  uni.navigateBack();
};

const handleLogin = () => {
  uni.showToast({ title: '登录成功', icon: 'success' });
  setTimeout(() => {
    uni.switchTab({ url: '/pages/tabbar/home/index' });
  }, 1500);
};
</script>

<template>
  <view class="page-container" :class="themeClass" :style="brandStyleVars">
    <lk-navbar title="登录" @back="goBack" />

    <view class="auth-page">
      <view class="auth-header">
        <text class="title">欢迎回来</text>
        <text class="subtitle">请登录您的账户</text>
      </view>

      <view class="auth-form">
        <lk-input v-model="phone" prefix-icon="phone" placeholder="请输入手机号" type="number" />
        <lk-input v-model="password" prefix-icon="lock" placeholder="请输入密码" type="password" />

        <lk-button type="primary" block radius="40" @click="handleLogin">登录</lk-button>
      </view>
    </view>
  </view>
</template>
<style lang="scss" scoped>
@use '@/styles/test-page.scss' as *;

.page-container {
  width: 100%;
  min-height: 100vh;
  background: $test-bg-page;
}

.auth-page {
  padding: 60rpx 40rpx;
}

.auth-header {
  margin-bottom: 80rpx;
  text-align: center;

  .title {
    font-size: 48rpx;
    font-weight: bold;
    color: $test-text-primary;
    display: block;
    margin-bottom: 16rpx;
  }

  .subtitle {
    font-size: 28rpx;
    color: $test-text-secondary;
  }
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}
</style>
