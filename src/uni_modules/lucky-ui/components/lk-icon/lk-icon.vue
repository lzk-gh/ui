<script setup lang="ts">
import { computed, watch } from 'vue';
import { iconProps, iconEmits } from './icon.props';
import { iconCharOf } from './codepoints';
import { resolveIconStyle, shouldWarnMissingIcon } from './icon.utils';

// #ifdef H5 || APP-PLUS
// H5 / App 使用 @font-face 静态加载字体（本地文件，不依赖 loadFontFace）
import './fonts/lk-icons.css';
// #endif
// #ifdef MP-WEIXIN
// 小程序端：仅导入 icon class 定义，字体文件通过 loadFontFace 动态加载
import './fonts/lk-icons-definitions.css';
// #endif

defineOptions({ name: 'LkIcon' });

const props = defineProps(iconProps);
const emit = defineEmits(iconEmits);

const iconChar = computed(() => iconCharOf(props.name));

const iconStyle = computed(() => resolveIconStyle({
  color: props.color,
  size: props.size,
}));

watch(
  () => props.name,
  n => {
    if (shouldWarnMissingIcon(iconChar.value)) {
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
@use './lk-icon.scss';
</style>
