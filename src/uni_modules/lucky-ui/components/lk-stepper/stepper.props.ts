import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';

export const StepperSize = {
  Sm: 'sm',
  Md: 'md',
  Lg: 'lg',
} as const;
export type StepperSize = (typeof StepperSize)[keyof typeof StepperSize];

export const stepperProps = {
  ...baseProps,

  /** 绑定值 */
  modelValue: {
    type: [Number, String] as PropType<number | string>,
    default: 0,
  },

  /** 最小值 */
  min: { type: [Number, String] as unknown as PropType<number | string>, default: 1 },

  /** 最大值 */
  max: { type: [Number, String] as unknown as PropType<number | string>, default: Infinity },

  /** 步长 */
  step: { type: [Number, String] as unknown as PropType<number | string>, default: 1 },

  /** 是否只允许整数 */
  integer: LkProp.boolean(false),

  /** 是否禁用 */
  disabled: LkProp.boolean(false),

  /** 是否禁用输入框 */
  disableInput: LkProp.boolean(false),

  /** 是否开启长按手势 */
  longPress: LkProp.boolean(true),

  /** 尺寸 */
  size: LkProp.enum(Object.values(StepperSize), StepperSize.Md, 'Stepper.size'),

  /** 输入框宽度 (rpx) */
  inputWidth: { type: [Number, String] as unknown as PropType<number | string>, default: '' },

  /** 按钮宽度 (rpx) */
  buttonSize: { type: [Number, String] as unknown as PropType<number | string>, default: '' },

  /** 变更前拦截: return false 或 Promise<false> 阻止 */
  beforeChange: {
    type: Function as PropType<(val: number) => boolean | Promise<boolean>>,
    default: null,
  },
} as const;

export type StepperProps = ExtractPropTypes<typeof stepperProps>;

export const stepperEmits = {
  'update:modelValue': (_val: number | string) => true,
  change: (_val: number | string) => true,
  overlimit: (_type: 'minus' | 'plus') => true,
  focus: (_e: unknown) => true,
  blur: (_e: unknown) => true,
};
