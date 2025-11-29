import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';

/**
 * 分段控制器尺寸
 */
export const SegmentedSize = {
  Sm: 'sm',
  Md: 'md',
  Lg: 'lg',
} as const;

export type SegmentedSize = (typeof SegmentedSize)[keyof typeof SegmentedSize];

export const segmentedProps = {
  ...baseProps,

  /** 当前选中值 */
  modelValue: {
    type: [String, Number] as PropType<string | number>,
    default: '',
  },

  /** 选项列表 */
  options: {
    type: Array as PropType<{ label: string; value: any }[]>,
    default: () => [],
  },

  /**
   * 尺寸
   * @value sm 小尺寸
   * @value md 中尺寸
   * @value lg 大尺寸
   */
  size: LkProp.enum(Object.values(SegmentedSize), SegmentedSize.Md, 'Segmented.size'),
} as const;

export type SegmentedProps = ExtractPropTypes<typeof segmentedProps>;

export const segmentedEmits = {
  'update:modelValue': (val: any) => true,
  change: (val: any) => true,
};
