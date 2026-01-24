<template>
  <view class="check-in-page" :class="themeClass" :style="{ height: contentHeight }">
    <scroll-view scroll-y show-scrollbar="false" class="full-scroll">
      <!-- 头部状态 -->
      <view class="welfare-header">
        <view class="user-info">
          <lk-avatar src="https://picsum.photos/100/100" size="80" round />
          <view class="points-info">
            <text class="p-val">1,204</text>
            <text class="p-label">My Lucky Points</text>
          </view>
        </view>
        <view class="rule-btn">Rules</view>
      </view>

      <!-- 动画提示条 -->
      <view v-if="rewardDisplay" :class="rewardClasses" :style="rewardStyles">
        <view class="reward-banner">
          <lk-icon name="gift" size="28" color="#fff" />
          <text>Congrats! +{{ todayReward }} points added.</text>
        </view>
      </view>

      <!-- 打卡日历 -->
      <view class="check-card">
        <view class="check-title-row">
          <text class="check-title">Daily Check-in</text>
          <text class="check-subtitle">Check in for 7 days to get a 20% coupon!</text>
        </view>

        <view class="calendar-grid">
          <view v-for="d in 7" :key="d" :class="['day-item', d <= checkedDays ? 'checked' : '']">
            <view class="coin-icon">
              <lk-icon :name="d <= checkedDays ? 'check-circle-fill' : 'circle'" size="32" />
            </view>
            <text class="day-text">Day {{ d }}</text>
            <text class="reward">+{{ d * 5 }}</text>
          </view>
        </view>

        <lk-button block type="primary" radius="60" height="100" :disabled="hasCheckedToday" @click="handleCheckIn">
          {{ hasCheckedToday ? 'Already Checked-in' : 'Check-in Today' }}
        </lk-button>
      </view>

      <!-- 福利任务 -->
      <view class="section-title">Welfare Tasks</view>
      <view class="task-list">
        <view v-for="(task, i) in tasks" :key="i" class="task-item">
          <view class="task-icon">
            <lk-icon :name="task.icon" size="48" color="var(--test-primary)" />
          </view>
          <view class="task-main">
            <text class="task-name">{{ task.name }}</text>
            <text class="task-reward">+{{ task.reward }} points</text>
          </view>
          <lk-button size="sm" type="primary" plain radius="30" @click="doTask(task)">Go</lk-button>
        </view>
      </view>

      <!-- 积分兑换 (轮播预览) -->
      <view class="section-title">Redeem Rewards</view>
      <view class="redeem-scroll">
        <view v-for="j in 3" :key="j" class="redeem-card">
          <image :src="`https://picsum.photos/300/200?random=${j+50}`" mode="aspectFill" class="redeem-img" />
          <view class="redeem-info">
            <text class="r-name">Lucky Gift Card</text>
            <text class="r-price">500 pts</text>
          </view>
        </view>
      </view>
    </scroll-view>
    <lk-toast ref="toastRef" />
  </view>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import LkAvatar from '@/uni_modules/lucky-ui/components/lk-avatar/lk-avatar.vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkToast from '@/uni_modules/lucky-ui/components/lk-toast/lk-toast.vue';
import { useTransition } from '@/uni_modules/lucky-ui/composables/useTransition';

defineProps<{
  contentHeight: string;
}>();

const themeClass = inject('themeClass', ref('lk-theme-light'));

const toastRef = ref();
const showReward = ref(false);
const todayReward = ref(35);

const checkedDays = ref(3);
const hasCheckedToday = ref(false);

type Task = { name: string; reward: string; icon: string };

const tasks: Task[] = [
  { name: 'Invite a Friend', reward: '100', icon: 'people' },
  { name: 'Share a Product', reward: '20', icon: 'share' },
  { name: 'Complete Profile', reward: '50', icon: 'person-vcard' }
];

const { classes: rewardClasses, styles: rewardStyles, display: rewardDisplay } = useTransition(
  () => showReward.value,
  { name: 'fade-down', duration: 260 }
);

