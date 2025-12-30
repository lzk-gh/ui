<script setup lang="ts">
import { defineProps, inject, onMounted, computed } from 'vue';
import { useRipple } from '@/uni_modules/lucky-ui/composables/useRipple';

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
const isActive = computed(() => (tabbar?.activeValue?.value ?? '') === currentValue.value);
const showBadge = computed(() => props.dot || props.badge !== undefined);

const { rippleActive, rippleWaveStyle, triggerRipple } = useRipple({ duration: 600 });

function handleClick() {
  tabbar?.select(currentValue.value);
}

function onTap(e: unknown) {
  triggerRipple(e);
  handleClick();
}

onMounted(() => {
  tabbar?.registerItem(currentValue.value);
});
</script>

<template>
  <view
    class="lk-tabbar-item lk-ripple"
    :class="{
      'lk-tabbar-item--active': isActive,
      'lk-tabbar-item--tic': tabbarType === 'TIC',
      'lk-ripple--active': rippleActive,
    }"
    @tap="onTap"
  >
    <view class="lk-tabbar-item__icon-wrap">
      <lk-badge v-if="showBadge" :content="badge" :dot="dot" :max="max">
        <lk-icon class="lk-tabbar-item__icon" :name="icon" size="32" />
      </lk-badge>
      <lk-icon v-else class="lk-tabbar-item__icon" :name="icon" size="32" />
    </view>
    <view class="lk-tabbar-item__name">{{ name }}</view>
    <view class="lk-ripple__wave" :style="rippleWaveStyle" />
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
