<script setup lang="ts">
import { computed } from 'vue';
import LkOverlay from '../lk-overlay/lk-overlay.vue';

defineOptions({ name: 'LkModal' });

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  width: { type: String, default: '600rpx' },
  showClose: { type: Boolean, default: true },
  closeOnOverlay: { type: Boolean, default: true },
  zIndex: { type: Number, default: 1300 },
  showHeader: { type: Boolean, default: true },
  showFooter: { type: Boolean, default: true }
});
const emit = defineEmits(['update:modelValue','open','close','confirm','cancel']);

function close() {
  emit('update:modelValue', false);
  emit('close');
}
function onOverlayClick() {
  if(props.closeOnOverlay) close();
}
function onOpen() {
  emit('open');
}
function confirm() {
  emit('confirm');
}
function cancel() {
  emit('cancel');
  close();
}
const show = computed(()=> props.modelValue);
</script>

<template>
  <lk-overlay :show="show" :z-index="zIndex" @update:show="close" @click="onOverlayClick"/>
  <view
      class="lk-modal"
      :style="{ zIndex: zIndex + 1, width }"
  >
    <view class="lk-modal__header" v-if="show && showHeader && (title || showClose || $slots.header)">
      <slot name="header">
        <text class="lk-modal__title">{{ title }}</text>
      </slot>
      <view v-if="showClose" class="lk-modal__close" @click="close">×</view>
    </view>
    <view v-if="show" class="lk-modal__body">
      <slot />
    </view>
    <view class="lk-modal__footer" v-if="show && showFooter">
      <slot name="footer">
        <lk-button size="small" variant="outline" @click="cancel">取消</lk-button>
        <lk-button size="small" @click="confirm">确定</lk-button>
      </slot>
    </view>
  </view>
</template>

<style scoped lang="scss">
.lk-modal {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  background: var(--lk-color-bg-surface);
  color: var(--lk-color-text);
  border-radius: var(--lk-radius-lg);
  box-shadow: var(--lk-shadow-lg);
  display: flex;
  flex-direction: column;
  max-width: 90%;
  animation: lk-modal-in .25s var(--lk-transition-fast);

  &__header {
    padding: 32rpx 36rpx 24rpx;
    font-size: 32rpx;
    font-weight: 600;
    position: relative;
  }
  &__title { display: inline-block; }
  &__close {
    position: absolute;
    right: 24rpx;
    top: 24rpx;
    font-size: 40rpx;
    line-height: 1;
    color: var(--lk-color-text-secondary);
    padding: 8rpx;
    border-radius: var(--lk-radius-sm);
    &:active {
      background: var(--lk-color-primary-bg-soft);
      color: var(--lk-color-primary);
    }
  }
  &__body {
    padding: 0 36rpx 32rpx;
    font-size: 28rpx;
    line-height: 1.6;
  }
  &__footer {
    padding: 0 36rpx 36rpx;
    display: flex;
    gap: 24rpx;
    justify-content: flex-end;
  }
}

@keyframes lk-modal-in {
  from { opacity:0; transform: translate(-50%,-46%); }
  to { opacity:1; transform: translate(-50%,-50%); }
}
</style>