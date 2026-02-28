<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick, getCurrentInstance } from 'vue';
import {
  useTransition,
  ANIMATION_PRESETS,
  type TransitionConfig,
} from '@/uni_modules/lucky-ui/composables/useTransition';
import { tooltipProps, tooltipEmits } from './tooltip.props';

defineOptions({ name: 'LkTooltip' });

const props = defineProps(tooltipProps);
const emit = defineEmits(tooltipEmits);
const instance = getCurrentInstance();
const popId = `lk-tooltip-pop-${instance?.uid ?? Math.floor(Math.random() * 1000000)}`;

const innerOpen = ref(false);
const resolvedPlacement = ref(props.placement);
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

let showTimer: ReturnType<typeof setTimeout> | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;

function doOpen(v = true) {
  if (props.disabled || props.always) return;
  if (open.value === v) return;
  open.value = v;
  if (v) emit('show');
  else emit('hide');
}

function onTriggerEnter() {
  if (props.always || props.trigger !== 'hover') return;
  if (hideTimer) clearTimeout(hideTimer);
  showTimer = setTimeout(() => doOpen(true), props.showDelay);
}
function onTriggerLeave() {
  if (props.always || props.trigger !== 'hover') return;
  if (showTimer) clearTimeout(showTimer);
  hideTimer = setTimeout(() => doOpen(false), props.hideDelay);
}
function onTriggerClick() {
  if (props.always || props.trigger !== 'click') return;
  doOpen(!open.value);
}
function onContentEnter() {
  if (props.always || props.trigger !== 'hover') return;
  if (hideTimer) clearTimeout(hideTimer);
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

watch(
  () => props.placement,
  v => {
    resolvedPlacement.value = v;
  }
);

function getFallbackPlacement(current: string, rect: Record<string, number>, vw: number, vh: number) {
  const edge = 12;
  const overflowTop = rect.top < edge;
  const overflowBottom = rect.bottom > vh - edge;
  const overflowLeft = rect.left < edge;
  const overflowRight = rect.right > vw - edge;

  if (current === 'top' && overflowTop) return 'bottom';
  if (current === 'bottom' && overflowBottom) return 'top';
  if (current === 'left' && overflowLeft) return 'right';
  if (current === 'right' && overflowRight) return 'left';

  if (overflowTop && !overflowBottom) return 'bottom';
  if (overflowBottom && !overflowTop) return 'top';
  if (overflowLeft && !overflowRight) return 'right';
  if (overflowRight && !overflowLeft) return 'left';

  return current;
}

function adjustPlacementByViewport() {
  if (!display.value) return;

  nextTick(() => {
    let query = (uni as any)?.createSelectorQuery?.();
    if (!query) return;
    if (query.in && instance?.proxy) query = query.in(instance.proxy);

    query
      .select(`#${popId}`)
      .boundingClientRect((rect: any) => {
        if (!rect) return;
        const sys = uni.getSystemInfoSync();
        const vw = sys.windowWidth || 375;
        const vh = sys.windowHeight || 667;
        resolvedPlacement.value = getFallbackPlacement(props.placement, rect, vw, vh) as any;
      })
      .exec();
  });
}

// 计算方位 class 与偏移变量
const placementClass = computed(() => `is-${resolvedPlacement.value}`);
const popStyle = computed(() => {
  const style: Record<string, string | number> = {
    '--lk-tooltip-offset': `${props.offset}rpx`,
    zIndex: props.zIndex,
  };
  if (props.width !== undefined && props.width !== null && props.width !== '') {
    style.width = typeof props.width === 'number' ? `${props.width}rpx` : String(props.width);
  }
  return style;
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
    name: defaultByPlacement[resolvedPlacement.value] || 'fade',
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

watch(
  () => display.value,
  val => {
    if (val) adjustPlacementByViewport();
  },
  { immediate: true }
);

watch(
  () => open.value,
  val => {
    if (val) adjustPlacementByViewport();
  }
);
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
      :id="popId"
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
