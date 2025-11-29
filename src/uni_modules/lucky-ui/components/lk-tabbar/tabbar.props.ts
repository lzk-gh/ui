import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';

/**
 * Tabbar 类型
 */
export const TabbarType = {
  TIC: 'TIC',
  FAB: 'FAB',
  CONCISE: 'CONCISE',
  CAPSULE: 'CAPSULE',
} as const;

export type TabbarType = (typeof TabbarType)[keyof typeof TabbarType];

export const tabbarProps = {
  ...baseProps,

  /** 当前选中值 */
  modelValue: LkProp.string(''),

  /** 是否固定在底部 */
  fixed: LkProp.boolean(false),

  /** 是否开启安全区域适配 */
  safeArea: LkProp.boolean(false),

  /** Tabbar 类型 */
  type: {
    type: String as PropType<TabbarType>,
    default: undefined,
  },

  /** 背景颜色 */
  backgroundColor: LkProp.string(''),

  /** 是否显示顶部边框 */
  topBorder: {
    type: Boolean,
    default: undefined,
  },

  /** 左上角圆角 */
  topLeftRadius: {
    type: [Number, String] as PropType<number | string>,
    default: undefined,
  },

  /** 右上角圆角 */
  topRightRadius: {
    type: [Number, String] as PropType<number | string>,
    default: undefined,
  },

  /** 是否显示顶部阴影 */
  topShadow: {
    type: Boolean,
    default: undefined,
  },

  /** 激活颜色 */
  activeColor: LkProp.string(''),

  /** 未激活颜色 */
  inactiveColor: LkProp.string(''),

  /** 是否开启磨砂效果 */
  frosted: {
    type: Boolean,
    default: undefined,
  },

  /** FAB 直径 */
  fabSize: {
    type: [Number, String] as PropType<number | string>,
    default: undefined,
  },

  /** 胶囊容器宽度 */
  capsuleWidth: {
    type: [Number, String] as PropType<number | string>,
    default: undefined,
  },

  /** 胶囊距离底部偏移 */
  capsuleOffset: {
    type: [Number, String] as PropType<number | string>,
    default: undefined,
  },
} as const;

export type TabbarProps = ExtractPropTypes<typeof tabbarProps>;

export const tabbarEmits = {
  'update:modelValue': (val: string) => true,
  change: (val: string) => true,
  'fab-click': () => true,
};
