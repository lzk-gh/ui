import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';
import type { ANIMATION_PRESETS, TransitionConfig } from '@/uni_modules/lucky-ui/composables/useTransition';

/**
 * 抽屉位置
 */
export const DrawerPosition = {
  Left: 'left',
  Right: 'right',
  Top: 'top',
  Bottom: 'bottom',
} as const;

export type DrawerPosition = (typeof DrawerPosition)[keyof typeof DrawerPosition];

export const drawerProps = {
  ...baseProps,

  /** 是否显示 */
  modelValue: LkProp.boolean(false),

  /** 位置（兼容旧版） */
  position: {
    type: String as PropType<DrawerPosition>,
    default: undefined,
  },

  /**
   * 位置
   * @value left 左侧
   * @value right 右侧
   * @value top 顶部
   * @value bottom 底部
   */
  side: LkProp.enum(Object.values(DrawerPosition), DrawerPosition.Right, 'Drawer.side'),

  /** 宽度（左右抽屉使用） */
  width: LkProp.string('70%'),

  /** 高度（上下抽屉使用） */
  height: LkProp.string('70%'),

  /** 是否显示遮罩 */
  overlay: LkProp.boolean(true),

  /** 点击遮罩是否关闭 */
  closeOnOverlay: LkProp.boolean(true),

  /** 是否锁定滚动 */
  lockScroll: LkProp.boolean(true),

  /** 标题 */
  title: LkProp.string(''),

  /** 是否显示关闭按钮 */
  showClose: LkProp.boolean(true),

  /** 动画预设名称 */
  animation: {
    type: String as PropType<keyof typeof ANIMATION_PRESETS>,
    default: undefined,
  },

  /** 动画类型 */
  animationType: {
    type: String as PropType<TransitionConfig['name']>,
    default: undefined,
  },

  /** 动画持续时间 */
  duration: {
    type: Number,
    default: undefined,
  },

  /** 动画延迟 */
  delay: {
    type: Number,
    default: undefined,
  },

  /** 动画缓动函数 */
  easing: {
    type: String as PropType<TransitionConfig['easing']>,
    default: undefined,
  },
} as const;

export type DrawerProps = ExtractPropTypes<typeof drawerProps>;

export const drawerEmits = ['update:modelValue', 'open', 'close', 'after-enter', 'after-leave'];
