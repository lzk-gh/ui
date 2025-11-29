import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';

/**
 * 选择器尺寸
 */
export const SelectSize = {
  Sm: 'sm',
  Md: 'md',
  Lg: 'lg',
} as const;

export type SelectSize = (typeof SelectSize)[keyof typeof SelectSize];

export const selectProps = {
  ...baseProps,

  /** 绑定值 */
  modelValue: {
    type: [String, Number, Array] as PropType<string | number | any[]>,
    default: '',
  },

  /** 是否多选 */
  multiple: LkProp.boolean(false),

  /** 占位符 */
  placeholder: LkProp.string('请选择'),

  /** 是否禁用 */
  disabled: LkProp.boolean(false),

  /** 是否可清空 */
  clearable: LkProp.boolean(true),

  /** 表单字段名 */
  prop: LkProp.string(''),

  /**
   * 尺寸
   * @value sm 小尺寸
   * @value md 中尺寸
   * @value lg 大尺寸
   */
  size: LkProp.enum(Object.values(SelectSize), SelectSize.Md, 'Select.size'),

  /** 最多显示的标签数量 */
  maxTagCount: LkProp.number(3),

  /** 选择后是否关闭下拉框 */
  closeOnSelect: LkProp.boolean(true),
} as const;

export type SelectProps = ExtractPropTypes<typeof selectProps>;

export const selectEmits = {
  'update:modelValue': (val: any) => true,
  change: (val: any) => true,
  focus: (e: any) => true,
  blur: (e: any) => true,
  clear: () => true,
  open: () => true,
  close: () => true,
};
