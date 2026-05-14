<script setup lang="ts">
import type { StyleValue } from 'vue';
import { inject, computed } from 'vue';
import type { RadioValue } from './radio.props';
import { radioProps, radioEmits } from './radio.props';
import { addUnit } from '../../core/src/utils/unit';
import LkIcon from '../lk-icon/lk-icon.vue';

// 使用 Symbol.for 保证跨模块一致性
const LK_RADIO_GROUP_KEY = Symbol.for('LkRadioGroup');

defineOptions({ name: 'LkRadio' });

const props = defineProps(radioProps);
const emit = defineEmits(radioEmits);

type RadioGroupContext = {
  props: {
    modelValue: RadioValue;
    disabled: boolean;
    shape: string;
    iconType: string;
    size: string;
    activeColor: string;
  };
  updateValue: (value: RadioValue) => void;
};

const group = inject<RadioGroupContext | null>(LK_RADIO_GROUP_KEY, null);

const radioValue = computed(() => (props.name !== '' ? props.name : props.label));
const style = computed(() => props.customStyle as StyleValue);

const isChecked = computed(() => {
  if (group) {
    return group.props.modelValue === radioValue.value;
  }
  return props.modelValue === radioValue.value;
});

const isDisabled = computed(() => {
  return props.disabled || !!group?.props.disabled;
});

const mergedShape = computed(() => {
  return props.shape || (group && group.props.shape) || 'circle';
});

const mergedIconType = computed(() => {
  return props.iconType || (group && group.props.iconType) || 'dot';
});

const mergedSize = computed(() => {
  return group ? group.props.size : 'md';
});

const mergedIconSize = computed(() => {
  if (props.iconSize) return props.iconSize;
  return mergedSize.value === 'sm' ? 24 : mergedSize.value === 'lg' ? 36 : 30;
});

const radioClass = computed(() => {
  return [
    'lk-radio',
    `lk-radio--${mergedSize.value}`,
    `lk-radio--${mergedShape.value}`,
    `lk-radio--icon-${mergedIconType.value}`,
    {
      'lk-radio--checked': isChecked.value,
      'lk-radio--disabled': isDisabled.value,
    },
    props.customClass,
  ];
});

const iconStyle = computed(() => {
  const nextStyle: Record<string, string> = {};
  const activeColor = props.activeColor || (group && group.props.activeColor);

  if (isChecked.value && activeColor) {
    nextStyle.borderColor = activeColor;
    nextStyle.backgroundColor = activeColor;
  }

  if (props.iconSize) {
    const size = addUnit(props.iconSize);
    if (size) {
      nextStyle.width = size;
      nextStyle.height = size;
    }
  }

  return nextStyle;
});

function handleToggle(event?: unknown) {
  if (isDisabled.value) return;
  emit('click', event, isChecked.value, radioValue.value);
  if (isChecked.value) return;
  if (group) {
    group.updateValue(radioValue.value);
  } else {
    emit('update:modelValue', radioValue.value);
    emit('change', radioValue.value);
  }
}

function handleLabelClick() {
  if (props.labelDisabled) return;
  handleToggle();
}
</script>

<template>
  <view
    :id="id"
    :class="radioClass"
    :style="style"
    role="radio"
    :aria-checked="isChecked"
    :aria-disabled="isDisabled"
    :aria-label="label"
    @tap="handleToggle($event)"
  >
    <view class="lk-radio__icon-wrap">
      <slot name="icon" :checked="isChecked" :disabled="isDisabled">
        <view class="lk-radio__icon" :class="[`lk-radio__icon--${mergedShape}`]" :style="iconStyle">
          <lk-icon
            class="lk-radio__check"
            name="check"
            :size="mergedIconSize"
            color="var(--lk-radio-check-color)"
          />
          <view class="lk-radio__dot" />
        </view>
      </slot>
    </view>
    <view v-if="label || $slots.default" class="lk-radio__label" @tap.stop="handleLabelClick">
      <slot>{{ label }}</slot>
    </view>
  </view>
</template>

<style lang="scss">
@use './lk-radio.scss';
</style>
