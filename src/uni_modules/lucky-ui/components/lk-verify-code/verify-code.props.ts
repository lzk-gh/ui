import type { ExtractPropTypes } from 'vue';
import { baseProps, LkProp } from '../common/props';

/** 输入类型 */
const VerifyCodeType = {
  Text: 'text',
  Number: 'number',
} as const;
export type VerifyCodeType = (typeof VerifyCodeType)[keyof typeof VerifyCodeType];

export const verifyCodeProps = {
  ...baseProps,
  /** 验证码长度 */
  length: LkProp.number(6),
  /** 绑定值 */
  modelValue: LkProp.string(''),
  /** 输入类型 */
  type: LkProp.enum<VerifyCodeType>(VerifyCodeType.Number),
  /** 是否密码模式 */
  mask: LkProp.boolean(false),
  /** 是否自动聚焦 */
  autofocus: LkProp.boolean(false),
} as const;

export type VerifyCodeProps = ExtractPropTypes<typeof verifyCodeProps>;

export const verifyCodeEmits = {
  'update:modelValue': (_: string) => true,
  finish: (_: string) => true,
};
