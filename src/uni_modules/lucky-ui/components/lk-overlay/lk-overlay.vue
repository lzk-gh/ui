<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { overlayProps, overlayEmits } from './overlay.props';
import { useTransition } from '../../composables/useTransition';

defineOptions({ name: 'LkOverlay' });

const props = defineProps(overlayProps);
const emit = defineEmits(overlayEmits);

// 外部受控值（优先使用 modelValue）
const externalShow = computed(() => (props.modelValue ?? props.show) as boolean);

// ==================== 动画管理 ====================
const {
  display,
  classes: transitionClasses,
  styles: transitionStyles,
} = useTransition(
  () => externalShow.value,
  {
    name: 'fade',
    duration: () => props.duration,
  },
  {
    onAfterEnter: () => emit('after-enter'),
    onAfterLeave: () => emit('after-leave'),
  }
);

function onClick(event?: unknown) {
  emit('click', event);
  if (props.closeOnClick) {
    emit('update:show', false);
    emit('update:modelValue', false);
    emit('close', event);
  }
}

function lock() {
  if (!props.lockScroll) return;
  // #ifdef H5
  document.body.style.overflow = 'hidden';
  // #endif
}
function unlock() {
  if (!props.lockScroll) return;
  // #ifdef H5
  document.body.style.overflow = '';
  // #endif
}

// 滚动锁定逻辑随外部显示状态切换
watch(externalShow, v => {
  if (v) {
    emit('open');
    lock();
  } else {
    unlock();
  }
}, { immediate: true });

onMounted(() => {
  if (externalShow.value) lock();
});
onBeforeUnmount(unlock);

function onTouchMove(e: TouchEvent) {
  emit('touchmove', e);
  if (props.lockScroll) {
    e.preventDefault();
  }
}
</script>

<template>
  <view
    v-if="display"
    :id="id"
    class="lk-overlay"
    :class="[customClass, transitionClasses]"
    :style="[
      {
        zIndex: props.zIndex,
        '--lk-overlay-bg': props.background || `rgba(0,0,0,${props.opacity})`,
      },
      transitionStyles,
      customStyle as any,
    ]"
    @tap="onClick"
    @touchmove="onTouchMove"
  >
    <slot />
  </view>
</template>

<style lang="scss">
@use './lk-overlay.scss';
</style>
