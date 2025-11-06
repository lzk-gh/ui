import type { ExtractPropTypes, PropType, VNode } from 'vue';

export type SpaceSize = number | [number, number] | 'sm'|'md'|'lg';
export type SpaceDirection = 'horizontal'|'vertical';
export type SpaceAlign = 'start'|'center'|'end'|'baseline';

export const lkSpaceProps = {
  size: { type: [Number, Array, String] as unknown as PropType<SpaceSize>, default: 'md' },
  direction: { type: String as () => SpaceDirection, default: 'horizontal' },
  align: { type: String as () => SpaceAlign, default: 'center' },
  wrap: { type: Boolean, default: false },
  split: { type: null as unknown as PropType<VNode | null>, default: null },
} as const;

export type LkSpaceProps = ExtractPropTypes<typeof lkSpaceProps>;
