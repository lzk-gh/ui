import type { ExtractPropTypes } from 'vue';
import { baseProps, LkProp } from '../common/props';

/**
 * Toast 位置
 */
export const ToastPosition = {
  Top: 'top',
  Center: 'center',
  Bottom: 'bottom',
} as const;

export type ToastPosition = (typeof ToastPosition)[keyof typeof ToastPosition];

export const toastProps = {
  ...baseProps,

  /** 是否显示 */
  modelValue: LkProp.boolean(false),

  /** 提示内容 */
  message: LkProp.string(''),

  /** 展示时长（毫秒） */
  duration: LkProp.number(2000),

  /** 图标名称 */
  icon: LkProp.string(''),

  /**
   * 位置
   * @value top 顶部
   * @value center 居中
   * @value bottom 底部
   */
  position: LkProp.enum(Object.values(ToastPosition), ToastPosition.Center, 'Toast.position'),

  /** 是否显示遮罩层 */
  overlay: LkProp.boolean(false),

  /** 是否禁止点击穿透 */
  forbidClick: LkProp.boolean(false),
} as const;

export type ToastProps = ExtractPropTypes<typeof toastProps>;

export const toastEmits = {
  'update:modelValue': (val: boolean) => true,
  open: () => true,
  close: () => true,
  'after-leave': () => true,
};
