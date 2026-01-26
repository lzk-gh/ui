<script setup lang="ts">
import { tagProps } from './tag.props';
import { computed, inject } from 'vue';
import type { CSSProperties } from 'vue';

defineOptions({ name: 'LkTag' });

const props = defineProps(tagProps);
const emit = defineEmits(['close', 'click', 'update:checked']);

const tagGroup = inject('lkTagGroup', null as any);

const isChecked = computed(() => {
  if (tagGroup && props.name !== undefined) {
    if (tagGroup.props.multiple) {
      return Array.isArray(tagGroup.props.modelValue) && tagGroup.props.modelValue.includes(props.name);
    }
    return tagGroup.props.modelValue === props.name;
  }
  return props.checked;
});

const currentSize = computed(() => tagGroup?.props.size || props.size);
const currentType = computed(() => {
  if (isChecked.value) return 'solid';
  return tagGroup?.props.type || props.type;
});

function onClose(e: any) {
  if (props.disabled) return;
  emit('close', e);
  e.stopPropagation();
}

function onClick(e: any) {
  if (props.disabled) return;
  
  if (tagGroup && props.name !== undefined) {
    tagGroup.toggleValue(props.name);
  } else if (props.clickable || props.checked !== undefined) {
    emit('update:checked', !props.checked);
  }
  
  emit('click', e);
}

const customStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {};

  const checked = isChecked.value;

  // 背景颜色
  const bgColor = checked 
    ? (props.activeBgColor || tagGroup?.props.activeBgColor || props.bgColor) 
    : props.bgColor;
    
  if (bgColor) {
    if (currentType.value === 'outline') {
      style.boxShadow = `inset 0 0 0 2rpx ${bgColor}`;
      style.background = 'transparent';
    } else {
      style.background = bgColor;
    }
  }

  // 文本颜色
  const textColor = checked 
    ? (props.activeTextColor || tagGroup?.props.activeTextColor || props.textColor) 
    : props.textColor;
    
  if (textColor) {
    style.color = textColor;
  }

  return style;
});
</script>

<template>
  <view
    class="lk-tag"
    :class="[
      `lk-tag--${currentType}`,
      `lk-tag--${currentSize}`,
      {
        'is-disabled': props.disabled,
        'is-round': props.round || tagGroup?.props.round,
        'is-closable': props.closable,
        'is-checked': isChecked,
        'is-clickable': props.clickable || props.checked !== undefined || !!tagGroup,
      },
    ]"
    :style="customStyle"
    @click="onClick"
  >
    <slot :checked="isChecked" />
    <view v-if="props.closable" class="lk-tag__close" @click="onClose">×</view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
