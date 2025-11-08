import type { ExtractPropTypes, PropType } from 'vue';

export interface PickerOption {
  label: string;
  value: any;
}

export type Columns = PickerOption[] | PickerOption[][];

export const lkPickerViewProps = {
  columns: { type: [Array] as unknown as PropType<Columns>, default: () => [] },
  modelValue: {
    type: [Array, String, Number, Object, Boolean] as unknown as PropType<any>,
    default: null,
  },
} as const;

export type LkPickerViewProps = ExtractPropTypes<typeof lkPickerViewProps>;

export const lkPickerViewEmits = {
  'update:modelValue': (_: any) => true,
  change: (_: any) => true,
};
