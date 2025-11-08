<script setup lang="ts">
import { computed, defineProps, inject } from 'vue';

defineOptions({ name: 'LkCollapseItem' });

const props = defineProps({
  name: { type: [String, Number], required: true },
  title: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
});
const collapse = inject<any>('LkCollapse');
const open = computed(() => collapse.active.value.includes(props.name));

function toggle() {
  if (props.disabled) return;
  collapse.toggle(props.name);
}
</script>

<template>
  <view class="lk-collapse-item" :class="{ 'is-open': open, 'is-disabled': disabled }">
    <view class="lk-collapse-item__header" @click="toggle">
      <text class="lk-collapse-item__title">
        <slot name="title">{{ title }}</slot>
      </text>
      <lk-icon
        name="arrow-down"
        size="28"
        class="lk-collapse-item__arrow"
        :class="{ 'is-open': open }"
      />
    </view>
    <view class="lk-collapse-item__body" v-show="open">
      <slot />
    </view>
  </view>
</template>

<style scoped lang="scss">
.lk-collapse-item {
  background: var(--lk-color-bg-surface);
  border-radius: var(--lk-radius-lg);
  border: 2rpx solid var(--lk-color-border-weak);
  overflow: hidden;
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28rpx 32rpx;
    font-size: 30rpx;
    font-weight: 500;
    position: relative;
    &:active {
      background: var(--lk-color-primary-bg-soft);
    }
  }
  &__title {
    flex: 1;
  }
  &__arrow {
    transition: transform var(--lk-transition-fast);
    &.is-open {
      transform: rotate(180deg);
    }
  }
  &__body {
    padding: 0 32rpx 32rpx;
    font-size: 26rpx;
    line-height: 1.6;
    color: var(--lk-color-text-secondary);
    animation: lk-collapse-expand 0.25s ease;
  }
  &.is-disabled {
    opacity: 0.5;
  }
}
@keyframes lk-collapse-expand {
  from {
    opacity: 0;
    transform: translateY(-6rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
