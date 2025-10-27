<script setup lang="ts">
import { computed, provide } from 'vue';

defineOptions({ name:'LkTimeline' });

type Direction = 'vertical' | 'horizontal'
type Mode = 'left' | 'right' | 'alternate'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  direction?: Direction
  mode?: Mode
  reverse?: boolean
  pending?: boolean | string
  dashed?: boolean
  /** 线条端点：flush(两端0距离)，equal(均等间隔) */
  lineCap?: 'flush' | 'equal'
  lineColor?: string
  lineWidth?: number | string
  itemGap?: number | string
  size?: Size
  lastVisibleTail?: boolean
  wrap?: boolean
}>(), {
  direction: 'vertical',
  mode: 'left',
  reverse: false,
  pending: false,
  dashed: false,
  lineCap: 'equal',
  lineColor: 'var(--lk-color-border-weak)',
  lineWidth: '4rpx',
  itemGap: '28rpx',
  size: 'md',
  lastVisibleTail: false,
  wrap: true,
})

// 注入键（与 item 通信） - 保持为模块内常量，避免 <script setup> 导出
const LkTimelineKey = Symbol('LkTimelineCtx')

function toUnit(val: number | string | undefined, fallback: string) {
  if (val === undefined || val === null) return fallback
  if (typeof val === 'number') return `${val}rpx`
  return val
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
}))

provide(LkTimelineKey, ctx)
// 兼容以字符串注入，避免跨文件导入键的限制
provide('LkTimelineCtx', ctx)

const classes = computed(() => [
  'lk-timeline',
  `is-${props.direction}`,
  `mode-${props.mode}`,
  { 'is-dashed': props.dashed, 'is-wrap': props.wrap, 'is-last-tail-visible': props.lastVisibleTail }
])

function dotSizeOf(size: Size) {
  // 与子项统一的小一号圆点
  if (size === 'sm') return '16rpx'
  if (size === 'lg') return '26rpx'
  return '20rpx'
}

const rootStyle = computed(() => ({
  '--lk-timeline-gap': toUnit(props.itemGap, '28rpx'),
  '--lk-timeline-line-width': toUnit(props.lineWidth, '4rpx'),
  '--lk-timeline-dot-size': dotSizeOf(props.size),
}))
</script>

<template>
  <view :class="classes" :style="rootStyle" role="list">
    <!-- 默认插槽渲染子项 -->
    <slot />
    <!-- pending 尾部占位/说明 -->
    <template v-if="props.pending">
      <view class="lk-timeline__pending" role="listitem">
        <slot name="pending">
          <text class="lk-timeline__pending-text">{{ typeof props.pending === 'string' ? props.pending : '' }}</text>
        </slot>
      </view>
    </template>
  </view>
  
</template>

<style scoped lang="scss">
.lk-timeline {
  display:flex;
  flex-direction: column;
  gap: 0; // 由“连接器”承担相邻项间距
}
.lk-timeline.is-horizontal {
  flex-direction: row;
  align-items: flex-start;
  flex-wrap: wrap;
}
.lk-timeline.is-horizontal.is-wrap { flex-wrap: wrap; }
.lk-timeline.is-horizontal:not(.is-wrap) { flex-wrap: nowrap; overflow:auto; }

.lk-timeline__pending {
  padding-left: 56rpx; /* 与 item 左侧对齐（点+间距的粗略对齐）*/
  color: var(--lk-color-text-secondary);
  font-size: 24rpx;
}
</style>