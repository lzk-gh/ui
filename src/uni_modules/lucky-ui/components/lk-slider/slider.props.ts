import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';

export type SliderSize = 'small' | 'default' | 'large';
const sliderSizeValues = ['small', 'default', 'large'] as const;

export const sliderProps = {
  ...baseProps,

  /** 绑定值 (number | number[]) */
  modelValue: {
    type: [Number, Array] as PropType<number | number[]>,
    default: 0,
  },

  /** 是否开启双滑块范围选择 */
  range: LkProp.boolean(false),

  /** 最小值 */
  min: LkProp.number(0),

  /** 最大值 */
  max: LkProp.number(100),

  /** 步长 */
  step: LkProp.number(1),

  /** 是否显示间断点 */
  showStops: LkProp.boolean(false),

  /** 是否禁用 */
  disabled: LkProp.boolean(false),

  /** 是否显示当前值 */
  showValue: LkProp.boolean(false),

  /** 尺寸 */
  size: LkProp.enum(sliderSizeValues, 'default', 'Slider.size'),

  /** 激活条颜色 */
  activeColor: LkProp.string(''),

  /** 背景条颜色 */
  inactiveColor: LkProp.string(''),

  /** 滑块大小 */
  blockSize: LkProp.string(''),

  /** 滑块颜色 */
  blockColor: LkProp.string(''),

  /** 轨道高度 */
  barHeight: LkProp.string(''),

  prop: LkProp.string(''),
} as const;

export type SliderProps = ExtractPropTypes<typeof sliderProps>;

export const sliderEmits = {
  'update:modelValue': (val: number | number[]) => true,
  change: (val: number | number[]) => true,
  input: (val: number | number[]) => true,
  dragstart: () => true,
  dragend: () => true,
};
