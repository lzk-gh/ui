import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';

export const checkboxGroupProps = {
  ...baseProps,
  /** 绑定值 */
  modelValue: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  /** 尺寸 sm | md | lg */
  size: LkProp.string('md'),
  /** 是否禁用 */
  disabled: LkProp.boolean(false),
  /** 排列方向 row | column */
  direction: LkProp.string('row'),
  /** 形状 circle | square */
  shape: LkProp.string('square'),
  /** 图标类型 check | dot */
  iconType: LkProp.string('check'),
  /** 选中时的颜色 */
  activeColor: LkProp.string(''),
  /** 最大选择数 */
  max: LkProp.number(Infinity),
} as const;

export const checkboxProps = {
  ...baseProps,
  /** 绑定值 */
  modelValue: {
    type: [Boolean, String, Number] as PropType<any>,
    default: false,
  },
  /** 标识符 */
  name: {
    type: [String, Number, Boolean] as PropType<any>,
    default: '',
  },
  /** 形状 circle | square */
  shape: LkProp.string(''),
  /** 图标类型 check | dot */
  iconType: LkProp.string(''),
  /** 是否禁用 */
  disabled: LkProp.boolean(false),
  /** 选中颜色 */
  activeColor: LkProp.string(''),
  /** 大小，支持设置数字 */
  iconSize: LkProp.stringNumber(''),
  /** 标签对应的内容 */
  label: LkProp.string(''),
  /** 标签是否禁用点击 */
  labelDisabled: LkProp.boolean(false),
  /** 是否为不确定状态 */
  indeterminate: LkProp.boolean(false),
} as const;

export type CheckboxGroupProps = ExtractPropTypes<typeof checkboxGroupProps>;
export type CheckboxProps = ExtractPropTypes<typeof checkboxProps>;

export const checkboxGroupEmits = ['update:modelValue', 'change'];
export const checkboxEmits = ['update:modelValue', 'change'];
