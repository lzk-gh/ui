<script setup lang="ts">
import { computed } from 'vue';
import LkOverlay from '../lk-overlay/lk-overlay.vue';
import { popupProps, popupEmits } from './popup.props';
import {
  useTransition,
  ANIMATION_PRESETS,
  type TransitionConfig,
} from '@/uni_modules/lucky-ui/composables/useTransition';

defineOptions({ name: 'LkPopup' });

const props = defineProps(popupProps);
const emit = defineEmits(popupEmits);

// 根据 position 给出合理默认动画
const defaultByPosition: Record<string, NonNullable<TransitionConfig['name']>> = {
  center: 'zoom-in',
  top: 'slide-down',
  bottom: 'slide-up',
  left: 'slide-right',
  right: 'slide-left',
};

const transitionConfig = computed<TransitionConfig>(() => {
  // 优先使用 animationType
  if (props.animationType) {
    return {
      name: props.animationType,
      duration: props.duration ?? 260,
      delay: props.delay,
      easing: props.easing ?? 'ease-out',
    };
  }
  // 其次使用预设 animation
  if (props.animation && ANIMATION_PRESETS[props.animation]) {
    const p = ANIMATION_PRESETS[props.animation];
    return {
      name: p.animation,
      duration: props.duration ?? p.duration ?? 260,
      delay: props.delay ?? p.delay,
      easing: props.easing ?? p.easing ?? 'ease-out',
    };
  }
  // 最后根据位置给默认
  const name = defaultByPosition[props.position] || 'zoom-in';
  return {
    name,
    duration: props.duration ?? 260,
    delay: props.delay ?? 0,
    easing: props.easing ?? 'ease-out',
  };
});

const {
  classes: transitionClasses,
  styles: transitionStyles,
  display,
} = useTransition(() => props.modelValue, transitionConfig.value, {
  onAfterEnter: () => emit('after-enter'),
  onAfterLeave: () => emit('after-leave'),
});

function onOverlayClick() {
  emit('click-overlay');
  if (props.closeOnOverlay) emit('update:modelValue', false);
}

const wrapperClass = computed(() => [
  'lk-popup',
  `lk-popup--${props.position}`,
  { 'is-round': props.round },
]);

const wrapperStyle = computed(() => ({ zIndex: props.zIndex + 1 }));
</script>

<template>
  <lk-overlay
    v-if="overlay && display"
    :show="true"
    :z-index="zIndex"
    :lock-scroll="lockScroll"
    :close-on-click="closeOnOverlay"
    @click="onOverlayClick"
  />
  <view v-if="display" :class="wrapperClass" :style="wrapperStyle" @touchmove.stop>
    <view class="lk-popup__panel" :class="transitionClasses" :style="transitionStyles">
      <slot />
      <view v-if="safeArea && position === 'bottom'" class="lk-popup__safe" />
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
