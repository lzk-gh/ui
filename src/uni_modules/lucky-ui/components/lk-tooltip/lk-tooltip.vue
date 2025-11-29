<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import {
  useTransition,
  ANIMATION_PRESETS,
  type TransitionConfig,
} from '@/uni_modules/lucky-ui/composables/useTransition';
import { tooltipProps, tooltipEmits } from './tooltip.props';

defineOptions({ name: 'LkTooltip' });

const props = defineProps(tooltipProps);
const emit = defineEmits(tooltipEmits);

const innerOpen = ref(false);
const open = computed({
  get: () => {
    if (props.always) return true;
    return props.modelValue === undefined ? innerOpen.value : props.modelValue;
  },
  set: (v: boolean) => {
    if (props.always) return; // 常驻时忽略外部变更
    if (props.modelValue === undefined) innerOpen.value = v;
    emit('update:modelValue', v);
  },
});

let showTimer: any = null;
let hideTimer: any = null;

function clearTimers() {
  if (showTimer) {
    clearTimeout(showTimer);
    showTimer = null;
  }
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
}

function doOpen(v = true) {
  if (props.disabled || props.always) return;
  if (open.value === v) return;
  open.value = v;
  emit(v ? 'show' : 'hide');
}

function onTriggerEnter() {
  if (props.always || props.trigger !== 'hover') return;
  clearTimeout(hideTimer);
  showTimer = setTimeout(() => doOpen(true), props.showDelay);
}
function onTriggerLeave() {
  if (props.always || props.trigger !== 'hover') return;
  clearTimeout(showTimer);
  hideTimer = setTimeout(() => doOpen(false), props.hideDelay);
}
function onTriggerClick() {
  if (props.always || props.trigger !== 'click') return;
  doOpen(!open.value);
}
function onContentEnter() {
  if (props.always || props.trigger !== 'hover') return;
  clearTimeout(hideTimer);
}
function onContentLeave() {
  if (props.always || props.trigger !== 'hover') return;
  hideTimer = setTimeout(() => doOpen(false), props.hideDelay);
}

watch(
  () => props.disabled,
  v => {
    if (v) doOpen(false);
  }
);

// 计算方位 class 与偏移变量
const placementClass = computed(() => `is-${props.placement}`);
const popStyle = computed(() => {
  const style: Record<string, any> = {
    '--lk-tooltip-offset': `${props.offset}rpx`,
  };
  if (props.width !== undefined && props.width !== null && props.width !== '') {
    style.width = typeof props.width === 'number' ? `${props.width}rpx` : String(props.width);
  }
  return style as any;
});

onMounted(() => {
  if (props.always || props.disabled) return;
  // 仅非受控时生效
  if (props.modelValue !== undefined) return;
  if (props.defaultOpen) {
    innerOpen.value = true;
    emit('show');
  }
});

// 动画：默认按 placement 给出轻微的方向感
const defaultByPlacement: Record<string, NonNullable<TransitionConfig['name']>> = {
  top: 'fade-down',
  bottom: 'fade-up',
  left: 'fade-right',
  right: 'fade-left',
};

const transitionConfig = computed<TransitionConfig>(() => {
  if (props.animationType)
    return {
      name: props.animationType,
      duration: props.duration,
      delay: props.delay,
      easing: props.easing,
    };
  if (props.animation && ANIMATION_PRESETS[props.animation]) {
    const p = ANIMATION_PRESETS[props.animation];
    return {
      name: p.animation,
      duration: props.duration ?? p.duration ?? 180,
      delay: props.delay ?? p.delay ?? 0,
      easing: props.easing ?? p.easing ?? 'ease-out',
    };
  }
  return {
    name: defaultByPlacement[props.placement] || 'fade',
    duration: props.duration,
    delay: props.delay,
    easing: props.easing,
  };
});

const {
  classes: tipClasses,
  styles: tipStyles,
  display,
} = useTransition(() => open.value, transitionConfig.value);
</script>

