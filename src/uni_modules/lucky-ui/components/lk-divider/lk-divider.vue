<script setup lang="ts">
import type { StyleValue } from 'vue';
import { computed, useSlots } from 'vue';
import { dividerProps } from './divider.props';
import {
  hasDividerText,
  resolveDividerClass,
  resolveDividerLineStyle,
} from './divider.utils';

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
const dividerStyle = computed(() => props.customStyle as StyleValue);

const hasText = computed(() => hasDividerText({
  text: props.text,
  hasDefaultSlot: Boolean(slots.default),
}));

// 动态计算左右线条的 flex 比例/宽度
const lineStyle = computed(() => resolveDividerLineStyle({
  textPosition: props.textPosition,
  hasText: hasText.value,
  vertical: props.vertical,
}));

const classes = computed(() => resolveDividerClass({
  textPosition: props.textPosition,
  vertical: props.vertical,
  dashed: props.dashed,
  hairline: props.hairline,
  hasText: hasText.value,
  customClass: props.customClass,
}));
</script>

<template>
  <view
    :class="classes"
    :style="dividerStyle"
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
@use './lk-divider.scss';
</style>
