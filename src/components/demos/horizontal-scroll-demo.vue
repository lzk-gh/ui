<template>
  <view class="horizontal-scroll-demo">
    <lk-navbar title="HorizontalScroll 横向滚动" />

    <demo-block title="基础用法">
      <lk-horizontal-scroll gap="40rpx">
        <view v-for="i in 10" :key="i">
          <view>Item {{ i }}</view>
        </view>
      </lk-horizontal-scroll>
    </demo-block>

    <demo-block title="音乐 App 风格">
      <lk-horizontal-scroll gap="24rpx" padding="0rpx">
        <view v-for="i in 6" :key="i" class="music-card">
          <image class="music-cover" :src="`https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg`" mode="aspectFill" />
          <text class="music-title">每日推荐 {{ i }}</text>
          <text class="music-desc">猜你喜欢</text>
        </view>
      </lk-horizontal-scroll>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import LkNavbar from '@/uni_modules/lucky-ui/components/lk-navbar/lk-navbar.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';
import LkHorizontalScroll from '@/uni_modules/lucky-ui/components/lk-horizontal-scroll/lk-horizontal-scroll.vue';
</script>

<style lang="scss" scoped>
.horizontal-scroll-demo {
  min-height: 100vh;
  padding-bottom: 40rpx;
}

.music-card {
  width: 320rpx;
  display: flex;
  flex-direction: column;
}

.music-cover {
  width: 320rpx;
  height: 220rpx;
  border-radius: 16rpx;
  margin-bottom: 12rpx;
}

.music-title {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 4rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.music-desc {
  font-size: 22rpx;
  color: #999;
}
</style>
