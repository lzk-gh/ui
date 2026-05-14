<script setup lang="ts">
import type { CSSProperties, StyleValue } from 'vue';
import { computed } from 'vue';
import LkIcon from '../lk-icon/lk-icon.vue';
import { selectListEmits, selectListProps, type SelectListOption, type SelectValue } from './select-list.props';

defineOptions({ name: 'LkSelectList' });

const props = defineProps(selectListProps);
const emit = defineEmits(selectListEmits);

const rootClass = computed(() => [
  'lk-select-list',
  `lk-select-list--${props.size}`,
  {
    'is-inset': props.inset,
    'is-disabled': props.disabled,
    'is-borderless': !props.bordered,
    'is-selected-bg-disabled': !props.selectedBg,
    'is-selected-border-disabled': !props.selectedBorder,
    'is-grid': columnCount.value > 1,
  },
  props.customClass,
]);

const columnCount = computed(() => Math.min(Math.max(Math.floor(props.columns || 1), 1), 4));

const itemRadiusValue = computed(() => {
  if (props.itemRadius === '' || props.itemRadius === null || props.itemRadius === undefined) {
    return '';
  }
  return typeof props.itemRadius === 'number' ? `${props.itemRadius}rpx` : String(props.itemRadius);
});

const rootStyle = computed<StyleValue>(() => {
  const style: StyleValue =
    typeof props.customStyle === 'object' && props.customStyle !== null
      ? ({ ...props.customStyle } as CSSProperties)
      : props.customStyle;

  const vars = {
    '--lk-select-list-columns': String(columnCount.value),
    ...(itemRadiusValue.value ? { '--lk-select-list-item-radius': itemRadiusValue.value } : {}),
    ...(props.activeColor
      ? {
          '--lk-select-list-selected-border': props.activeColor,
          '--lk-select-list-icon-color': props.activeColor,
          '--lk-select-list-selected-color': props.activeColor,
        }
      : {}),
  };

  if (!props.activeColor && columnCount.value <= 1 && !itemRadiusValue.value) return style;

  if (typeof style === 'string') {
    const cssVars = Object.entries(vars)
      .map(([key, value]) => `${key}: ${value}`)
      .join(';');
    return [style, cssVars].filter(Boolean).join(';');
  }

  return typeof style === 'object' ? { ...style, ...vars } : vars;
});

function readOption(option: SelectListOption, key: string): unknown {
  return option[key];
}

function getValue(option: SelectListOption): SelectValue {
  return readOption(option, props.valueKey) as SelectValue;
}

function getTitle(option: SelectListOption): string {
  const value = readOption(option, props.titleKey);
  return value == null ? '' : String(value);
}

function getDescription(option: SelectListOption): string {
  const value = readOption(option, props.descKey);
  return value == null ? '' : String(value);
}

function isOptionDisabled(option: SelectListOption): boolean {
  return props.disabled || Boolean(readOption(option, props.disabledKey));
}

function normalizeMultipleValue(): SelectValue[] {
  return Array.isArray(props.modelValue) ? [...props.modelValue] : [];
}

function isSelected(option: SelectListOption): boolean {
  const value = getValue(option);
  return props.multiple
    ? normalizeMultipleValue().includes(value)
    : props.modelValue === value;
}

function optionClass(option: SelectListOption) {
  return [
    'lk-select-list__item',
    {
      'is-selected': isSelected(option),
      'is-disabled': isOptionDisabled(option),
    },
  ];
}

function onSelect(option: SelectListOption) {
  if (isOptionDisabled(option)) return;

  const selected = isSelected(option);
  const value = getValue(option);

  if (!props.multiple) {
    if (selected) return;
    emit('update:modelValue', value);
    emit('change', value, option);
    emit('select', option, true);
    return;
  }

  const list = normalizeMultipleValue();
  const index = list.indexOf(value);

  if (index !== -1) {
    list.splice(index, 1);
    emit('update:modelValue', list);
    emit('change', list, option);
    emit('select', option, false);
    return;
  }

  if (props.max > 0 && list.length >= props.max) {
    emit('overlimit', option, props.max);
    return;
  }

  list.push(value);
  emit('update:modelValue', list);
  emit('change', list, option);
  emit('select', option, true);
}
</script>

<template>
  <view :id="id" :class="rootClass" :style="rootStyle">
    <view
      v-for="option in options"
      :key="String(getValue(option))"
      :class="optionClass(option)"
      @tap="onSelect(option)"
    >
      <view v-if="option.icon" class="lk-select-list__prefix">
        <lk-icon :name="option.icon" size="36" color="primary" />
      </view>

      <view class="lk-select-list__content">
        <text class="lk-select-list__title">{{ getTitle(option) }}</text>
        <text v-if="getDescription(option)" class="lk-select-list__desc">
          {{ getDescription(option) }}
        </text>
      </view>

      <view v-if="showIcon" class="lk-select-list__suffix">
        <lk-icon
          v-if="isSelected(option)"
          :name="icon"
          size="34"
          color="var(--lk-select-list-icon-color)"
        />
      </view>
    </view>
  </view>
</template>

<style lang="scss">
@use './lk-select-list.scss';
</style>
