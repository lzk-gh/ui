import type { ExtractPropTypes } from 'vue';
import { baseProps, LkProp } from '../common/props';

export const navbarProps = {
  ...baseProps,

  /** 标题 */
  title: LkProp.string(''),

  /** 是否固定在顶部 */
  fixed: LkProp.boolean(true),

  /** 左侧文字 */
  leftText: LkProp.string(''),

  /** 右侧文字 */
  rightText: LkProp.string(''),

  /** 是否显示返回按钮 */
  showBack: LkProp.boolean(true),

  /** 是否占位 */
  placeholder: LkProp.boolean(true),

  /** 是否开启安全区域适配 */
  safeArea: LkProp.boolean(true),
} as const;

export type NavbarProps = ExtractPropTypes<typeof navbarProps>;

export const navbarEmits = ['back', 'click-left', 'click-right'];
