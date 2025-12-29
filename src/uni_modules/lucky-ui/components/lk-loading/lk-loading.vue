<script setup lang="ts">
import { computed } from 'vue';
import { loadingProps } from './loading.props';

defineOptions({ name: 'LkLoading' });

const props = defineProps(loadingProps);

const _type = computed(() => {
  // type 优先，其次 variant（向后兼容）
  return (props.type ?? props.variant) as string;
});
</script>

<template>
  <view
    class="lk-loading"
    :class="[`lk-loading--${_type}`, { 'is-vertical': vertical }]"
    :style="{ '--_color': color }"
    role="status"
    aria-live="polite"
  >
    <!-- Spinner（改进） -->
    <view
      v-if="_type === 'spinner'"
      class="lk-loading__spinner"
      :style="{
        width: (typeof size === 'number' ? size : parseInt(size)) + 'rpx',
        height: (typeof size === 'number' ? size : parseInt(size)) + 'rpx',
      }"
    ></view>

    <!-- Dots -->
    <view
      v-else-if="_type === 'dots'"
      class="lk-loading__dots"
      :style="{
        height: (typeof size === 'number' ? size : parseInt(size)) + 'rpx',
      }"
    >
      <view v-for="i in 3" :key="i" class="dot"></view>
    </view>

    <!-- Bar -->
    <view
      v-else-if="_type === 'bar'"
      class="lk-loading__bar"
      :style="{ width: Number(size) * 2 + 'rpx' }"
    >
      <view class="bar-indicator"></view>
    </view>

    <!-- Bounce -->
    <view
      v-else-if="_type === 'bounce'"
      class="lk-loading__bounce"
      :style="{
        height: (typeof size === 'number' ? size : parseInt(size)) + 'rpx',
      }"
    >
      <view v-for="i in 3" :key="i" class="bounce-ball"></view>
    </view>

    <!-- Wave -->
    <view
      v-else-if="_type === 'wave'"
      class="lk-loading__wave"
      :style="{
        height: (typeof size === 'number' ? size : parseInt(size)) + 'rpx',
      }"
    >
      <view v-for="i in 5" :key="i" class="wave-bar"></view>
    </view>

    <!-- Ring -->
    <view
      v-else-if="_type === 'ring'"
      class="lk-loading__ring"
      :style="{
        width: (typeof size === 'number' ? size : parseInt(size)) + 'rpx',
        height: (typeof size === 'number' ? size : parseInt(size)) + 'rpx',
      }"
    ></view>

    <!-- Ellipsis -->
    <view
      v-else-if="_type === 'ellipsis'"
      class="lk-loading__ellipsis"
      :style="{
        height: (typeof size === 'number' ? size : parseInt(size)) + 'rpx',
      }"
    >
      <view v-for="i in 3" :key="i" class="ellipsis-dot"></view>
    </view>

    <!-- Text Shine -->
    <view v-else-if="_type === 'text'" class="lk-loading__text-shine">
      <text class="loading-text">{{ text || 'Loading...' }}</text>
    </view>

    <text v-if="text && _type !== 'text'" class="lk-loading__text">{{ text }}</text>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
