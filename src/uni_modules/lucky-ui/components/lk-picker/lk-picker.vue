<script setup lang="ts">
import { ref, watch } from 'vue';
import { lkPickerProps, lkPickerEmits } from './types';
import LkPopup from '../lk-popup/lk-popup.vue';
import LkPickerView from '../lk-picker-view/lk-picker-view.vue';

defineOptions({ name: 'LkPicker' });

const props = defineProps(lkPickerProps);
const emit = defineEmits(lkPickerEmits);

const innerValue = ref<any>(props.modelValue);

watch(
  () => props.modelValue,
  v => (innerValue.value = v)
);

function onChange(v: any) {
  innerValue.value = v;
  emit('update:modelValue', v);
  emit('change', v);
}

function onCancel() {
  emit('cancel');
  emit('update:visible', false);
}
function onConfirm() {
  emit('confirm', innerValue.value);
  emit('update:visible', false);
}
</script>

<template>
  <lk-popup
    :model-value="props.visible"
    position="bottom"
    :round="props.round"
    :z-index="props.zIndex"
    @update:modelValue="v => emit('update:visible', v)"
  >
    <view class="lk-picker">
      <view class="lk-picker__toolbar">
        <button class="lk-picker__btn lk-picker__btn--cancel" @click="onCancel">
          {{ props.cancelText }}
        </button>
        <view class="lk-picker__title">{{ props.title }}</view>
        <button class="lk-picker__btn lk-picker__btn--confirm" @click="onConfirm">
          {{ props.confirmText }}
        </button>
      </view>
      <lk-picker-view
        :columns="props.columns"
        v-model="innerValue"
        class="lk-picker__view"
      />
    </view>
  </lk-popup>
</template>

<style scoped lang="scss">
.lk-picker {
  width: 100%;
  background: var(--lk-color-bg-surface);
}
.lk-picker__toolbar {
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24rpx;
  border-bottom: 2rpx solid var(--lk-color-border);
}
.lk-picker__title {
  font-weight: 600;
}
.lk-picker__btn {
  background: transparent;
  border: none;
  color: var(--lk-color-primary);
  font-size: 28rpx;
}
</style>
