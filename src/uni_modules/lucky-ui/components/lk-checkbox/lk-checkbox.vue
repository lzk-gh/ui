<script setup lang="ts">
import type { StyleValue } from 'vue';
import { inject, computed } from 'vue';
import type { CheckboxValue } from './checkbox.props';
import { checkboxProps, checkboxEmits } from './checkbox.props';
import { addUnit } from '../../core/src/utils/unit';
import LkIcon from '../lk-icon/lk-icon.vue';

// 导入 Symbol key （同文件内定义）
const LK_CHECKBOX_GROUP_KEY = Symbol.for('LkCheckboxGroup');

defineOptions({ name: 'LkCheckbox' });

const props = defineProps(checkboxProps);
const emit = defineEmits(checkboxEmits);

type CheckboxGroupContext = {
  props: {
    modelValue: CheckboxValue[];
    disabled: boolean;
    shape: string;
    iconType: string;
    size: string;
    activeColor: string;
  };
  toggleValue: (name: CheckboxValue) => void;
};

const group = inject<CheckboxGroupContext | null>(LK_CHECKBOX_GROUP_KEY, null);

const checkboxValue = computed(() => (props.name !== '' ? props.name : props.label));
const style = computed(() => props.customStyle as StyleValue);

const isChecked = computed(() => {
  if (group) {
    return group.props.modelValue.includes(checkboxValue.value);
  }
  return !!props.modelValue;
});

const isDisabled = computed(() => {
  return props.disabled || !!group?.props.disabled;
});

const mergedShape = computed(() => {
  return props.shape || (group && group.props.shape) || 'square';
});

const mergedIconType = computed(() => {
  return props.iconType || (group && group.props.iconType) || 'check';
});

const mergedSize = computed(() => {
  return group ? group.props.size : 'md';
});

const mergedIconSize = computed(() => {
  if (props.iconSize) return props.iconSize;
  return mergedSize.value === 'sm' ? 24 : mergedSize.value === 'lg' ? 36 : 30;
});

const checkboxClass = computed(() => {
  return [
    'lk-checkbox',
    `lk-checkbox--${mergedSize.value}`,
    `lk-checkbox--${mergedShape.value}`,
    `lk-checkbox--icon-${mergedIconType.value}`,
    {
      'lk-checkbox--checked': isChecked.value,
      'lk-checkbox--disabled': isDisabled.value,
      'lk-checkbox--indeterminate': props.indeterminate,
    },
    props.customClass,
  ];
});

const iconStyle = computed(() => {
  const nextStyle: Record<string, string> = {};
  const activeColor = props.activeColor || (group && group.props.activeColor);

  if ((isChecked.value || props.indeterminate) && activeColor) {
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
  emit('click', event, isChecked.value, checkboxValue.value);
  if (group) {
    group.toggleValue(checkboxValue.value);
  } else {
    const nextValue = !props.modelValue;
    emit('update:modelValue', nextValue);
    emit('change', nextValue);
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
    :class="checkboxClass"
    :style="style"
    role="checkbox"
    :aria-checked="isChecked"
    :aria-disabled="isDisabled"
    :aria-label="label"
    @tap="handleToggle($event)"
  >
    <view class="lk-checkbox__icon-wrap">
      <slot
        name="icon"
        :checked="isChecked"
        :disabled="isDisabled"
        :indeterminate="props.indeterminate"
      >
        <view
          class="lk-checkbox__icon"
          :class="[`lk-checkbox__icon--${mergedShape}`]"
          :style="iconStyle"
        >
          <lk-icon class="lk-checkbox__check" name="check" :size="mergedIconSize" color="#fff" />
          <lk-icon class="lk-checkbox__dash" name="dash" :size="mergedIconSize" color="#fff" />
          <view class="lk-checkbox__dot" />
        </view>
      </slot>
    </view>
    <view v-if="label || $slots.default" class="lk-checkbox__label" @tap.stop="handleLabelClick">
      <slot>{{ label }}</slot>
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
