<script setup lang="ts">
import { watch, computed, onUnmounted } from 'vue';
import { useTransition } from '@/uni_modules/lucky-ui/composables/useTransition';
import { toastProps, toastEmits } from './toast.props';

defineOptions({ name: 'LkToast' });

const props = defineProps(toastProps);
const emit = defineEmits(toastEmits);

const show = computed(() => props.modelValue);
let timer: ReturnType<typeof setTimeout> | null = null;

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
  { name: props.transition, duration: 260, easing: 'ease-out' },
  {
    onAfterLeave: () => emit('after-leave'),
  }
);

onUnmounted(() => clearTimers());
</script>

<template>
  <view v-if="overlay && show" class="lk-toast__overlay" :class="{ 'is-lock': forbidClick }" :style="{ zIndex }" />
  <view
    v-if="display"
    class="lk-toast"
    :class="[`lk-toast--${position}`]"
    :style="{ zIndex: zIndex + 1 }"
  >
    <view class="lk-toast__inner" :class="transitionClasses" :style="transitionStyles">
      <text class="lk-toast__text"
        ><slot>{{ message }}</slot></text
      >
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
