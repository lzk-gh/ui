import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';

/**
 * Tabs 类型
 */
export const TabsType = {
  Line: 'line',
  Card: 'card',
} as const;

export type TabsType = (typeof TabsType)[keyof typeof TabsType];

export const tabsProps = {
  ...baseProps,

  /** 当前选中值 */
  modelValue: {
    type: [String, Number] as PropType<string | number>,
    default: '',
  },

  /** 是否开启延迟渲染 */
  lazy: LkProp.boolean(true),

  /**
   * 标签类型
   * @value line 下划线
   * @value card 卡片
   */
  type: LkProp.enum(Object.values(TabsType), TabsType.Line, 'Tabs.type'),

  /** 标签是否自动拉伸 */
  stretch: LkProp.boolean(true),
} as const;

export type TabsProps = ExtractPropTypes<typeof tabsProps>;

export const tabsEmits = {
  'update:modelValue': (_val: string | number) => true,
  change: (_val: string | number) => true,
};
