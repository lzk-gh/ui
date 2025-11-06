import type { ExtractPropTypes, PropType } from 'vue';

export type ColorFormat = 'hex'|'rgb'|'hsv';

export const lkColorPickerProps = {
  modelValue: { type: String, default: '' },
  format: { type: String as () => ColorFormat, default: 'hex' },
  alpha: { type: Boolean, default: false },
  preset: { type: Array as unknown as PropType<string[]>, default: () => [] },
} as const;

export type LkColorPickerProps = ExtractPropTypes<typeof lkColorPickerProps>;

export const lkColorPickerEmits = {
  'update:modelValue': (_: string) => true,
  change: (_: string) => true,
};
