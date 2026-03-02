import type { ExtractPropTypes } from 'vue';
import { baseProps, LkProp } from '../common/props';

export const TextareaVariant = {
  Outline: 'outline',
  Filled: 'filled',
  Flush: 'flush',
} as const;

export type TextareaVariant = (typeof TextareaVariant)[keyof typeof TextareaVariant];

export const textareaProps = {
  ...baseProps,

  /** 绑定值 */
  modelValue: LkProp.string(''),

  /** 标签 */
  label: LkProp.string(''),

  /** 占位符 */
  placeholder: LkProp.string('请输入内容'),

  /** 占位符类名 */
  placeholderClass: LkProp.string('lk-textarea__placeholder'),

  /**
   * 风格变体 outline | filled | flush
   * @default outline
   */
  variant: LkProp.enum(Object.values(TextareaVariant), TextareaVariant.Outline, 'Textarea.variant'),

  /** 是否禁用 */
  disabled: LkProp.boolean(false),

  /** 最大输入长度，-1 表示不限制 */
  maxlength: LkProp.number(-1),

  /** 是否自动增高 */
  autoHeight: LkProp.boolean(false),

  /** 是否显示字数统计 */
  showCount: LkProp.boolean(false),

  /** 是否可清空 */
  clearable: LkProp.boolean(false),

  /**
   * 键盘右下角按钮文字
   * send / search / next / go / done / return
   */
  confirmType: LkProp.string('return'),

  /** 键盘弹起时，是否自动上推页面（小程序原生属性） */
  adjustPosition: LkProp.boolean(true),

  /** 光标与键盘的距离，单位 rpx（小程序原生属性） */
  cursorSpacing: LkProp.number(0),

  /** 是否展示在键盘上方 */
  fixed: LkProp.boolean(false),

  /** 表单字段名，用于表单验证联动 */
  prop: LkProp.string(''),

  /** 是否触发表单验证（默认 true） */
  validateEvent: LkProp.boolean(true),
} as const;

export const textareaEmits = {
  'update:modelValue': (_val: string) => true,
  input: (_val: string) => true,
  /** 失焦时触发，携带最终值 */
  change: (_val: string) => true,
  focus: (_e: unknown) => true,
  blur: (_e: unknown) => true,
  confirm: (_e: unknown) => true,
  clear: () => true,
  linechange: (_e: unknown) => true,
};

export type TextareaProps = ExtractPropTypes<typeof textareaProps>;