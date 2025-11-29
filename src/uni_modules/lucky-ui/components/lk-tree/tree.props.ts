import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';

export interface TreeNode {
  label: string;
  value: string | number;
  children?: TreeNode[];
  disabled?: boolean;
  expand?: boolean;
  checked?: boolean;
  indeterminate?: boolean;
}

export const treeProps = {
  ...baseProps,

  /** 选中值 */
  modelValue: {
    type: Array as PropType<Array<string | number>>,
    default: () => [],
  },

  /** 树形数据 */
  data: {
    type: Array as PropType<TreeNode[]>,
    default: () => [],
  },

  /** 是否可勾选 */
  checkable: LkProp.boolean(true),

  /** 是否手风琴模式 */
  accordion: LkProp.boolean(false),
} as const;

export type TreeProps = ExtractPropTypes<typeof treeProps>;

export const treeEmits = {
  'update:modelValue': (val: Array<string | number>) => true,
  change: (val: Array<string | number>) => true,
  toggle: (node: TreeNode) => true,
};
