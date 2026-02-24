import type { ExtractPropTypes } from 'vue';
import { LkProp } from '../common/props';

/**
 * 节点状态
 */
export const TimelineItemStatus = ['default', 'active', 'completed', 'pending', 'error'] as const;
export type TimelineItemStatus = (typeof TimelineItemStatus)[number];

/**
 * 节点样式变体（可覆盖父级 dotVariant）
 */
export const TimelineDotVariant = ['filled', 'outlined', 'numbered'] as const;
export type TimelineDotVariant = (typeof TimelineDotVariant)[number];

export const timelineItemProps = {
  /**
   * 节点序号（配合 dotVariant="numbered"）
   */
  index: LkProp.number(-1),

  /**
   * 节点状态
   * @value default 默认
   * @value active 进行中（高亮）
   * @value completed 已完成
   * @value pending 待处理（灰色）
   * @value error 错误
   */
  status: LkProp.enum(TimelineItemStatus, 'default', 'TimelineItem.status'),

  /**
   * 主标题
   */
  title: LkProp.string(''),

  /**
   * 副标题 / 地点等辅助信息
   */
  subtitle: LkProp.string(''),

  /**
   * 正文描述
   */
  desc: LkProp.string(''),

  /**
   * 时间文本（主，如 "09:00" 或 "Jan 12"）
   */
  time: LkProp.string(''),

  /**
   * 日期文本（辅助日期标签，如 "Today"）
   */
  date: LkProp.string(''),

  /**
   * 节点颜色（覆盖默认 accent 色）
   */
  color: LkProp.string(''),

  /**
   * 可选节点图标名（lk-icon name）
   */
  icon: LkProp.string(''),

  /**
   * 节点样式变体（覆盖父级设置）
   * 不传时跟随父级 dotVariant
   */
  dotVariant: LkProp.string(''),

  /**
   * 是否为最后一项（隐藏连接线），不传时自动判断
   */
  last: LkProp.boolean(false),
} as const;

export type TimelineItemProps = ExtractPropTypes<typeof timelineItemProps>;

