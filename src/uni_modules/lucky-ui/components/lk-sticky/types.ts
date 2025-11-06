import type { ExtractPropTypes } from 'vue';

export const lkStickyProps = {
  offsetTop: { type: Number, default: 0 },
  zIndex: { type: Number, default: 99 },
  container: { type: [String, Object] as any, default: '' },
} as const;

export type LkStickyProps = ExtractPropTypes<typeof lkStickyProps>;
