import type { ExtractPropTypes } from 'vue';

export const lkVerifyCodeProps = {
  length: { type: Number, default: 6 },
  modelValue: { type: String, default: '' },
  type: { type: String as () => 'text'|'number', default: 'number' },
  mask: { type: Boolean, default: false },
  autofocus: { type: Boolean, default: false },
} as const;

export type LkVerifyCodeProps = ExtractPropTypes<typeof lkVerifyCodeProps>;

export const lkVerifyCodeEmits = {
  'update:modelValue': (_: string) => true,
  finish: (_: string) => true,
};
