<script setup lang="ts">
defineOptions({ name: 'LkCard' });

const props = defineProps({
  title: { type: String, default: '' },
  subTitle: { type: String, default: '' },
  shadow: { type: String, default: 'base' }, // none|sm|base|lg
  padding: { type: String, default: '32rpx' },
  border: { type: Boolean, default: false },
  hoverable: { type: Boolean, default: false },
});
</script>

<template>
  <view
    class="lk-card"
    :class="[`lk-card--shadow-${shadow}`, { 'is-border': border, 'is-hover': hoverable }]"
    :style="{ padding }"
  >
    <view v-if="title || $slots.header" class="lk-card__header">
      <view class="lk-card__title">
        <slot name="header">
          <text class="lk-card__title-text">{{ title }}</text>
          <text v-if="subTitle" class="lk-card__subtitle">{{ subTitle }}</text>
        </slot>
      </view>
      <view v-if="$slots['header-extra']" class="lk-card__extra">
        <slot name="header-extra" />
      </view>
    </view>
    <view class="lk-card__body">
      <slot />
    </view>
    <view v-if="$slots.footer" class="lk-card__footer">
      <slot name="footer" />
    </view>
  </view>
</template>

<style scoped lang="scss">
.lk-card {
  background: var(--lk-color-bg-surface);
  border-radius: var(--lk-radius-lg);
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  position: relative;
  transition:
    box-shadow var(--lk-transition-fast),
    transform var(--lk-transition-fast);
  &.is-border {
    border: 2rpx solid var(--lk-color-border-weak);
  }

  &--shadow-none {
    box-shadow: none;
  }
  &--shadow-sm {
    box-shadow: var(--lk-shadow-sm);
  }
  &--shadow-base {
    box-shadow: var(--lk-shadow-base);
  }
  &--shadow-lg {
    box-shadow: var(--lk-shadow-lg);
  }

  &.is-hover:active {
    transform: translateY(2rpx);
  }

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24rpx;
  }
  &__title-text {
    font-size: 32rpx;
    font-weight: 600;
  }
  &__subtitle {
    margin-left: 12rpx;
    font-size: 24rpx;
    color: var(--lk-color-text-secondary);
  }
  &__body {
    font-size: 28rpx;
    line-height: 1.6;
    color: var(--lk-color-text);
  }
  &__footer {
    font-size: 24rpx;
    color: var(--lk-color-text-secondary);
  }
}
</style>
