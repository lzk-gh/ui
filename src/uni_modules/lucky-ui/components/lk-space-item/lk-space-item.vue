<script setup lang="ts">
/**
 * SpaceItem 间距子项
 * 用于 LkSpace 内部，通过包装子项实现跨端兼容的间距逻辑
 */
defineOptions({ name: 'LkSpaceItem' });
</script>

<template>
  <view class="lk-space-item">
    <slot />
  </view>
</template>

<style lang="scss">
.lk-space-item {
  display: block;
}
</style>
