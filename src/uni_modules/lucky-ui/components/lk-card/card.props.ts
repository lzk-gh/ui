import type { ExtractPropTypes } from 'vue';
import { baseProps, LkProp } from '../common/props';

/**
 * 卡片阴影
 */
export const CardShadow = {
  Base: 'base',
  Hover: 'hover',
  Always: 'always',
  Never: 'never',
} as const;

export type CardShadow = (typeof CardShadow)[keyof typeof CardShadow];

export const cardProps = {
  ...baseProps,

  /** 标题 */
  title: LkProp.string(''),

  /** 副标题 */
  subTitle: LkProp.string(''),

  /**
   * 阴影显示时机
   * @value base 默认阴影
   * @value hover 悬停时显示
   * @value always 始终显示
   * @value never 不显示
   */
  shadow: LkProp.enum(Object.values(CardShadow), CardShadow.Base, 'Card.shadow'),

  /** 内边距 */
  padding: LkProp.string('32rpx'),

  /** 是否显示边框 */
  border: LkProp.boolean(false),

  /** 是否可悬停 */
  hoverable: LkProp.boolean(false),
} as const;

export type CardProps = ExtractPropTypes<typeof cardProps>;
