<script setup lang="ts">
import { computed } from 'vue';
import { loadingProps } from './loading.props';
import {
  resolveLoadingBarStyle,
  resolveLoadingHeightStyle,
  resolveLoadingRootClass,
  resolveLoadingRootStyle,
  resolveLoadingSquareStyle,
  resolveLoadingText,
  resolveLoadingType,
  shouldRenderLoadingText,
} from './loading.utils';

defineOptions({ name: 'LkLoading' });

const props = defineProps(loadingProps);

const _type = computed(() => resolveLoadingType({
  type: props.type,
  variant: props.variant,
}));
const rootClass = computed(() => resolveLoadingRootClass({
  type: _type.value,
  vertical: props.vertical,
}));
const rootStyle = computed(() => resolveLoadingRootStyle(props.color));
const squareStyle = computed(() => resolveLoadingSquareStyle(props.size));
const heightStyle = computed(() => resolveLoadingHeightStyle(props.size));
const barStyle = computed(() => resolveLoadingBarStyle(props.size));
const displayText = computed(() => resolveLoadingText({
  type: _type.value,
  text: props.text,
}));
const showBottomText = computed(() => shouldRenderLoadingText({
  type: _type.value,
  text: props.text,
}));
</script>

<template>
  <view
    class="lk-loading"
    :class="rootClass"
    :style="rootStyle"
    role="status"
    aria-live="polite"
  >
    <!-- Spinner（改进） -->
    <view
      v-if="_type === 'spinner'"
      class="lk-loading__spinner"
      :style="squareStyle"
    ></view>

    <!-- Dots -->
    <view
      v-else-if="_type === 'dots'"
      class="lk-loading__dots"
      :style="heightStyle"
    >
      <view v-for="i in 3" :key="i" class="dot"></view>
    </view>

    <!-- Bar -->
    <view
      v-else-if="_type === 'bar'"
      class="lk-loading__bar"
      :style="barStyle"
    >
      <view class="bar-indicator"></view>
    </view>

    <!-- Bounce -->
    <view
      v-else-if="_type === 'bounce'"
      class="lk-loading__bounce"
      :style="heightStyle"
    >
      <view v-for="i in 3" :key="i" class="bounce-ball"></view>
    </view>

    <!-- Wave -->
    <view
      v-else-if="_type === 'wave'"
      class="lk-loading__wave"
      :style="heightStyle"
    >
      <view v-for="i in 5" :key="i" class="wave-bar"></view>
    </view>

    <!-- Ring -->
    <view
      v-else-if="_type === 'ring'"
      class="lk-loading__ring"
      :style="squareStyle"
    ></view>

    <!-- Ellipsis -->
    <view
      v-else-if="_type === 'ellipsis'"
      class="lk-loading__ellipsis"
      :style="heightStyle"
    >
      <view v-for="i in 3" :key="i" class="ellipsis-dot"></view>
    </view>

    <!-- Text Shine -->
    <view v-else-if="_type === 'text'" class="lk-loading__text-shine">
      <text class="loading-text">{{ displayText }}</text>
    </view>

    <text v-if="showBottomText" class="lk-loading__text">{{ displayText }}</text>
  </view>
</template>

<style lang="scss">
@use './lk-loading.scss';
</style>
