<script setup lang="ts">
import {
  computed,
  ref,
  watch,
} from 'vue';
import LkOverlay from '../lk-overlay/lk-overlay.vue';
import LkIcon from '../lk-icon/lk-icon.vue';
import { popupProps, popupEmits } from './popup.props';
import { addUnit } from '../../core/src/utils/unit';
import {
  useTransition,
  ANIMATION_PRESETS,
  type TransitionConfig,
} from '@/uni_modules/lucky-ui/composables/useTransition';

defineOptions({ name: 'LkPopup' });

const props = defineProps(popupProps);
const emit = defineEmits(popupEmits);
const closeOnOverlayResolved = computed(() => {
  return props.closeOnClickOverlay ?? props.closeOnOverlay;
});
const popupHeight = computed(() => addUnit(props.height) || '');
const popupWidth = computed(() => addUnit(props.width) || '');

const defaultByPosition: Record<string, NonNullable<TransitionConfig['name']>> = {
  center: 'zoom-in',
  top: 'slide-down',
  bottom: 'slide-up',
  left: 'slide-left',
  right: 'slide-right',
};

const transitionConfig = computed<TransitionConfig>(() => {
  if (props.position === 'bottom' && props.draggable) {
    return {
      name: 'fade',
      duration: props.duration ?? 260,
      delay: props.delay,
      easing: props.easing ?? 'ease-out',
    };
  }

  if (props.animationType) {
    return {
      name: props.animationType,
      duration: props.duration ?? 260,
      delay: props.delay,
      easing: props.easing ?? 'ease-out',
    };
  }
  if (props.animation && ANIMATION_PRESETS[props.animation]) {
    const p = ANIMATION_PRESETS[props.animation];
    return {
      name: p.animation,
      duration: props.duration ?? p.duration ?? 260,
      delay: props.delay ?? p.delay,
      easing: props.easing ?? p.easing ?? 'ease-out',
    };
  }
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
  if (closeOnOverlayResolved.value) emit('update:modelValue', false);
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

const isBottomDraggable = computed(() => props.position === 'bottom' && props.draggable);

const translateY = ref(0);
const isPanelGestureActive = ref(false);
const internalContentScrollTop = ref(0);
const internalContentScrollHeight = ref(0);

type PopupTouchEvent = { touches?: ArrayLike<{ clientY?: number }> };

const windowHeight = uni.getSystemInfoSync().windowHeight;

let startY = 0;
let startTranslateY = 0;
let velocity = 0;
let lastTime = 0;
let lastY = 0;

const VELOCITY_THRESHOLD = 0.5;
const SCROLL_BOUND_EPS = 6;

const snapPixelsSorted = computed(() => {
  const raw = props.snapPoints.filter(n => typeof n === 'number' && n >= 0 && n <= 1);
  const list = raw.length ? [...raw] : [0.5, 0.1];
  return [...new Set(list.map(r => r * windowHeight))].sort((a, b) => a - b);
});

const initialOpenTranslateY = computed(() => {
  const arr = props.snapPoints;
  const first = typeof arr[0] === 'number' ? arr[0] : 0.5;
  const clamped = Math.min(1, Math.max(0, first));
  return clamped * windowHeight;
});

const minSnapY = computed(() => snapPixelsSorted.value[0] ?? windowHeight * 0.1);

function touchClientY(e: PopupTouchEvent): number {
  const y = e.touches?.[0]?.clientY;
  return typeof y === 'number' ? y : 0;
}

function doubleRaf(cb: () => void): void {
  const raf =
    typeof globalThis.requestAnimationFrame === 'function'
      ? globalThis.requestAnimationFrame.bind(globalThis)
      : (fn: FrameRequestCallback) => globalThis.setTimeout(fn, 16);
  raf(() => {
    raf(cb);
  });
}

function preventTouchMoveIfPossible(e: unknown): void {
  // #ifdef H5
  const ev = e as { preventDefault?: () => void };
  ev.preventDefault?.();
  // #endif
}

function applyRubberBand(nextY: number): number {
  const floor = minSnapY.value;
  if (nextY < floor) {
    return floor + (nextY - floor) * 0.3;
  }
  return nextY;
}

function updateVelocitySample(currentY: number): void {
  const currentTime = Date.now();
  const timeDelta = currentTime - lastTime;
  if (timeDelta > 0) {
    velocity = (currentY - lastY) / timeDelta;
  }
  lastY = currentY;
  lastTime = currentTime;
}

function resolveSnapTarget(currentY: number, vel: number): number {
  const snaps = snapPixelsSorted.value;
  const closeY = windowHeight;
  const candidates = [...snaps, closeY];

  if (vel > VELOCITY_THRESHOLD) {
    const down = candidates.filter(p => p > currentY + 2);
    return down.length ? Math.min(...down) : closeY;
  }
  if (vel < -VELOCITY_THRESHOLD) {
    const up = candidates.filter(p => p < currentY - 2);
    return up.length ? Math.max(...up) : (snaps[0] ?? currentY);
  }

  return candidates.reduce((best, p) =>
    Math.abs(p - currentY) < Math.abs(best - currentY) ? p : best
  );
}

function finalizeSheetPosition(): void {
  const current = translateY.value;
  const target = resolveSnapTarget(current, velocity);

  if (target >= windowHeight - 2) {
    translateY.value = windowHeight;
    emit('update:modelValue', false);
    return;
  }

  translateY.value = target;
}

watch(
  () => props.modelValue,
  (val, oldVal) => {
    if (val !== oldVal) emit(val ? 'open' : 'close');
    if (props.position === 'bottom' && props.draggable) {
      if (val) {
        translateY.value = windowHeight;
        const target = initialOpenTranslateY.value;
        doubleRaf(() => {
          translateY.value = target;
        });
      } else {
        translateY.value = windowHeight;
      }
    }
  }
);

function onHandleTouchStart(e: PopupTouchEvent) {
  if (!props.draggable || props.position !== 'bottom') return;
  isPanelGestureActive.value = true;
  startY = touchClientY(e);
  startTranslateY = translateY.value;
  lastY = startY;
  lastTime = Date.now();
  velocity = 0;
}

function onHandleTouchMove(e: PopupTouchEvent) {
  if (!props.draggable || props.position !== 'bottom') return;
  if (!isPanelGestureActive.value) return;
  const currentY = touchClientY(e);
  updateVelocitySample(currentY);
  const deltaY = currentY - startY;
  let nextY = startTranslateY + deltaY;
  nextY = applyRubberBand(nextY);
  translateY.value = nextY;
  preventTouchMoveIfPossible(e);
}

function onHandleTouchEnd() {
  if (!props.draggable || props.position !== 'bottom') return;
  if (!isPanelGestureActive.value) return;
  isPanelGestureActive.value = false;
  finalizeSheetPosition();
}

function onContentScroll(e: { detail?: { scrollTop?: number; scrollHeight?: number } }) {
  const d = e.detail;
  internalContentScrollTop.value = typeof d?.scrollTop === 'number' ? d.scrollTop : 0;
  if (typeof d?.scrollHeight === 'number' && d.scrollHeight > 0) {
    internalContentScrollHeight.value = d.scrollHeight;
  }
}

function resolveNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function getGestureScrollTop(): number {
  return Math.max(0, resolveNumber(props.contentScrollTop, internalContentScrollTop.value));
}

function getGestureScrollHeight(): number {
  return Math.max(0, resolveNumber(props.contentScrollHeight, internalContentScrollHeight.value));
}

function getGestureViewportHeight(): number {
  return Math.max(0, resolveNumber(props.contentViewportHeight, windowHeight - translateY.value));
}

function canExpandSheet(): boolean {
  return translateY.value > minSnapY.value + 2;
}

function expandSheetFromContentLower(): void {
  if (!props.draggable || props.position !== 'bottom' || isPanelGestureActive.value) return;
  if (!canExpandSheet()) return;
  velocity = -VELOCITY_THRESHOLD - 0.1;
  finalizeSheetPosition();
}

function isContentAtLower(): boolean {
  const vh = getGestureViewportHeight();
  const sh = getGestureScrollHeight();
  if (vh <= 0 || sh <= 0) return false;
  return getGestureScrollTop() + vh >= sh - SCROLL_BOUND_EPS;
}

watch(
  () => [props.contentScrollTop, props.contentScrollHeight, props.contentViewportHeight] as const,
  () => {
    if (isContentAtLower()) expandSheetFromContentLower();
  }
);

const panelStyle = computed(() => {
  if (props.position === 'bottom' && props.draggable) {
    const durationMs =
      typeof transitionConfig.value.duration === 'number' ? transitionConfig.value.duration : 300;
    const visibleHeight = Math.max(0, windowHeight - translateY.value);
    return {
      ...transitionStyles.value,
      height: `${visibleHeight}px`,
      transform: 'none',
      transition: isPanelGestureActive.value
        ? 'none'
        : `height ${Math.max(durationMs, 260) * 0.001}s cubic-bezier(0.18, 0.89, 0.32, 1.28)`,
      ...(popupWidth.value ? { width: popupWidth.value } : {}),
      borderRadius: props.round
        ? `var(--lk-popup-radius, var(--lk-rpx-24)) var(--lk-popup-radius, var(--lk-rpx-24)) 0 0`
        : '0',
    };
  }
  return {
    ...transitionStyles.value,
    ...(popupHeight.value ? { height: popupHeight.value } : {}),
    ...(popupWidth.value ? { width: popupWidth.value } : {}),
  };
});
</script>

<template>
  <lk-overlay
    v-if="overlay && display"
    :show="modelValue"
    :z-index="zIndex"
    :lock-scroll="lockScroll"
    :close-on-click="closeOnOverlayResolved"
    @click="onOverlayClick"
  />
  <view v-if="display" :class="wrapperClass" :style="wrapperStyle" @touchmove.stop>
    <view class="lk-popup__panel" :class="transitionClasses" :style="panelStyle">
      <view
        v-if="position === 'bottom' && draggable"
        class="lk-popup__drag-handle"
        @touchstart.stop="onHandleTouchStart"
        @touchmove.stop="onHandleTouchMove"
        @touchend="onHandleTouchEnd"
        @touchcancel="onHandleTouchEnd"
      >
        <view class="lk-popup__drag-bar" />
      </view>

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

      <scroll-view
        v-if="isBottomDraggable"
        class="lk-popup__content"
        :scroll-y="!isPanelGestureActive"
        :show-scrollbar="false"
        @scroll="onContentScroll"
        @scrolltolower="expandSheetFromContentLower"
      >
        <slot />
      </scroll-view>

      <!-- #ifdef H5 -->
      <view v-if="!isBottomDraggable" class="lk-popup__content">
        <slot />
      </view>
      <!-- #endif -->

      <!-- #ifdef MP || APP-PLUS -->
      <scroll-view
        v-if="!isBottomDraggable"
        class="lk-popup__content"
        scroll-y
        :show-scrollbar="false"
      >
        <slot />
      </scroll-view>
      <!-- #endif -->

      <view v-if="safeArea && position === 'bottom'" class="lk-popup__safe" />
    </view>
  </view>
</template>

<style lang="scss">
@use './lk-popup.scss';
</style>
