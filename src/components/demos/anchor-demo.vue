<template>
  <view class="component-demo">
    <demo-block title="Anchor 锚点导航">
      <view class="layout">
        <view class="nav">
          <lk-anchor :offset-top="0" affix @change="onChange">
            <lk-anchor-link href="#sec1" title="第一节" />
            <lk-anchor-link href="#sec2" title="第二节" />
            <lk-anchor-link href="#sec3" title="第三节" />
          </lk-anchor>
        </view>
        <view class="content" id="content">
          <view id="sec1" data-lk-anchor-target class="section">第一节内容...</view>
          <view id="sec2" data-lk-anchor-target class="section">第二节内容...</view>
          <view id="sec3" data-lk-anchor-target class="section">第三节内容...</view>
        </view>
      </view>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';
import LkAnchor from '@/uni_modules/lucky-ui/components/lk-anchor/lk-anchor.vue';
import LkAnchorLink from '@/uni_modules/lucky-ui/components/lk-anchor/lk-anchor-link.vue';

function onChange(active: string) {
  // 可根据 active 做联动
}
</script>

<style scoped lang="scss">
.component-demo { display:flex; flex-direction:column; gap:24rpx; }
.layout { display:flex; gap: 24rpx; }
.nav { width: 200rpx; position: sticky; top: 0; align-self:flex-start; }
.content { flex: 1; height: 800rpx; overflow-y: auto; border: 2rpx solid var(--lk-color-border); padding: 12rpx; }
.section { height: 600rpx; border-bottom: 2rpx solid var(--lk-color-border); padding: 16rpx; }
</style>
