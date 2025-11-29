import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';

/**
 * 时间轴方向
 */
export const TimelineDirection = {
  Vertical: 'vertical',
  Horizontal: 'horizontal',
} as const;

/**
 * 时间轴模式
 */
export const TimelineMode = {
  Left: 'left',
  Right: 'right',
  Alternate: 'alternate',
} as const;

/**
 * 时间轴尺寸
 */
export const TimelineSize = {
  Sm: 'sm',
  Md: 'md',
  Lg: 'lg',
} as const;

/**
 * 线条端点
 */
export const TimelineLineCap = {
  Flush: 'flush',
  Equal: 'equal',
} as const;

export type TimelineDirection = (typeof TimelineDirection)[keyof typeof TimelineDirection];
export type TimelineMode = (typeof TimelineMode)[keyof typeof TimelineMode];
export type TimelineSize = (typeof TimelineSize)[keyof typeof TimelineSize];
export type TimelineLineCap = (typeof TimelineLineCap)[keyof typeof TimelineLineCap];

export const timelineProps = {
  ...baseProps,

  /**
   * 方向
   * @value vertical 垂直
   * @value horizontal 水平
   */
  direction: LkProp.enum(Object.values(TimelineDirection), TimelineDirection.Vertical, 'Timeline.direction'),

  /**
   * 模式
   * @value left 左侧
   * @value right 右侧
   * @value alternate 交替
   */
  mode: LkProp.enum(Object.values(TimelineMode), TimelineMode.Left, 'Timeline.mode'),

  /** 是否倒序 */
  reverse: LkProp.boolean(false),

  /** 是否显示待完成项 */
  pending: {
    type: [Boolean, String] as PropType<boolean | string>,
    default: false,
  },

  /** 是否虚线 */
  dashed: LkProp.boolean(false),

  /**
   * 线条端点
   * @value flush 两端0距离
   * @value equal 均等间隔
   */
  lineCap: LkProp.enum(Object.values(TimelineLineCap), TimelineLineCap.Equal, 'Timeline.lineCap'),

  /** 线条颜色 */
  lineColor: LkProp.string('var(--lk-color-border-weak)'),

  /** 线条宽度 */
  lineWidth: {
    type: [Number, String] as PropType<number | string>,
    default: '4rpx',
  },

  /** 项目间距 */
  itemGap: {
    type: [Number, String] as PropType<number | string>,
    default: '28rpx',
  },

  /**
   * 尺寸
   * @value sm 小尺寸
   * @value md 中尺寸
   * @value lg 大尺寸
   */
  size: LkProp.enum(Object.values(TimelineSize), TimelineSize.Md, 'Timeline.size'),

  /** 是否显示最后一项的尾巴 */
  lastVisibleTail: LkProp.boolean(false),

  /** 是否换行 */
  wrap: LkProp.boolean(true),
} as const;

export type TimelineProps = ExtractPropTypes<typeof timelineProps>;
