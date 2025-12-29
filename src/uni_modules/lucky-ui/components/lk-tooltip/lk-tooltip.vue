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
  if (v) emit('show');
  else emit('hide');
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

<style lang="scss">
@use './index.scss';
</style>
