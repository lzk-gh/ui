<template>
  <view class="component-demo">
    <demo-block title="水平间距">
      <lk-space size="md">
        <lk-button>按钮一</lk-button>
        <lk-button>按钮二</lk-button>
        <lk-button>按钮三</lk-button>
      </lk-space>
    </demo-block>

    <demo-block title="垂直间距 + 分隔符">
      <lk-space direction="vertical" :size="16" :split="split">
        <view class="cell">项目 A</view>
        <view class="cell">项目 B</view>
        <view class="cell">项目 C</view>
      </lk-space>
    </demo-block>

    <demo-block title="自动换行">
      <lk-space wrap size="sm">
        <view class="tag" v-for="i in 12" :key="i">标签{{ i }}</view>
      </lk-space>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { h } from 'vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';
import LkSpace from '@/uni_modules/lucky-ui/components/lk-space/lk-space.vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';

const split = h('text', { style: 'color: var(--lk-color-border);' }, '|');
</script>

<style scoped lang="scss">
.component-demo { display:flex; flex-direction:column; gap:24rpx; }
.cell { background: var(--lk-color-bg-elevated); padding: 16rpx 24rpx; border-radius: var(--lk-radius-sm); }
.tag { background: var(--lk-color-primary-bg-soft); color: var(--lk-color-primary); padding: 6rpx 12rpx; border-radius: var(--lk-radius-sm); }
</style>
