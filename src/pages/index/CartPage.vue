<template>
  <scroll-view scroll-y show-scrollbar="false" class="checkout-page" :class="themeClass" :style="{ height: contentHeight }">
    <!-- 自定义导航栏 -->
    <view class="nav-header">
      <view class="icon-btn" @click="activeTab = 'home'">
        <lk-icon name="chevron-left" size="40" color="var(--test-text-primary)" />
      </view>
      <text class="nav-title">Checkout</text>
      <view class="icon-btn" @click="showMorePopup = true">
        <lk-icon name="three-dots" size="40" color="var(--test-text-primary)" />
      </view>
    </view>

    <!-- 交互增强：更多操作 -->
    <lk-popup v-model="showMorePopup" position="bottom" round height="45%">
      <view class="drag-handle"></view>
      <view class="popup-menu-content">
        <lk-cell title="Select All Items" icon="check-all" clickable @click="handleMoreAction('select-all')" border />
        <lk-cell title="Clear Cart" icon="trash" clickable @click="handleMoreAction('clear')" border />
        <lk-cell title="Manage Vouchers" icon="ticket-perforated" clickable @click="handleMoreAction('voucher')" border />
        <lk-cell title="Shipping Support" icon="headset" clickable @click="handleMoreAction('support')" />
      </view>
    </lk-popup>

    <!-- 商品列表 -->
    <view class="cart-items">
      <view v-for="(item, index) in cartItems" :key="index" class="cart-item">
        <image :src="item.image" mode="aspectFill" class="item-img" />
        <view class="item-details">
          <view class="item-header">
            <view class="item-info">
              <text class="item-title">{{ item.title }}</text>
              <text class="item-sub">{{ item.sub }}</text>
            </view>
            <lk-icon name="three-dots" size="32" color="var(--test-text-secondary)" />
          </view>
          <view class="item-footer">
            <text class="item-price">${{ item.price }}</text>
            <view class="stepper-wrap">
              <lk-stepper v-model="item.count" :min="1" />
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 配送信息 -->
    <view class="section-container">
      <text class="section-title">Shipping Information</text>
      <view class="payment-card">
        <view class="visa-logo">
          <lk-icon name="credit-card-fill" size="48" color="#0E4595" />
          <text class="visa-text">VISA</text>
        </view>
        <text class="card-number">**** **** **** 2143</text>
        <lk-icon name="chevron-down" size="32" color="var(--test-text-tertiary)" />
      </view>
    </view>

    <!-- 金额结算 -->
    <view class="bill-container">
      <view class="bill-row">
        <text class="label">Total (9 items)</text>
        <text class="value">$1,014.95</text>
      </view>
      <view class="bill-row">
        <text class="label">Shipping Fee</text>
        <text class="value">$0.00</text>
      </view>
      <view class="bill-row">
        <text class="label">Discount</text>
        <text class="value">$0.00</text>
      </view>
      <view class="divider"></view>
      <view class="bill-row subtotal">
        <text class="label">Sub Total</text>
        <text class="value">$1,014.95</text>
      </view>
    </view>

    <!-- 支付按钮 -->
    <view class="footer-btn">
      <view class="pay-btn" @click="handlePay">
        <text>Pay</text>
      </view>
    </view>

    <view class="safe-area-bottom"></view>
  </scroll-view>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import LkStepper from '@/uni_modules/lucky-ui/components/lk-stepper/lk-stepper.vue';
import LkPopup from '@/uni_modules/lucky-ui/components/lk-popup/lk-popup.vue';
import LkCell from '@/uni_modules/lucky-ui/components/lk-cell/lk-cell.vue';

defineProps<{
  contentHeight: string;
}>();

// 获取父组件的 activeTab 改变方法 (简单模拟)
const activeTab = inject('activeTab', ref('cart'));
const themeClass = inject('themeClass', ref('lk-theme-light'));

const showMorePopup = ref(false);

