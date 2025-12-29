<script setup lang="ts">
import { computed } from 'vue';
import LkOverlay from '../lk-overlay/lk-overlay.vue';
import { drawerProps, drawerEmits } from './drawer.props';
import {
  useTransition,
  ANIMATION_PRESETS,
  type TransitionConfig,
} from '@/uni_modules/lucky-ui/composables/useTransition';

defineOptions({ name: 'LkDrawer' });

/**
 * 抽屉组件
 * - position/side: 抽屉出现方向，支持 left | right | top | bottom
 *   为了向后兼容，保留 side；若同时传入，position 优先生效。
 */
const props = defineProps(drawerProps);
const emit = defineEmits(drawerEmits);

// 统一方向，position 优先，其次 side
const pos = computed<'left' | 'right' | 'top' | 'bottom'>(
  () => (props.position || props.side || 'right') as any
);

const defaultByPos: Record<string, NonNullable<TransitionConfig['name']>> = {
  left: 'slide-right',
  right: 'slide-left',
  top: 'slide-down',
  bottom: 'slide-up',
};

const transitionConfig = computed<TransitionConfig>(() => {
  if (props.animationType) {
    return {
      name: props.animationType,
      duration: props.duration ?? 260,
      delay: props.delay ?? 0,
      easing: props.easing ?? 'ease-out',
    };
  }
  if (props.animation && ANIMATION_PRESETS[props.animation]) {
    const p = ANIMATION_PRESETS[props.animation];
    return {
      name: p.animation,
      duration: props.duration ?? p.duration ?? 260,
      delay: props.delay ?? p.delay ?? 0,
      easing: props.easing ?? p.easing ?? 'ease-out',
    };
  }
  const name = defaultByPos[pos.value] || 'slide-left';
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

function overlayClick() {
  if (props.closeOnOverlay) emit('update:modelValue', false);
}

const cls = computed(() => ['lk-drawer', `lk-drawer--${pos.value}`]);
const wrapperStyle = computed(() => {
  const style: Record<string, string | number> = { zIndex: (props.zIndex as number) + 1 };
  if (pos.value === 'left' || pos.value === 'right') {
    style.width = props.width;
  } else {
    style.height = props.height;
    style.width = '100%';
  }
  return style;
});
</script>

<template>
  <lk-overlay
    v-if="overlay && display"
    :show="true"
    :z-index="zIndex"
    :lock-scroll="lockScroll"
    @click="overlayClick"
  />
  <view v-if="display" :class="cls" :style="wrapperStyle" @touchmove.stop>
    <view class="lk-drawer__panel" :class="transitionClasses" :style="transitionStyles">
      <view v-if="title || showClose" class="lk-drawer__header">
        <text v-if="title" class="lk-drawer__title">{{ title }}</text>
        <view v-if="showClose" class="lk-drawer__close" @click="emit('update:modelValue', false)"
          >×</view
        >
      </view>
      <view class="lk-drawer__body">
        <slot />
      </view>
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
