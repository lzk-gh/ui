import { LkProp, baseProps } from '../common/props';
import type { PropType } from 'vue';

export const choiceProps = {
  ...baseProps,
  /** 绑定值 */
  modelValue: {
    type: [String, Number, Array] as PropType<string | number | any[] | null>,
    default: null,
  },
  /** 选项列表 */
  options: {
    type: Array as PropType<Array<{ label: string; value: any; icon?: string }>>,
    default: () => [],
  },
  /** 是否多选 */
  multiple: LkProp.boolean(false),
  /** 尺寸 */
  size: LkProp.string('md'),
  /** 是否允许取消选中 */
  allowUnselect: LkProp.boolean(true),
  /** 间距 (rpx) */
  gap: LkProp.number(20),
} as const;

export const choiceEmits = ['update:modelValue', 'change', 'click'];
