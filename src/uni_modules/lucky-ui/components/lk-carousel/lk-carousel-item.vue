<script lang="ts" setup>
defineProps<{
  src?: string;
}>();
</script>

<template>
  <view class="lk-carousel-item">
    <image v-if="src" class="lk-carousel-item__image" :src="src" />
    <slot v-else></slot>
  </view>
</template>

<style lang="scss" scoped>
.lk-carousel-item {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
