<script setup lang="ts">
import { provide } from 'vue';

defineOptions({ name: 'LkBreadcrumb' });
const props = defineProps({
  separator: { type: String, default: '/' },
});
provide('LkBreadcrumb', { separator: props.separator });
</script>

<template>
  <view class="lk-breadcrumb">
    <slot />
  </view>
</template>

<style scoped lang="scss">
.lk-breadcrumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8rpx;
  font-size: 24rpx;
}
</style>
