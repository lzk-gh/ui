import type { ExtractPropTypes } from 'vue';
import { baseProps, LkProp } from '../common/props';

export const timePickerProps = {
  ...baseProps,
  /** 绑定值（HH:mm:ss） */
  modelValue: LkProp.string(''),
  /** 时间格式（支持裁剪秒） */
  format: LkProp.string('HH:mm:ss'),
  /** 占位文本 */
  placeholder: LkProp.string('选择时间'),
  /** 是否可清除 */
  clearable: LkProp.boolean(true),
  /** 是否禁用 */
  disabled: LkProp.boolean(false),
  /** 小时步长 */
  stepHour: LkProp.number(1),
  /** 分钟步长 */
  stepMinute: LkProp.number(1),
  /** 秒步长 */
  stepSecond: LkProp.number(1),
} as const;

export type TimePickerProps = ExtractPropTypes<typeof timePickerProps>;

export const timePickerEmits = {
  'update:modelValue': (val: string) => true,
  change: (val: string) => true,
  open: () => true,
  close: () => true,
  clear: () => true,
};
