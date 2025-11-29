import type { ExtractPropTypes } from 'vue';
import { baseProps, LkProp } from '../common/props';

export const sliderProps = {
  ...baseProps,

  /** 绑定值 */
  modelValue: LkProp.number(0),

  /** 最小值 */
  min: LkProp.number(0),

  /** 最大值 */
  max: LkProp.number(100),

  /** 步长 */
  step: LkProp.number(1),

  /** 是否禁用 */
  disabled: LkProp.boolean(false),

  /** 是否显示当前值 */
  showValue: LkProp.boolean(true),

  /** 表单字段名 */
  prop: LkProp.string(''),
} as const;

export type SliderProps = ExtractPropTypes<typeof sliderProps>;

export const sliderEmits = {
  'update:modelValue': (val: number) => true,
  change: (val: number) => true,
  input: (val: number) => true,
  dragstart: () => true,
  dragend: () => true,
};
