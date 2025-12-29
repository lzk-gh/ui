<script setup lang="ts">
defineOptions({ name: 'DemoBlock' });
const props = defineProps({
  title: { type: String, default: '' },
  padding: { type: Boolean, default: true },
});
</script>

<template>
  <view class="demo-block">
    <view v-if="title" class="demo-block__title">{{ title }}</view>
    <view class="demo-block__body" :class="{ 'no-pad': !padding }"><slot /></view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
