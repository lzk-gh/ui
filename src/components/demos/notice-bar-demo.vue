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

    <demo-block title="滚动通知">
      <lk-notice-bar
        text="系统升级通知：今晚 22:00-23:00 将进行系统维护，请提前保存数据。维护期间将无法访问系统，给您带来不便敬请谅解。"
        :scrollable="true"
      />
    </demo-block>

    <demo-block title="不同类型">
      <lk-notice-bar text="信息通知" type="info" />
      <lk-notice-bar text="成功通知" type="success" style="margin-top: 16rpx;" />
      <lk-notice-bar text="警告提示" type="warning" style="margin-top: 16rpx;" />
      <lk-notice-bar text="错误提示" type="danger" style="margin-top: 16rpx;" />
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

const handleClick = () => {
  uni.showToast({ title: '查看消息', icon: 'none' });
};
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
