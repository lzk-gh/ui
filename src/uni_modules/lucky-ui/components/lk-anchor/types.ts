import type { ExtractPropTypes } from 'vue';

export const lkAnchorProps = {
  offsetTop: { type: Number, default: 0 },
  affix: { type: Boolean, default: false },
} as const;

export type LkAnchorProps = ExtractPropTypes<typeof lkAnchorProps>;

export const lkAnchorEmits = {
  change: (_: string) => true,
};

export const lkAnchorLinkProps = {
  href: { type: String, required: true },
  title: { type: String, default: '' },
} as const;

export type LkAnchorLinkProps = ExtractPropTypes<typeof lkAnchorLinkProps>;
