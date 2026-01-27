import type { ExtractPropTypes } from 'vue';
import { baseProps, LkProp } from '../common/props';

export const overlayProps = {
  ...baseProps,

  /** 是否显示（兼容写法） */
  show: LkProp.boolean(false),

  /** 是否显示（v-model） */
  modelValue: {
    type: Boolean,
    default: undefined as unknown as boolean,
  },

  /** 层级 */
  zIndex: LkProp.number(900),

  /** 透明度 */
  opacity: LkProp.number(0.55),

  /** 背景颜色 */
  background: LkProp.string(''),

  /** 点击是否关闭 */
  closeOnClick: LkProp.boolean(true),

  /** 是否锁定滚动 */
  lockScroll: LkProp.boolean(true),

  /** 动画持续时间（毫秒） */
  duration: LkProp.number(240),
} as const;

export type OverlayProps = ExtractPropTypes<typeof overlayProps>;

export const overlayEmits = [
  'click',
  'update:show',
  'update:modelValue',
  'after-enter',
  'after-leave',
];
