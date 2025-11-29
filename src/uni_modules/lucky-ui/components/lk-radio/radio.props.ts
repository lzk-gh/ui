import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';

/**
 * 单选框尺寸
 */
export const RadioSize = {
  Sm: 'sm',
  Md: 'md',
  Lg: 'lg',
} as const;

/**
 * 单选框形状
 */
export const RadioShape = {
  Square: 'square',
  Round: 'round',
} as const;

export type RadioSize = (typeof RadioSize)[keyof typeof RadioSize];
export type RadioShape = (typeof RadioShape)[keyof typeof RadioShape];

export const radioProps = {
  ...baseProps,

  /** 绑定值 */
  modelValue: {
    type: [String, Number, Boolean] as PropType<string | number | boolean>,
    default: undefined,
  },

  /** 选项值 */
  label: {
    type: [String, Number, Boolean] as PropType<string | number | boolean>,
    required: true as const,
  },

  /** 尺寸 */
  size: LkProp.string(''),

  /** 是否禁用 */
  disabled: LkProp.boolean(false),

  /** 图标类型 */
  iconType: LkProp.string(''),

  /** 形状 */
  shape: LkProp.string(''),
} as const;

export type RadioProps = ExtractPropTypes<typeof radioProps>;

export const radioEmits = ['update:modelValue', 'change'];