<template>
  <view
    class="lk-tooltip"
    :class="[disabled && 'is-disabled', always && 'is-always']"
    @mouseenter="onTriggerEnter"
    @mouseleave="onTriggerLeave"
    @click="onTriggerClick"
  >
    <view class="lk-tooltip__trigger">
      <slot />
    </view>

    <view
      v-if="display"
      class="lk-tooltip__pop lk-elevated"
      :class="placementClass"
      :style="{ ...popStyle, ...tipStyles }"
      @mouseenter="onContentEnter"
      @mouseleave="onContentLeave"
    >
      <view class="lk-tooltip__content" :class="tipClasses">
        <slot name="content">
          <text>{{ content }}</text>
        </slot>
      </view>
      <view class="lk-tooltip__arrow" />
    </view>
  </view>
</template>

<style scoped lang="scss">
.lk-tooltip {
  position: relative;
  display: inline-block;
  &.is-disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  &__trigger {
    display: inline-flex;
    align-items: center;
  }

  &__pop {
    position: absolute;
    z-index: 2400;
    background: var(--lk-color-bg-surface);
    color: var(--lk-color-text);
    border: 2rpx solid var(--lk-color-border-weak);
    border-radius: var(--lk-radius-md);
    padding: 10rpx 14rpx;
    font-size: 24rpx;
    line-height: 1.4;
    box-shadow: var(--lk-shadow-base);
    /* 动画交给 useTransition 控制 */

    // 默认 top
    top: auto;
    bottom: calc(100% + var(--lk-tooltip-offset, 8rpx));
    left: 50%;
    transform: translateX(-50%);

    &.is-bottom {
      top: calc(100% + var(--lk-tooltip-offset, 8rpx));
      bottom: auto;
      left: 50%;
      transform: translateX(-50%);
    }
    &.is-left {
      right: calc(100% + var(--lk-tooltip-offset, 8rpx));
      left: auto;
      top: 50%;
      bottom: auto;
      transform: translateY(-50%);
    }
    &.is-right {
      left: calc(100% + var(--lk-tooltip-offset, 8rpx));
      right: auto;
      top: 50%;
      bottom: auto;
      transform: translateY(-50%);
    }
  }

  &__content {
    display: block;
  }

  &__arrow {
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
  }

  // 箭头：根据不同方向绘制
  &__pop.is-top &__arrow {
    /* pop 在上方，即箭头朝下，连接触发元素的上边 */
    left: 50%;
    bottom: -8rpx;
    transform: translateX(-50%);
    border-width: 8rpx 8rpx 0 8rpx;
    border-color: var(--lk-color-border-weak) transparent transparent transparent;
  }
  &__pop.is-top::after {
    // 内箭头填充背景，制造边框效果
    content: '';
    position: absolute;
    left: 50%;
    bottom: -6rpx;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 6rpx 6rpx 0 6rpx;
    border-color: var(--lk-color-bg-surface) transparent transparent transparent;
  }

  &__pop.is-bottom &__arrow {
    left: 50%;
    top: -8rpx;
    transform: translateX(-50%);
    border-width: 0 8rpx 8rpx 8rpx;
    border-color: transparent transparent var(--lk-color-border-weak) transparent;
  }
  &__pop.is-bottom::after {
    content: '';
    position: absolute;
    left: 50%;
    top: -6rpx;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 6rpx 6rpx 6rpx;
    border-color: transparent transparent var(--lk-color-bg-surface) transparent;
  }

  &__pop.is-left &__arrow {
    top: 50%;
    right: -8rpx;
    transform: translateY(-50%);
    border-width: 8rpx 0 8rpx 8rpx;
    border-color: transparent transparent transparent var(--lk-color-border-weak);
  }
  &__pop.is-left::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -6rpx;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 6rpx 0 6rpx 6rpx;
    border-color: transparent transparent transparent var(--lk-color-bg-surface);
  }

  &__pop.is-right &__arrow {
    top: 50%;
    left: -8rpx;
    transform: translateY(-50%);
    border-width: 8rpx 8rpx 8rpx 0;
    border-color: transparent var(--lk-color-border-weak) transparent transparent;
  }
  &__pop.is-right::after {
    content: '';
    position: absolute;
    top: 50%;
    left: -6rpx;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 6rpx 6rpx 6rpx 0;
    border-color: transparent var(--lk-color-bg-surface) transparent transparent;
  }
}

/* 关键帧由 useTransition 的类与过渡控制，不再需要本地 keyframes */
</style>
