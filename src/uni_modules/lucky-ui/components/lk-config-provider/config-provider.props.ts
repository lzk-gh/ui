import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';
import type { Theme } from '../../composables/useConfig';

export const configProviderProps = {
  ...baseProps,

  /**
   * 主题名称
   * @value light 亮色主题
   * @value dark 暗色主题
   */
  theme: LkProp.string<Theme>('light'),

  /**
   * 品牌色，设置后会自动生成色阶变量
   */
  brandColor: LkProp.string(''),

  /**
   * 自定义主题变量，支持批量设置 CSS 变量
   * 例如：{ 'radius-base': '20rpx', 'font-size-base': '32rpx' }
   */
  themeVars: {
    type: Object as PropType<Record<string, string | number>>,
    default: () => ({}),
  },

  /**
   * 是否开启底部安全区适配
   */
  safeAreaInsetBottom: LkProp.boolean(false),
} as const;

export type ConfigProviderProps = ExtractPropTypes<typeof configProviderProps>;
