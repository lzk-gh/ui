import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';

/** 颜色格式 */
const ColorFormat = {
  Hex: 'hex',
  Rgb: 'rgb',
  Hsv: 'hsv',
} as const;
export type ColorFormat = (typeof ColorFormat)[keyof typeof ColorFormat];

export const colorPickerProps = {
  ...baseProps,
  /** 绑定值 */
  modelValue: LkProp.string(''),
  /** 颜色格式 */
  format: LkProp.enum(Object.values(ColorFormat), ColorFormat.Hex, 'ColorPicker.format'),
  /** 是否支持透明度 */
  alpha: LkProp.boolean(false),
  /** 预设颜色 */
  preset: { type: Array as unknown as PropType<string[]>, default: () => [] },
} as const;

export type LkColorPickerProps = ExtractPropTypes<typeof colorPickerProps>;

export const colorPickerEmits = {
  'update:modelValue': (_: string) => true,
  change: (_: string) => true,
};
