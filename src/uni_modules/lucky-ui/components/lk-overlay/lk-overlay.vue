<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { overlayProps, overlayEmits } from './overlay.props';

defineOptions({ name: 'LkOverlay' });

/**
 * requestAnimationFrame 兼容处理
 * 小程序环境中 requestAnimationFrame 不可用，使用 setTimeout 作为 fallback
 */
const hasRAF = typeof requestAnimationFrame === 'function';
const rAF = (cb: () => void): number =>
  hasRAF ? (requestAnimationFrame as any)(cb) : (setTimeout(cb, 16) as unknown as number);

const props = defineProps(overlayProps);
const emit = defineEmits(overlayEmits);

// 内部控制显示以支持离场动画
const display = ref(false);
const anim = ref<'enter' | 'leave' | ''>('');

const styleVar = computed(
  () =>
    ({
      zIndex: props.zIndex,
      '--lk-overlay-duration': props.duration + 'ms',
      '--lk-overlay-bg': props.background || `rgba(0,0,0,${props.opacity})`,
      // 兼容不支持 CSS 变量的平台
      animationDuration: props.duration + 'ms',
    }) as Record<string, string | number>
);

// 外部受控值（优先使用 modelValue）
const externalShow = computed(() => (props.modelValue ?? props.show) as boolean);

function onClick() {
  emit('click');
  if (props.closeOnClick) {
    emit('update:show', false);
    emit('update:modelValue', false);
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

watch(
  externalShow,
  v => {
    if (v) {
      if (!display.value) {
        display.value = true;
        // 下一帧触发进入动画
        rAF(() => {
          anim.value = 'enter';
          emit('after-enter');
        });
      } else {
        anim.value = 'enter';
        emit('after-enter');
      }
      lock();
    } else {
      if (display.value) {
        anim.value = 'leave';
        setTimeout(() => {
          display.value = false;
          emit('after-leave');
        }, props.duration);
      }
      unlock();
    }
  },
  { immediate: true }
);
onMounted(() => {
  if (externalShow.value) lock();
});
onBeforeUnmount(unlock);

function onTouchMove(e: TouchEvent) {
  if (props.lockScroll) {
    e.preventDefault();
  }
}
</script>

<template>
  <view
    v-if="display"
    class="lk-overlay"
    :class="{ 'is-enter': anim === 'enter', 'is-leave': anim === 'leave' }"
    :style="styleVar"
    @click="onClick"
    @touchmove="onTouchMove"
  >
    <slot />
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
