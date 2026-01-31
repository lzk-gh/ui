import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';

export const defaultIndexList = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

export const indexBarProps = {
  ...baseProps,

  /** 索引列表 */
  indexList: {
    type: Array as unknown as PropType<string[]>,
    default: () => defaultIndexList,
  },

  /** 是否开启吸顶 */
  sticky: LkProp.boolean(true),

  /** 吸顶时距离顶部的偏移量 */
  stickyOffsetTop: LkProp.number(0),

  /** 滚动容器选择器 */
  scrollTarget: LkProp.string(''),

  /** 是否显示触摸时的大字母提示 */
  showIndicator: LkProp.boolean(true),

  /** 高亮颜色 */
  highlightColor: LkProp.string(''),
} as const;

export type IndexBarProps = ExtractPropTypes<typeof indexBarProps>;

export const indexBarEmits = {
  select: (_: string) => true,
  change: (_: string) => true,
};

export const indexAnchorProps = {
  ...baseProps,

  /** 索引字符 */
  index: {
    type: String,
    required: true as const,
  },

  /** 锚点标题 */
  title: LkProp.string(''),
} as const;

export type IndexAnchorProps = ExtractPropTypes<typeof indexAnchorProps>;
