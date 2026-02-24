import type { ExtractPropTypes } from 'vue';
import { baseProps, LkProp } from '../common/props';

/**
 * 步骤条方向
 */
export const StepsDirection = {
  Horizontal: 'horizontal',
  Vertical: 'vertical',
} as const;

/**
 * 步骤条状态
 */
export const StepsStatus = {
  Finish: 'finish',
  Error: 'error',
} as const;

/**
 * 步骤条样式类型
 */
export const StepsType = {
  Default: 'default',
  Dot: 'dot',
  Progress: 'progress',
} as const;

export type StepsDirection = (typeof StepsDirection)[keyof typeof StepsDirection];
export type StepsStatus = (typeof StepsStatus)[keyof typeof StepsStatus];
export type StepsType = (typeof StepsType)[keyof typeof StepsType];

export const stepsProps = {
  ...baseProps,

  /** 当前步骤索引 */
  current: LkProp.number(0),

  /**
   * 方向
   * @value horizontal 水平
   * @value vertical 垂直
   */
  direction: LkProp.enum(
    Object.values(StepsDirection),
    StepsDirection.Horizontal,
    'Steps.direction'
  ),

  /**
   * 样式类型
   * @value default 默认带图标
   * @value dot 简洁圆点模式
   * @value progress 进度条模式
   */
  type: LkProp.enum(Object.values(StepsType), StepsType.Default, 'Steps.type'),

  /** 状态 */
  status: LkProp.string(''),

  /** 是否显示序号 */
  showNumber: LkProp.boolean(false),
} as const;

export type StepsProps = ExtractPropTypes<typeof stepsProps>;

export const stepsEmits = {
  change: (_val: number) => true,
};
