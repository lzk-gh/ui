<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-card title="卡片标题">
        <view class="card-content"> 这是卡片内容 </view>
      </lk-card>
    </demo-block>

    <demo-block title="带封面">
      <lk-card title="风景">
        <template #cover>
          <image src="https://picsum.photos/400/200" class="cover-image" />
        </template>
        <view class="card-content"> 优美的风景图片 </view>
      </lk-card>
    </demo-block>

    <demo-block title="带底部">
      <lk-card title="操作卡片">
        <view class="card-content"> 卡片内容区域 </view>
        <template #footer>
          <view class="card-footer">
            <lk-button type="text">取消</lk-button>
            <lk-button type="primary">确定</lk-button>
          </view>
        </template>
      </lk-card>
    </demo-block>

    <demo-block title="简约模式">
      <lk-card>
        <view class="card-content"> 无标题卡片 </view>
      </lk-card>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import LkCard from '@/uni_modules/lucky-ui/components/lk-card/lk-card.vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.card-content {
  padding: 24rpx;
  font-size: 28rpx;
  color: var(--lk-color-text);
}

.cover-image {
  width: 100%;
  height: 300rpx;
  display: block;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  gap: 16rpx;
  padding: 16rpx 24rpx;
  border-top: 2rpx solid var(--lk-color-border);
}
</style>
