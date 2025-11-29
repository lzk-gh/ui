import type { ExtractPropTypes, PropType } from 'vue';
import type { RegionNode } from './data';
import { baseProps, LkProp } from '../common/props';

export const areaPickerProps = {
  ...baseProps,
  /** 绑定值 */
  modelValue: {
    type: Array as unknown as PropType<string[]>,
    default: () => [],
  },
  /** 地区数据 */
  data: {
    type: Array as unknown as PropType<RegionNode[]>,
    default: undefined,
  },
  /** 标题 */
  title: LkProp.string('选择地区'),
  /** 是否显示 */
  visible: LkProp.boolean(false),
  /** 层级数 */
  level: LkProp.number(3),
} as const;

export type LkAreaPickerProps = ExtractPropTypes<typeof areaPickerProps>;

export const areaPickerEmits = {
  'update:modelValue': (_: string[]) => true,
  'update:visible': (_: boolean) => true,
  change: (_: string[]) => true,
  confirm: (_: string[]) => true,
  cancel: () => true,
};
