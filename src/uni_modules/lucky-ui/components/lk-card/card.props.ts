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

  /** 是否可悬停 */
  hoverable: LkProp.boolean(false),
} as const;

export type CardProps = ExtractPropTypes<typeof cardProps>;
