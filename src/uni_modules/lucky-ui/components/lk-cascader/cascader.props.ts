import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';

export interface CascaderNode {
  label: string;
  value: string | number;
  children?: CascaderNode[];
  disabled?: boolean;
}

export const cascaderProps = {
  ...baseProps,
  /** 绑定值 */
  modelValue: {
    type: Array as PropType<Array<string | number>>,
    default: () => [],
  },
  /** 选项数据 */
  options: { type: Array as PropType<CascaderNode[]>, default: () => [] },
  /** 占位文本 */
  placeholder: LkProp.string('请选择'),
  /** 是否可清除 */
  clearable: LkProp.boolean(true),
  /** 是否禁用 */
  disabled: LkProp.boolean(false),
  /** 是否在选择时就触发变化 */
  changeOnSelect: LkProp.boolean(false),
} as const;

export type CascaderProps = ExtractPropTypes<typeof cascaderProps>;

export const cascaderEmits = ['update:modelValue', 'change', 'open', 'close', 'clear'];
