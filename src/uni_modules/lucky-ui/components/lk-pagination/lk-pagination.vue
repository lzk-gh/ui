<script setup lang="ts">
import { computed } from 'vue';
import { paginationProps, paginationEmits } from './pagination.props';
defineOptions({ name: 'LkPagination' });

const props = defineProps(paginationProps);
const emit = defineEmits(paginationEmits);

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)));
const current = computed(() => Math.min(Math.max(1, props.modelValue), pageCount.value));

function change(p: number) {
  if (p < 1 || p > pageCount.value || p === current.value) return;
  emit('update:modelValue', p);
  emit('change', p);
}
function pages() {
  const half = Math.floor(props.pagerCount / 2);
  let start = Math.max(1, current.value - half);
  let end = start + props.pagerCount - 1;
  if (end > pageCount.value) {
    end = pageCount.value;
    start = Math.max(1, end - props.pagerCount + 1);
  }
  const arr = [];
  for (let i = start; i <= end; i++) arr.push(i);
  return arr;
}
</script>

<template>
  <view class="lk-pagination" :class="[`lk-pagination--${size}`]">
    <view
      class="lk-pagination__btn"
      :class="{ 'is-disabled': current === 1 }"
      @click="change(current - 1)"
      >‹</view
    >
    <view
      v-for="p in pages()"
      :key="p"
      class="lk-pagination__page"
      :class="{ 'is-active': p === current }"
      @click="change(p)"
      >{{ p }}</view
    >
    <view
      class="lk-pagination__btn"
      :class="{ 'is-disabled': current === pageCount }"
      @click="change(current + 1)"
      >›</view
    >
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
