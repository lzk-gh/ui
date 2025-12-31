<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import LkOverlay from '../lk-overlay/lk-overlay.vue';
import LkIcon from '../lk-icon/lk-icon.vue';
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
  left: 'slide-left',
  right: 'slide-right',
};

const transitionConfig = computed<TransitionConfig>(() => {
  // 如果开启了拖拽且在底部，强制使用 fade，由 JS 接管位移动画
  if (props.position === 'bottom' && props.draggable) {
    return {
      name: 'fade',
      duration: props.duration ?? 260,
      delay: props.delay,
      easing: props.easing ?? 'ease-out',
    };
  }

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

function onCloseClick() {
  emit('click-close');
  emit('update:modelValue', false);
}

const wrapperClass = computed(() => [
  'lk-popup',
  `lk-popup--${props.position}`,
  { 'is-round': props.round },
  { 'is-draggable': props.position === 'bottom' && props.draggable },
]);

const wrapperStyle = computed(() => ({
  zIndex: props.zIndex + 1,
  '--lk-popup-radius': props.radius,
}));

// --- 拖拽逻辑 (Bottom Sheet) ---
const translateY = ref(0);
const isDragging = ref(false);
const windowHeight = uni.getSystemInfoSync().windowHeight;
let startY = 0;
let startTranslateY = 0;
let velocity = 0; // 速度
let lastTime = 0;
let lastY = 0;

// 监听显示状态，初始化位置
watch(
  () => props.modelValue,
  val => {
    if (props.position === 'bottom' && props.draggable) {
      if (val) {
        // 打开时，先置于底部，然后动画到半屏
        translateY.value = windowHeight;
        // 使用 setTimeout 确保在 display: true 渲染后执行动画
        setTimeout(() => {
          translateY.value = windowHeight * 0.5; // 默认半屏
        }, 50);
      } else {
        // 关闭时，动画到底部
        translateY.value = windowHeight;
      }
    }
  }
);

function onTouchStart(e: TouchEvent) {
  if (!props.draggable || props.position !== 'bottom') return;
  isDragging.value = true;
  startY = e.touches[0].clientY;
  startTranslateY = translateY.value;
  lastY = startY;
  lastTime = Date.now();
  velocity = 0;
}

function onTouchMove(e: TouchEvent) {
  if (!isDragging.value) return;
  const currentY = e.touches[0].clientY;
  const currentTime = Date.now();
  const deltaY = currentY - startY;
  let nextY = startTranslateY + deltaY;

  // 计算速度
  const timeDelta = currentTime - lastTime;
  if (timeDelta > 0) {
    velocity = (currentY - lastY) / timeDelta;
  }
  lastY = currentY;
  lastTime = currentTime;

  // 阻尼效果：向上超过 10% 屏幕时（nextY < windowHeight * 0.1）
  const maxTop = windowHeight * 0.1;
  if (nextY < maxTop) {
    nextY = maxTop + (nextY - maxTop) * 0.3; // 增加阻力
  }

  translateY.value = nextY;
}

function onTouchEnd() {
  if (!isDragging.value) return;
  isDragging.value = false;

  const current = translateY.value;
  const half = windowHeight * 0.5;
  const maxTop = windowHeight * 0.1;
  const velocityThreshold = 0.5; // 速度阈值

  // 根据速度快速判断方向
  if (Math.abs(velocity) > velocityThreshold) {
    if (velocity > 0) {
      // 向下快速滑动
      if (current > half) {
        // 超过半屏 -> 关闭
        translateY.value = windowHeight;
        emit('update:modelValue', false);
      } else {
        // 回到半屏
        translateY.value = half;
      }
    } else {
      // 向上快速滑动
      if (current < half) {
        // 吸附到最高点（90%）
        translateY.value = maxTop;
      } else {
        // 回到半屏
        translateY.value = half;
      }
    }
    return;
  }

  // 根据位置判断吸附点（降低阈值）
  const threshold = 60; // 降低阈值，更容易触发

  if (current > windowHeight - threshold) {
    // 接近底部 -> 关闭
    translateY.value = windowHeight;
    emit('update:modelValue', false);
  } else if (current > half + threshold) {
    // 在半屏和底部之间 -> 回到半屏
    translateY.value = half;
  } else if (current > half - threshold) {
    // 在半屏附近 -> 回到半屏
    translateY.value = half;
  } else {
    // 接近顶部 -> 吸附到最高点（90%）
    translateY.value = maxTop;
  }
}

const panelStyle = computed(() => {
  if (props.position === 'bottom' && props.draggable) {
    return {
      ...transitionStyles.value,
      transform: `translateY(${translateY.value}px)`,
      transition: isDragging.value ? 'none' : 'transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)', // 弹性动画
      height: '100vh', // 拖拽模式下占满全屏高度以便上拉
      borderRadius: props.round ? `var(--lk-popup-radius, 24rpx) var(--lk-popup-radius, 24rpx) 0 0` : '0',
    };
  }
  return transitionStyles.value;
});
</script>

<template>
  <lk-overlay
    v-if="overlay && display"
    :show="modelValue"
    :z-index="zIndex"
    :lock-scroll="lockScroll"
    :close-on-click="closeOnOverlay"
    @click="onOverlayClick"
  />
  <view v-if="display" :class="wrapperClass" :style="wrapperStyle" @touchmove.stop>
    <view
      class="lk-popup__panel"
      :class="transitionClasses"
      :style="panelStyle"
    >
      <!-- Drag Handle -->
      <view
        v-if="position === 'bottom' && draggable"
        class="lk-popup__drag-handle"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        <view class="lk-popup__drag-bar" />
      </view>

      <!-- Header -->
      <view v-if="title || $slots.title || closable" class="lk-popup__header">
        <view class="lk-popup__title">
          <slot name="title">{{ title }}</slot>
        </view>
        <view
          v-if="closable"
          class="lk-popup__close"
          :class="`lk-popup__close--${closeIconPosition}`"
          @click="onCloseClick"
        >
          <lk-icon :name="closeIcon" size="36" />
        </view>
      </view>

      <!-- Content -->
      <view class="lk-popup__content">
        <slot />
      </view>

      <view v-if="safeArea && position === 'bottom'" class="lk-popup__safe" />
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
