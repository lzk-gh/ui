<script setup lang="ts">
import { watch } from 'vue';
import LkPopup from '../lk-popup/lk-popup.vue';
import { actionSheetProps, actionSheetEmits, type Action } from './action-sheet.props';
import {
  ANIMATION_PRESETS,
  type TransitionConfig,
} from '@/uni_modules/lucky-ui/composables/useTransition';

defineOptions({ name: 'LkActionSheet' });

const props = defineProps(actionSheetProps);

const emit = defineEmits(actionSheetEmits);

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
    @update:model-value="onPopupModelChange"
  >
    <view class="lk-action-sheet">
      <view v-if="title || description" class="lk-action-sheet__head">
        <text v-if="title" class="lk-action-sheet__title">{{ title }}</text>
        <text v-if="description" class="lk-action-sheet__desc">{{ description }}</text>
      </view>

      <view class="lk-action-sheet__list" :class="{ 'is-no-head': !(title || description) }">
        <view
          v-for="(a, i) in actions"
          :key="i"
          class="lk-action-sheet__item"
          :class="{ 'is-disabled': a.disabled, 'is-loading': a.loading }"
          :style="{ color: a.color || 'inherit' }"
          @click="onSelect(a, i)"
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

<style lang="scss">
@use './index.scss';
</style>
