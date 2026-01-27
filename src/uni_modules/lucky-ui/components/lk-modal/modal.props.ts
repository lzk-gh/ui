import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';
import type { ANIMATION_PRESETS, TransitionConfig } from '@/uni_modules/lucky-ui/composables/useTransition';

export const modalProps = {
  ...baseProps,

  /** 是否显示 */
  modelValue: LkProp.boolean(false),

  /** 层级 (默认 1500，高于 Popup 的 1000) */
  zIndex: LkProp.number(1500),

  /** 标题 */
  title: LkProp.string(''),

  /** 宽度 */
  width: LkProp.string('600rpx'),

  /** 是否显示关闭按钮 */
  showClose: LkProp.boolean(true),

  /** 点击遮罩是否关闭 */
  closeOnOverlay: LkProp.boolean(true),

  /** 是否显示头部 */
  showHeader: LkProp.boolean(true),

  /** 是否显示底部 */
  showFooter: LkProp.boolean(true),

  /** 动画预设名称 */
  animation: {
    type: String as PropType<keyof typeof ANIMATION_PRESETS>,
    default: 'scale',
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

export type ModalProps = ExtractPropTypes<typeof modalProps>;

export const modalEmits = {
  'update:modelValue': (value: boolean) => true,
  open: () => true,
  close: () => true,
  confirm: () => true,
  cancel: () => true,
};
