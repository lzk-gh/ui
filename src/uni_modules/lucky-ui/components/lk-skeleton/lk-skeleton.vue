<script setup lang="ts">
defineOptions({ name: 'LkSkeleton' });

const props = defineProps({
  loading: { type: Boolean, default: true },
  avatar: { type: Boolean, default: false },
  avatarSize: { type: String, default: '72rpx' },
  rows: { type: Number, default: 3 },
  rowWidth: { type: [String, Array], default: '100%' }, // 支持数组 ['80%','60%']
  animated: { type: Boolean, default: true },
  round: { type: Boolean, default: false }
});

function getRowWidth(i:number) {
  if(Array.isArray(props.rowWidth)) {
    return props.rowWidth[i] || props.rowWidth[props.rowWidth.length -1] || '100%';
  }
  return props.rowWidth;
}
</script>

<template>
  <view class="lk-skeleton" v-if="loading">
    <view v-if="avatar" class="lk-skeleton__avatar" :style="{ width: avatarSize, height: avatarSize, borderRadius: round?'50%':'var(--lk-radius-md)'}"></view>
    <view class="lk-skeleton__content">
      <view
          v-for="i in rows"
          :key="i"
          class="lk-skeleton__row"
          :style="{ width: getRowWidth(i-1) }"
          :class="{ 'is-anim': animated }"
      />
    </view>
  </view>
  <slot v-else />
</template>

<style scoped lang="scss">
.lk-skeleton {
  display: flex;
  align-items: flex-start;
  gap: 24rpx;
  &__avatar {
    background: var(--lk-color-primary-bg-soft);
    position: relative;
    overflow: hidden;
  }
  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20rpx;
  }
  &__row {
    height: 28rpx;
    border-radius: 16rpx;
    background: linear-gradient(
            90deg,
            var(--lk-color-primary-bg-soft) 20%,
            rgba(0,0,0,0.05) 40%,
            var(--lk-color-primary-bg-soft) 60%
    );
    background-size: 200% 100%;
    &.is-anim {
      animation: lk-skeleton-move 1.2s linear infinite;
    }
  }
}
@keyframes lk-skeleton-move {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>