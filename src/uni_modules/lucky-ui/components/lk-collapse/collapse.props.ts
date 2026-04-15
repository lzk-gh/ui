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

  /**
   * 视觉模式
   * @value separate 分离模式（每个项目独立卡片）
   * @value unified 整体模式（所有项目合并在一个卡片中）
   */
  type: LkProp.enum(['separate', 'unified'], 'separate'),

  /** 是否显示外边框/分割线 */
  border: LkProp.boolean(true),
} as const;

export type CollapseProps = ExtractPropTypes<typeof collapseProps>;

export const collapseEmits = ['update:modelValue', 'change'];
