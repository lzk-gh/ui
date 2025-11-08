<script setup lang="ts">
import { lkIndexAnchorProps } from './types';

defineOptions({ name: 'LkIndexAnchor' });

const props = defineProps(lkIndexAnchorProps);
</script>

<template>
  <view class="lk-index-anchor" :data-lk-index-anchor="props.index">
    <view class="lk-index-anchor__title">{{ props.title || props.index }}</view>
    <slot />
  </view>
</template>

<style scoped lang="scss">
.lk-index-anchor {
  padding: 8rpx 0;
}
.lk-index-anchor__title {
  padding: 8rpx 24rpx;
  color: var(--lk-color-text-tertiary);
  font-size: 24rpx;
}
</style>
