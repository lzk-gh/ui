<script setup lang="ts">
import { computed, ref, watch, type StyleValue } from 'vue';
import { avatarProps } from './avatar.props';
import { addUnit } from '../../core/src/utils/unit';

defineOptions({ name: 'LkAvatar' });

const props = defineProps(avatarProps);
const hasError = ref(false);

/**
 * 计算圆角
 * - 优先使用 radius
 * - 未传 radius 时按 shape 提供默认圆角
 */
const borderRadius = computed(() => {
  if (props.shape === 'circle') {
    return '50%';
  }
  if (props.radius !== '' && props.radius !== undefined && props.radius !== null) {
    return addUnit(props.radius);
  }
  if (props.shape === 'rounded') {
    return 'var(--lk-radius-lg)';
  }
  if (props.shape === 'square') {
    return 'var(--lk-radius-xs)';
  }
  return 'var(--lk-radius-md)';
});

/**
 * 组件内联样式
 * - 小程序端优先使用直出样式，避免 CSS 变量透传兼容差异
 */
const avatarStyle = computed(() => ({
  width: addUnit(props.size),
  height: addUnit(props.size),
  background: props.bg || 'var(--lk-fill-1)',
  borderRadius: borderRadius.value,
  color: props.color || undefined,
}));

/**
 * 合并样式，避免在模板中使用 any 断言
 */
const mergedStyle = computed<StyleValue>(() => [avatarStyle.value, props.customStyle as unknown as StyleValue]);

watch(
  () => props.src,
  () => (hasError.value = false)
);

function onError() {
  hasError.value = true;
}
</script>

<template>
  <view
    class="lk-avatar"
    :class="[`lk-avatar--${shape}`, { 'is-fallback': hasError || !src }, customClass]"
    :style="mergedStyle"
  >
    <image
      v-if="src && !hasError"
      class="lk-avatar__img"
      :src="src"
      mode="aspectFill"
      @error="onError"
    />
    <slot v-else>{{ text.slice(0, 1).toUpperCase() }}</slot>
  </view>
</template>

<style lang="scss">
@use './lk-avatar.scss';
</style>
