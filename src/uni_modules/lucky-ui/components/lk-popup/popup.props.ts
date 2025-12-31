import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';
import type { ANIMATION_PRESETS, TransitionConfig } from '@/uni_modules/lucky-ui/composables/useTransition';

/**
 * 弹出层位置
 */
export const PopupPosition = {
  Center: 'center',
  Top: 'top',
  Bottom: 'bottom',
  Left: 'left',
  Right: 'right',
} as const;

export type PopupPosition = (typeof PopupPosition)[keyof typeof PopupPosition];

export const popupProps = {
  ...baseProps,

  /** 是否显示 */
  modelValue: LkProp.boolean(false),

  /**
   * 弹出位置
   * @value center 居中
   * @value top 顶部
   * @value bottom 底部
   * @value left 左侧
   * @value right 右侧
   */
  position: LkProp.enum(Object.values(PopupPosition), PopupPosition.Center, 'Popup.position'),

  /** 是否圆角 */
  round: LkProp.boolean(true),

  /** 圆角大小 */
  radius: LkProp.string('24rpx'),

  /** 是否开启拖拽（仅 bottom 模式有效） */
  draggable: LkProp.boolean(false),

  /** 标题 */
  title: LkProp.string(''),

  /** 是否显示关闭图标 */
  closable: LkProp.boolean(false),

  /** 关闭图标名称 */
  closeIcon: LkProp.string('x-lg'),

  /** 关闭图标位置 */
  closeIconPosition: LkProp.enum(['top-right', 'top-left'], 'top-right', 'Popup.closeIconPosition'),

  /** 是否显示遮罩 */
  overlay: LkProp.boolean(true),

  /** 点击遮罩是否关闭 */
  closeOnOverlay: LkProp.boolean(true),

  /** 是否锁定滚动 */
  lockScroll: LkProp.boolean(true),

  /** 是否开启安全区域适配 */
  safeArea: LkProp.boolean(true),

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

export type PopupProps = ExtractPropTypes<typeof popupProps>;

export const popupEmits = [
  'update:modelValue',
  'open',
  'close',
  'click-overlay',
  'click-close',
  'after-enter',
  'after-leave',
];
