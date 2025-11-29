import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';

export const rateProps = {
  ...baseProps,

  /** 绑定值 */
  modelValue: LkProp.number(0),

  /** 图标数量 */
  count: LkProp.number(5),

  /** 是否允许半星 */
  allowHalf: LkProp.boolean(false),

  /** 是否禁用 */
  disabled: LkProp.boolean(false),

  /** 是否只读 */
  readonly: LkProp.boolean(false),

  /** 图标大小 */
  size: {
    type: [String, Number] as PropType<string | number>,
    default: 40,
  },

  /** 选中时的颜色 */
  color: LkProp.string(''),

  /** 自定义图标名 */
  icon: LkProp.string(''),

  /** 表单字段名 */
  prop: LkProp.string(''),
} as const;

export type RateProps = ExtractPropTypes<typeof rateProps>;

export const rateEmits = {
  'update:modelValue': (val: number) => true,
  change: (val: number) => true,
  hover: (val: number) => true,
};
