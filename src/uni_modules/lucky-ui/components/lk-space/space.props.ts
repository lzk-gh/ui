import type { ExtractPropTypes, PropType, VNode } from 'vue';
import { baseProps, LkProp } from '../common/props';

export type SpaceSize = number | [number, number] | 'sm' | 'md' | 'lg';

/**
 * 间距方向
 */
export const SpaceDirection = {
  Horizontal: 'horizontal',
  Vertical: 'vertical',
} as const;

/**
 * 对齐方式
 */
export const SpaceAlign = {
  Start: 'start',
  Center: 'center',
  End: 'end',
  Baseline: 'baseline',
} as const;

export type SpaceDirection = (typeof SpaceDirection)[keyof typeof SpaceDirection];
export type SpaceAlign = (typeof SpaceAlign)[keyof typeof SpaceAlign];

export const spaceProps = {
  ...baseProps,

  /** 间距大小 */
  size: {
    type: [Number, Array, String] as unknown as PropType<SpaceSize>,
    default: 'md',
  },

  /**
   * 方向
   * @value horizontal 水平
   * @value vertical 垂直
   */
  direction: LkProp.enum(Object.values(SpaceDirection), SpaceDirection.Horizontal, 'Space.direction'),

  /**
   * 对齐方式
   * @value start 起始
   * @value center 居中
   * @value end 末尾
   * @value baseline 基线
   */
  align: LkProp.enum(Object.values(SpaceAlign), SpaceAlign.Center, 'Space.align'),

  /** 是否换行 */
  wrap: LkProp.boolean(false),

  /** 分隔符 */
  split: {
    type: null as unknown as PropType<VNode | null>,
    default: null,
  },
} as const;

export type SpaceProps = ExtractPropTypes<typeof spaceProps>;
