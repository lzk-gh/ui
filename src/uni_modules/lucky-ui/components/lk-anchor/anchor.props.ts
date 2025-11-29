import type { ExtractPropTypes } from 'vue';
import { baseProps, LkProp } from '../common/props';

export const anchorProps = {
  ...baseProps,

  /** 距离顶部偏移量 */
  offsetTop: LkProp.number(0),

  /** 是否固定 */
  affix: LkProp.boolean(false),
} as const;

export type AnchorProps = ExtractPropTypes<typeof anchorProps>;

export const anchorEmits = {
  change: (_: string) => true,
};

export const anchorLinkProps = {
  ...baseProps,

  /** 锚点链接 */
  href: {
    type: String,
    required: true as const,
  },

  /** 链接标题 */
  title: LkProp.string(''),
} as const;

export type AnchorLinkProps = ExtractPropTypes<typeof anchorLinkProps>;
