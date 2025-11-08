<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';

defineOptions({ name: 'LkOverlay' });

const props = defineProps({
  // 是否显示（受控）
  show: { type: Boolean, default: false },
  // v-model 兼容：modelValue（优先于 show）
  modelValue: { type: Boolean, default: undefined as unknown as boolean },
  // 层级
  zIndex: { type: Number, default: 1200 },
  // 透明度（当未设置 background 时生效）
  opacity: { type: Number, default: 0.55 },
  // 覆盖背景色（优先级高于 opacity）
  background: { type: String, default: '' },
  // 点击是否自动关闭（发出 update:show=false）
  closeOnClick: { type: Boolean, default: true },
  // 锁定滚动（H5: body overflow hidden；小程序：阻止touchmove）
  lockScroll: { type: Boolean, default: true },
  // 动画时长（ms）
  duration: { type: Number, default: 240 },
});
const emit = defineEmits([
  'click',
  'update:show',
  'update:modelValue',
  'after-enter',
  'after-leave',
]);

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
        requestAnimationFrame(() => {
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

<style scoped lang="scss">
.lk-overlay {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: var(--lk-overlay-bg, rgba(0, 0, 0, 0.55));
  display: flex;
  align-items: center;
  justify-content: center;
  // 初始无动画，按状态类处理
  &.is-enter {
    animation: lk-overlay-in var(--lk-overlay-duration, 0.24s) ease;
  }
  &.is-leave {
    animation: lk-overlay-out var(--lk-overlay-duration, 0.24s) ease forwards;
  }
}
@keyframes lk-overlay-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes lk-overlay-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
