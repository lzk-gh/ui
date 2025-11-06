<script setup lang="ts">
import { computed, inject } from 'vue';
import { lkAnchorLinkProps } from './types';

defineOptions({ name: 'LkAnchorLink' });

const props = defineProps(lkAnchorLinkProps);
const active = inject<any>('lk-anchor-active');

const isActive = computed(()=> active?.value === props.href);

function onClick() {
  // #ifdef H5
  try {
    const id = props.href.replace('#','');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (e) {}
  // #endif
  // 其他端降级为跳转 hash 或不处理
}
</script>

<template>
  <view :class="['lk-anchor-link', { 'is-active': isActive }]" @click="onClick">
    <slot>{{ props.title }}</slot>
  </view>
</template>

<style scoped lang="scss">
.lk-anchor-link { padding: 8rpx 12rpx; color: var(--lk-color-text-tertiary); }
.lk-anchor-link.is-active { color: var(--lk-color-primary); font-weight: 600; }
</style>
