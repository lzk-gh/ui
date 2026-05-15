<script setup lang="ts">
import { computed } from 'vue';
import { resolveCellGroupClass } from './cell.utils';

defineOptions({ name: 'LkCellGroup' });

const props = defineProps({
  title: { type: String, default: '' },
  inset: { type: Boolean, default: false },
  border: { type: Boolean, default: false },
  card: { type: Boolean, default: false },
});

const groupClass = computed(() => resolveCellGroupClass({
  inset: props.inset,
  card: props.card,
  border: props.border,
}));
</script>

<template>
  <view
    class="lk-cell-group"
    :class="groupClass"
  >
    <view v-if="title" class="lk-cell-group__title">{{ title }}</view>
    <view class="lk-cell-group__body">
      <slot />
    </view>
  </view>
</template>

<style lang="scss">
@use './lk-cell.scss';
</style>
