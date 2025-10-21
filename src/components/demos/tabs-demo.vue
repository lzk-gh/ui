<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-tabs v-model="activeTab1">
        <lk-tab-pane label="标签一" name="1">
          <view class="tab-content">标签一的内容</view>
        </lk-tab-pane>
        <lk-tab-pane label="标签二" name="2">
          <view class="tab-content">标签二的内容</view>
        </lk-tab-pane>
        <lk-tab-pane label="标签三" name="3">
          <view class="tab-content">标签三的内容</view>
        </lk-tab-pane>
      </lk-tabs>
    </demo-block>

    <demo-block title="带徽标">
      <lk-tabs v-model="activeTab2">
        <lk-tab-pane label="消息" name="1">
          <template #label>
            <view class="tab-label">
              <text>消息</text>
              <lk-badge :content="5" />
            </view>
          </template>
          <view class="tab-content">消息列表</view>
        </lk-tab-pane>
        <lk-tab-pane label="通知" name="2">
          <template #label>
            <view class="tab-label">
              <text>通知</text>
              <lk-badge dot />
            </view>
          </template>
          <view class="tab-content">通知列表</view>
        </lk-tab-pane>
      </lk-tabs>
    </demo-block>

    <demo-block title="左右插槽">
      <lk-tabs v-model="activeTab3">
        <template #left>
          <view class="tab-slot-item">
            <text>🔍</text>
          </view>
        </template>
        <lk-tab-pane label="首页" name="1">
          <view class="tab-content">首页内容</view>
        </lk-tab-pane>
        <lk-tab-pane label="分类" name="2">
          <view class="tab-content">分类内容</view>
        </lk-tab-pane>
        <lk-tab-pane label="我的" name="3">
          <view class="tab-content">我的内容</view>
        </lk-tab-pane>
        <template #right>
          <view class="tab-slot-item">
            <text>⋯</text>
          </view>
        </template>
      </lk-tabs>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LkTabs from '@/uni_modules/lucky-ui/components/lk-tabs/lk-tabs.vue';
import LkTabPane from '@/uni_modules/lucky-ui/components/lk-tabs/lk-tab-pane.vue';
import LkBadge from '@/uni_modules/lucky-ui/components/lk-badge/lk-badge.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const activeTab1 = ref('1');
const activeTab2 = ref('1');
const activeTab3 = ref('1');
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.tab-content {
  padding: 48rpx 24rpx;
  font-size: 28rpx;
  color: var(--lk-color-text);
  text-align: center;
  background: var(--lk-color-bg);
  border-radius: 0 0 16rpx 16rpx;
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.tab-slot-item {
  padding: 24rpx 16rpx;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
