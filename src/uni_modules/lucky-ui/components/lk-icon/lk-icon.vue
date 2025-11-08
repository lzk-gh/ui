<script setup lang="ts">
import { computed, watch } from 'vue';
import { lkIconProps, lkIconEmits } from './types';
import { iconCharOf } from './codepoints';

// 由 svgtofont 生成的 CSS
import './fonts/lk-icons.css';

defineOptions({ name: 'LkIcon' });

const props = defineProps(lkIconProps);
const emit = defineEmits(lkIconEmits);

const iconChar = computed(() => iconCharOf(props.name));

const iconStyle = computed(() => {
  const styles: Record<string, string> = {};
  if (props.color) styles.color = props.color;
  if (props.size) {
    styles.fontSize = /^\d+$/.test(String(props.size))
      ? `${props.size}rpx`
      : String(props.size);
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
.lk-icon {
  font-family: 'lk-icons' !important;
  font-style: normal;
  font-weight: normal;
  display: inline-block;
  line-height: 1;
  vertical-align: middle;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
