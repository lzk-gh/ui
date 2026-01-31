<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, ref } from 'vue';
import { tabbarContextKey } from './context';
import { tabbarItemProps } from './tabbar-item.props';

defineOptions({ name: 'LkTabbarItem' });

const props = defineProps(tabbarItemProps);
const tabbar = inject(tabbarContextKey, null);

// 注册当前项并获取索引
const itemIndex = ref(-1);
let unregister: (() => void) | null = null;

onMounted(() => {
  if (tabbar) {
    const result = tabbar.registerItem();
    itemIndex.value = result.index;
    unregister = result.unregister;
  }
});

onUnmounted(() => {
  unregister?.();
});

// 是否激活
const isActive = computed(() => tabbar?.active.value === props.name);

// 当前模式
const mode = computed(() => tabbar?.mode.value || 'fixed');

// 是否为 bump 模式的中间项
const isBumpItem = computed(() => {
  if (mode.value !== 'bump' || !tabbar) return false;
  const total = tabbar.itemCount.value;
  const middle = Math.floor(total / 2);
  return total % 2 === 1 && itemIndex.value === middle;
});

// 徽标显示
const showBadge = computed(() => {
  if (props.dot) return false;
  return props.badge !== '' && props.badge !== null && typeof props.badge !== 'undefined';
});

const badgeText = computed(() => String(props.badge));

// 当前应该显示的图标
const currentIcon = computed(() => {
  if (isActive.value && props.selectedIcon) {
    return props.selectedIcon;
  }
  return props.icon;
});

// 点击处理
function onTap() {
  tabbar?.setActive(props.name, itemIndex.value);
}
</script>

<template>
  <view
    class="lk-tabbar-item"
    :class="{
      'is-active': isActive,
      'lk-tabbar-item--bump': isBumpItem,
    }"
    @tap="onTap"
  >
    <!-- 凸起模式的特殊背景 -->
    <view v-if="isBumpItem" class="lk-tabbar-item__bump-bg" />

    <view class="lk-tabbar-item__icon">
      <!-- 自定义图标(图片) -->
      <template v-if="customIcon">
        <image :src="currentIcon" class="lk-tabbar-item__custom-icon" mode="aspectFit" />
      </template>
      <!-- lk-icon 内置图标 -->
      <template v-else-if="icon">
        <lk-icon :name="currentIcon" :size="isBumpItem ? 52 : 44" />
      </template>

      <!-- 小红点 -->
      <view v-if="dot" class="lk-tabbar-item__dot" />
      <!-- 徽标 -->
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
