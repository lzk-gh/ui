<script setup lang="ts">
import { computed } from 'vue';
import { skeletonProps } from './skeleton.props';
defineOptions({ name: 'LkSkeleton' });

const props = defineProps(skeletonProps);

function getRowWidth(i: number): string {
  if (Array.isArray(props.rowWidth)) {
    return String(props.rowWidth[i] || props.rowWidth[props.rowWidth.length - 1] || '100%');
  }
  return String(props.rowWidth);
}

const hostStyle = computed(() => {
  const dur =
    typeof props.duration === 'number' ? `${props.duration}s` : String(props.duration || '1.8s');
  return {
    '--lk-skel-duration': dur,
    '--lk-skel-ease': props.easing,
  } as any;
});
</script>

<template>
  <view class="lk-skeleton" v-if="loading" :style="hostStyle">
    <view
      v-if="avatar"
      class="lk-skeleton__avatar"
      :class="{ 'is-anim': animated }"
      :style="{
        width: avatarSize,
        height: avatarSize,
        borderRadius: round ? '50%' : 'var(--lk-radius-md)',
      }"
    ></view>
    <view class="lk-skeleton__content">
      <view
        v-if="title"
        class="lk-skeleton__title"
        :class="{ 'is-anim': animated }"
        :style="{ width: titleWidth, height: titleHeight }"
      />
      <view
        v-for="i in rows"
        :key="i"
        class="lk-skeleton__row"
        :style="{ width: getRowWidth(i - 1) }"
        :class="{ 'is-anim': animated }"
      />
    </view>
  </view>
  <slot v-else />
</template>

<style scoped lang="scss">
.lk-skeleton {
  /* Skeleton 主题变量：基础色与高光色，提供回退值以增强可见度 */
  --lk-skel-base: var(--lk-color-primary-bg-soft, #f2f3f5);
  --lk-skel-highlight: rgba(255, 255, 255, 0.35);

  display: flex;
  align-items: flex-start;
  gap: 24rpx;
  &__avatar {
    background-image: linear-gradient(
      120deg,
      var(--lk-skel-base) 25%,
      var(--lk-skel-highlight) 37%,
      var(--lk-skel-base) 63%
    );
    background-size: 300% 100%;
    position: relative;
    overflow: hidden;
  }
  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20rpx;
  }
  &__title {
    border-radius: 16rpx;
    background-image: linear-gradient(
      120deg,
      var(--lk-skel-base) 25%,
      var(--lk-skel-highlight) 37%,
      var(--lk-skel-base) 63%
    );
    background-size: 300% 100%;
  }
  &__row {
    height: 28rpx;
    border-radius: 16rpx;
    background-image: linear-gradient(
      120deg,
      var(--lk-skel-base) 25%,
      var(--lk-skel-highlight) 37%,
      var(--lk-skel-base) 63%
    );
    background-size: 300% 100%;
    &.is-anim {
      animation: lk-skeleton-move var(--lk-skel-duration, 2.4s) var(--lk-skel-ease, ease-in-out)
        infinite;
    }
  }
  &__title.is-anim {
    animation: lk-skeleton-move var(--lk-skel-duration, 2.4s) var(--lk-skel-ease, ease-in-out)
      infinite;
  }
  &__avatar.is-anim {
    animation: lk-skeleton-move var(--lk-skel-duration, 2.4s) var(--lk-skel-ease, ease-in-out)
      infinite;
  }
}
@keyframes lk-skeleton-move {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -100% 0;
  }
}
</style>
