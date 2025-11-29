import type { ExtractPropTypes } from 'vue';
import { baseProps, LkProp } from '../common/props';

export const dateTimePickerProps = {
  ...baseProps,
  /** 绑定值 */
  modelValue: LkProp.string(''),
  /** 占位文本 */
  placeholder: LkProp.string('选择日期时间'),
  /** 是否可清除 */
  clearable: LkProp.boolean(true),
  /** 是否禁用 */
  disabled: LkProp.boolean(false),
  /** 日期时间格式 */
  format: LkProp.string('YYYY-MM-DD HH:mm:ss'),
  /** 时间格式 */
  timeFormat: LkProp.string('HH:mm:ss'),
} as const;

export type DateTimePickerProps = ExtractPropTypes<typeof dateTimePickerProps>;

export const dateTimePickerEmits = ['update:modelValue', 'change', 'open', 'close', 'clear'];
