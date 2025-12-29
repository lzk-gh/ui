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
      '--_size': size + 'rpx',
      '--_bg': bg || undefined,
      '--_color': color || undefined,
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

<style lang="scss">
@use './index.scss';
</style>
