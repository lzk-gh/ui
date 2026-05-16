<script lang="ts" setup>
defineOptions({ name: 'LkCarouselItem' });

defineProps<{
  src?: string;
}>();
</script>

<template>
  <view class="lk-carousel-item">
    <image
      v-if="src"
      class="lk-carousel-item__image"
      :src="src"
      mode="aspectFill"
      :draggable="false"
    />
    <slot v-else />
  </view>
</template>

<style lang="scss" scoped>
.lk-carousel-item {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: inherit;

  &__image {
    width: 100%;
    height: 100%;
    display: block;
    will-change: transform;
  }
}
</style>
