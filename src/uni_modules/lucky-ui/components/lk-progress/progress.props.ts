import type { ExtractPropTypes } from 'vue';
import { baseProps, LkProp } from '../common/props';

/**
 * 进度条类型
 */
export const ProgressType = {
  Linear: 'linear',
  Circle: 'circle',
} as const;

export type ProgressType = (typeof ProgressType)[keyof typeof ProgressType];

export const progressProps = {
  ...baseProps,

  /** 进度百分比 */
  percentage: LkProp.number(0),

  /** 是否显示条纹 */
  striped: LkProp.boolean(false),

  /** 是否动画 */
  animated: LkProp.boolean(false),

  /** 文字是否显示在进度条内 */
  textInside: LkProp.boolean(false),

  /** 是否显示文字 */
  showText: LkProp.boolean(true),

  /**
   * 类型
   * @value linear 线性
   * @value circle 环形
   */
  type: LkProp.enum(Object.values(ProgressType), ProgressType.Linear, 'Progress.type'),

  /** 环形进度条尺寸（rpx） */
  size: LkProp.number(120),

  /** 进度条线条宽度 */
  stroke: LkProp.number(10),
} as const;

export type ProgressProps = ExtractPropTypes<typeof progressProps>;
