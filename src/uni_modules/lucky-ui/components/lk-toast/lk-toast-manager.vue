<script setup lang="ts">
import { toastStore } from './toast-manager';

defineOptions({ name:'LkToastManager' });
</script>

<template>
  <view class="lk-toast-manager">
    <view
        v-for="t in toastStore.list"
        :key="t.id"
        class="lk-toast-mgr__item"
        :class="['pos-'+t.position]"
        @click="toastStore.close(t.id)"
    >
      <view class="lk-toast-mgr__inner">
        <lk-icon v-if="t.icon" :name="t.icon" size="40" class="lk-toast-mgr__icon" />
        <text class="lk-toast-mgr__text">{{ t.message }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.lk-toast-manager {
  position: fixed;
  left:0; top:0; right:0; bottom:0;
  pointer-events:none;
  z-index: 4500;
}
.lk-toast-mgr__item {
  position:absolute;
  left:50%; transform:translateX(-50%);
  &.pos-top { top:12%; }
  &.pos-center { top:50%; transform: translate(-50%,-50%); }
  &.pos-bottom { bottom:12%; }
}
.lk-toast-mgr__inner {
  pointer-events:auto;
  max-width:560rpx; min-width:220rpx;
  background: rgba(0,0,0,.85);
  color:#fff;
  padding: 28rpx 40rpx;
  border-radius: var(--lk-radius-lg);
  display:flex; flex-direction:column; align-items:center; gap:16rpx;
  animation: mgr-in .25s;
}
@keyframes mgr-in { from{ opacity:0; transform:translateY(6rpx);} to{opacity:1; transform:translateY(0);} }
.lk-toast-mgr__text { font-size:26rpx; text-align:center; }
.lk-toast-mgr__icon { color:#fff; }
</style>