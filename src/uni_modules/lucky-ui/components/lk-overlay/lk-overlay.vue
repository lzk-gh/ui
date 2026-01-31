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
const timer = ref<number | null>(null);

const styleVar = computed(
  () =>
    ({
      zIndex: props.zIndex,
      '--lk-overlay-duration': `${props.duration}ms`,
      '--lk-overlay-bg': props.background || `rgba(0,0,0,${props.opacity})`,
      // 兼容不支持 CSS 变量的平台
      transitionDuration: `${props.duration}ms`,
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
    if (timer.value) {
      clearTimeout(timer.value);
      timer.value = null;
    }

    if (v) {
      if (!display.value) {
        display.value = true;
        anim.value = '';
        // 双重 rAF 确保渲染一帧后再应用动画类名，避免闪烁和无动画
        rAF(() => {
          rAF(() => {
            anim.value = 'enter';
            emit('after-enter');
          });
        });
      } else {
        // 已经在显示中（可能是正在离开时被打断），直接转为进入
        // 需要强制重绘吗？transition 会自动处理从当前 opacity -> 1
        anim.value = 'enter';
        emit('after-enter');
      }
      lock();
    } else {
      if (display.value) {
        anim.value = 'leave';
        timer.value = setTimeout(() => {
          display.value = false;
          emit('after-leave');
          timer.value = null;
        }, props.duration) as unknown as number;
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
