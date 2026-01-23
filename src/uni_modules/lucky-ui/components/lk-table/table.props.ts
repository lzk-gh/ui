import type { ExtractPropTypes, PropType } from 'vue'
import { baseProps, LkProp } from '../common/props'

export interface TableColumn {
  key: string
  title?: string
  width?: string | number
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
  fixed?: 'left' | 'right'
  hidden?: boolean
  className?: string
  headerSlot?: string
  /** 卡片模式下是否作为主要字段显示 */
  primary?: boolean
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

  /** 展示模式: card=卡片模式(移动端友好), table=传统表格 */
  mode: LkProp.enum(['card', 'table'] as const, 'card', 'mode'),

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

  /** 是否显示索引列 (仅table模式) */
  showIndex: LkProp.boolean(false),

  /** 是否可选择 */
  selectable: LkProp.boolean(false),

  /** 表头是否吸顶 (仅table模式) */
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

  /** 是否可展开详情 (仅card模式) */
  expandable: LkProp.boolean(false),

  /** 滑动操作按钮 (仅card模式) */
  actions: {
    type: Array as PropType<TableAction[]>,
    default: (): TableAction[] => [],
  },
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
