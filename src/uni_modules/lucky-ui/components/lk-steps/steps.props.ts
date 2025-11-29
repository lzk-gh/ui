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

export type StepsDirection = (typeof StepsDirection)[keyof typeof StepsDirection];
export type StepsStatus = (typeof StepsStatus)[keyof typeof StepsStatus];

export const stepsProps = {
  ...baseProps,

  /** 当前步骤索引 */
  current: LkProp.number(0),

  /**
   * 方向
   * @value horizontal 水平
   * @value vertical 垂直
   */
  direction: LkProp.enum(Object.values(StepsDirection), StepsDirection.Horizontal, 'Steps.direction'),

  /** 状态 */
  status: LkProp.string(''),
} as const;

export type StepsProps = ExtractPropTypes<typeof stepsProps>;

export const stepsEmits = {
  change: (val: number) => true,
};
