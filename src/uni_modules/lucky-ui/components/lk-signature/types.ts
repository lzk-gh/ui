import type { ExtractPropTypes } from 'vue';

export const lkSignatureProps = {
  width: { type: Number, default: 600 },
  height: { type: Number, default: 300 },
  lineWidth: { type: Number, default: 3 },
  color: { type: String, default: '#111' },
  background: { type: String, default: '#fff' },
  undo: { type: Boolean, default: true },
} as const;

export type LkSignatureProps = ExtractPropTypes<typeof lkSignatureProps>;
