import type { ExtractPropTypes, PropType } from 'vue';
import type { Columns } from '../lk-picker-view/types';

export const lkPickerProps = {
  modelValue: { type: [Array, String, Number, Object, Boolean] as unknown as PropType<any>, default: null },
  columns: { type: [Array] as unknown as PropType<Columns>, default: () => [] },
  title: { type: String, default: '' },
  confirmText: { type: String, default: '确定' },
  cancelText: { type: String, default: '取消' },
  visible: { type: Boolean, default: false },
  round: { type: Boolean, default: true },
  zIndex: { type: Number, default: 1300 },
} as const;

export type LkPickerProps = ExtractPropTypes<typeof lkPickerProps>;

export const lkPickerEmits = {
  'update:modelValue': (_: any) => true,
  'update:visible': (_: boolean) => true,
  change: (_: any) => true,
  confirm: (_: any) => true,
  cancel: () => true,
};
