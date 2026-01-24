<template>
  <scroll-view class="mine-page" :class="themeClass" :style="{ height: contentHeight }" scroll-y show-scrollbar="false">
    <!-- 背景装饰 -->
    <view class="profile-bg"></view>

    <view class="content-wrap">
      <!-- 用户头像与基本信息 -->
      <view class="profile-header">
        <lk-avatar
          src="https://picsum.photos/200/200?random=mine-profile"
          size="160"
          round
          border="4rpx solid #fff"
        />
        <text class="user-name">Albert Stevano</text>
        <text class="user-email">albert.stevano@example.com</text>

        <!-- 用户等级/勋章 -->
        <view class="badge-row">
          <lk-tag type="solid" size="sm" radius="20">Gold Member</lk-tag>
          <lk-tag type="solid" size="sm" radius="20" bg-color="#22c55e" style="margin-left: 12rpx;">Verified</lk-tag>
        </view>
      </view>

      <!-- 统计数据 -->
      <view class="stats-card" @click="activeTab = 'analytics'">
        <view v-for="(stat, i) in stats" :key="i" class="stat-item">
          <text class="stat-value">{{ stat.value }}</text>
          <text class="stat-label">{{ stat.label }}</text>
        </view>
      </view>

      <!-- 快捷入口 -->
      <view class="quick-entry section-card" style="padding: 20rpx;">
        <lk-grid :columns="2" :border="false">
          <view class="entry-item" @click="activeTab = 'check-in'">
            <lk-icon name="calendar-check" size="40" color="var(--test-primary)" />
            <text>Daily Check-in</text>
          </view>
          <view class="entry-item" @click="activeTab = 'analytics'">
            <lk-icon name="pie-chart" size="40" color="#6366f1" />
            <text>Data Insights</text>
          </view>
        </lk-grid>
      </view>

      <!-- 订单状态 -->
      <view class="section-card">
        <view class="section-header">
          <text class="section-title">My Orders</text>
          <text class="view-all" @click="goToOrders">View All</text>
        </view>
        <lk-grid :columns="4" :border="false">
          <view v-for="(order, i) in orderStatuses" :key="i" class="order-status-item">
            <lk-badge :value="order.count" :offset="[0, 5]">
              <lk-icon :name="order.icon" size="48" color="var(--test-text-primary)" />
            </lk-badge>
            <text class="status-label">{{ order.label }}</text>
          </view>
        </lk-grid>
      </view>

      <!-- 菜单项 -->
      <view class="menu-list">
        <view class="section-card">
          <lk-cell title="Edit Profile" icon="person-gear" clickable arrow border @click="activeTab = 'edit-profile'" />
          <lk-cell title="My Wishlist" icon="heart" clickable arrow border />
          <lk-cell title="Shipping Addresses" icon="geo-alt" clickable arrow border />
          <lk-cell title="Payment Methods" icon="credit-card" clickable arrow />
        </view>

        <view class="section-card" style="margin-top: 30rpx;">
          <lk-cell title="Theme Management" icon="palette" clickable arrow border @click="showThemeSheet = true" />
          <lk-cell title="Privacy Policy" icon="shield-lock" clickable arrow border />
          <lk-cell title="Settings" icon="gear" clickable arrow />
        </view>
      </view>

      <!-- 退出登录 -->
      <view class="logout-btn-wrap">
        <lk-button block plain type="danger" radius="40" @click="showLogoutModal = true">Log Out</lk-button>
      </view>
    </view>

    <!-- 交互增强：主题切换 -->
    <lk-action-sheet
      v-model="showThemeSheet"
      :actions="themeActions"
      title="Select Theme"
      @select="handleThemeSelect"
    />

    <!-- 交互增强：退出确认 -->
    <lk-modal
      v-model="showLogoutModal"
      title="Sign Out"
      confirm-text="Logout"
      cancel-text="Wait"
      @confirm="handleLogout"
    >
      <text style="color: var(--test-text-secondary); font-size: 28rpx;">Are you sure you want to sign out? You will need to login again to access your orders.</text>
    </lk-modal>
  </scroll-view>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import LkAvatar from '@/uni_modules/lucky-ui/components/lk-avatar/lk-avatar.vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import LkGrid from '@/uni_modules/lucky-ui/components/lk-grid/lk-grid.vue';
