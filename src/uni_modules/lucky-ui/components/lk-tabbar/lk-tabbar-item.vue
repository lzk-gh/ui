<script setup lang="ts">
import { defineProps, inject, onMounted, computed } from 'vue';

const props = defineProps<{
  name?: string;
  icon?: string;
  value?: string;
  // 徽标支持
  badge?: number | string;
  dot?: boolean;
  max?: number;
}>();

// 获取 tabbar type
import { inject as injectType } from 'vue';
const tabbarType = injectType('lkTabbarType', 'TIC');

type TabbarContext = {
  activeValue: { value: string };
  select: (val?: string) => void;
  registerItem: (val?: string) => void;
};

const tabbar = inject<TabbarContext>('lkTabbar');

const currentValue = computed(() => props.value ?? props.name ?? '');
const isActive = computed(
  () => (tabbar?.activeValue?.value ?? '') === currentValue.value
);
const showBadge = computed(() => props.dot || props.badge !== undefined);

function handleClick() {
  tabbar?.select(currentValue.value);
}

onMounted(() => {
  tabbar?.registerItem(currentValue.value);
});
</script>

<template>
  <view
    class="lk-tabbar-item"
    :class="{
      'lk-tabbar-item--active': isActive,
      'lk-tabbar-item--tic': tabbarType === 'TIC',
    }"
    @click="handleClick"
  >
    <view class="lk-tabbar-item__icon-wrap">
      <lk-badge v-if="showBadge" :content="badge" :dot="dot" :max="max">
        <lk-icon class="lk-tabbar-item__icon" :name="icon" size="32" />
      </lk-badge>
      <lk-icon v-else class="lk-tabbar-item__icon" :name="icon" size="32" />
    </view>
    <view class="lk-tabbar-item__name">{{ name }}</view>
  </view>
</template>

<style scoped lang="scss">
.lk-tabbar-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 22rpx 0;
  flex: 1;
  color: var(--lk-tabbar-inactive-color, #666666);

  &__icon-wrap {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__name {
    margin-top: 8rpx;
    font-size: 24rpx;
    color: currentColor;
  }

  &--active {
    color: var(--lk-tabbar-active-color, var(--lk-color-primary));
  }

  &__icon {
    transition: transform 0.3s ease;
  }

  &--tic.lk-tabbar-item--active &__icon {
    transform: translateY(-100%);
  }
}
</style>
