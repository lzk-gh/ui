<script setup lang="ts">
import { ref, watch } from 'vue';
import { avatarProps } from './avatar.props';

defineOptions({ name: 'LkAvatar' });

const props = defineProps(avatarProps);
const hasError = ref(false);

watch(
  () => props.src,
  () => (hasError.value = false)
);

function onError() {
  hasError.value = true;
}
</script>

<template>
  <view
    class="lk-avatar"
    :class="[`lk-avatar--${shape}`, { 'is-fallback': hasError || !src }]"
    :style="{
      width: size + 'rpx',
      height: size + 'rpx',
      background: bg || 'var(--lk-color-primary-bg-soft)',
      color: color || 'var(--lk-color-primary-active)',
    }"
  >
    <image
      v-if="src && !hasError"
      class="lk-avatar__img"
      :src="src"
      mode="aspectFill"
      @error="onError"
    />
    <slot v-else>{{ text.slice(0, 1).toUpperCase() }}</slot>
  </view>
</template>

<style scoped lang="scss">
.lk-avatar {
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  color: var(--lk-color-primary-active);
  background: var(--lk-color-primary-bg-soft);
  &--circle {
    border-radius: 50%;
  }
  &--square {
    border-radius: var(--lk-radius-xs);
  }
  &--rounded {
    border-radius: var(--lk-radius-lg);
  }
  &__img {
    width: 100%;
    height: 100%;
    display: block;
  }
  &.is-fallback {
    font-weight: 600;
    letter-spacing: 1rpx;
  }
}
</style>
