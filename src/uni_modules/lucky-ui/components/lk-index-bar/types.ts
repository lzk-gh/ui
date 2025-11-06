import type { ExtractPropTypes, PropType } from 'vue';

export const defaultIndexList = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

export const lkIndexBarProps = {
  indexList: { type: Array as unknown as PropType<string[]>, default: () => defaultIndexList },
  sticky: { type: Boolean, default: true },
  stickyOffsetTop: { type: Number, default: 0 },
  scrollTarget: { type: String, default: '' },
} as const;

export type LkIndexBarProps = ExtractPropTypes<typeof lkIndexBarProps>;

export const lkIndexBarEmits = {
  select: (_: string) => true,
  change: (_: string) => true,
};

export const lkIndexAnchorProps = {
  index: { type: String, required: true },
  title: { type: String, default: '' },
} as const;

export type LkIndexAnchorProps = ExtractPropTypes<typeof lkIndexAnchorProps>;
