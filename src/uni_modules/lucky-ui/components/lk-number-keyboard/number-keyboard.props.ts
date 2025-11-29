import type { ExtractPropTypes } from 'vue';
import { baseProps, LkProp } from '../common/props';

export const numberKeyboardProps = {
  ...baseProps,
  /** 是否显示 */
  visible: LkProp.boolean(false),
  /** 是否随机排序 */
  random: LkProp.boolean(false),
  /** 额外按键 */
  extraKey: LkProp.string(''),
  /** 确认按钮文本 */
  confirmText: LkProp.string('确认'),
  /** 是否允许小数点 */
  allowDecimal: LkProp.boolean(false),
  /** 是否允许系统键盘 */
  allowKeyboard: LkProp.boolean(false),
  /** 是否安全区域 */
  safeArea: LkProp.boolean(true),
} as const;

export type NumberKeyboardProps = ExtractPropTypes<typeof numberKeyboardProps>;

export const numberKeyboardEmits = {
  'update:visible': (_: boolean) => true,
  input: (_: string) => true,
  delete: () => true,
  confirm: () => true,
  close: () => true,
};
