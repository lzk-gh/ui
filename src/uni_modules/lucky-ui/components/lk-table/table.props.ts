import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';

export interface TableColumn {
  key: string;
  title?: string;
  width?: string | number;
  align?: string;
  sortable?: boolean;
  sortMethod?: (a: any, b: any, asc: boolean) => number;
  formatter?: (row: any, col: TableColumn, rowIndex: number) => any;
  summary?: 'sum' | 'avg' | ((values: any[], col: TableColumn) => any);
  fixed?: 'left' | 'right';
  hidden?: boolean;
  className?: string;
  headerSlot?: string;
  minWidth?: string | number;
}

export const tableProps = {
  ...baseProps,

  /** 表格列配置 */
  columns: {
    type: Array as PropType<TableColumn[]>,
    default: () => [],
  },

  /** 表格数据 */
  data: {
    type: Array as PropType<any[]>,
    default: () => [],
  },

  /** 行数据唯一标识 */
  rowKey: LkProp.string('id'),

  /** 是否斑马纹 */
  striped: LkProp.boolean(true),

  /** 是否显示边框 */
  bordered: LkProp.boolean(false),

  /** 是否紧凑模式 */
  compact: LkProp.boolean(false),

  /** 是否显示索引列 */
  showIndex: LkProp.boolean(false),

  /** 是否可选择 */
  selectable: LkProp.boolean(false),

  /** 表头是否吸顶 */
  stickyHeader: LkProp.boolean(true),

  /** 最大高度 */
  maxHeight: {
    type: [Number, String] as PropType<number | string>,
    default: '',
  },

  /** 是否加载中 */
  loading: LkProp.boolean(false),

  /** 空数据文字 */
  emptyText: LkProp.string('暂无数据'),

  /** 是否显示汇总行 */
  summary: LkProp.boolean(false),

  /** 是否远程排序 */
  sortRemote: LkProp.boolean(false),

  /** 默认排序 */
  defaultSort: {
    type: Object as PropType<{ key: string; order: 'asc' | 'desc' }>,
    default: undefined,
  },

  /** 已选中的行 */
  modelValue: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
} as const;

export type TableProps = ExtractPropTypes<typeof tableProps>;

export const tableEmits = {
  'update:modelValue': (val: any[]) => true,
  'selection-change': (val: any[]) => true,
  'row-click': (row: any, index: number) => true,
  'sort-change': (params: { key: string; order: 'asc' | 'desc' | null }) => true,
  'summary-computed': (row: any) => true,
};
