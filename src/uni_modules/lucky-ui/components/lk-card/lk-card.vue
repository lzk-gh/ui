<script setup lang="ts">
import { computed } from 'vue';
import { cardProps } from './card.props';

defineOptions({ name: 'LkCard' });

const props = defineProps(cardProps);

const cardClass = computed(() => {
  return [
    'lk-card',
    `lk-card--shadow-${props.shadow}`,
    {
      'is-border': props.border,
      'is-hover': props.hoverable,
    },
  ];
});
</script>

<template>
  <view :class="cardClass">
    <!-- 封面图插槽：贴边显示 -->
    <view v-if="$slots.cover" class="lk-card__cover">
      <slot name="cover" />
    </view>

    <!-- 头部 -->
    <view
      v-if="title || $slots.header"
      class="lk-card__header"
      :style="{ padding: `${padding} ${padding} 0` }"
    >
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

    <!-- 内容主体 -->
    <view class="lk-card__body" :style="{ padding }">
      <slot />
    </view>

    <!-- 底部 -->
    <view
      v-if="$slots.footer"
      class="lk-card__footer"
      :style="{ padding: `0 ${padding} ${padding}` }"
    >
      <slot name="footer" />
    </view>
  </view>
</template>

<style scoped lang="scss">
.lk-card {
  background: var(--lk-color-bg-surface, #ffffff);
  border-radius: var(--lk-radius-lg, 16rpx);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden; // 确保封面图圆角
  transition:
    box-shadow var(--lk-transition-fast, 0.2s),
    transform var(--lk-transition-fast, 0.2s);

  &.is-border {
    border: 2rpx solid var(--lk-color-border-weak, #ebedf0);
  }

  &--shadow-none {
    box-shadow: none;
  }
  &--shadow-sm {
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  }
  &--shadow-base {
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
  }
  &--shadow-lg {
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.12);
  }

  &.is-hover:active {
    transform: translateY(2rpx);
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06); // 按下时阴影收缩
  }

  &__cover {
    width: 100%;
    // 封面图容器，图片通常设为 width: 100%
    :deep(image),
    :deep(img) {
      display: block;
      width: 100%;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24rpx;
  }

  &__title {
    flex: 1;
    display: flex;
    align-items: baseline;
  }

  &__title-text {
    font-size: 34rpx;
    font-weight: 600;
    color: var(--lk-color-text, #323233);
    line-height: 1.4;
  }

  &__subtitle {
    margin-left: 16rpx;
    font-size: 24rpx;
    color: var(--lk-color-text-secondary, #969799);
    font-weight: normal;
  }

  &__extra {
    font-size: 26rpx;
    color: var(--lk-color-text-secondary, #969799);
  }

  &__body {
    font-size: 28rpx;
    line-height: 1.6;
    color: var(--lk-color-text-regular, #646566);
  }

  &__footer {
    font-size: 24rpx;
    color: var(--lk-color-text-secondary, #969799);
  }
}
</style>
