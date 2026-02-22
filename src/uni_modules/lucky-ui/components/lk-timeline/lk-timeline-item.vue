<script setup lang="ts">
import { computed, inject, useSlots, type ComputedRef } from 'vue';
import { timelineItemProps } from './timeline-item.props';
import type { TimelineDirection, TimelineDotVariant } from './timeline.props';

defineOptions({ name: 'LkTimelineItem' });

interface TimelineCtx {
  direction: TimelineDirection;
  showLine: boolean;
  activeIndex: number;
  dotVariant: TimelineDotVariant;
}

const emit = defineEmits<{ (e: 'click', ev: Event): void }>();
const props = defineProps(timelineItemProps);
const slots = useSlots();

const injectedRaw = inject<ComputedRef<TimelineCtx>>(
  'LkTimelineCtx',
  null as unknown as ComputedRef<TimelineCtx>
);
const ctx = computed<TimelineCtx>(
  () =>
    injectedRaw?.value ?? {
      direction: 'vertical',
      showLine: true,
      activeIndex: -1,
      dotVariant: 'filled',
    }
);

const isActive = computed(
  () =>
    props.status === 'active' ||
    (props.index >= 0 && props.index === ctx.value.activeIndex)
);
const isCompleted = computed(() => props.status === 'completed');
const isPending = computed(() => props.status === 'pending');
const isError = computed(() => props.status === 'error');
const isHorizontal = computed(() => ctx.value.direction === 'horizontal');

// 节点样式优先用 item 自身的，否则继承父级
const dotVariant = computed(() => props.dotVariant || ctx.value.dotVariant || 'filled');

// 节点显示数字（numbered 时）
const displayNumber = computed(() => (props.index >= 0 ? props.index + 1 : ''));

// 品牌色统一：所有状态均使用 primary，pending 在 SCSS 层降透明
const accentColor = computed(() => {
  if (props.color) return props.color;
  return 'var(--lk-color-primary, #007aff)';
});

// 是否显示左侧列（有 left 插槽或 time/date prop）
const hasLeft = computed(() => !!(slots.left || props.time || props.date));

const itemClass = computed(() => [
  'lk-timeline-item',
  isHorizontal.value ? 'lk-timeline-item--horizontal' : 'lk-timeline-item--vertical',
  hasLeft.value && 'has-left',
  isActive.value && 'is-active',
  isCompleted.value && 'is-completed',
  isPending.value && 'is-pending',
  isError.value && 'is-error',
]);

const itemStyle = computed(() => ({
  '--lk-ti-accent': accentColor.value,
}));

function onTap(ev: Event) {
  emit('click', ev);
}
</script>

<template>
  <view :class="itemClass" :style="itemStyle" role="listitem" @click="onTap">
    <!-- 左侧列：时间 / 自定义（有内容时才渲染） -->
    <view v-if="hasLeft" class="lk-timeline-item__left">
      <slot name="left">
        <text v-if="date" class="lk-timeline-item__date">{{ date }}</text>
        <text v-if="time" class="lk-timeline-item__time">{{ time }}</text>
      </slot>
    </view>

    <!-- 轨道列：节点圆 + 连接线 -->
    <view class="lk-timeline-item__track">
      <!-- 节点圆 -->
      <view
        class="lk-timeline-item__dot"
        :class="[
          `lk-timeline-item__dot--${dotVariant}`,
          isActive && 'is-active',
        ]"
      >
        <!-- numbered 变体显示序号 -->
        <text v-if="dotVariant === 'numbered' && displayNumber" class="lk-timeline-item__dot-num">
          {{ displayNumber }}
        </text>
        <!-- icon 插槽 -->
        <text v-else-if="icon" class="lk-icon" :class="`lk-icon-${icon}`" />
        <!-- 已完成 checkmark -->
        <text v-else-if="isCompleted" class="lk-timeline-item__dot-symbol">✓</text>
        <!-- error 叉 -->
        <text v-else-if="isError" class="lk-timeline-item__dot-symbol">✕</text>
      </view>

      <!-- 连接线 -->
      <view v-if="ctx.showLine && !last" class="lk-timeline-item__line" />
    </view>

    <!-- 右侧内容列 -->
    <view class="lk-timeline-item__body">
      <!-- 标题行 -->
      <view v-if="title || $slots.title" class="lk-timeline-item__title-row">
        <slot name="title">
          <text class="lk-timeline-item__title">{{ title }}</text>
        </slot>
      </view>

      <!-- 副标题（地点 / 房间号等） -->
      <view v-if="subtitle || $slots.subtitle" class="lk-timeline-item__subtitle-row">
        <slot name="subtitle">
          <text class="lk-timeline-item__subtitle">{{ subtitle }}</text>
        </slot>
      </view>

      <!-- 正文描述 -->
      <view v-if="desc || $slots.default" class="lk-timeline-item__desc-row">
        <slot>
          <text class="lk-timeline-item__desc">{{ desc }}</text>
        </slot>
      </view>

      <!-- 扩展插槽（图片预览 / 自定义卡片内容） -->
      <slot name="extra" />
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>

