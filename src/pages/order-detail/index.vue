<template>
  <view class="order-detail-page">
    <!-- 自定义导航栏 -->
    <lk-navbar title="订单详情" left-arrow @click-left="handleBack" />

    <scroll-view class="order-detail-page__scroll" scroll-y show-scrollbar="false">
      <lk-space direction="vertical" :gap="24" fill style="padding: 24rpx; padding-bottom: calc(140rpx + env(safe-area-inset-bottom));">

        <!-- 加载骨架屏 -->
        <lk-card v-if="loading" shadow="base">
          <lk-space direction="vertical" :gap="24" fill>
            <lk-skeleton :rows="1" :title="false" avatar avatar-size="80" />
            <lk-skeleton :rows="3" />
          </lk-space>
        </lk-card>

        <template v-else>
          <!-- 订单状态步骤条 -->
          <lk-card shadow="base">
            <lk-steps :current="2" direction="horizontal">
              <lk-step title="下单" description="2023-10-01 10:00" />
              <lk-step title="付款" description="2023-10-01 10:05" />
              <lk-step title="发货" description="2023-10-02 14:00" />
              <lk-step title="收货" />
            </lk-steps>
          </lk-card>

          <!-- 商品信息 -->
          <lk-card title="商品信息" shadow="base">
            <lk-space :gap="24" align="start" fill>
              <lk-image src="https://picsum.photos/200/200" width="160" height="160" radius="12" />
              <lk-space direction="vertical" :gap="8" fill>
                <text style="font-size: 28rpx; font-weight: bold; color: var(--lk-color-text-primary);">Lucky UI 高级定制组件库</text>
                <text style="font-size: 24rpx; color: var(--lk-color-text-secondary);">规格：全套组件 + 终身更新</text>
                <lk-space justify="between" align="center" fill>
                  <text style="font-size: 32rpx; color: var(--lk-color-danger); font-weight: bold;">¥ 999.00</text>
                  <text style="font-size: 24rpx; color: var(--lk-color-text-placeholder);">x 1</text>
                </lk-space>
              </lk-space>
            </lk-space>
          </lk-card>

          <!-- 费用明细折叠面板 -->
          <lk-card shadow="base" padding="0rpx">
            <lk-collapse v-model="activeCollapse">
              <lk-collapse-item title="费用明细" name="fee">
                <lk-space direction="vertical" :gap="16" fill style="padding: 24rpx;">
                  <lk-space justify="between" fill>
                    <text style="font-size: 26rpx; color: var(--lk-color-text-regular);">商品总额</text>
                    <text style="font-size: 26rpx; color: var(--lk-color-text-primary);">¥ 999.00</text>
                  </lk-space>
                  <lk-space justify="between" fill>
                    <text style="font-size: 26rpx; color: var(--lk-color-text-regular);">运费</text>
                    <text style="font-size: 26rpx; color: var(--lk-color-text-primary);">¥ 0.00</text>
                  </lk-space>
                  <lk-space justify="between" fill>
                    <text style="font-size: 26rpx; color: var(--lk-color-text-regular);">优惠券</text>
                    <text style="font-size: 26rpx; color: var(--lk-color-danger);">- ¥ 100.00</text>
                  </lk-space>
                  <lk-divider />
                  <lk-space justify="between" fill>
                    <text style="font-size: 28rpx; font-weight: bold; color: var(--lk-color-text-primary);">实付款</text>
                    <text style="font-size: 32rpx; font-weight: bold; color: var(--lk-color-danger);">¥ 899.00</text>
                  </lk-space>
                </lk-space>
              </lk-collapse-item>
            </lk-collapse>
          </lk-card>

          <!-- 订单信息 -->
          <lk-card title="订单信息" shadow="base">
            <lk-space direction="vertical" :gap="16" fill>
              <lk-space justify="between" fill>
                <text style="font-size: 26rpx; color: var(--lk-color-text-secondary);">订单编号</text>
                <lk-space :gap="8" align="center">
                  <text style="font-size: 26rpx; color: var(--lk-color-text-primary);">LK202310010001</text>
                  <lk-tag size="sm" plain @click="handleCopy">复制</lk-tag>
                </lk-space>
              </lk-space>
              <lk-space justify="between" fill>
                <text style="font-size: 26rpx; color: var(--lk-color-text-secondary);">物流信息</text>
                <text style="font-size: 26rpx; color: var(--lk-color-primary);" @click="showLogistics = true">查看物流 ></text>
              </lk-space>
              <lk-space justify="between" fill>
                <text style="font-size: 26rpx; color: var(--lk-color-text-secondary);">下单时间</text>
                <text style="font-size: 26rpx; color: var(--lk-color-text-primary);">2023-10-01 10:00:00</text>
              </lk-space>
              <lk-space justify="between" fill>
                <text style="font-size: 26rpx; color: var(--lk-color-text-secondary);">支付方式</text>
                <text style="font-size: 26rpx; color: var(--lk-color-text-primary);">微信支付</text>
              </lk-space>
            </lk-space>
          </lk-card>
        </template>
      </lk-space>
    </scroll-view>

    <!-- 物流详情弹窗 -->
    <lk-popup v-model:show="showLogistics" position="bottom" round title="物流详情" height="60vh">
      <view style="padding: 32rpx;">
        <lk-timeline>
          <lk-timeline-item title="已签收" desc="您的订单已签收，感谢使用 Lucky UI" time="2023-10-03 10:00" color="var(--lk-color-success)" />
          <lk-timeline-item title="派送中" desc="派送员：张三 (13800138000) 正在为您派送" time="2023-10-03 08:30" />
          <lk-timeline-item title="到达网点" desc="快件已到达上海市浦东新区网点" time="2023-10-02 22:00" />
          <lk-timeline-item title="已发货" desc="您的订单已从广州仓库发出" time="2023-10-02 14:00" />
        </lk-timeline>
      </view>
    </lk-popup>

    <!-- 底部操作栏 -->
    <lk-sticky position="bottom">
      <view style="padding: 20rpx 32rpx; background-color: var(--lk-color-bg-surface); border-top: 1rpx solid var(--lk-color-border-light); padding-bottom: calc(20rpx + env(safe-area-inset-bottom));">
        <lk-space justify="end" :gap="16" fill>
          <lk-button plain size="sm" @click="handleContact">联系客服</lk-button>
          <lk-button type="primary" size="sm" @click="handleConfirm">确认收货</lk-button>
        </lk-space>
      </view>
    </lk-sticky>

    <!-- 反馈组件 -->
    <lk-toast ref="toastRef" />
    <lk-modal
      v-model:show="showConfirmModal"
      title="确认收货"
      content="您是否已收到商品并确认无误？"
      show-cancel-button
      @confirm="handleConfirmReceipt"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import LkNavbar from '@/uni_modules/lucky-ui/components/lk-navbar/lk-navbar.vue';
