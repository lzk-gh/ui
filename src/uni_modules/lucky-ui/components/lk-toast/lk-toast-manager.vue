<script setup lang="ts">
import { toastStore } from './toast-manager';

defineOptions({ name: 'LkToastManager' });
</script>

<template>
  <view class="lk-toast-manager">
    <view
      v-for="t in toastStore.list"
      :key="t.id"
      class="lk-toast-mgr__item"
      :class="['pos-' + t.position]"
      @click="toastStore.close(t.id)"
    >
      <view class="lk-toast-mgr__inner">
        <lk-icon v-if="t.icon" :name="t.icon" size="40" class="lk-toast-mgr__icon" />
        <text class="lk-toast-mgr__text">{{ t.message }}</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
