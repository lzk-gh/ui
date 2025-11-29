import type { ExtractPropTypes } from 'vue';
import { baseProps, LkProp } from '../common/props';

/**
 * 步进器尺寸
 */
export const StepperSize = {
  Sm: 'sm',
  Md: 'md',
  Lg: 'lg',
} as const;

export type StepperSize = (typeof StepperSize)[keyof typeof StepperSize];

export const stepperProps = {
  ...baseProps,

  /** 绑定值 */
  modelValue: LkProp.number(0),

  /** 最小值 */
  min: {
    type: Number,
    default: Number.NEGATIVE_INFINITY,
  },

  /** 最大值 */
  max: {
    type: Number,
    default: Number.POSITIVE_INFINITY,
  },

  /** 步长 */
  step: LkProp.number(1),

  /** 是否禁用 */
  disabled: LkProp.boolean(false),

  /**
   * 尺寸
   * @value sm 小尺寸
   * @value md 中尺寸
   * @value lg 大尺寸
   */
  size: LkProp.enum(Object.values(StepperSize), StepperSize.Md, 'Stepper.size'),

  /** 表单字段名 */
  prop: LkProp.string(''),
} as const;

export type StepperProps = ExtractPropTypes<typeof stepperProps>;

export const stepperEmits = {
  'update:modelValue': (val: number) => true,
  change: (val: number) => true,
};
