<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { dividerProps } from './divider.props';

/**
 * LkDivider 分割线
 * - 支持水平/垂直模式
 * - 采用 3-View 结构（左线-文字-右线）
 * - 纯 CSS Flex 驱动定位，彻底摆脱背景色覆盖和层级冲突
 * - 支持按百分比/像素分配剩余空间，极度灵活
 */

defineOptions({ name: 'LkDivider' });

const props = defineProps(dividerProps);
const slots = useSlots();

const hasText = computed(() => !!(props.text || slots.default));

// 动态计算左右线条的 flex 比例/宽度
const lineStyle = computed(() => {
  const pos = props.textPosition;
  if (pos === 'left' || pos === 'right' || pos === 'center' || !hasText.value || props.vertical) {
    return { left: {}, right: {} };
  }

  const leftStyle: Record<string, string> = {};
  const rightStyle: Record<string, string> = {};

  const strPos = String(pos);
  const numVal = parseFloat(strPos);
  // 判断是否为百分比（纯数字或带 % 号）
  const isPercent = typeof pos === 'number' || strPos.endsWith('%') || /^\d+(\.\d+)?$/.test(strPos);

  if (isPercent && !isNaN(numVal)) {
    // 方案：按百分比分配左右线条占据的“剩余空间”
    const leftRatio = Math.max(0, Math.min(100, numVal));
    const rightRatio = 100 - leftRatio;
    leftStyle.flex = `${leftRatio}`;
    rightStyle.flex = `${rightRatio}`;
  } else {
    // 方案：指定左侧固定宽度，右侧占满剩余空间
    leftStyle.flex = `0 0 ${strPos}`;
    rightStyle.flex = '1';
  }

  return { left: leftStyle, right: rightStyle };
});

const classes = computed(() => {
  const pos = props.textPosition;
  const isStandardPos = pos === 'left' || pos === 'right' || pos === 'center';
  
  return [
    'lk-divider',
    isStandardPos ? `lk-divider--${pos}` : 'lk-divider--custom-pos',
    {
      'is-vertical': props.vertical,
      'is-dashed': props.dashed,
      'is-hairline': props.hairline,
      'has-text': hasText.value,
    },
    props.customClass
  ];
});
</script>

<template>
  <view
    :class="classes"
    :style="props.customStyle"
    role="separator"
    :aria-orientation="vertical ? 'vertical' : 'horizontal'"
  >
    <!-- 水平模式：左边线条 -->
    <view v-if="!vertical" class="lk-divider__left" :style="lineStyle.left" />

    <!-- 水平模式：文字内容 -->
    <view v-if="hasText && !vertical" class="lk-divider__content">
      <slot>{{ text }}</slot>
    </view>

    <!-- 水平模式：右边线条 -->
    <view v-if="hasText && !vertical" class="lk-divider__right" :style="lineStyle.right" />
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
