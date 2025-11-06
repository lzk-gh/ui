<template>
  <view class="component-demo">
    <demo-block title="IndexBar 索引栏">
      <view class="list" id="list">
        <lk-index-bar :scroll-target="'#list'">
          <lk-index-anchor v-for="ch in letters" :key="ch" :index="ch" :title="ch">
            <view v-for="i in 5" :key="i" class="row">{{ ch }} - 项目 {{ i }}</view>
          </lk-index-anchor>
        </lk-index-bar>
      </view>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';
import LkIndexBar from '@/uni_modules/lucky-ui/components/lk-index-bar/lk-index-bar.vue';
import LkIndexAnchor from '@/uni_modules/lucky-ui/components/lk-index-bar/lk-index-anchor.vue';

const letters = Array.from({ length: 10 }, (_, i) => String.fromCharCode(65 + i));
</script>

<style scoped lang="scss">
.component-demo { display:flex; flex-direction:column; gap:24rpx; }
.list { height: 800rpx; overflow-y: auto; border: 2rpx solid var(--lk-color-border); position: relative; }
.row { padding: 20rpx 24rpx; border-bottom: 2rpx solid var(--lk-color-border); }
</style>
