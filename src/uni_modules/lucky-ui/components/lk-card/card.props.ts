import type { ExtractPropTypes } from 'vue';
import { baseProps, LkProp } from '../common/props';

export const cardProps = {
  ...baseProps,

  /** 标题 */
  title: LkProp.string(''),

  /** 副标题 */
  subTitle: LkProp.string(''),

  /** 内边距 */
  padding: LkProp.string('32rpx'),

  /** 是否显示边框 */
  border: LkProp.boolean(false),

  /** 阴影强度 */
  shadow: LkProp.enum(['none', 'never', 'sm', 'md', 'base', 'lg'] as const, 'sm', 'Card.shadow'),

  /** 自定义背景色（传入空字符串表示使用默认） */
  bgColor: LkProp.string(''),

  /** 透明背景 */
  transparent: LkProp.boolean(false),

  /** 是否可悬停 */
  hoverable: LkProp.boolean(false),
} as const;

export type CardProps = ExtractPropTypes<typeof cardProps>;