import LkCell from '@/uni_modules/lucky-ui/components/lk-cell/lk-cell.vue';
import LkBadge from '@/uni_modules/lucky-ui/components/lk-badge/lk-badge.vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkTag from '@/uni_modules/lucky-ui/components/lk-tag/lk-tag.vue';
import LkActionSheet from '@/uni_modules/lucky-ui/components/lk-action-sheet/lk-action-sheet.vue';
import LkModal from '@/uni_modules/lucky-ui/components/lk-modal/lk-modal.vue';

defineProps<{
  contentHeight: string;
}>();

const activeTab = inject('activeTab', ref('mine'));
const themeClass = inject('themeClass', ref('lk-theme-light'));
const toggleTheme = inject('toggleTheme', () => {});

const stats = [
  { value: '12', label: 'Wishlist' },
  { value: '25', label: 'Coupons' },
  { value: '1,204', label: 'Points' }
];

const orderStatuses = [
  { label: 'Pending', icon: 'wallet2', count: 2 },
  { label: 'Processing', icon: 'box-seam', count: 0 },
  { label: 'Shipped', icon: 'truck', count: 5 },
  { label: 'Reviews', icon: 'chat-dots', count: 1 }
];

const showThemeSheet = ref(false);
const themeActions = [
  { name: 'Light Mode', color: '#1f2937' },
  { name: 'Dark Mode', color: '#1f2937' }
];

const handleThemeSelect = (payload: { action: { name: string }; index: number }) => {
  const { action } = payload;
  if (action.name === 'Dark Mode') {
    if (themeClass.value === 'lk-theme-light') toggleTheme();
  } else {
    if (themeClass.value === 'lk-theme-dark') toggleTheme();
  }
};

const showLogoutModal = ref(false);
const handleLogout = () => {
  uni.showToast({ title: 'Logged out', icon: 'success' });
  activeTab.value = 'auth';
};

const goToOrders = () => {
  uni.showToast({ title: 'Orders page...', icon: 'none' });
};
</script>

<style lang="scss" scoped>
@import '@/styles/test-page.scss';

.mine-page {
  background-color: $test-bg-page;
  position: relative;
}

.profile-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 460rpx;
  background: linear-gradient(180deg, $test-text-primary 0%, $test-primary 100%);
  border-bottom-left-radius: 40rpx;
  border-bottom-right-radius: 40rpx;
}

.content-wrap {
  position: relative;
  z-index: 1;
  padding: 40rpx 40rpx 140rpx;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20rpx;
  margin-bottom: 40rpx;

  .user-name {
    font-size: 40rpx;
    font-weight: bold;
    color: #fff;
    margin-top: 24rpx;
    text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.2);
  }

  .user-email {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.8);
    margin-top: 8rpx;
  }

  .badge-row {
    margin-top: 20rpx;
    display: flex;
  }
}

.stats-card {
  background: $test-bg-card;
  border-radius: 32rpx;
  display: flex;
  padding: 40rpx 0;
  box-shadow: $test-shadow-md;
  margin-bottom: 40rpx;

  .stat-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-right: 1px solid $test-border-color;

    &:last-child {
      border-right: none;
    }

    .stat-value {
      font-size: 36rpx;
      font-weight: bold;
      color: $test-text-primary;
    }

    .stat-label {
      font-size: 22rpx;
      color: $test-text-secondary;
      margin-top: 8rpx;
    }
  }
}

.section-card {
  background: $test-bg-card;
  border-radius: 32rpx;
  padding: 30rpx;
  box-shadow: $test-shadow-sm;
  margin-bottom: 30rpx;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 36rpx;

    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: $test-text-primary;
    }

    .view-all {
      font-size: 24rpx;
      color: $test-primary;
    }
  }
}

.order-status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;

  .status-label {
    font-size: 24rpx;
    color: $test-text-secondary;
  }
}

.entry-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  padding: 20rpx;
  font-size: 26rpx;
  font-weight: bold;
  color: $test-text-primary;
}

.menu-list {
  :deep(.lk-cell) {
    background: transparent;
    padding: 30rpx 0;
  }
}

.logout-btn-wrap {
  margin-block: 60rpx;
}
</style>
