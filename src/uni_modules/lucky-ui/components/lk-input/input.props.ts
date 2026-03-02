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
 * 输入框类型（uni-app 跨平台兼容类型集合）
 */
export const InputType = {
  Text: 'text',
  Password: 'password',
  Number: 'number',
  Tel: 'tel',
  Email: 'email',
  /** 带小数点的数字键盘（小程序专用） */
  Digit: 'digit',
  /** 身份证输入（小程序专用） */
  Idcard: 'idcard',
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
   * @value number 数字（小程序尾缀输入法）
   * @value tel 电话
   * @value email 邮箱
   * @value digit 带小数点的数字键盘（小程序）
   * @value idcard 身份证输入（小程序）
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

  /** 表单字段名，用于表单验证联动 */
  prop: LkProp.string(''),

  /** 是否自动聚焦 */
  autofocus: LkProp.boolean(false),

  /** 前缀图标名 */
  prefixIcon: LkProp.string(''),

  /** 后缀图标名（showPassword=true 时被密码图标覆盖） */
  suffixIcon: LkProp.string(''),

  /** 是否显示输入字数限制 */
  showWordLimit: LkProp.boolean(false),

  /**
   * 是否显示密码明暗切换按钮
   * 仅当 type="password" 时生效
   * @default false
   */
  showPassword: LkProp.boolean(false),

  /**
   * 输入内容对齐方式
   * @value left 左对齐
   * @value center 居中
   * @value right 右对齐
   */
  inputAlign: LkProp.enum(['left', 'center', 'right'] as const, 'left', 'Input.inputAlign'),

  /**
   * 键盘右下角按钮文字（小程序原生属性）
   * send / search / next / go / done / return
   */
  confirmType: LkProp.string('done'),

  /**
   * 光标与键盘的距离（小程序原生属性，单位 px）
   */
  cursorSpacing: LkProp.number(0),

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

export const inputEmits = {
  'update:modelValue': (_val: string | number) => true,
  /** 实时输入时触发 */
  input: (_val: string | number) => true,
  /** 失焦时触发（携带最终值） */
  change: (_val: string | number) => true,
  blur: (_e: any) => true,
  focus: (_e: any) => true,
  /** 清空时触发 */
  clear: () => true,
  /** 键盘确认时触发（小程序） */
  confirm: (_e: any) => true,
  /** 假输入框点击 */
  click: () => true,
};
