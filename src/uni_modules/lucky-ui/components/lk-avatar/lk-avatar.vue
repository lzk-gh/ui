<script setup lang="ts">
import { ref, watch } from 'vue';
defineOptions({ name: 'LkAvatar' });

const props = defineProps({
  src: { type: String, default: '' },
  text: { type: String, default: '' },
  size: { type: String, default: '48' }, // rpx or px string
  round: { type: Boolean, default: true },
  shape: { type: String, default: 'circle' }, // circle | square | rounded
  alt: { type: String, default: '' },
  bg: { type: String, default: '' }
});
const hasError = ref(false);
watch(()=>props.src, ()=> hasError.value = false);

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
      background: bg || 'var(--lk-color-primary-bg-soft)'
    }"
  >
    <image
        v-if="src && !hasError"
        class="lk-avatar__img"
        :src="src"
        mode="aspectFill"
        @error="onError"
    />
    <text v-else class="lk-avatar__text">
      <slot>{{ text.slice(0,1).toUpperCase() }}</slot>
    </text>
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
  &--circle { border-radius: 50%; }
  &--square { border-radius: var(--lk-radius-xs); }
  &--rounded { border-radius: var(--lk-radius-lg); }
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