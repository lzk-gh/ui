<script setup lang="ts">
import { inject, computed } from 'vue';
import { checkboxProps, checkboxEmits } from './checkbox.props';
import { addUnit } from '../../core/src/utils/unit';
import LkIcon from '../lk-icon/lk-icon.vue';

defineOptions({ name: 'LkCheckbox' });

const props = defineProps(checkboxProps);
const emit = defineEmits(checkboxEmits);

const group = inject<any>('lkCheckboxGroup', null);

const checkboxValue = computed(() => (props.name !== '' ? props.name : props.label));

const isChecked = computed(() => {
  if (group) {
    return group.props.modelValue.includes(checkboxValue.value);
  }
  return !!props.modelValue;
});

const isDisabled = computed(() => {
  return props.disabled || (group && group.props.disabled);
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
  const style: any = {};
  const activeColor = props.activeColor || (group && group.props.activeColor);

  if ((isChecked.value || props.indeterminate) && activeColor) {
    style.borderColor = activeColor;
    style.backgroundColor = activeColor;
  }

  if (props.iconSize) {
    style.width = addUnit(props.iconSize);
    style.height = addUnit(props.iconSize);
  }

  return style;
});

function handleToggle() {
  if (isDisabled.value) return;
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
  <view :class="checkboxClass" :style="customStyle" @tap="handleToggle">
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
