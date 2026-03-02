import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';
import type { FormRules } from './context';

/**
 * 标签对齐方式
 */
export const FormLabelAlign = {
  Left: 'left',
  Right: 'right',
  Top: 'top',
} as const;

export type FormLabelAlign = (typeof FormLabelAlign)[keyof typeof FormLabelAlign];

export const formProps = {
  ...baseProps,

  /** 表单数据对象 */
  model: {
    type: Object as PropType<Record<string, any>>,
    required: true as const,
  },

  /** 表单验证规则 */
  rules: {
    type: Object as PropType<FormRules>,
    default: undefined,
  },

  /** 标签宽度 */
  labelWidth: {
    type: [String, Number] as PropType<string | number>,
    default: '',
  },

  /**
   * 标签对齐方式
   * @value left 左对齐
   * @value right 右对齐
   * @value top 顶部对齐
   */
  labelAlign: LkProp.enum(Object.values(FormLabelAlign), FormLabelAlign.Left, 'Form.labelAlign'),

  /** 是否显示错误信息 */
  showMessage: LkProp.boolean(true),

  /**
   * 验证失败后是否自动滚动到第一个错误字段
   * @default false
   */
  scrollToError: LkProp.boolean(false),

  /**
   * 是否禁用本表单内所有控件
   */
  disabled: LkProp.boolean(false),
} as const;

export type FormProps = ExtractPropTypes<typeof formProps>;

export const formItemProps = {
  ...baseProps,

  /** 表单字段名 */
  prop: LkProp.string(''),

  /** 标签文本 */
  label: LkProp.string(''),

  /** 是否必填 */
  required: {
    type: Boolean as PropType<boolean>,
    default: undefined,
  },

  /** 标签宽度 */
  labelWidth: {
    type: [String, Number] as PropType<string | number>,
    default: '',
  },

  /** 标签对齐方式，继承 Form */
  labelAlign: LkProp.string(''),

  /** 是否显示错误信息 */
  showMessage: {
    type: Boolean as PropType<boolean>,
    default: undefined,
  },
} as const;

export type FormItemProps = ExtractPropTypes<typeof formItemProps>;
