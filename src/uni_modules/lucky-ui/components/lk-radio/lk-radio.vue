<script setup lang="ts">
import { inject, computed, useSlots } from 'vue';
import { radioProps, radioEmits } from './radio.props';

defineOptions({ name: 'LkRadio' });
const props = defineProps(radioProps);
const emit = defineEmits(radioEmits);

const slots = useSlots();
const group = inject<any>('LkRadioGroup', null);
const isGroup = computed(() => !!group?.isGroup);
const mergedSize = computed(() => props.size || group?.size || 'md');
const mergedIconType = computed(() => props.iconType || group?.iconType || 'dot');
const mergedShape = computed(() => props.shape || group?.shape || 'circle');
const checked = computed(() =>
  isGroup.value ? group.value() === props.label : props.modelValue === props.label
);
const isDisabled = computed(() => (isGroup.value ? group.disabled : props.disabled));
const hasIconSlot = computed(() => !!slots.icon);

function select() {
  if (isDisabled.value || checked.value) return;
  if (isGroup.value) group.update(props.label);
  else {
    emit('update:modelValue', props.label);
    emit('change', props.label);
  }
}
</script>

<template>
  <view
    class="lk-radio"
    :class="[
      `lk-radio--${mergedSize}`,
      `lk-radio--${mergedShape}`,
      `lk-radio--${mergedIconType}`,
      { 'is-checked': checked, 'is-disabled': isDisabled },
    ]"
    @click="select"
  >
    <view class="lk-radio__outer">
      <view v-if="mergedIconType === 'dot'" class="lk-radio__inner lk-radio__dot" />
      <view v-else-if="mergedIconType === 'check'" class="lk-radio__inner lk-radio__check">✓</view>
      <view
        v-else-if="mergedIconType === 'icon' || hasIconSlot"
        class="lk-radio__inner lk-radio__icon"
      >
        <slot name="icon" :checked="checked" :disabled="isDisabled" />
      </view>
    </view>
    <view class="lk-radio__label"
      ><slot>{{ label }}</slot></view
    >
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
