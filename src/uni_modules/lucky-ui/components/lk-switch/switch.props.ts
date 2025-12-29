import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';

/**
 * 开关尺寸
 */
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

  /**
   * 尺寸
   * @value sm 小尺寸
   * @value md 默认尺寸
   * @value lg 大尺寸
   */
  size: LkProp.enum(Object.values(SwitchSize), SwitchSize.Md, 'Switch.size'),

  /** 是否禁用 */
  disabled: LkProp.boolean(false),

  /** 是否加载中 */
  loading: LkProp.boolean(false),

  /** 切换前的拦截函数 */
  beforeChange: {
    type: Function as PropType<(val: any) => boolean | Promise<boolean>>,
    default: null,
  },
} as const;

export type SwitchProps = ExtractPropTypes<typeof switchProps>;

export const switchEmits = ['update:modelValue', 'change', 'click'];
