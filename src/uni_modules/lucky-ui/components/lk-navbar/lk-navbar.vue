<script setup lang="ts">
defineOptions({ name:'LkNavbar' });

const props = defineProps({
  title: { type: String, default: '' },
  fixed: { type: Boolean, default: true },
  leftText: { type: String, default: '' },
  rightText: { type: String, default: '' },
  showBack: { type: Boolean, default: true },
  placeholder: { type: Boolean, default: true },
  safeArea: { type: Boolean, default: true },
  zIndex: { type: Number, default: 110 }
});
const emit = defineEmits(['back','click-left','click-right']);

const sys = typeof uni !== 'undefined' ? uni.getSystemInfoSync() : { statusBarHeight: 0 };
const statusBarHeight = sys.statusBarHeight || 0;

function back() {
  emit('back');
  // #ifdef MP
  uni.navigateBack({ delta:1 });
  // #endif
}

</script>

<template>
  <view class="lk-navbar__placeholder" v-if="fixed && placeholder"></view>
  <view
      class="lk-navbar"
      :class="{ 'is-fixed': fixed }"
      :style="{ paddingTop: safeArea ? statusBarHeight + 'px' : '0px', zIndex: zIndex }"
  >
    <view class="lk-navbar__content">
      <view class="lk-navbar__left" @click="$emit('click-left')">
        <lk-icon
            v-if="showBack"
            name="arrow-left"
            size="36"
            class="lk-navbar__back"
            @click.stop="back"
        />
        <text v-if="leftText" class="lk-navbar__text">{{ leftText }}</text>
        <slot name="left" />
      </view>
      <view class="lk-navbar__center">
        <text v-if="title" class="lk-navbar__title">{{ title }}</text>
        <slot />
      </view>
      <view class="lk-navbar__right" @click="$emit('click-right')">
        <text v-if="rightText" class="lk-navbar__text">{{ rightText }}</text>
        <slot name="right" />
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.lk-navbar__placeholder { height: calc(88rpx + env(safe-area-inset-top)); }
.lk-navbar {
  position: relative;
  background: var(--lk-color-bg-surface);
  color: var(--lk-color-text);
  box-shadow: var(--lk-shadow-sm);
  &.is-fixed {
    position: sticky;
    top: 0;
    left:0;
    right:0;
  }
  &__content {
    height: 88rpx;
    display:flex;
    align-items:center;
    padding: 0 24rpx;
    gap: 12rpx;
  }
  &__left, &__right {
    display:flex;
    align-items:center;
    gap: 8rpx;
    min-width: 120rpx;
  }
  &__center {
    flex:1;
    display:flex;
    justify-content:center;
    align-items:center;
    min-width:0;
  }
  &__title {
    font-size: 32rpx;
    font-weight:600;
  }
  &__back { color: var(--lk-color-primary); }
  &__text { font-size: 26rpx; color: var(--lk-color-text-secondary); }
}
</style>