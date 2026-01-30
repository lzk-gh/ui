<script setup lang="ts">
import { tagProps } from './tag.props';
import { computed } from 'vue';
import type { CSSProperties } from 'vue';

defineOptions({ name: 'LkTag' });

const props = defineProps(tagProps);
const emit = defineEmits(['close', 'click']);

function onClose(e: any) {
  if (props.disabled) return;
  emit('close', e);
  e.stopPropagation();
}

function onClick(e: any) {
  if (props.disabled) return;
  emit('click', e);
}

const customStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {};

  if (props.bgColor) {
    if (props.type === 'outline') {
      style.boxShadow = `inset 0 0 0 2rpx ${props.bgColor}`;
      style.background = 'transparent';
    } else {
      style.background = props.bgColor;
    }
  }

  if (props.textColor) {
    style.color = props.textColor;
  }

  return style;
});
</script>

<template>
  <view
    class="lk-tag"
    :class="[
      `lk-tag--${props.type}`,
      `lk-tag--${props.size}`,
      {
        'is-disabled': props.disabled,
        'is-round': props.round,
        'is-closable': props.closable,
      },
      customClass,
    ]"
    :style="[customStyle, props.customStyle]"
    @click="onClick"
  >
    <view class="lk-tag__content">
      <slot />
    </view>
    <view v-if="props.closable" class="lk-tag__close" @click="onClose">×</view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
