<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-card title="卡片标题" sub-title="副标题">
        <view class="card-content">
          卡片内容区域，可以包含文字、图片等多种元素。
        </view>
      </lk-card>
    </demo-block>

    <demo-block title="带封面">
      <lk-card title="风景" sub-title="每日推荐">
        <template #cover>
          <image
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80"
            mode="aspectFill"
            class="cover-image"
          />
        </template>
        <view class="card-content">
          优美的风景图片，展示了卡片组件对封面图的完美支持。
        </view>
      </lk-card>
    </demo-block>

    <demo-block title="带底部操作">
      <lk-card title="订单详情">
        <view class="card-content">
          <view class="info-row">
            <text>商品名称</text>
            <text>高级机械键盘</text>
          </view>
          <view class="info-row">
            <text>订单金额</text>
            <text class="price">¥ 899.00</text>
          </view>
        </view>
        <template #footer>
          <view class="card-footer">
            <lk-button size="sm" plain>查看物流</lk-button>
            <lk-button size="sm" type="primary">确认收货</lk-button>
          </view>
        </template>
      </lk-card>
    </demo-block>

    <demo-block title="交互效果">
      <lk-card title="可悬停/点击" hoverable shadow="base">
        <view class="card-content"> 点击或按住卡片查看阴影和位移变化 </view>
      </lk-card>
    </demo-block>

    <demo-block title="简约模式">
      <lk-card shadow="never" border>
        <view class="card-content"> 无标题、无阴影、带边框 </view>
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
  gap: 32rpx;
  padding-bottom: 60rpx;
}

.card-content {
  font-size: 28rpx;
  color: var(--lk-color-text-regular, #666);
  line-height: 1.6;
}

.cover-image {
  width: 100%;
  height: 320rpx;
  display: block;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
  padding-top: 20rpx;
  border-top: 2rpx solid var(--lk-color-border-weak, #f5f5f5);
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12rpx;

  &:last-child {
    margin-bottom: 0;
  }

  .price {
    color: var(--lk-color-danger, #ff4d4f);
    font-weight: 600;
  }
}
</style>
