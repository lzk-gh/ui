import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';

/**
 * 输入框尺寸
 */
export const InputSize = {
  Sm: 'sm',
  Md: 'md',
  Lg: 'lg',
} as const;

/**
 * 输入框类型
 */
export const InputType = {
  Text: 'text',
  Password: 'password',
  Number: 'number',
  Tel: 'tel',
  Email: 'email',
} as const;

export type InputSize = (typeof InputSize)[keyof typeof InputSize];
export type InputType = (typeof InputType)[keyof typeof InputType];

export const inputProps = {
  ...baseProps,

  /** 绑定值 */
  modelValue: {
    type: [String, Number] as PropType<string | number>,
    default: '',
  },

  /**
   * 输入框尺寸
   * @value sm 小尺寸
   * @value md 中尺寸
   * @value lg 大尺寸
   */
  size: LkProp.enum(Object.values(InputSize), InputSize.Md, 'Input.size'),

  /**
   * 输入框类型
   * @value text 文本
   * @value password 密码
   * @value number 数字
   * @value tel 电话
   * @value email 邮箱
   */
  type: LkProp.enum(Object.values(InputType), InputType.Text, 'Input.type'),

  /** 占位符 */
  placeholder: LkProp.string(''),

  /** 是否禁用 */
  disabled: LkProp.boolean(false),

  /** 是否只读 */
  readonly: LkProp.boolean(false),

  /** 是否可清空 */
  clearable: LkProp.boolean(true),

  /** 最大输入长度，-1 表示不限制 */
  maxlength: LkProp.number(-1),

  /** 是否显示字数统计 */
  showCount: LkProp.boolean(false),

  /** 表单字段名 */
  prop: LkProp.string(''),

  /** 是否自动聚焦 */
  autofocus: LkProp.boolean(false),

  /** 前缀图标 */
  prefixIcon: LkProp.string(''),

  /** 后缀图标 */
  suffixIcon: LkProp.string(''),

  /** 是否显示输入字数限制 */
  showWordLimit: LkProp.boolean(false),

  /**
   * 是否为假输入框模式
   * 用于搜索跳转场景，点击会触发 click 事件而非聚焦
   */
  fake: LkProp.boolean(false),

  /**
   * 假输入框的显示文本
   * 当 fake=true 时使用，不设置则显示 placeholder
   */
  fakeText: LkProp.string(''),
} as const;

export type InputProps = ExtractPropTypes<typeof inputProps>;

export const inputEmits = ['update:modelValue', 'input', 'change', 'focus', 'blur', 'clear', 'click'];
