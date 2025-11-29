import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps } from '../common/props';

export interface PickerOption {
  label: string;
  value: any;
}

export type Columns = PickerOption[] | PickerOption[][];

export const pickerViewProps = {
  ...baseProps,

  /** 选项列数据 */
  columns: {
    type: [Array] as unknown as PropType<Columns>,
    default: () => [],
  },

  /** 绑定值 */
  modelValue: {
    type: [Array, String, Number, Object, Boolean] as unknown as PropType<any>,
    default: null,
  },
} as const;

export type PickerViewProps = ExtractPropTypes<typeof pickerViewProps>;

export const pickerViewEmits = {
  'update:modelValue': (_: any) => true,
  change: (_: any) => true,
};
