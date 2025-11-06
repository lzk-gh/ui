<template>
  <view class="component-demo">
    <demo-block title="基础吸顶">
      <view class="long-list">
        <view class="placeholder">向下滚动查看效果</view>
        <lk-sticky :offset-top="0">
          <view class="sticky-bar">我是吸顶栏</view>
        </lk-sticky>
        <view v-for="i in 30" :key="i" class="item">列表项 {{ i }}</view>
      </view>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';
import LkSticky from '@/uni_modules/lucky-ui/components/lk-sticky/lk-sticky.vue';
</script>

<style scoped lang="scss">
.component-demo { display:flex; flex-direction:column; gap:24rpx; }
.long-list { height: 800rpx; overflow-y: auto; border: 2rpx solid var(--lk-color-border); }
.sticky-bar { background: var(--lk-color-bg-elevated); padding: 16rpx 24rpx; font-weight: 600; border-bottom: 2rpx solid var(--lk-color-border); }
.item { padding: 20rpx 24rpx; border-bottom: 2rpx solid var(--lk-color-border); }
.placeholder { height: 200rpx; display:flex; align-items:center; justify-content:center; color: var(--lk-color-text-tertiary); }
</style>
