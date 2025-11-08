<template>
  <view class="component-demo">
    <demo-block title="在容器内演示（受控模式）">
      <view class="desc"
        >在内部 scroll-view 中演示 Backtop 的出现与回顶（通过 scrollTop 受控）。</view
      >
      <scroll-view class="sv-box" scroll-y :scroll-top="innerTop" @scroll="onSvScroll">
        <view class="sv-content">
          <view v-for="i in 30" :key="i" class="item">示例项目 {{ i }}</view>
        </view>
      </scroll-view>
      <lk-backtop
        :usePageScroll="false"
        :scrollTop="innerTop"
        :bottom="'120rpx'"
        @to-top="innerTop = 0"
      />
    </demo-block>

    <demo-block title="基础用法">
      <view class="desc">页面向下滚动超过可视高度后出现，点击回到顶部。</view>
      <view class="placeholder" />
      <view class="placeholder" />
      <view class="placeholder" />
      <lk-backtop :visibilityHeight="200" />
    </demo-block>

    <demo-block title="自定义位置与形状">
      <view class="desc"
        >可通过 right、bottom 调整位置，shape 支持 circle/square/round。</view
      >
      <view class="placeholder" />
      <view class="placeholder" />
      <lk-backtop :right="'40rpx'" :bottom="'160rpx'" shape="round" />
      <lk-backtop :right="'140rpx'" :bottom="'160rpx'" shape="square" size="sm" />
    </demo-block>

    <demo-block title="自定义内容">
      <view class="desc">可通过默认插槽自定义内容。</view>
      <view class="placeholder" />
      <view class="placeholder" />
      <lk-backtop :bottom="'240rpx'">
        <lk-icon
          name="arrow-up-circle-fill"
          size="40"
          color="var(--lk-color-text-inverse)"
        />
        <text class="slot-text">TOP</text>
      </lk-backtop>
    </demo-block>

    <demo-block title="阈值与动画时长">
      <view class="desc"
        >通过 visibilityHeight 控制出现阈值，通过 duration 控制回顶动画时长。</view
      >
      <view class="placeholder" />
      <view class="placeholder" />
      <lk-backtop :bottom="'320rpx'" :visibilityHeight="600" :duration="500" />
    </demo-block>

    <view class="tips">
      <lk-icon name="info-circle" size="28" color="var(--lk-color-info)" />
      <text>
        说明：本详情页使用 scroll-view 容器滚动，Backtop
        监听的是页面滚动（onPageScroll）。如需体验实际效果， 请在页面级滚动环境（非
        scroll-view）中使用，或在业务页中直接引入。
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';
import LkBacktop from '@/uni_modules/lucky-ui/components/lk-backtop/lk-backtop.vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';

import { ref } from 'vue';

const innerTop = ref(0);
function onSvScroll(e: any) {
  // #ifdef H5 || MP || APP-PLUS
  innerTop.value = e.detail?.scrollTop || 0;
  // #endif
}
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.desc {
  font-size: 24rpx;
  color: var(--lk-color-text-secondary);
  margin-bottom: 16rpx;
}

.sv-box {
  height: 520rpx;
  border: 2rpx solid var(--lk-color-border);
  border-radius: var(--lk-radius-lg);
  background: var(--lk-color-bg-surface);
  overflow: hidden;
}
.sv-content {
  padding: 16rpx;
}
.item {
  height: 80rpx;
  display: flex;
  align-items: center;
  padding: 0 16rpx;
  margin-bottom: 12rpx;
  border-radius: var(--lk-radius-md);
  background: var(--lk-color-fill);
  color: var(--lk-color-text-secondary);
}

.placeholder {
  height: 600rpx;
  background: var(--lk-color-bg-surface);
  border-radius: var(--lk-radius-lg);
  border: 2rpx dashed var(--lk-color-border);
}

.slot-text {
  font-size: 22rpx;
  color: var(--lk-color-text-inverse);
}

.tips {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  padding: 16rpx;
  background: var(--lk-color-info-bg-soft);
  border-radius: var(--lk-radius-md);
  color: var(--lk-color-text);

  text {
    font-size: 22rpx;
    color: var(--lk-color-text-secondary);
  }
}
</style>
