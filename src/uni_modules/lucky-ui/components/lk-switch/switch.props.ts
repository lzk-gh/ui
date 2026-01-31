import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';

export const SwitchSize = {
  Sm: 'sm',
  Md: 'md',
  Lg: 'lg',
} as const;

export type SwitchSize = (typeof SwitchSize)[keyof typeof SwitchSize];

export const switchProps = {
  ...baseProps,

  /** 绑定值 */
  modelValue: {
    type: [Boolean, String, Number] as PropType<boolean | string | number>,
    default: false,
  },

  /** 开启时的值 */
  activeValue: {
    type: [Boolean, String, Number] as PropType<boolean | string | number>,
    default: true,
  },

  /** 关闭时的值 */
  inactiveValue: {
    type: [Boolean, String, Number] as PropType<boolean | string | number>,
    default: false,
  },

  /** 尺寸: sm | md | lg */
  size: LkProp.enum(Object.values(SwitchSize), SwitchSize.Md, 'Switch.size'),

  /** 开启时的背景色 */
  activeColor: String,

  /** 关闭时的背景色 */
  inactiveColor: String,

  /** 是否禁用 */
  disabled: LkProp.boolean(false),

  /** 是否加载中 */
  loading: LkProp.boolean(false),

  /** 切换前的拦截函数，返回 false 或 Promise<false> 阻止切换 */
  beforeChange: {
    type: Function as PropType<(val: any) => boolean | Promise<boolean>>,
    default: null,
  },
} as const;

export type SwitchProps = ExtractPropTypes<typeof switchProps>;

export const switchEmits = {
  'update:modelValue': (_val: boolean | string | number) => true,
  change: (_val: boolean | string | number) => true,
  click: (_e: Event) => true,
};
