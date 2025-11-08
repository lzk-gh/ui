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

<style scoped lang="scss">
.lk-breadcrumb-item {
  display: inline-flex;
  align-items: center;
  color: var(--lk-color-text-secondary);
  &.is-link {
    color: var(--lk-color-primary);
  }
  &:last-child {
    .lk-breadcrumb-item__sep {
      display: none;
    }
    color: var(--lk-color-text);
    font-weight: 500;
  }
  &__sep {
    margin: 0 4rpx;
  }
}
</style>
