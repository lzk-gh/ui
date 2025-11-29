import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';

/**
 * 复选框尺寸
 */
export const CheckboxSize = {
  Sm: 'sm',
  Md: 'md',
  Lg: 'lg',
} as const;

/**
 * 复选框形状
 */
export const CheckboxShape = {
  Square: 'square',
  Round: 'round',
} as const;

export type CheckboxSize = (typeof CheckboxSize)[keyof typeof CheckboxSize];
export type CheckboxShape = (typeof CheckboxShape)[keyof typeof CheckboxShape];

export const checkboxProps = {
  ...baseProps,

  /** 绑定值 */
  modelValue: {
    type: [Boolean, String, Number] as PropType<boolean | string | number>,
    default: undefined,
  },

  /** 选项标签 */
  label: {
    type: [String, Number, Boolean, Object] as PropType<string | number | boolean | object>,
    default: undefined,
  },

  /** 选中时的值 */
  trueValue: {
    type: [Boolean, String, Number] as PropType<boolean | string | number>,
    default: true,
  },

  /** 未选中时的值 */
  falseValue: {
    type: [Boolean, String, Number] as PropType<boolean | string | number>,
    default: false,
  },

  /** 尺寸 */
  size: LkProp.string(''),

  /** 是否禁用 */
  disabled: LkProp.boolean(false),

  /** 是否为中间状态 */
  indeterminate: LkProp.boolean(false),

  /** 图标类型 */
  iconType: LkProp.string(''),

  /** 形状 */
  shape: LkProp.string(''),
} as const;

export type CheckboxProps = ExtractPropTypes<typeof checkboxProps>;

export const checkboxEmits = ['update:modelValue', 'change'];
