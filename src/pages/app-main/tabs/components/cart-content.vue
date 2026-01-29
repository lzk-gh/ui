<template>
  <scroll-view scroll-y show-scrollbar="false" class="checkout-content" :class="themeClass" :style="{ height: contentHeight }">
    <!-- 自定义导航栏 -->
    <view class="nav-header">
      <view class="icon-btn" @click="goBack">
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
        <lk-cell title="Select All Items" icon="check-all" clickable border @click="handleMoreAction('select-all')" />
        <lk-cell title="Clear Cart" icon="trash" clickable border @click="handleMoreAction('clear')" />
        <lk-cell title="Manage Vouchers" icon="ticket-perforated" clickable border @click="handleMoreAction('voucher')" />
        <lk-cell title="Shipping Support" icon="headset" clickable @click="handleMoreAction('support')" />
      </view>
    </lk-popup>

    <!-- 商品列表 -->
    <view class="cart-items">
      <lk-card
        v-for="(item, index) in cartItems"
        :key="index"
        class="cart-item"
        padding="24rpx"
        shadow="none"
        transparent
      >
        <view class="item-body">
          <lk-image :src="item.image" width="160rpx" height="160rpx" radius="30rpx" fit="cover" />
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
      </lk-card>
    </view>

    <!-- 配送信息 -->
    <lk-card class="section-container" title="Shipping Information" padding="0" shadow="none" transparent>
      <lk-cell-group>
        <lk-cell title="VISA" label="Primary" value="**** **** **** 2143" icon="credit-card-fill" arrow />
      </lk-cell-group>
    </lk-card>

    <!-- 金额结算 -->
    <lk-cell-group class="bill-container" card>
      <lk-cell title="Total (9 items)" value="$1,014.95" />
      <lk-cell title="Shipping Fee" value="$0.00" />
      <lk-cell title="Discount" value="$0.00" />
      <lk-cell class="subtotal" title="Sub Total" value="$1,014.95" />
    </lk-cell-group>

    <!-- 支付按钮 -->
    <view class="footer-btn">
      <lk-button type="primary" block radius="55" height="110" @click="handlePay">Pay</lk-button>
    </view>

    <view class="safe-area-bottom"></view>
  </scroll-view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useThemeStore } from '@/stores/theme';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import LkStepper from '@/uni_modules/lucky-ui/components/lk-stepper/lk-stepper.vue';
import LkPopup from '@/uni_modules/lucky-ui/components/lk-popup/lk-popup.vue';
import LkCell from '@/uni_modules/lucky-ui/components/lk-cell/lk-cell.vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkCard from '@/uni_modules/lucky-ui/components/lk-card/lk-card.vue';
import LkImage from '@/uni_modules/lucky-ui/components/lk-image/lk-image.vue';
import LkCellGroup from '@/uni_modules/lucky-ui/components/lk-cell/lk-cell-group.vue';

defineProps<{
  contentHeight: string;
}>();

const themeStore = useThemeStore();
const themeClass = computed(() => themeStore.themeClass);

const showMorePopup = ref(false);

const goBack = () => {
  uni.switchTab({ url: '/pages/tabbar/home/index' });
};

const handleMoreAction = (type: string) => {
  showMorePopup.value = false;
  uni.showToast({ title: `Action: ${type}`, icon: 'none' });
};

const cartItems = ref([
  {
    title: 'Modern light clothes',
    sub: 'Dress modern',
    price: '212.99',
    count: 4,
    image: 'https://picsum.photos/200/200?random=11',
  },
  {
    title: 'Modern light clothes',
    sub: 'Dress modern',
    price: '162.99',
    count: 1,
    image: 'https://picsum.photos/200/200?random=12',
  },
]);

const handlePay = () => {
  uni.showToast({ title: '准备支付...', icon: 'loading' });
};
</script>

<style lang="scss" scoped>
@use '@/styles/test-page.scss' as *;

.checkout-content {
  background-color: $test-bg-page;
  padding: 30rpx 40rpx 0;
  box-sizing: border-box;
  flex: 1;
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
  margin-bottom: 40rpx;

  .item-body {
    display: flex;
    gap: 30rpx;
    align-items: center;
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
}

.bill-container {
  margin-bottom: 60rpx;

  :deep(.subtotal .lk-cell__title),
  :deep(.subtotal .lk-cell__value) {
    color: $test-text-primary;
    font-weight: bold;
    font-size: 34rpx;
  }
}

.footer-btn {
  padding: 20rpx 0;
}

.safe-area-bottom {
  height: 120rpx;
}
</style>
