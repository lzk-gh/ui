import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';
import type { TabConfig } from '../../core/src/tabbar-container';

export type { TabConfig } from '../../core/src/tabbar-container';

export const TabbarContainerMode = {
  Plain: 'plain',
  Block: 'block',
  Flashlight: 'flashlight',
  Float: 'float',
  MarkerTop: 'marker-top',
  MarkerBottom: 'marker-bottom',
  DotSlide: 'dot-slide',
  Bubble: 'bubble',
  Ripple: 'ripple',
  MaskFill: 'mask-fill',
  TextRaise: 'text-raise',
} as const;

export type TabbarContainerMode =
  (typeof TabbarContainerMode)[keyof typeof TabbarContainerMode];

export const tabbarContainerProps = {
  ...baseProps,

  /** Tab 配置 */
  tabs: {
    type: Array as PropType<TabConfig[]>,
    default: () => [],
  },

  /** 默认激活的 Tab ID */
  defaultTab: LkProp.string(''),

  /** 是否开启调试模式 */
  debug: LkProp.boolean(false),

  /** Tabbar 模式 */
  mode: LkProp.enum(
    Object.values(TabbarContainerMode),
    TabbarContainerMode.Block,
    'TabbarContainer.mode'
  ),

  /** 预加载延迟（毫秒） */
  preloadDelay: LkProp.number(2000),

  /** 是否预加载所有 Tab */
  preloadAll: LkProp.boolean(true),
} as const;

export const tabbarContainerEmits = {
  change: (tabId: string) => typeof tabId === 'string',
  beforeChange: (tabId: string, oldTabId: string) =>
    typeof tabId === 'string' && typeof oldTabId === 'string',
};

export type TabbarContainerProps = ExtractPropTypes<typeof tabbarContainerProps>;
export type TabbarContainerEmits = typeof tabbarContainerEmits;

