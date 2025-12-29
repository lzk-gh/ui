<template>
  <view class="component-demo">
    <demo-block title="基础分割线">
      <lk-divider />
    </demo-block>

    <demo-block title="带文字">
      <lk-divider text="默认居中" />
      <lk-divider text="左对齐" text-position="left" />
      <lk-divider text="右对齐" text-position="right" />
    </demo-block>

    <demo-block title="虚线">
      <lk-divider dashed />
      <lk-divider text="虚线分割" dashed />
    </demo-block>

    <demo-block title="带图标">
      <lk-divider>
        <lk-icon name="star-fill" size="24" color="var(--lk-color-warning)" />
      </lk-divider>
      <lk-divider text-position="left">
        <lk-icon name="heart-fill" size="24" color="var(--lk-color-danger)" class="mr-8" />
        热门推荐
      </lk-divider>
    </demo-block>

    <demo-block title="不同颜色">
      <lk-divider text="主色调" style="--divider-color: var(--lk-color-primary)" />
      <lk-divider text="成功" style="--divider-color: var(--lk-color-success)" />
      <lk-divider text="警告" style="--divider-color: var(--lk-color-warning)" />
    </demo-block>

    <demo-block title="内容分组">
      <view class="content-group">
        <text>这是第一组内容</text>
      </view>
      <lk-divider text="Section 1" text-position="left" />
      <view class="content-group">
        <text>这是第二组内容</text>
      </view>
      <lk-divider text="Section 2" :show-bg="false" />
      <view class="content-group">
        <text>这是第三组内容</text>
      </view>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import LkDivider from '@/uni_modules/lucky-ui/components/lk-divider/lk-divider.vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.mr-8 {
  margin-right: 8rpx;
}

.content-group {
  padding: 24rpx;
  background: var(--lk-color-bg-surface);
  border-radius: var(--lk-radius-md);

  text {
    font-size: 26rpx;
    color: var(--lk-color-text-secondary);
  }
}
</style>
