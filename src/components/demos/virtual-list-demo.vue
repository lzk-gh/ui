<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <text class="info-text">1000条数据，只渲染可视区域</text>
      <lk-virtual-list 
        :data="listData1" 
        :item-height="100"
        height="600rpx"
      >
        <template #default="{ item, index }">
          <view class="list-item">
            <text class="item-index">{{ index + 1 }}</text>
            <text class="item-text">{{ item.text }}</text>
          </view>
        </template>
      </lk-virtual-list>
    </demo-block>

    <demo-block title="不同高度">
      <lk-virtual-list 
        :data="listData2" 
        :item-height="80"
        height="500rpx"
      >
        <template #default="{ item }">
          <view class="list-item-dynamic">
            <lk-avatar :src="item.avatar" />
            <view class="item-content">
              <text class="item-name">{{ item.name }}</text>
              <text class="item-desc">{{ item.desc }}</text>
            </view>
          </view>
        </template>
      </lk-virtual-list>
    </demo-block>

    <demo-block title="性能对比">
      <text class="info-text">虚拟列表可以高效渲染大量数据</text>
      <view class="stats">
        <text>数据量: {{ listData1.length }}条</text>
        <text>渲染节点: ~10个</text>
        <text>性能提升: 100倍+</text>
      </view>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LkVirtualList from '@/uni_modules/lucky-ui/components/lk-virtual-list/lk-virtual-list.vue';
import LkAvatar from '@/uni_modules/lucky-ui/components/lk-avatar/lk-avatar.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

// 生成1000条数据
const listData1 = ref(
  Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    text: `列表项 ${i + 1}`
  }))
);

// 生成用户列表数据
const listData2 = ref(
  Array.from({ length: 500 }, (_, i) => ({
    id: i,
    name: `用户${i + 1}`,
    desc: `这是用户${i + 1}的描述信息`,
    avatar: `https://picsum.photos/100?random=${i}`
  }))
);
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.info-text {
  display: block;
  margin-bottom: 16rpx;
  font-size: 24rpx;
  color: var(--lk-color-text-secondary);
}

.list-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 24rpx;
  border-bottom: 2rpx solid var(--lk-color-border);
}

.item-index {
  flex-shrink: 0;
  width: 60rpx;
  font-size: 24rpx;
  color: var(--lk-color-text-secondary);
}

.item-text {
  font-size: 28rpx;
  color: var(--lk-color-text);
}

.list-item-dynamic {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 20rpx;
  border-bottom: 2rpx solid var(--lk-color-border);
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.item-name {
  font-size: 28rpx;
  font-weight: 500;
  color: var(--lk-color-text);
}

.item-desc {
  font-size: 24rpx;
  color: var(--lk-color-text-secondary);
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding: 24rpx;
  background: var(--lk-color-bg);
  border-radius: 16rpx;
  
  text {
    font-size: 28rpx;
    color: var(--lk-color-text);
  }
}
</style>
