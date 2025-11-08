import type { ExtractPropTypes, PropType } from 'vue';
import type { RegionNode } from './data';

export const lkAreaPickerProps = {
  modelValue: {
    type: Array as unknown as PropType<string[]>,
    default: () => [],
  },
  data: {
    type: Array as unknown as PropType<RegionNode[]>,
    default: undefined,
  },
  title: { type: String, default: '选择地区' },
  visible: { type: Boolean, default: false },
  level: { type: Number, default: 3 },
} as const;

export type LkAreaPickerProps = ExtractPropTypes<typeof lkAreaPickerProps>;

export const lkAreaPickerEmits = {
  'update:modelValue': (_: string[]) => true,
  'update:visible': (_: boolean) => true,
  change: (_: string[]) => true,
  confirm: (_: string[]) => true,
  cancel: () => true,
};
