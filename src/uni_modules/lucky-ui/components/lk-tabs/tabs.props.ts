import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';

/**
 * Tabs 类型
 */
export const TabsType = {
  Line: 'line',
  Card: 'card',
  Pill: 'pill',
} as const;

export type TabsType = (typeof TabsType)[keyof typeof TabsType];
export type TabsValue = string | number;

export interface TabPaneContext {
  name: TabsValue;
  label: string;
  disabled?: boolean;
}

export const tabsProps = {
  ...baseProps,

  /** 当前选中值 */
  modelValue: {
    type: [String, Number] as PropType<TabsValue>,
    default: '',
  },

  /** 是否开启延迟渲染 */
  lazy: LkProp.boolean(true),

  /**
   * 标签类型
   * @value line 下划线
   * @value card 卡片
   * @value pill 胶囊
   */
  type: LkProp.enum(Object.values(TabsType), TabsType.Line, 'Tabs.type'),

  /** 标签是否自动拉伸 */
  stretch: LkProp.boolean(true),

  /** 是否可滑动切换 */
  swipeable: LkProp.boolean(true),

  /** 指示器是否显示 */
  showIndicator: LkProp.boolean(true),
} as const;

export type TabsProps = ExtractPropTypes<typeof tabsProps>;

export const tabsEmits = {
  'update:modelValue': (_val: TabsValue) => true,
  change: (_val: TabsValue, _pane?: TabPaneContext, _index?: number) => true,
  click: (_val: TabsValue, _pane?: TabPaneContext, _index?: number, _event?: unknown) => true,
  'tab-click': (_payload: {
    name: TabsValue;
    pane?: TabPaneContext;
    index: number;
    event?: unknown;
  }) => true,
  'click-disabled': (_payload: {
    name: TabsValue;
    pane?: TabPaneContext;
    index: number;
    event?: unknown;
  }) => true,
  'swipe-change': (_payload: {
    name: TabsValue;
    pane?: TabPaneContext;
    index: number;
    direction: 'prev' | 'next';
  }) => true,
};
