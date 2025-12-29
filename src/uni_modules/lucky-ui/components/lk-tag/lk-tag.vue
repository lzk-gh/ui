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

  // 文本颜色优先
  if (props.textColor) {
    style.color = props.textColor;
  }

  // 背景或描边颜色
  if (props.bgColor) {
    if (props.type === 'outline') {
      // outline 类型：使用内阴影模拟描边
      style.boxShadow = `inset 0 0 0 2rpx ${props.bgColor}`;
      style.background = 'transparent';
    } else {
      style.background = props.bgColor;
    }
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
      { 'is-disabled': props.disabled, 'is-round': props.round, 'is-closable': props.closable },
    ]"
    :style="customStyle"
    @click="onClick"
  >
    <slot />
    <view v-if="props.closable" class="lk-tag__close" @click="onClose">×</view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
