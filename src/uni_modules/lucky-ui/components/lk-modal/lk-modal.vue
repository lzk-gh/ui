<script setup lang="ts">
import { computed, watch } from 'vue';
import LkOverlay from '../lk-overlay/lk-overlay.vue';
import { modalProps, modalEmits } from './modal.props';
import {
  useTransition,
  ANIMATION_PRESETS,
  type TransitionConfig,
} from '@/uni_modules/lucky-ui/composables/useTransition';

defineOptions({ name: 'LkModal' });

const props = defineProps(modalProps);

const emit = defineEmits(modalEmits);

// ==================== 动画配置计算 ====================
const transitionConfig = computed<TransitionConfig>(() => {
  // 如果传了 animationType，则完全自定义
  if (props.animationType) {
    return {
      name: props.animationType,
      duration: props.duration,
      delay: props.delay,
      easing: props.easing,
    };
  }

  // 否则走预设
  const preset = ANIMATION_PRESETS[props.animation] || ANIMATION_PRESETS.scale;
  return {
    name: preset.animation,
    duration: props.duration ?? preset.duration,
    delay: props.delay ?? preset.delay ?? 0,
    easing: props.easing ?? preset.easing,
  };
});

// ==================== useTransition ====================
const {
  classes: transitionClasses,
  styles: transitionStyles,
  display,
  state,
} = useTransition(() => props.modelValue, transitionConfig.value, {
  onAfterEnter: () => emit('open'),
  onAfterLeave: () => emit('close'),
});

// ==================== 关闭逻辑 ====================
async function close() {
  // 如果正在离开，直接返回（防止重复触发）
  if (state.value.leaving) return;

  // 如果 confirm 返回 Promise，会等待 Promise 完成后再关闭
  const result = emit('confirm');
  if (result instanceof Promise) {
    try {
      await result;
    } catch (err) {
      // 用户可能 reject，取消关闭
      return;
    }
  }

  emit('update:modelValue', false);
}

function onOverlayClick() {
  if (props.closeOnOverlay) close();
}

function cancel() {
  emit('cancel');
  close();
}

// ==================== 同步外部 v-model 变化 ====================
watch(
  () => props.modelValue,
  val => {
    // 外部强制关闭时，如果正在进入中，也要走离开动画
    if (!val && state.value.entering) {
      // 手动触发 leave
      setTimeout(() => {
        if (state.value.entering) {
          state.value.entering = false;
          state.value.leaving = true;
          // ... 正常 leave 流程会被 watch 触发
        }
      }, 0);
    }
  }
);
</script>

<template>
  <!-- 遮罩层保持原始 show，避免动画干扰 -->
  <lk-overlay
    :show="props.modelValue"
    :z-index="zIndex"
    @update:show="close"
    @click="onOverlayClick"
  />

  <!-- 模态框主体：动画容器 -->
  <view v-if="display" class="lk-modal" :style="{ zIndex: zIndex + 1 }">
    <view
      class="lk-modal__panel"
      :class="transitionClasses"
      :style="{ ...transitionStyles, width }"
    >
      <!-- Header -->
      <view class="lk-modal__header" v-if="showHeader && (title || showClose || $slots.header)">
        <slot name="header">
          <text class="lk-modal__title">{{ title }}</text>
        </slot>
        <view v-if="showClose" class="lk-modal__close" @click="close">×</view>
      </view>

      <!-- Body -->
      <view class="lk-modal__body">
        <slot />
      </view>

      <!-- Footer -->
      <view class="lk-modal__footer" v-if="showFooter">
        <slot name="footer">
          <lk-button size="small" variant="outline" @click="cancel">取消</lk-button>
          <lk-button size="small" @click="close">确定</lk-button>
        </slot>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.lk-modal {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 90%;
  /* 外层仅负责定位与居中，不参与动画 transform，避免冲突 */

  &__panel {
    background: var(--lk-color-bg-surface);
    color: var(--lk-color-text);
    border-radius: var(--lk-radius-lg);
    box-shadow: var(--lk-shadow-lg);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  &__header {
    padding: 32rpx 36rpx 24rpx;
    font-size: 32rpx;
    font-weight: 600;
    position: relative;
    border-bottom: 1rpx solid var(--lk-color-border);
  }

  &__title {
    display: inline-block;
  }

  &__close {
    position: absolute;
    right: 24rpx;
    top: 50%;
    transform: translateY(-50%);
    font-size: 48rpx;
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
    padding: 32rpx 36rpx;
    font-size: 28rpx;
    line-height: 1.6;
    flex: 1;
  }

  &__footer {
    padding: 24rpx 36rpx 36rpx;
    display: flex;
    gap: 24rpx;
    justify-content: flex-end;
    border-top: 1rpx solid var(--lk-color-border);
  }
}
</style>
