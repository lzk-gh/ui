<script setup lang="ts">
import { watch, defineProps, defineEmits } from 'vue';
import LkPopup from '../lk-popup/lk-popup.vue';
import {
  ANIMATION_PRESETS,
  type TransitionConfig,
} from '@/uni_modules/lucky-ui/composables/useTransition';

defineOptions({ name: 'LkActionSheet' });

interface Action {
  name: string;
  sub?: string;
  disabled?: boolean;
  color?: string;
  loading?: boolean;
}

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  actions: { type: Array as () => Action[], default: () => [] },
  cancelText: { type: String, default: '取消' },
  closeOnClickAction: { type: Boolean, default: true },
  safeArea: { type: Boolean, default: true },
  // 透传动画到 Popup（默认使用 bottom 方向的 slide-up）
  animation: { type: String as () => keyof typeof ANIMATION_PRESETS, default: undefined },
  animationType: { type: String as () => TransitionConfig['name'], default: undefined },
  duration: { type: Number, default: undefined },
  delay: { type: Number, default: undefined },
  easing: { type: String as () => TransitionConfig['easing'], default: undefined },
});

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void;
  (e: 'select', payload: { action: Action; index: number }): void;
  (e: 'cancel'): void;
  (e: 'open'): void;
  (e: 'close'): void;
}>();

watch(
  () => props.modelValue,
  v => (v ? emit('open') : emit('close'))
);

function hide() {
  emit('update:modelValue', false);
}
function onSelect(act: Action, idx: number) {
  if (act.disabled || act.loading) return;
  emit('select', { action: act, index: idx });
  if (props.closeOnClickAction) hide();
}
function cancel() {
  emit('cancel');
  hide();
}

/* 通过 popup 的 update:modelValue 事件向上抛出，避免在子组件内对 prop 写入引发警告 */
function onPopupModelChange(v: boolean) {
  emit('update:modelValue', v);
}
</script>

<template>
  <!-- 不能直接 v-model="modelValue"（会尝试本地写入 prop） -->
  <lk-popup
    :model-value="modelValue"
    position="bottom"
    :round="true"
    :animation="animation"
    :animation-type="animationType"
    :duration="duration"
    :delay="delay"
    :easing="easing"
    @update:modelValue="onPopupModelChange"
  >
    <view class="lk-action-sheet">
      <view v-if="title || description" class="lk-action-sheet__head">
        <text v-if="title" class="lk-action-sheet__title">{{ title }}</text>
        <text v-if="description" class="lk-action-sheet__desc">{{ description }}</text>
      </view>

      <view class="lk-action-sheet__list" :class="{ 'no-head': !(title || description) }">
        <view
          v-for="(a, i) in actions"
          :key="i"
          class="lk-action-sheet__item"
          :class="{ 'is-disabled': a.disabled, 'is-loading': a.loading }"
          @click="onSelect(a, i)"
          :style="{ color: a.color || 'inherit' }"
        >
          <text class="lk-action-sheet__name">{{ a.name }}</text>
          <text v-if="a.sub" class="lk-action-sheet__sub">{{ a.sub }}</text>
          <view v-if="a.loading" class="lk-action-sheet__spinner" />
        </view>
      </view>

      <view v-if="cancelText" class="lk-action-sheet__cancel" @click="cancel">
        {{ cancelText }}
      </view>
      <view v-if="safeArea" class="lk-action-sheet__safe" />
    </view>
  </lk-popup>
</template>

<style scoped lang="scss">
.lk-action-sheet {
  display: flex;
  flex-direction: column;
  max-height: 70vh;

  &__head {
    padding: 28rpx 32rpx 12rpx;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 10rpx;
  }
  &__title {
    font-size: 30rpx;
    font-weight: 600;
  }
  &__desc {
    font-size: 24rpx;
    color: var(--lk-color-text-secondary);
    line-height: 1.4;
  }

  &__list {
    display: flex;
    flex-direction: column;
    &.no-head .lk-action-sheet__item:first-child {
      border-top: none;
    }
  }

  &__item {
    padding: 32rpx;
    text-align: center;
    font-size: 30rpx;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8rpx;
    &:active {
      background: var(--lk-color-primary-bg-soft);
    }
    & + & {
      border-top: 2rpx solid var(--lk-color-border-weak);
    }
    &.is-disabled {
      opacity: 0.4;
    }
    &.is-loading {
      color: var(--lk-color-text-secondary);
    }
  }
  &__name {
    line-height: 1.2;
  }
  &__sub {
    font-size: 24rpx;
    color: var(--lk-color-text-secondary);
  }
  &__cancel {
    margin-top: 16rpx;
    padding: 32rpx;
    background: var(--lk-color-bg-surface);
    text-align: center;
    font-size: 32rpx;
    &:active {
      background: var(--lk-color-primary-bg-soft);
    }
    border-top: 2rpx solid var(--lk-color-border-weak);
  }
  &__spinner {
    position: absolute;
    right: 32rpx;
    top: 50%;
    margin-top: -18rpx;
    width: 36rpx;
    height: 36rpx;
    border: 4rpx solid var(--lk-color-primary-bg-soft);
    border-top-color: var(--lk-color-primary);
    border-radius: 50%;
    animation: ac-spin 0.8s linear infinite;
  }
  &__safe {
    height: env(safe-area-inset-bottom);
  }
}
@keyframes ac-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
