import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';

export const dateRangePickerProps = {
  ...baseProps,
  /** 绑定值 */
  modelValue: { type: Array as PropType<[string, string] | []>, default: () => [] },
  /** 占位文本 */
  placeholder: LkProp.string('选择日期范围'),
  /** 是否可清除 */
  clearable: LkProp.boolean(true),
  /** 是否禁用 */
  disabled: LkProp.boolean(false),
  /** 是否联动 */
  linked: LkProp.boolean(true),
  /** 每周第一天 */
  firstDay: LkProp.number(1),
} as const;

export type DateRangePickerProps = ExtractPropTypes<typeof dateRangePickerProps>;

export const dateRangePickerEmits = ['update:modelValue', 'change', 'open', 'close', 'clear'];
