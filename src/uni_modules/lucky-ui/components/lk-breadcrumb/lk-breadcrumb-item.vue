<script setup lang="ts">
import { inject } from 'vue';
defineOptions({ name: 'LkBreadcrumbItem' });

const props = defineProps({
  to: { type: String, default: '' },
  clickable: { type: Boolean, default: true },
});
const bc = inject<any>('LkBreadcrumb');
function go() {
  if (!props.clickable || !props.to) return;
  // #ifdef MP
  if (props.to.startsWith('/')) uni.navigateTo({ url: props.to });
  // #endif
}
</script>

<template>
  <view class="lk-breadcrumb-item" :class="{ 'is-link': to }" @click="go">
    <slot />
    <text class="lk-breadcrumb-item__sep">{{ bc?.separator }}</text>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
