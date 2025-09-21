<script setup lang="ts">
import { inject, onMounted, onBeforeUnmount } from 'vue';

defineOptions({ name:'LkCarouselItem' });

const carousel = inject<any>('LkCarousel');
onMounted(()=> carousel?.register?.({}));
onBeforeUnmount(()=> carousel?.unregister?.({}));
</script>

<template>
  <view class="lk-carousel-item">
    <slot />
  </view>
</template>

<style scoped lang="scss">
.lk-carousel-item {
  flex:0 0 100%;
  width:100%;
  height:100%;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:36rpx;
  color: var(--lk-color-text);
  background: var(--lk-color-primary-bg-soft);
  user-select:none;
}
</style>