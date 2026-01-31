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
 * 时间轴尺寸
 */
export const TimelineSize = {
  Sm: 'sm',
  Md: 'md',
  Lg: 'lg',
} as const;

export type TimelineDirection = (typeof TimelineDirection)[keyof typeof TimelineDirection];
export type TimelineSize = (typeof TimelineSize)[keyof typeof TimelineSize];

export const timelineProps = {
  ...baseProps,

  /**
   * 方向
   * @value vertical 垂直
   * @value horizontal 水平
   */
  direction: LkProp.enum(
    Object.values(TimelineDirection),
    TimelineDirection.Vertical,
    'Timeline.direction'
  ),

  /** 是否显示待完成项 */
  pending: {
    type: [Boolean, String] as PropType<boolean | string>,
    default: false,
  },

  /** 是否显示时间轴 */
  showLine: LkProp.boolean(true),

  /** 是否显示时间区域 */
  showTime: LkProp.boolean(true),

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

  /** 激活的索引（从 0 开始），仅在子项未传 active 时生效 */
  activeIndex: LkProp.number(-1),

  /**
   * 尺寸
   * @value sm 小尺寸
   * @value md 中尺寸
   * @value lg 大尺寸
   */
  size: LkProp.enum(Object.values(TimelineSize), TimelineSize.Md, 'Timeline.size'),
} as const;

export type TimelineProps = ExtractPropTypes<typeof timelineProps>;
