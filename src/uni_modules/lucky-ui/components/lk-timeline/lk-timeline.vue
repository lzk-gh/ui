<script setup lang="ts">
import { computed, provide } from 'vue';
import { timelineProps } from './timeline.props';
import type { TimelineDirection, TimelineMode, TimelineSize } from './timeline.props';

defineOptions({ name: 'LkTimeline' });

const props = defineProps(timelineProps);

// 注入键（与 item 通信） - 保持为模块内常量，避免 <script setup> 导出
const LkTimelineKey = Symbol('LkTimelineCtx');

function toUnit(val: number | string | undefined, fallback: string) {
  if (val === undefined || val === null) return fallback;
  if (typeof val === 'number') return `${val}rpx`;
  return val;
}

const ctx = computed(() => ({
  direction: props.direction,
  mode: props.mode,
  dashed: props.dashed,
  lineCap: props.lineCap,
  lineColor: props.lineColor,
  lineWidth: toUnit(props.lineWidth, '4rpx'),
  itemGap: toUnit(props.itemGap, '28rpx'),
  size: props.size,
  lastVisibleTail: props.lastVisibleTail,
}));

provide(LkTimelineKey, ctx);
// 兼容以字符串注入，避免跨文件导入键的限制
provide('LkTimelineCtx', ctx);

const classes = computed(() => [
  'lk-timeline',
  `is-${props.direction}`,
  `mode-${props.mode}`,
  {
    'is-dashed': props.dashed,
    'is-wrap': props.wrap,
    'is-last-tail-visible': props.lastVisibleTail,
  },
]);

function dotSizeOf(size: TimelineSize) {
  // 与子项统一的小一号圆点
  if (size === 'sm') return '16rpx';
  if (size === 'lg') return '26rpx';
  return '20rpx';
}

const rootStyle = computed(() => ({
  '--lk-timeline-gap': toUnit(props.itemGap, '28rpx'),
  '--lk-timeline-line-width': toUnit(props.lineWidth, '4rpx'),
  '--lk-timeline-dot-size': dotSizeOf(props.size),
}));
</script>

<template>
  <view :class="classes" :style="rootStyle" role="list">
    <!-- 默认插槽渲染子项 -->
    <slot />
    <!-- pending 尾部占位/说明 -->
    <template v-if="props.pending">
      <view class="lk-timeline__pending" role="listitem">
        <slot name="pending">
          <text class="lk-timeline__pending-text">{{
            typeof props.pending === 'string' ? props.pending : ''
          }}</text>
        </slot>
      </view>
    </template>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
