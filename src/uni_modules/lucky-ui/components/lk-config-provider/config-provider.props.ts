import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps } from '../common/props';

export const configProviderProps = {
  ...baseProps,
  /**
   * 强制指定主题，不传则跟随全局 Store
   * @value light
   * @value dark
   */
  theme: {
    type: String as PropType<'light' | 'dark'>,
    default: undefined,
  },
  /**
   * 强制指定品牌色，不传则跟随全局 Store
   */
  brandColor: {
    type: String,
    default: undefined,
  },
  /**
   * 是否自动适配底部安全区
   */
  safeAreaInsetBottom: {
    type: Boolean,
    default: false,
  },
  /**
   * 容器标签名，默认 view
   */
  tag: {
    type: String,
    default: 'view',
  },
} as const;

export type ConfigProviderProps = ExtractPropTypes<typeof configProviderProps>;
