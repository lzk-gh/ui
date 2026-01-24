<template>
  <view class="edit-profile-page" :class="themeClass" :style="{ height: contentHeight }">
    <scroll-view scroll-y class="full-scroll">
      <view class="header-section">
        <view class="avatar-wrap" @click="changeAvatar">
          <lk-avatar src="https://picsum.photos/200/200?random=mine-profile" size="200" round border="6rpx solid var(--test-bg-page)" />
          <view class="edit-badge">
            <lk-icon name="camera" size="32" color="#fff" />
          </view>
        </view>
      </view>

      <view class="form-container">
        <view class="section-card">
          <lk-space direction="vertical" :gap="30" fill>
            <view class="form-item">
              <text class="label">Full Name</text>
              <lk-input v-model="profile.name" placeholder="Enter your name" border />
            </view>
            <view class="form-item">
              <text class="label">Email Address</text>
              <lk-input v-model="profile.email" placeholder="Enter your email" border />
            </view>
            <view class="form-item">
              <text class="label">Phone Number</text>
              <lk-input v-model="profile.phone" placeholder="+1 234 567 890" border />
            </view>
            <view class="form-item">
              <text class="label">Bio</text>
              <lk-textarea v-model="profile.bio" placeholder="Tell us about yourself..." border height="200" />
            </view>
          </lk-space>
        </view>

        <view class="section-card" style="margin-top: 40rpx;">
          <view class="form-item">
            <text class="label">Gender</text>
            <lk-radio-group v-model="profile.gender" direction="horizontal">
              <lk-radio label="Male">Male</lk-radio>
              <lk-radio label="Female">Female</lk-radio>
              <lk-radio label="Other">Other</lk-radio>
            </lk-radio-group>
          </view>
        </view>

        <view class="action-wrap">
          <lk-button block type="primary" radius="60" height="110" @click="handleSave">
            Save Changes
          </lk-button>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, inject } from 'vue';
import LkAvatar from '@/uni_modules/lucky-ui/components/lk-avatar/lk-avatar.vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import LkInput from '@/uni_modules/lucky-ui/components/lk-input/lk-input.vue';
import LkTextarea from '@/uni_modules/lucky-ui/components/lk-textarea/lk-textarea.vue';
import LkRadio from '@/uni_modules/lucky-ui/components/lk-radio/lk-radio.vue';
import LkRadioGroup from '@/uni_modules/lucky-ui/components/lk-radio/lk-radio-group.vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkSpace from '@/uni_modules/lucky-ui/components/lk-space/lk-space.vue';

defineProps<{
  contentHeight: string;
}>();

const themeClass = inject('themeClass', ref('lk-theme-light'));
const activeTab = inject('activeTab', ref('home'));

const profile = reactive({
  name: 'Albert Stevano',
  email: 'albert.stevano@example.com',
  phone: '+1 234 567 890',
  bio: 'Passionate shopper and fashion enthusiast.',
  gender: 'Male'
});

const changeAvatar = () => {
  uni.chooseImage({
    count: 1,
    success: (_res) => {
      uni.showToast({ title: 'Avatar updated', icon: 'success' });
    }
  });
};

const handleSave = () => {
  uni.showLoading({ title: 'Saving...' });
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({ title: 'Profile Updated', icon: 'success' });
    activeTab.value = 'mine';
  }, 1000);
};
</script>

<style lang="scss" scoped>
@import '@/styles/test-page.scss';

.edit-profile-page {
  background-color: $test-bg-page;
}

.header-section {
  height: 300rpx;
  background: $test-text-primary;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 60rpx;
  position: relative;
  margin-bottom: 120rpx;

  .avatar-wrap {
    position: absolute;
    bottom: -100rpx;

    .edit-badge {
      position: absolute;
      right: 10rpx;
      bottom: 10rpx;
      width: 60rpx;
      height: 60rpx;
      background: $test-primary;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 4rpx solid #fff;
    }
  }
}

.form-container {
  padding: 0 40rpx 100rpx;

  .section-card {
    background: $test-bg-card;
    border-radius: 40rpx;
    padding: 40rpx;
    box-shadow: $test-shadow-sm;
  }

  .form-item {
    .label {
      font-size: 26rpx;
      font-weight: 600;
      color: $test-text-secondary;
      display: block;
      margin-bottom: 16rpx;
    }
  }
}

.action-wrap {
  margin-top: 60rpx;
}
</style>
