<script setup lang="ts">
import { ref, watch, computed, onUnmounted } from 'vue';

defineOptions({ name: 'LkToast' });

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  message: { type: String, default: '' },
  duration: { type: Number, default: 2000 },
  icon: { type: String, default: '' },
  position: { type: String, default: 'center' }, // top|center|bottom
  overlay: { type: Boolean, default: false },
  forbidClick: { type: Boolean, default: false },
});
const emit = defineEmits(['update:modelValue', 'open', 'close', 'after-leave']);

const show = computed(() => props.modelValue);
const leaving = ref(false);
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
      leaving.value = false;
      emit('open');
      scheduleClose();
    } else {
      if (!leaving.value) {
        // 外部直接设 false
        leaving.value = true;
        setTimeout(() => emit('after-leave'), 260);
        emit('close');
      }
    }
  }
);

function close() {
  if (!show.value) return;
  leaving.value = true;
  emit('close');
  setTimeout(() => {
    emit('update:modelValue', false);
    emit('after-leave');
  }, 260);
}

onUnmounted(() => clearTimers());
</script>

<template>
  <view v-if="overlay && show" class="lk-toast__overlay" :class="{ 'is-lock': forbidClick }" />
  <view v-if="show" class="lk-toast" :class="[`lk-toast--${position}`, { 'is-leave': leaving }]">
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
    animation: toast-in 0.26s;
  }
  &.is-leave .lk-toast__inner {
    animation: toast-out 0.26s forwards;
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
@keyframes toast-in {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes toast-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.85);
  }
}
</style>
