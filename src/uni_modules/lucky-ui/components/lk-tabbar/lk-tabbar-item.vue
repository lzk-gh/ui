<script setup lang="ts">
import { computed, inject } from 'vue';
import { tabbarContextKey } from './context';
import { tabbarItemProps } from './tabbar-item.props';

defineOptions({ name: 'LkTabbarItem' });

const props = defineProps(tabbarItemProps);
const tabbar = inject(tabbarContextKey, null);

const isActive = computed(() => tabbar?.active.value === props.name);

const showBadge = computed(() => {
  if (props.dot) return false;
  return props.badge !== '' && props.badge !== null && typeof props.badge !== 'undefined';
});

const badgeText = computed(() => String(props.badge));

function onTap() {
  tabbar?.setActive(props.name);
}
</script>

<template>
  <view class="lk-tabbar-item" :class="{ 'is-active': isActive }" @tap="onTap">
    <view class="lk-tabbar-item__icon">
      <lk-icon v-if="icon" :name="icon" size="44" />
      <view v-if="dot" class="lk-tabbar-item__dot" />
      <view v-else-if="showBadge" class="lk-tabbar-item__badge">
        <text>{{ badgeText }}</text>
      </view>
    </view>
    <view v-if="label" class="lk-tabbar-item__label">{{ label }}</view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