const handleCheckIn = () => {
  setTimeout(() => {
    checkedDays.value++;
    hasCheckedToday.value = true;
    todayReward.value = checkedDays.value * 5;
    showReward.value = true;
    toastRef.value?.show({ message: 'Points received!', type: 'success' });
    setTimeout(() => {
      showReward.value = false;
    }, 2000);
  }, 700);
};

const doTask = (task: Task) => {
  toastRef.value?.show({ message: `Going to ${task.name}`, type: 'info' });
};
</script>

<style lang="scss" scoped>
@import '@/styles/test-page.scss';

.check-in-page {
  background-color: $test-bg-page;
}

.full-scroll {
  height: 100%;
}

.welfare-header {
  padding: 40rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .user-info {
    display: flex;
    align-items: center;
    gap: 20rpx;

    .points-info {
      .p-val {
        font-size: 40rpx;
        font-weight: bold;
        color: $test-text-primary;
        display: block;
      }
      .p-label {
        font-size: 22rpx;
        color: $test-text-secondary;
      }
    }
  }

  .rule-btn {
    font-size: 24rpx;
    color: $test-text-secondary;
    padding: 10rpx 24rpx;
    background: $test-gray-100;
    border-radius: 30rpx;
  }
}

.reward-banner {
  margin: 0 40rpx 30rpx;
  padding: 20rpx 30rpx;
  background: $test-primary;
  color: #fff;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
  box-shadow: $test-shadow-sm;
  font-size: 24rpx;
}

.check-card {
  margin: 0 40rpx 60rpx;
  background: $test-bg-card;
  border-radius: 48rpx;
  padding: 40rpx;
  box-shadow: $test-shadow-md;

  .check-title-row {
    margin-bottom: 40rpx;
    .check-title {
      font-size: 36rpx;
      font-weight: bold;
      color: $test-text-primary;
      display: block;
    }
    .check-subtitle {
      font-size: 24rpx;
      color: $test-text-secondary;
      margin-top: 8rpx;
      display: block;
    }
  }
}

.calendar-grid {
  display: flex;
  justify-content: space-between;
  margin-bottom: 50rpx;

  .day-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12rpx;

    .coin-icon {
      width: 60rpx;
      height: 60rpx;
      background: $test-gray-100;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $test-text-tertiary;
    }

    .day-text { font-size: 18rpx; color: $test-text-secondary; }
    .reward { font-size: 20rpx; color: $test-text-tertiary; font-weight: bold; }

    &.checked {
      .coin-icon {
        background: $test-primary;
        color: #fff;
      }
      .day-text, .reward { color: $test-primary; }
    }
  }
}

.section-title {
  padding: 0 40rpx;
  font-size: 32rpx;
  font-weight: bold;
  color: $test-text-primary;
  margin-bottom: 30rpx;
}

.task-list {
  padding: 0 40rpx;
  margin-bottom: 60rpx;

  .task-item {
    display: flex;
    align-items: center;
    gap: 24rpx;
    background: $test-bg-card;
    padding: 30rpx;
    border-radius: 32rpx;
    margin-bottom: 24rpx;
    box-shadow: $test-shadow-sm;

    .task-icon {
      width: 80rpx;
      height: 80rpx;
      background: $test-gray-100;
      border-radius: 20rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .task-main {
      flex: 1;
      .task-name { font-size: 28rpx; font-weight: bold; color: $test-text-primary; display: block; }
      .task-reward { font-size: 22rpx; color: $test-primary; margin-top: 6rpx; display: block; }
    }
  }
}

.redeem-scroll {
  display: flex;
  gap: 24rpx;
  padding: 0 40rpx 60rpx;
  overflow-x: auto;

  .redeem-card {
    min-width: 300rpx;
    background: $test-bg-card;
    border-radius: 32rpx;
    overflow: hidden;
    box-shadow: $test-shadow-sm;

    .redeem-img { width: 100%; height: 180rpx; }
    .redeem-info {
      padding: 20rpx;
      .r-name { font-size: 24rpx; font-weight: bold; color: $test-text-primary; display: block; }
      .r-price { font-size: 22rpx; color: $test-primary; margin-top: 6rpx; display: block; }
    }
  }
}
</style>
