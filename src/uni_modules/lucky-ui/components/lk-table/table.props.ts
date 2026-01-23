import type { ExtractPropTypes, PropType } from 'vue'
import { baseProps, LkProp } from '../common/props'

export interface TableColumn {
  key: string
  title?: string
  /** 列宽度，支持 px、rpx、百分比，不设置则均匀分配 */
  width?: string | number
  /** 最小宽度 */
  minWidth?: string | number
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  sortMethod?: (
    a: Record<string, unknown>,
    b: Record<string, unknown>,
    asc: boolean
  ) => number
  formatter?: (
    row: Record<string, unknown>,
    col: TableColumn,
    rowIndex: number
  ) => unknown
  summary?: 'sum' | 'avg' | ((values: number[], col: TableColumn) => unknown)
  /** 列固定位置 */
  fixed?: 'left' | 'right'
  hidden?: boolean
  className?: string
  headerSlot?: string
}

export interface TableAction {
  key: string
  text: string
  type?: 'default' | 'primary' | 'danger' | 'warning'
}

export interface DefaultSort {
  key: string
  order: 'asc' | 'desc'
}

export const tableProps = {
  ...baseProps,

  /** 表格列配置 */
  columns: {
    type: Array as PropType<TableColumn[]>,
    default: (): TableColumn[] => [],
  },

  /** 表格数据 */
  data: {
    type: Array as PropType<Record<string, unknown>[]>,
    default: (): Record<string, unknown>[] => [],
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
    default: undefined,
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
    type: Object as PropType<DefaultSort>,
    default: undefined,
  },

  /** 已选中的行 */
  modelValue: {
    type: Array as PropType<(string | number)[]>,
    default: (): (string | number)[] => [],
  },

  /** 操作列配置 */
  actions: {
    type: Array as PropType<TableAction[]>,
    default: (): TableAction[] => [],
  },

  /** 操作列宽度 */
  actionWidth: {
    type: [Number, String] as PropType<number | string>,
    default: 160,
  },

  /** 操作列是否固定在右侧 */
  actionFixed: LkProp.boolean(true),
} as const

export type TableProps = ExtractPropTypes<typeof tableProps>

export const tableEmits = {
  'update:modelValue': (_val: (string | number)[]) => true,
  'selection-change': (_val: (string | number)[]) => true,
  'row-click': (_row: Record<string, unknown>, _index: number) => true,
  'sort-change': (_params: { key: string; order: 'asc' | 'desc' | null }) => true,
  'summary-computed': (_row: Record<string, unknown>) => true,
  action: (_action: string, _row: Record<string, unknown>, _index: number) => true,
}
