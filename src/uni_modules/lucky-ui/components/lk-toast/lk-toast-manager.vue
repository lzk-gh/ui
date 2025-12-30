<script setup lang="ts">
import { toastStore } from './toast-manager';
import LkToastItem from './lk-toast-item.vue';

defineOptions({ name: 'LkToastManager' });
</script>

<template>
  <view class="lk-toast-manager">
    <lk-toast-item v-for="t in toastStore.list" :key="t.id" :item="t" />
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
