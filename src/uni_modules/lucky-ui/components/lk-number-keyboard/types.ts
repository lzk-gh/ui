import type { ExtractPropTypes, PropType } from 'vue';

export const lkNumberKeyboardProps = {
  visible: { type: Boolean, default: false },
  random: { type: Boolean, default: false },
  extraKey: { type: String, default: '' },
  confirmText: { type: String, default: '确认' },
  allowDecimal: { type: Boolean, default: false },
  allowKeyboard: { type: Boolean, default: false },
  safeArea: { type: Boolean, default: true },
  zIndex: { type: Number, default: 1300 },
} as const;

export type LkNumberKeyboardProps = ExtractPropTypes<typeof lkNumberKeyboardProps>;

export const lkNumberKeyboardEmits = {
  'update:visible': (_: boolean) => true,
  input: (_: string) => true,
  delete: () => true,
  confirm: () => true,
  close: () => true,
};
