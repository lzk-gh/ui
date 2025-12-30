<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { navbarProps, navbarEmits } from './navbar.props';
import { useRipple } from '@/uni_modules/lucky-ui/composables/useRipple';

defineOptions({ name: 'LkNavbar' });

const props = defineProps(navbarProps);
const emit = defineEmits(navbarEmits);
const slots = useSlots();

const {
  rippleActive: leftActive,
  rippleWaveStyle: leftRippleStyle,
  triggerRipple: triggerLeft
} = useRipple();

const {
  rippleActive: rightActive,
  rippleWaveStyle: rightRippleStyle,
  triggerRipple: triggerRight
} = useRipple();

// 获取系统信息
const sys = typeof uni !== 'undefined' ? uni.getSystemInfoSync() : ({ statusBarHeight: 0 } as any);
const statusBarHeight = sys.statusBarHeight || 0;
const windowWidth: number = sys && typeof sys.windowWidth === 'number' ? sys.windowWidth : 0;

// 获取胶囊按钮信息（仅小程序）
let menuButtonInfo: any = { height: 0, top: 0 };
// #ifdef MP
if (typeof uni !== 'undefined' && uni.getMenuButtonBoundingClientRect) {
  menuButtonInfo = uni.getMenuButtonBoundingClientRect();
}
// #endif

// 计算导航栏内容高度
// 在小程序中，导航栏高度应该与胶囊按钮对齐
const navbarContentHeight = computed(() => {
  // #ifdef MP
  if (menuButtonInfo.height > 0) {
    // 胶囊按钮的高度 + 上下间距（胶囊距离状态栏的距离 * 2）
    return menuButtonInfo.height + (menuButtonInfo.top - statusBarHeight) * 2;
  }
  // #endif
  // H5 或无胶囊信息时使用默认高度 44px (约 88rpx)
  return 44;
});

// 计算右侧安全间距，避免内容被小程序胶囊遮挡
const contentPaddingRight = computed(() => {
  const hasRightContent = !!props.rightText || !!slots.right;
  // #ifdef MP
  if (
    hasRightContent &&
    menuButtonInfo &&
    typeof menuButtonInfo.left === 'number' &&
    typeof windowWidth === 'number'
  ) {
    const rightSpace = windowWidth - menuButtonInfo.left; // 胶囊到右边的距离（包含胶囊宽度与边距）
    return Math.max(rightSpace + 4, 12); // 额外预留 4px 缓冲，最小 12px
  }
  // #endif
  return 12; // H5 默认右侧内边距 12px
});

function back(event: any) {
  // triggerLeft(event); // Handled by parent click
  emit('back');
  // #ifdef MP
  uni.navigateBack({ delta: 1 });
  // #endif
}

function onLeftClick(event: any) {
  triggerLeft(event);
  emit('click-left');
}

function onRightClick(event: any) {
  triggerRight(event);
  emit('click-right');
}
</script>

<template>
  <view class="lk-navbar" :class="{ 'is-fixed': fixed }" :style="{ zIndex: zIndex }">
    <!-- 状态栏占位 -->
    <view
      v-if="safeArea"
      class="lk-navbar__status-bar"
      :style="{ height: statusBarHeight + 'px' }"
    />

    <!-- 导航栏内容 -->
    <view
      class="lk-navbar__content"
      :style="{
        height: navbarContentHeight + 'px',
        paddingRight: contentPaddingRight + 'px',
      }"
    >
      <view
        class="lk-navbar__left lk-ripple"
        :class="{ 'lk-ripple--active': leftActive }"
        @tap="onLeftClick"
      >
        <lk-icon
          v-if="showBack"
          name="arrow-left"
          size="36"
          class="lk-navbar__back"
          @click.stop="back"
        />
        <text v-if="leftText" class="lk-navbar__text">{{ leftText }}</text>
        <slot name="left" />
        <view class="lk-ripple__wave" :style="leftRippleStyle" />
      </view>
      <view class="lk-navbar__center">
        <text v-if="title" class="lk-navbar__title">{{ title }}</text>
        <slot />
      </view>
      <view
        class="lk-navbar__right lk-ripple"
        :class="{ 'lk-ripple--active': rightActive }"
        @tap="onRightClick"
      >
        <text v-if="rightText" class="lk-navbar__text">{{ rightText }}</text>
        <slot name="right" />
        <view class="lk-ripple__wave" :style="rightRippleStyle" />
      </view>
    </view>
  </view>

  <!-- 占位符，当 fixed 时撑起高度 -->
  <view
    v-if="fixed && placeholder"
    class="lk-navbar__placeholder"
    :style="{
      height: (safeArea ? statusBarHeight : 0) + navbarContentHeight + 'px',
    }"
  />
</template>

<style lang="scss">
@use './index.scss';
</style>
