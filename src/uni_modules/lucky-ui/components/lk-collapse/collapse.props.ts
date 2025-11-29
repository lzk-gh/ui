import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';

export const collapseProps = {
  ...baseProps,

  /** 当前展开的面板 */
  modelValue: {
    type: [Array, String, Number] as PropType<any[] | string | number>,
    default: () => [],
  },

  /** 是否手风琴模式 */
  accordion: LkProp.boolean(false),
} as const;

export type CollapseProps = ExtractPropTypes<typeof collapseProps>;

export const collapseEmits = ['update:modelValue', 'change'];
