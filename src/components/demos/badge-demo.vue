<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <view class="demo-row">
        <lk-badge :value="5">
          <lk-button>消息</lk-button>
        </lk-badge>
        <lk-badge :value="99" :max="99">
          <lk-icon name="bell-fill" size="44" />
        </lk-badge>
        <lk-badge :value="188" :max="99">
          <lk-icon name="envelope-fill" size="44" />
        </lk-badge>
      </view>
    </demo-block>

    <demo-block title="小红点">
      <view class="demo-row">
        <lk-badge dot bg-color="#f00">
          <lk-button>新消息</lk-button>
        </lk-badge>
        <lk-badge dot bg-color="#f00">
          <lk-icon name="chat-dots-fill" size="44" />
        </lk-badge>
        <lk-badge dot bg-color="#f00">
          <lk-avatar text="U" />
        </lk-badge>
      </view>
    </demo-block>

    <demo-block title="自定义内容">
      <view class="demo-row">
        <lk-badge :value="'HOT'" type="danger">
          <lk-button>热门</lk-button>
        </lk-badge>
        <lk-badge :value="'NEW'" type="success">
          <lk-button>最新</lk-button>
        </lk-badge>
        <lk-badge :value="'VIP'" type="warning">
          <lk-icon name="person-fill" size="44" />
        </lk-badge>
      </view>
    </demo-block>

    <demo-block title="不同类型">
      <view class="demo-row">
        <lk-badge :value="8" type="primary" color="#000">
          <lk-button>主要</lk-button>
        </lk-badge>
        <lk-badge :value="8" type="success">
          <lk-button>成功</lk-button>
        </lk-badge>
        <lk-badge :value="8" type="danger">
          <lk-button>危险</lk-button>
        </lk-badge>
      </view>
    </demo-block>

    <demo-block title="动态徽章">
      <view class="demo-row">
        <lk-badge :value="badgeCount">
          <lk-button @click="increaseBadge">点击增加</lk-button>
        </lk-badge>
        <lk-button size="medium" @click="resetBadge">重置</lk-button>
      </view>
    </demo-block>

    <demo-block title="实用场景">
      <view class="demo-row scene-row">
        <lk-badge :value="3" type="danger">
          <view class="scene-item">
            <lk-icon name="chat-dots-fill" size="40" />
            <text>消息</text>
          </view>
        </lk-badge>
        <lk-badge :value="12" type="danger">
          <view class="scene-item">
            <lk-icon name="bell-fill" size="40" />
            <text>通知</text>
          </view>
        </lk-badge>
        <lk-badge :value="99" :max="99" type="danger">
          <view class="scene-item">
            <lk-icon name="envelope-fill" size="40" />
            <text>邮件</text>
          </view>
        </lk-badge>
      </view>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LkBadge from '@/uni_modules/lucky-ui/components/lk-badge/lk-badge.vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import LkAvatar from '@/uni_modules/lucky-ui/components/lk-avatar/lk-avatar.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const badgeCount = ref(5);

const increaseBadge = () => {
  badgeCount.value++;
  uni.showToast({ title: `徽章计数: ${badgeCount.value}`, icon: 'none' });
};

const resetBadge = () => {
  badgeCount.value = 5;
  uni.showToast({ title: '徽章已重置', icon: 'none' });
};
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.demo-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16rpx;

  &.scene-row {
    gap: 32rpx;
  }
}

.scene-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx;
  background: var(--lk-color-bg-surface);
  border-radius: var(--lk-radius-md);

  text {
    font-size: 22rpx;
    color: var(--lk-color-text-secondary);
  }
}
</style>
