<script setup lang="ts">
import { tagEmits, tagProps } from './tag.props';
import { computed } from 'vue';
import type { CSSProperties } from 'vue';

defineOptions({ name: 'LkTag' });

const props = defineProps(tagProps);
const emit = defineEmits(tagEmits);

function onClose(e: unknown) {
  if (props.disabled) {
    emit('close-disabled', e);
    return;
  }
  emit('close', e);
}

function onClick(e: unknown) {
  if (props.disabled) {
    emit('click-disabled', e);
    return;
  }
  emit('click', e);
}

const customStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {};

  if (props.bgColor) {
    if (props.type === 'outline') {
      style.boxShadow = `inset 0 0 0 var(--lk-rpx-2) ${props.bgColor}`;
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
    :id="id"
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
    :style="[customStyle, props.customStyle as any]"
    @tap="onClick"
  >
    <view class="lk-tag__content">
      <slot />
    </view>
    <view v-if="props.closable" class="lk-tag__close" @tap.stop="onClose">×</view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
