<script setup lang="ts">
import { computed, watch } from 'vue';
import LkOverlay from '../lk-overlay/lk-overlay.vue';
import LkIcon from '../lk-icon/lk-icon.vue';
import LkButton from '../lk-button/lk-button.vue';
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
  if ((result as any) instanceof Promise) {
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
      <view v-if="showHeader && (title || showClose || $slots.header)" class="lk-modal__header">
        <slot name="header">
          <text class="lk-modal__title">{{ title }}</text>
        </slot>
        <lk-icon v-if="showClose" name="x" size="40" class="lk-modal__close" @click="close" />
      </view>

      <!-- Body -->
      <view class="lk-modal__body">
        <slot />
      </view>

      <!-- Footer -->
      <view v-if="showFooter" class="lk-modal__footer">
        <slot name="footer">
          <lk-button class="lk-modal__footer-btn" block size="md" variant="soft" @click="cancel">取消</lk-button>
          <lk-button class="lk-modal__footer-btn" block size="md" variant="solid" @click="close">确定</lk-button>
        </slot>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
