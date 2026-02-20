import type { ExtractPropTypes } from 'vue';
import { baseProps, LkProp } from '../common/props';

export const TextareaVariant = {
  Outline: 'outline', // 描边型（传统）
  Filled: 'filled', // 填充型（现代，带灰色背景）
  Flush: 'flush', // 无边框型（适合列表）
} as const;

export type TextareaVariant = (typeof TextareaVariant)[keyof typeof TextareaVariant];

export const textareaProps = {
  ...baseProps,
  modelValue: LkProp.string(''),
  label: LkProp.string(''),
  placeholder: LkProp.string('请输入内容'),
  placeholderClass: LkProp.string('lk-textarea__placeholder'),

  /**
   * 风格变体
   * @default outline
   */
  variant: LkProp.enum(Object.values(TextareaVariant), TextareaVariant.Outline, 'Textarea.variant'),

  disabled: LkProp.boolean(false),
  maxlength: LkProp.number(140),
  autoHeight: LkProp.boolean(false),
  showCount: LkProp.boolean(false),

  /** 是否可清空 */
  clearable: LkProp.boolean(false),

  /**
   * 原生属性：键盘右下角按钮的文字
   * send, search, next, go, done
   */
  confirmType: LkProp.string('return'),

  /** 原生属性：键盘弹起时，是否自动上推页面 */
  adjustPosition: LkProp.boolean(true),

  cursorSpacing: LkProp.number(0),
  fixed: LkProp.boolean(false),
} as const;

export const textareaEmits = {
  'update:modelValue': (_val: string) => true,
  focus: (_e: unknown) => true,
  blur: (_e: unknown) => true,
  confirm: (_e: unknown) => true,
  input: (_val: string) => true,
  clear: () => true,
  linechange: (_e: unknown) => true,
};

export type TextareaProps = ExtractPropTypes<typeof textareaProps>;
