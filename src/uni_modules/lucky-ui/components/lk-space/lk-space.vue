<script setup lang="ts">
import { computed } from 'vue';
import { spaceProps } from './space.props';

defineOptions({ name: 'LkSpace' });

const props = defineProps(spaceProps);

// 预设尺寸映射 (单位 rpx)
const presetMap = { sm: 8, md: 16, lg: 24 } as const;

/**
 * 格式化间距值
 * @param val 输入值
 * @returns 带单位的字符串
 */
function formatGap(val: string | number): string {
  if (typeof val === 'number') return `${val}rpx`;
  if (val in presetMap) return `${presetMap[val as keyof typeof presetMap]}rpx`;
  // 如果是 '10px' 这种自带单位的字符串，直接返回；否则默认为 rpx
  return String(val).match(/^[0-9]+$/) ? `${val}rpx` : String(val);
}

const style = computed(() => {
  let rowGap = '0'; // 垂直间距 (行间距)
  let colGap = '0'; // 水平间距 (列间距)

  if (Array.isArray(props.gap)) {
    // 数组模式: [水平间距, 垂直间距]
    colGap = formatGap(props.gap[0]);
    rowGap = formatGap(props.gap[1] ?? props.gap[0]);
  } else {
    // 单值模式: 统一间距
    const val = formatGap(props.gap);
    colGap = val;
    rowGap = val;
  }

  return {
    // CSS gap 标准语法: row-gap column-gap
    gap: `${rowGap} ${colGap}`,
  };
});

const mergedAlign = computed(() => {
  if (props.align) return props.align;
  // 默认对齐逻辑：水平方向居中，垂直方向拉伸（更符合布局直觉）
  return props.direction === 'horizontal' ? 'center' : 'stretch';
});

const klass = computed(() => [
  'lk-space',
  `lk-space--${props.direction}`,
  `lk-space--align-${mergedAlign.value}`,
  {
    'lk-space--wrap': props.wrap,
    'lk-space--fill': props.fill || props.direction === 'vertical',
  },
]);
</script>

<template>
  <view :class="klass" :style="style">
    <slot />
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
