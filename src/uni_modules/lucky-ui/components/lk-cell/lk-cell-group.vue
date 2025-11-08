<script setup lang="ts">
defineOptions({ name: 'LkCellGroup' });
const props = defineProps({
  title: { type: String, default: '' },
  inset: { type: Boolean, default: false },
  border: { type: Boolean, default: true },
  card: { type: Boolean, default: false },
});
</script>

<template>
  <view
    class="lk-cell-group"
    :class="[{ 'is-inset': inset, 'is-card': card, 'is-border': border }]"
  >
    <view v-if="title" class="lk-cell-group__title">{{ title }}</view>
    <view class="lk-cell-group__body">
      <slot />
    </view>
  </view>
</template>

<style scoped lang="scss">
.lk-cell-group {
  display: flex;
  flex-direction: column;
  gap: 0;
  &__title {
    padding: 16rpx 8rpx 8rpx 12rpx;
    font-size: 24rpx;
    color: var(--lk-color-text-secondary);
  }
  &__body {
    background: var(--lk-color-bg-surface);
    border-radius: var(--lk-radius-lg);
    overflow: hidden;
  }
  &.is-inset {
    padding: 0 24rpx;
  }
  &.is-card {
    margin: 8rpx 0;
  }
  &.is-border .lk-cell + .lk-cell {
    border-top: 2rpx solid var(--lk-color-border-weak);
  }
}
</style>
