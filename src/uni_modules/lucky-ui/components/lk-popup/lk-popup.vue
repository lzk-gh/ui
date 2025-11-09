<script setup lang="ts">
import { computed } from 'vue';
import LkOverlay from '../lk-overlay/lk-overlay.vue';
import {
  useTransition,
  ANIMATION_PRESETS,
  type TransitionConfig,
} from '@/uni_modules/lucky-ui/composables/useTransition';

defineOptions({ name: 'LkPopup' });

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  position: {
    type: String as () => 'center' | 'top' | 'bottom' | 'left' | 'right',
    default: 'center',
  },
  round: { type: Boolean, default: true },
  overlay: { type: Boolean, default: true },
  closeOnOverlay: { type: Boolean, default: true },
  lockScroll: { type: Boolean, default: true },
  zIndex: { type: Number, default: 1300 },
  safeArea: { type: Boolean, default: true },
  // 统一动画配置（与 Modal 保持一致）
  animation: { type: String as () => keyof typeof ANIMATION_PRESETS, default: undefined },
  animationType: { type: String as () => TransitionConfig['name'], default: undefined },
  duration: { type: Number, default: undefined },
  delay: { type: Number, default: undefined },
  easing: { type: String as () => TransitionConfig['easing'], default: undefined },
});
const emit = defineEmits([
  'update:modelValue',
  'open',
  'close',
  'click-overlay',
  'after-enter',
  'after-leave',
]);

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

<style scoped lang="scss">
.lk-popup {
  position: fixed;
  max-width: 100%;
  max-height: 100%;

  &--center {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  &--bottom {
    left: 0;
    right: 0;
    bottom: 0;
  }
  &--top {
    left: 0;
    right: 0;
    top: 0;
  }
  &--left {
    top: 0;
    bottom: 0;
    left: 0;
    width: 70%;
  }
  &--right {
    top: 0;
    bottom: 0;
    right: 0;
    width: 70%;
  }

  &__panel {
    background: var(--lk-color-bg-surface);
    color: var(--lk-color-text);
    box-shadow: var(--lk-shadow-base);
    max-width: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    border-radius: var(--lk-radius-lg);
  }

  &__safe {
    height: env(safe-area-inset-bottom);
  }
}
</style>
