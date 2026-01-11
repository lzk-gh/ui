import type { ExtractPropTypes, PropType } from 'vue';

export const tabbarItemProps = {
  /** 唯一标识（必填） */
  name: {
    type: [String, Number] as PropType<string | number>,
    required: true,
  },

  /** 图标名称 */
  icon: {
    type: String as PropType<string>,
    default: '',
  },

  /** 文字标签 */
  label: {
    type: String as PropType<string>,
    default: '',
  },

  /** 徽标数字 */
  badge: {
    type: [String, Number] as PropType<string | number>,
    default: '',
  },

  /** 小红点 */
  dot: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
} as const;

export type TabbarItemProps = ExtractPropTypes<typeof tabbarItemProps>;