const handleMoreAction = (type: string) => {
  showMorePopup.value = false;
  uni.showToast({ title: 'Action: ' + type, icon: 'none' });
};

const cartItems = ref([
  {
    title: 'Modern light clothes',
    sub: 'Dress modern',
    price: '212.99',
    count: 4,
    image: 'https://picsum.photos/200/200?random=11'
  },
  {
    title: 'Modern light clothes',
    sub: 'Dress modern',
    price: '162.99',
    count: 1,
    image: 'https://picsum.photos/200/200?random=12'
  }
]);

const handlePay = () => {
  uni.showToast({ title: '准备支付...', icon: 'loading' });
};
</script>

<style lang="scss" scoped>
@import '@/styles/test-page.scss';

.checkout-page {
  background-color: $test-bg-page;
  padding: 30rpx 40rpx 0;
  box-sizing: border-box;
}

.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100rpx;
  margin-bottom: 40rpx;

  .nav-title {
    font-size: 34rpx;
    font-weight: bold;
    color: $test-text-primary;
  }

  .icon-btn {
    width: 80rpx;
    height: 80rpx;
    background: $test-bg-card;
    border-radius: 50%;
    border: 1px solid $test-border-color;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: $test-shadow-sm;
  }
}

.drag-handle {
  width: 80rpx;
  height: 10rpx;
  background-color: $test-border-color;
  border-radius: 10rpx;
  margin: 20rpx auto 10rpx;
}

.popup-menu-content {
  padding: 20rpx 40rpx;
}

.cart-items {
  margin-bottom: 60rpx;
}

.cart-item {
  display: flex;
  gap: 30rpx;
  margin-bottom: 40rpx;

  .item-img {
    width: 160rpx;
    height: 160rpx;
    border-radius: 30rpx;
    background: $test-gray-100;
  }

  .item-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .item-header {
      display: flex;
      justify-content: space-between;

      .item-title {
        font-size: 30rpx;
        font-weight: bold;
        color: $test-text-primary;
        display: block;
      }

      .item-sub {
        font-size: 24rpx;
        color: $test-text-secondary;
      }
    }

    .item-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .item-price {
        font-size: 32rpx;
        font-weight: bold;
        color: $test-text-primary;
      }
    }
  }
}

.section-container {
  margin-bottom: 60rpx;

  .section-title {
    font-size: 30rpx;
    font-weight: bold;
    color: $test-text-primary;
    display: block;
    margin-bottom: 30rpx;
  }

  .payment-card {
    height: 140rpx;
    background: $test-gray-100;
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    padding: 0 30rpx;
    gap: 20rpx;

    .visa-logo {
      display: flex;
      align-items: center;
      gap: 10rpx;
      padding: 10rpx 20rpx;
      background: $test-bg-card;
      border-radius: 12rpx;

      .visa-text {
        font-weight: bold;
        font-style: italic;
        color: #0E4595;
        font-size: 24rpx;
      }
    }

    .card-number {
      flex: 1;
      font-size: 28rpx;
      color: $test-text-primary;
      letter-spacing: 2rpx;
    }
  }
}

.bill-container {
  margin-bottom: 60rpx;

  .bill-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20rpx;

    .label {
      font-size: 28rpx;
      color: $test-text-secondary;
    }

    .value {
      font-size: 28rpx;
      color: $test-text-primary;
      font-weight: bold;
    }

    &.subtotal {
      margin-top: 20rpx;
      .label {
        color: $test-text-primary;
      }
      .value {
        font-size: 34rpx;
      }
    }
  }

  .divider {
    height: 1px;
    background: $test-border-color;
    margin: 30rpx 0;
  }
}

.footer-btn {
  padding: 20rpx 0;

  .pay-btn {
    height: 110rpx;
    background: $test-text-primary;
    color: $test-text-inverse;
    border-radius: 55rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 34rpx;
    font-weight: bold;
    box-shadow: $test-shadow-md;
  }
}

.safe-area-bottom {
  height: 120rpx;
}
</style>

