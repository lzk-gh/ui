<script setup lang="ts">
import { cellProps, cellEmits } from './cell.props';

defineOptions({ name: 'LkCell' });

const props = defineProps(cellProps);
const emit = defineEmits(cellEmits);

function onClick() {
  if (props.disabled) return;
  emit('click');
}
</script>

<template>
  <view
    class="lk-cell"
    :class="[
      {
        'is-clickable': clickable,
        'is-disabled': disabled,
        'is-center': center,
      },
    ]"
    @click="onClick"
  >
    <view class="lk-cell__left">
      <lk-icon v-if="icon" :name="icon" size="36" class="lk-cell__icon" />
      <view class="lk-cell__titles">
        <text v-if="$slots.title || title" class="lk-cell__title">
          <slot name="title">{{ title }}</slot>
        </text>
        <text v-if="$slots.label || label" class="lk-cell__label">
          <slot name="label">{{ label }}</slot>
        </text>
      </view>
    </view>
    <view class="lk-cell__right">
      <text v-if="$slots.value || value" class="lk-cell__value">
        <slot name="value">{{ value }}</slot>
      </text>
      <lk-icon v-if="arrow" name="arrow-right" size="30" class="lk-cell__arrow" />
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
