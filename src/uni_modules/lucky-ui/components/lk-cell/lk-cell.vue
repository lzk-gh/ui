<script setup lang="ts">
import { cellProps, cellEmits } from './cell.props';
import { useRipple } from '@/uni_modules/lucky-ui/composables/useRipple';

defineOptions({ name: 'LkCell' });

const props = defineProps(cellProps);
const emit = defineEmits(cellEmits);

const { rippleActive, rippleWaveStyle, triggerRipple } = useRipple({ duration: 600 });

function onTap(e: unknown) {
  if (props.disabled) return;
  if (props.clickable && props.ripple) {
    triggerRipple(e);
  }
  emit('click');
}
</script>

<template>
  <view
    class="lk-cell"
    :class="[
      {
        'lk-ripple': clickable && ripple,
        'is-clickable': clickable,
        'is-disabled': disabled,
        'is-center': center,
        'lk-ripple--active': rippleActive,
      },
    ]"
    @tap="onTap"
  >
    <view class="lk-cell__left">
      <slot name="left">
        <lk-icon v-if="icon" :name="icon" size="36" class="lk-cell__icon" />
        <view class="lk-cell__titles">
          <view v-if="$slots.title" class="lk-cell__title">
            <slot name="title" />
          </view>
          <text v-else-if="title" class="lk-cell__title">{{ title }}</text>

          <view v-if="$slots.label" class="lk-cell__label">
            <slot name="label" />
          </view>
          <text v-else-if="label" class="lk-cell__label">{{ label }}</text>
        </view>
      </slot>
    </view>
    <view class="lk-cell__right">
      <slot name="right">
        <view v-if="$slots.value" class="lk-cell__value">
          <slot name="value" />
        </view>
        <text v-else-if="value" class="lk-cell__value">{{ value }}</text>
        <lk-icon v-if="arrow" name="arrow-right" size="30" class="lk-cell__arrow" />
      </slot>
    </view>
    <view v-if="clickable && ripple" class="lk-ripple__wave" :style="rippleWaveStyle" />
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
