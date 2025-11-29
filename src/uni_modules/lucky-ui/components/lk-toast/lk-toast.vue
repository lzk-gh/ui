<script setup lang="ts">
import { ref, watch, computed, onUnmounted } from 'vue';
import { useTransition } from '@/uni_modules/lucky-ui/composables/useTransition';
import { toastProps, toastEmits } from './toast.props';

defineOptions({ name: 'LkToast' });

const props = defineProps(toastProps);
const emit = defineEmits(toastEmits);

const show = computed(() => props.modelValue);
let timer: any = null;

function clearTimers() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

function scheduleClose() {
  clearTimers();
  if (props.duration > 0) {
    timer = setTimeout(() => close(), props.duration);
  }
}

watch(
  () => props.modelValue,
  v => {
    if (v) {
      emit('open');
      scheduleClose();
    } else {
      emit('close');
      setTimeout(() => emit('after-leave'), 260);
    }
  }
);

function close() {
  if (!show.value) return;
  emit('update:modelValue', false);
  emit('close');
}

// 使用动画 composable
const {
  classes: transitionClasses,
  styles: transitionStyles,
  display,
} = useTransition(
  () => props.modelValue,
  { name: 'zoom-in', duration: 260, easing: 'ease-out' },
  {
    onAfterLeave: () => emit('after-leave'),
  }
);

onUnmounted(() => clearTimers());
</script>

<template>
  <view v-if="overlay && show" class="lk-toast__overlay" :class="{ 'is-lock': forbidClick }" />
  <view
    v-if="display"
    class="lk-toast"
    :class="[`lk-toast--${position}`, transitionClasses]"
    :style="transitionStyles"
  >
    <view class="lk-toast__inner">
      <lk-icon v-if="icon" :name="icon" size="44" class="lk-toast__icon" />
      <text class="lk-toast__text"
        ><slot>{{ message }}</slot></text
      >
    </view>
  </view>
</template>

<style scoped lang="scss">
.lk-toast__overlay {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.01);
  &.is-lock {
    pointer-events: auto;
  }
}
.lk-toast {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  z-index: 4000;
  &--center {
    top: 50%;
    transform: translate(-50%, -50%);
  }
  &--top {
    top: 12%;
  }
  &--bottom {
    bottom: 12%;
  }
  &__inner {
    max-width: 560rpx;
    min-width: 220rpx;
    padding: 32rpx 40rpx;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    color: #fff;
    border-radius: var(--lk-radius-lg);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16rpx;
  }
  &__text {
    font-size: 26rpx;
    text-align: center;
    line-height: 1.4;
  }
  &__icon {
    color: #fff;
  }
}
</style>
