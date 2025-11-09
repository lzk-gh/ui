import type { PropType, ExtractPropTypes } from 'vue';
import { baseProps, LkProp } from '../common/props';

export const ScrollMode = {
  Horizontal: 'horizontal',
  Vertical: 'vertical',
} as const;

export type ScrollMode = (typeof ScrollMode)[keyof typeof ScrollMode];

export const noticeBarProps = {
  ...baseProps,

  /** 文本内容 */
  text: LkProp.string(''),

  /**
   * 滚动模式: false | true | 'horizontal' | 'vertical'
   * - false: 不滚动
   * - true | 'horizontal': 横向滚动
   * - 'vertical': 竖向逐条滚动
   */
  scrollable: {
    type: [Boolean, String] as PropType<boolean | ScrollMode>,
    default: false,
  },

  /** 滚动速度（秒） */
  speed: LkProp.number(10),

  /** 是否可关闭 */
  closeable: LkProp.boolean(false),

  /** 左侧图标名 */
  icon: LkProp.string(''),

  /** 文字颜色 */
  color: LkProp.string('var(--lk-color-primary)'),

  /** 背景颜色 */
  background: LkProp.string('var(--lk-color-primary-bg-soft)'),

  /** 是否不要背景（包括不注入 background 与 color） */
  noBackground: LkProp.boolean(false),

  /** 竖向滚动时的消息列表 */
  messages: {
    type: Array as PropType<string[]>,
    default: () => [] as string[],
  },
} as const;

export type NoticeBarProps = ExtractPropTypes<typeof noticeBarProps>;
