import type { ExtractPropTypes } from 'vue';
import { baseProps, LkProp } from '../common/props';

/**
 * LkTabbar 底部导航栏 Props
 * 设计参考 iOS TabBar，简洁优雅
 */
export const tabbarProps = {
  ...baseProps,

  /** 当前选中项的 name 值 */
  modelValue: LkProp.stringNumber(''),

  /** 层级 (默认 300，低于弹出层) */
  zIndex: LkProp.number(300),

  /** 是否固定在底部 */
  fixed: LkProp.boolean(true),

  /** 是否适配底部安全区域（iPhone X 等机型） */
  safeArea: LkProp.boolean(true),

  /** 是否显示顶部边框线 */
  border: LkProp.boolean(true),

  /** 激活项的颜色 */
  activeColor: LkProp.string(''),

  /** 未激活项的颜色 */
  inactiveColor: LkProp.string(''),

  /** 背景颜色 */
  backgroundColor: LkProp.string(''),
} as const;

export type TabbarProps = ExtractPropTypes<typeof tabbarProps>;

export const tabbarEmits = {
  'update:modelValue': (val: string | number) => true,
  change: (val: string | number) => true,
};
