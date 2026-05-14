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

function expandShortHex(hex: string) {
  return hex
    .split('')
    .map(ch => ch + ch)
    .join('');
}

function toSoftColor(color: string) {
  const value = color.trim();
  const hex = value.replace('#', '');
  const normalized = hex.length === 3 ? expandShortHex(hex) : hex;
  if (/^[0-9a-fA-F]{6}$/.test(normalized)) {
    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, 0.12)`;
  }
  const rgb = value.match(/^rgba?\(([^)]+)\)$/i);
  if (rgb) {
    const [r, g, b] = rgb[1].split(',').map(part => part.trim());
    if (r && g && b) return `rgba(${r}, ${g}, ${b}, 0.12)`;
  }
  return color;
}

function resolveSemanticColor(color: string) {
  const value = color.trim();
  const colorMap: Record<string, { text: string; bg: string }> = {
    primary: {
      text: 'var(--lk-brand-600)',
      bg: 'rgba(var(--lk-brand-rgb, 105, 101, 219), 0.1)',
    },
    success: {
      text: 'var(--lk-color-success)',
      bg: 'var(--lk-color-success-soft, rgba(82, 196, 26, 0.12))',
    },
    warning: {
      text: 'var(--lk-color-warning)',
      bg: 'var(--lk-color-warning-soft, rgba(250, 173, 20, 0.14))',
    },
    danger: {
      text: 'var(--lk-color-danger)',
      bg: 'var(--lk-color-danger-soft, rgba(255, 77, 79, 0.12))',
    },
    info: {
      text: 'var(--lk-color-info)',
      bg: 'var(--lk-color-info-soft, rgba(24, 144, 255, 0.12))',
    },
  };
  return colorMap[value] || { text: value, bg: toSoftColor(value) };
}

const customStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {};

  if (props.color) {
    const semanticColor = resolveSemanticColor(props.color);
    style.color = semanticColor.text;
    style.background = semanticColor.bg;
    style.boxShadow = 'none';
  }

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
@use './lk-tag.scss';
</style>
