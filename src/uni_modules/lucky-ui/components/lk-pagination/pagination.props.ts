import type { ExtractPropTypes } from 'vue';
import { baseProps, LkProp } from '../common/props';

/**
 * 分页尺寸
 */
export const PaginationSize = {
  Sm: 'sm',
  Md: 'md',
  Lg: 'lg',
} as const;

export type PaginationSize = (typeof PaginationSize)[keyof typeof PaginationSize];

export const paginationProps = {
  ...baseProps,

  /** 总数据条数 */
  total: {
    type: Number,
    required: true as const,
  },

  /** 每页条数 */
  pageSize: LkProp.number(10),

  /** 当前页码 */
  modelValue: LkProp.number(1),

  /** 显示的页码数量 */
  pagerCount: LkProp.number(5),

  /**
   * 尺寸
   * @value sm 小尺寸
   * @value md 中尺寸
   * @value lg 大尺寸
   */
  size: LkProp.enum(Object.values(PaginationSize), PaginationSize.Md, 'Pagination.size'),
} as const;

export type PaginationProps = ExtractPropTypes<typeof paginationProps>;

export const paginationEmits = {
  'update:modelValue': (val: number) => true,
  change: (val: number) => true,
};
