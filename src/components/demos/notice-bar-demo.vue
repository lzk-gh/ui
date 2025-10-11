<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-notice-bar text="🎉 Lucky UI - 高质量的 UniApp UI 组件库，支持多端适配！" />
    </demo-block>

    <demo-block title="可关闭">
      <lk-notice-bar
        v-if="showNotice"
        text="这是一条可以关闭的通知消息"
        closeable
        @close="showNotice = false"
      />
      <lk-button v-else size="medium" @click="showNotice = true">重新显示</lk-button>
    </demo-block>

    <demo-block title="横向滚动">
      <lk-notice-bar
        text="系统升级通知：今晚 22:00-23:00 将进行系统维护，请提前保存数据。维护期间将无法访问系统，给您带来不便敬请谅解。感谢您的理解与支持！"
        scrollable="horizontal"
        :speed="15"
      />
    </demo-block>

    <demo-block title="竖向滚动">
      <lk-notice-bar
        scrollable="vertical"
        :messages="verticalMessages"
        :speed="3"
      />
    </demo-block>

    <demo-block title="带右侧插槽">
      <lk-notice-bar text="点击右侧查看详情">
        <template #left-icon>
          <lk-icon name="info-circle-fill" size="32" />
        </template>
        <template #right>
          <view class="link-text" @click.stop="handleDetail">详情 ></view>
        </template>
      </lk-notice-bar>
      
      <lk-notice-bar 
        scrollable="vertical"
        :messages="verticalMessages"
        :speed="2"
        style="margin-top: 16rpx;"
      >
        <template #left-icon>
          <lk-icon name="bell-fill" size="32" />
        </template>
        <template #right-icon>
          <lk-icon name="chevron-right" size="28" @click.stop="handleMore" />
        </template>
      </lk-notice-bar>
    </demo-block>

    <demo-block title="带图标">
      <lk-notice-bar text="新功能上线啦，快来体验吧！">
        <template #left-icon>
          <lk-icon name="megaphone-fill" size="32" />
        </template>
      </lk-notice-bar>
      <lk-notice-bar text="重要活动通知" style="margin-top: 16rpx;">
        <template #left-icon>
          <lk-icon name="bell-fill" size="32" />
        </template>
      </lk-notice-bar>
    </demo-block>

    <demo-block title="自定义颜色">
      <lk-notice-bar
        text="自定义颜色的通知消息"
        color="#ff6b6b"
        background="#ffe0e0"
      />
      <lk-notice-bar
        text="深色主题通知"
        color="#ffffff"
        background="#333333"
        style="margin-top: 16rpx;"
      />
    </demo-block>

    <demo-block title="实用场景">
      <lk-notice-bar text="限时优惠：全场商品8折，活动仅限今天！" closeable>
        <template #left-icon>
          <lk-icon name="gift-fill" size="32" />
        </template>
      </lk-notice-bar>
      <lk-notice-bar text="您有3条未读消息" closeable style="margin-top: 16rpx;" @click="handleClick">
        <template #left-icon>
          <lk-icon name="envelope-fill" size="32" />
        </template>
      </lk-notice-bar>
      <lk-notice-bar
        scrollable="horizontal"
        text="🔥 双11大促销！全场5折起，满199减50，满399减100，更有神秘大礼等你来拿！"
        style="margin-top: 16rpx;"
        :speed="12"
      >
        <template #left-icon>
          <lk-icon name="fire" size="32" />
        </template>
      </lk-notice-bar>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LkNoticeBar from '@/uni_modules/lucky-ui/components/lk-notice-bar/lk-notice-bar.vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const showNotice = ref(true);

const verticalMessages = [
  '📢 系统消息：您有新的订单待处理',
  '🎁 活动通知：双11狂欢节即将开始',
  '⚠️ 温馨提示：请及时更新个人信息',
  '✨ 新功能：支持多种支付方式'
];

const handleClick = () => {
  uni.showToast({ title: '查看消息', icon: 'none' });
};

const handleDetail = () => {
  uni.showToast({ title: '查看详情', icon: 'none' });
};

const handleMore = () => {
  uni.showToast({ title: '查看更多', icon: 'none' });
};
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.link-text {
  font-size: 24rpx;
  opacity: 0.8;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
}
</style>
