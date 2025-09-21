<script setup lang="ts">
defineOptions({ name:'LkTimeline' });
</script>
<template>
  <view class="lk-timeline">
    <slot />
  </view>
</template>
<style scoped lang="scss">
.lk-timeline { display:flex; flex-direction:column; gap: 28rpx; }
</style>