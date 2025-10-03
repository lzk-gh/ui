<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-tooltip content="这是提示文字">
        <lk-button>悬停查看</lk-button>
      </lk-tooltip>
    </demo-block>

    <demo-block title="不同位置">
      <view class="tooltip-grid">
        <lk-tooltip content="顶部提示" placement="top">
          <lk-button>上</lk-button>
        </lk-tooltip>
        <lk-tooltip content="右侧提示" placement="right">
          <lk-button>右</lk-button>
        </lk-tooltip>
        <lk-tooltip content="底部提示" placement="bottom">
          <lk-button>下</lk-button>
        </lk-tooltip>
        <lk-tooltip content="左侧提示" placement="left">
          <lk-button>左</lk-button>
        </lk-tooltip>
      </view>
    </demo-block>

    <demo-block title="深色主题">
      <lk-tooltip content="深色主题提示" theme="dark">
        <lk-button type="primary">深色提示</lk-button>
      </lk-tooltip>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkTooltip from '@/uni_modules/lucky-ui/components/lk-tooltip/lk-tooltip.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.tooltip-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}
</style>
