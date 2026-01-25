<script setup lang="ts">
defineOptions({ name: 'LkCellGroup' });
const props = defineProps({
  title: { type: String, default: '' },
  inset: { type: Boolean, default: false },
  border: { type: Boolean, default: false },
  card: { type: Boolean, default: false },
});
</script>

<template>
  <view
    class="lk-cell-group"
    :class="[{ 'is-inset': inset, 'is-card': card, 'is-border': border }]"
  >
    <view v-if="title" class="lk-cell-group__title">{{ title }}</view>
    <view class="lk-cell-group__body">
      <slot />
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
