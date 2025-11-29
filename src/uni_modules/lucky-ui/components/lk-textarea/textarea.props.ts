import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';

/**
 * 文本域尺寸
 */
export const TextareaSize = {
  Sm: 'sm',
  Md: 'md',
  Lg: 'lg',
} as const;

export type TextareaSize = (typeof TextareaSize)[keyof typeof TextareaSize];

export const textareaProps = {
  ...baseProps,

  /** 绑定值 */
  modelValue: LkProp.string(''),

  /** 行数 */
  rows: LkProp.number(3),

  /** 自适应高度 */
  autoSize: {
    type: [Boolean, Object] as PropType<boolean | { minRows?: number; maxRows?: number }>,
    default: true,
  },

  /** 最大输入长度，-1 表示不限制 */
  maxlength: LkProp.number(-1),

  /** 是否显示字数统计 */
  showCount: LkProp.boolean(false),

  /** 占位符 */
  placeholder: LkProp.string(''),

  /** 是否禁用 */
  disabled: LkProp.boolean(false),

  /** 是否只读 */
  readonly: LkProp.boolean(false),

  /** 是否可清空 */
  clearable: LkProp.boolean(false),

  /**
   * 尺寸
   * @value sm 小尺寸
   * @value md 中尺寸
   * @value lg 大尺寸
   */
  size: LkProp.enum(Object.values(TextareaSize), TextareaSize.Md, 'Textarea.size'),

  /** 表单字段名 */
  prop: LkProp.string(''),
} as const;

export type TextareaProps = ExtractPropTypes<typeof textareaProps>;

export const textareaEmits = {
  'update:modelValue': (val: string) => true,
  input: (val: string) => true,
  change: (val: string) => true,
  focus: (e: any) => true,
  blur: (e: any) => true,
  clear: () => true,
};
