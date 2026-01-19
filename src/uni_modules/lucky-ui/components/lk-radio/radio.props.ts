import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';

export const radioGroupProps = {
  ...baseProps,
  /** 绑定值 */
  modelValue: {
    type: [String, Number, Boolean] as PropType<any>,
    default: '',
  },
  /** 尺寸 sm | md | lg */
  size: LkProp.string('md'),
  /** 是否禁用 */
  disabled: LkProp.boolean(false),
  /** 排列方向 row | column */
  direction: LkProp.string('row'),
  /** 图标颜色 */
  activeColor: LkProp.string(''),
  /** 形状 circle | square */
  shape: LkProp.string('circle'),
  /** 图标类型 dot | check */
  iconType: LkProp.string('dot'),
} as const;

export const radioProps = {
  ...baseProps,
  /** 标识符 */
  name: {
    type: [String, Number, Boolean] as PropType<any>,
    default: '',
  },
  /** 形状 circle | square */
  shape: LkProp.string(''),
  /** 图标类型 dot | check */
  iconType: LkProp.string(''),
  /** 是否禁用 */
  disabled: LkProp.boolean(false),
  /** 选中颜色 */
  activeColor: LkProp.string(''),
  /** 大小，支持设置数字 */
  iconSize: LkProp.stringNumber(''),
  /** 标签对应的内容 */
  label: LkProp.string(''),
  /** 标签是否禁用点击 */
  labelDisabled: LkProp.boolean(false),
} as const;

export type RadioGroupProps = ExtractPropTypes<typeof radioGroupProps>;
export type RadioProps = ExtractPropTypes<typeof radioProps>;

export const radioGroupEmits = ['update:modelValue', 'change'];
export const radioEmits = ['update:modelValue', 'change'];
