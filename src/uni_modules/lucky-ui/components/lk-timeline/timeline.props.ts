import type { ExtractPropTypes } from 'vue';
import { baseProps, LkProp } from '../common/props';

/**
 * 时间轴排列方向
 */
export const TimelineDirection = ['vertical', 'horizontal'] as const;
export type TimelineDirection = (typeof TimelineDirection)[number];

/**
 * 节点默认样式变体
 */
export const TimelineDotVariant = ['filled', 'outlined', 'numbered'] as const;
export type TimelineDotVariant = (typeof TimelineDotVariant)[number];

export const timelineProps = {
  ...baseProps,

  /**
   * 排列方向
   * @value vertical 垂直（默认）
   * @value horizontal 水平滚动
   */
  direction: LkProp.enum(TimelineDirection, 'vertical', 'Timeline.direction'),

  /**
   * 是否显示连接线
   */
  showLine: LkProp.boolean(true),

  /**
   * 激活节点索引（0-based），-1 表示不高亮
   */
  activeIndex: LkProp.number(-1),

  /**
   * 节点样式变体
   * @value filled 实心圆（默认）
   * @value outlined 空心圆描边
   * @value numbered 数字序号
   */
  dotVariant: LkProp.enum(TimelineDotVariant, 'filled', 'Timeline.dotVariant'),
} as const;

export type TimelineProps = ExtractPropTypes<typeof timelineProps>;

