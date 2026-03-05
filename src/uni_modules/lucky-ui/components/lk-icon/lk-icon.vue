<script setup lang="ts">
import { computed, watch } from 'vue';
import { iconProps, iconEmits } from './icon.props';
import { iconCharOf } from './codepoints';

// #ifdef H5
// H5 使用 @font-face 静态加载字体（含所有字体格式引用）
import './fonts/lk-icons.css';
// #endif
// #ifndef H5
// 小程序 / App：仅导入 icon class 定义，字体文件通过 loadFontFace 加载
// 避免 @font-face 导致 svg/ttf/woff 等字体文件被打包进主包（节省 ~1MB）
import './fonts/lk-icons-definitions.css';
// #endif

defineOptions({ name: 'LkIcon' });

const props = defineProps(iconProps);
const emit = defineEmits(iconEmits);

const iconChar = computed(() => iconCharOf(props.name));

// 语义化颜色映射
const semanticColorMap: Record<string, string> = {
  primary: 'var(--lk-color-primary)',
  success: 'var(--lk-color-success)',
  warning: 'var(--lk-color-warning)',
  danger: 'var(--lk-color-danger)',
  info: 'var(--lk-color-info)',
  text: 'var(--lk-color-text)',
  textSecondary: 'var(--lk-color-text-secondary)',
  textTertiary: 'var(--lk-color-text-tertiary)',
  textPlaceholder: 'var(--lk-color-text-placeholder)',
  textDisabled: 'var(--lk-color-text-disabled)',
  textInverse: 'var(--lk-color-text-inverse)',
};

function resolveColor(color: string): string {
  if (!color) return '';
  // 如果是语义值，转换为 CSS 变量
  if (semanticColorMap[color]) {
    return semanticColorMap[color];
  }
  // 否则直接使用（HEX、RGB 等）
  return color;
}

const iconStyle = computed(() => {
  const styles: Record<string, string> = {};
  if (props.color) {
    styles.color = resolveColor(props.color);
  }
  if (props.size) {
    styles.fontSize = /^\d+$/.test(String(props.size)) ? `${props.size}rpx` : String(props.size);
  }
  return styles;
});

watch(
  () => props.name,
  n => {
    if (!iconChar.value) {
      console.warn(`[lk-icon] 内置图标 "${n}" 未找到（不在当前字体集）。`);
    }
  },
  { immediate: true }
);

function handleClick(e: Event) {
  emit('click', e);
}
</script>

<template>
  <text
    class="lk-icon"
    :style="[iconStyle, props.customStyle as any]"
    aria-hidden="true"
    @click="handleClick"
  >
    {{ iconChar }}
  </text>
</template>

<style lang="scss">
@use './index.scss';
</style>
