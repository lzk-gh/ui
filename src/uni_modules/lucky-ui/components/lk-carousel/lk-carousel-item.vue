<script lang="ts" setup>
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
    <slot v-else></slot>
  </view>
</template>

<style lang="scss" scoped>
.lk-carousel-item {
  width: 100%;
  height: 100%;
  /* 确保 Flex 居中，防止图片周围有空隙 */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: inherit;

  &__image {
    width: 100%;
    height: 100%;
    display: block; /* 关键：防止底部产生空隙 */
    will-change: transform;
  }
}
</style>
