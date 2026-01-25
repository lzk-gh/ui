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

function getRowHeight(i: number): string {
  if (Array.isArray(props.rowHeight)) {
    return String(props.rowHeight[i] || props.rowHeight[props.rowHeight.length - 1] || '32rpx');
  }
  return String(props.rowHeight);
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
        :style="{ width: getRowWidth(i - 1), height: getRowHeight(i - 1) }"
        :class="{ 'is-anim': animated }"
      />
    </view>
  </view>
  <slot v-else />
</template>

<style lang="scss">
@use './index.scss';
</style>
