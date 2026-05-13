<script setup lang="ts">
import { computed } from 'vue';
import LkOverlay from '../lk-overlay/lk-overlay.vue';
import LkIcon from '../lk-icon/lk-icon.vue';
import LkButton from '../lk-button/lk-button.vue';
import { modalProps, modalEmits } from './modal.props';
import { useLocale } from '../../composables/useLocale';
import {
  useTransition,
  ANIMATION_PRESETS,
  type TransitionConfig,
  type TransitionName,
} from '@/uni_modules/lucky-ui/composables/useTransition';

defineOptions({ name: 'LkModal' });

const props = defineProps(modalProps);

const emit = defineEmits(modalEmits);
const { t } = useLocale('modal');

const resolvedConfirmText = computed(() => props.confirmText || t('confirm'));
const resolvedCancelText = computed(() => props.cancelText || t('cancel'));

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

const transitionName = computed<TransitionName>(() => {
  const name = transitionConfig.value.name;
  if (typeof name === 'string') return name as TransitionName;
  return 'fade';
});

const transitionDuration = computed<number>(() => {
  const duration = transitionConfig.value.duration;
  return typeof duration === 'number' ? duration : 300;
});

const transitionDelay = computed<number>(() => {
  const delay = transitionConfig.value.delay;
  return typeof delay === 'number' ? delay : 0;
});

const transitionEasing = computed<string>(() => {
  const easing = transitionConfig.value.easing;
  return typeof easing === 'string' ? easing : 'ease';
});

// ==================== useTransition ====================
const {
  classes: transitionClasses,
  styles: transitionStyles,
  display,
  state,
} = useTransition(() => props.modelValue, {
  name: () => transitionName.value,
  duration: () => transitionDuration.value,
  delay: () => transitionDelay.value,
  easing: () => transitionEasing.value,
}, {
  onAfterEnter: () => {
    emit('open');
    emit('after-enter');
  },
  onAfterLeave: () => {
    emit('close');
    emit('after-leave');
  },
});

// ==================== 关闭逻辑 ====================
function close() {
  // 如果正在离开，直接返回（防止重复触发）
  if (state.value.leaving) return;
  emit('update:modelValue', false);
}

function confirm() {
  if (state.value.leaving) return;
  emit('confirm');
  emit('update:modelValue', false);
}

function onOverlayClick() {
  emit('click-overlay');
  if (props.closeOnOverlay) close();
}

function cancel() {
  emit('cancel');
  close();
}

function onCloseClick() {
  emit('click-close');
  close();
}

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
      <view
        v-if="showHeader && (title || showClose || $slots.header)"
        class="lk-modal__header"
        :class="[`is-title-${titleAlign}`]"
      >
        <slot name="header">
          <text class="lk-modal__title">{{ title }}</text>
        </slot>
        <lk-icon v-if="showClose" name="x" size="48" class="lk-modal__close" @click="onCloseClick" />
      </view>

      <!-- Body -->
      <view class="lk-modal__body">
        <slot />
      </view>

      <!-- Footer -->
      <view
        v-if="showFooter"
        class="lk-modal__footer"
        :class="[`is-footer-${footerType}`, { 'has-cancel': showCancel }]"
      >
        <slot name="footer">
          <template v-if="footerType === 'button'">
            <lk-button
              v-if="showCancel"
              class="lk-modal__footer-btn lk-modal__footer-btn--cancel"
              block
              size="md"
              variant="soft"
              @click="cancel"
            >
              {{ resolvedCancelText }}
            </lk-button>
            <lk-button class="lk-modal__footer-btn" block size="md" variant="solid" @click="confirm">
              {{ resolvedConfirmText }}
            </lk-button>
          </template>
          <template v-else>
            <view
              v-if="showCancel"
              class="lk-modal__text-btn lk-modal__text-btn--cancel"
              @click="cancel"
            >
              {{ resolvedCancelText }}
            </view>
            <view class="lk-modal__text-btn lk-modal__text-btn--confirm" @click="confirm">
              {{ resolvedConfirmText }}
            </view>
          </template>
        </slot>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