import LkSpace from '@/uni_modules/lucky-ui/components/lk-space/lk-space.vue';
import LkCard from '@/uni_modules/lucky-ui/components/lk-card/lk-card.vue';
import LkSteps from '@/uni_modules/lucky-ui/components/lk-steps/lk-steps.vue';
import LkStep from '@/uni_modules/lucky-ui/components/lk-steps/lk-step.vue';
import LkImage from '@/uni_modules/lucky-ui/components/lk-image/lk-image.vue';
import LkTag from '@/uni_modules/lucky-ui/components/lk-tag/lk-tag.vue';
import LkCollapse from '@/uni_modules/lucky-ui/components/lk-collapse/lk-collapse.vue';
import LkCollapseItem from '@/uni_modules/lucky-ui/components/lk-collapse/lk-collapse-item.vue';
import LkDivider from '@/uni_modules/lucky-ui/components/lk-divider/lk-divider.vue';
import LkSticky from '@/uni_modules/lucky-ui/components/lk-sticky/lk-sticky.vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkSkeleton from '@/uni_modules/lucky-ui/components/lk-skeleton/lk-skeleton.vue';
import LkToast from '@/uni_modules/lucky-ui/components/lk-toast/lk-toast.vue';
import LkModal from '@/uni_modules/lucky-ui/components/lk-modal/lk-modal.vue';
import LkPopup from '@/uni_modules/lucky-ui/components/lk-popup/lk-popup.vue';
import LkTimeline from '@/uni_modules/lucky-ui/components/lk-timeline/lk-timeline.vue';
import LkTimelineItem from '@/uni_modules/lucky-ui/components/lk-timeline/lk-timeline-item.vue';

const loading = ref(true);
const activeCollapse = ref(['fee']);
const showConfirmModal = ref(false);
const showLogistics = ref(false);
const toastRef = ref();

onMounted(() => {
  // 模拟加载
  setTimeout(() => {
    loading.value = false;
  }, 1500);
});

const handleBack = () => {
  uni.navigateBack();
};

const handleCopy = () => {
  uni.setClipboardData({
    data: 'LK202310010001',
    success: () => {
      toastRef.value?.show({
        message: '复制成功',
        type: 'success'
      });
    }
  });
};

const handleContact = () => {
  toastRef.value?.show({
    message: '正在连接客服...',
    type: 'loading',
    duration: 2000
  });
};

const handleConfirm = () => {
  showConfirmModal.value = true;
};

const handleConfirmReceipt = () => {
  toastRef.value?.show({
    message: '收货成功',
    type: 'success'
  });
};
</script>

<style scoped lang="scss">
.order-detail-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--lk-color-bg-layout);
}

.order-detail-page__scroll {
  flex: 1;
  min-height: 0;
}
</style>
