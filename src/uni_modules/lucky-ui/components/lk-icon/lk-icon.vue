<script setup lang="ts">
import { computed, watch } from 'vue';
import { iconProps, iconEmits } from './icon.props';
import { iconCharOf } from './codepoints';

// 由 svgtofont 生成的 CSS
import './fonts/lk-icons.css';

defineOptions({ name: 'LkIcon' });

const props = defineProps(iconProps);
const emit = defineEmits(iconEmits);

const iconChar = computed(() => iconCharOf(props.name));

const iconStyle = computed(() => {
  const styles: Record<string, string> = {};
  if (props.color) styles.color = props.color;
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
    :style="[iconStyle, props.customStyle]"
    @click="handleClick"
    v-text="iconChar"
    aria-hidden="true"
  />
</template>

<style lang="scss">
@use './index.scss';
</style>
