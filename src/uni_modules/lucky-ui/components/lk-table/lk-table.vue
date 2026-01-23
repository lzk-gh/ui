<script setup lang="ts">
/**
 * Lucky UI - lk-table (移动端优化表格)
 * 移动端特性:
 *  - 卡片模式：每行数据展示为卡片，更适合移动端阅读
 *  - 横向表格模式：传统表格，支持横向滚动
 *  - 可展开详情
 *  - 滑动操作（删除/编辑）
 *  - 行选择（多选/单选）
 *  - 排序支持
 *  - 空数据/加载状态
 *  - 触摸优化的交互
 */
import { ref, computed, watch, type CSSProperties } from 'vue'
import {
  tableProps,
  tableEmits,
  type TableColumn,
  type TableAction,
  type DefaultSort,
} from './table.props'

defineOptions({ name: 'LkTable' })

const props = defineProps(tableProps)
const emit = defineEmits(tableEmits)

// 类型安全的 props 访问
const columnsData = computed<TableColumn[]>(() => (props.columns as TableColumn[]) || [])
const rowsData = computed<Record<string, unknown>[]>(
  () => (props.data as Record<string, unknown>[]) || []
)
const actionsData = computed<TableAction[]>(() => (props.actions as TableAction[]) || [])
const selectionData = computed<(string | number)[]>(
  () => (props.modelValue as (string | number)[]) || []
)
const rowKeyStr = computed(() => props.rowKey as string)

// ======================== 状态 ========================
const internalSelection = ref<(string | number)[]>([])
const sortState = ref<{ key: string; order: '' | 'asc' | 'desc' }>({
  key: '',
  order: '',
})
const expandedRows = ref<Set<string | number>>(new Set())

// 初始化排序
const defaultSortVal = props.defaultSort as DefaultSort | undefined
if (defaultSortVal && defaultSortVal.key) {
  sortState.value = {
    key: defaultSortVal.key,
    order: (defaultSortVal.order === 'desc' ? 'desc' : 'asc') as 'asc' | 'desc',
  }
}

// 同步外部选择
watch(
  () => selectionData.value,
  (v) => {
    if (v) {
      internalSelection.value = [...v]
    }
  },
  { immediate: true }
)

// ======================== 计算属性 ========================
const visibleColumns = computed<TableColumn[]>(() =>
  columnsData.value.filter((c) => !c.hidden)
)

// 数据数组
const dataArray = computed<Record<string, unknown>[]>(() => rowsData.value)

// 卡片模式下的主要列和次要列
const primaryColumns = computed<TableColumn[]>(() =>
  visibleColumns.value.filter(
    (c) => c.primary || c.key === columnsData.value[0]?.key
  )
)
const secondaryColumns = computed<TableColumn[]>(() =>
  visibleColumns.value.filter(
    (c) => !c.primary && c.key !== columnsData.value[0]?.key
  )
)

// 排序后的数据
const sortedData = computed<Record<string, unknown>[]>(() => {
  const { key, order } = sortState.value
  if (!key || !order) return dataArray.value
  if (props.sortRemote) return dataArray.value
  const col = visibleColumns.value.find((c) => c.key === key)
  if (!col) return dataArray.value
  const arr = [...dataArray.value]
  const asc = order === 'asc'
  const method = col.sortMethod || defaultSortMethod
  arr.sort((a, b) => method(a, b, asc))
  return arr
})

function defaultSortMethod(
  a: Record<string, unknown>,
  b: Record<string, unknown>,
  asc: boolean
) {
  const va = a[sortState.value.key]
  const vb = b[sortState.value.key]
  if (va == null && vb == null) return 0
  if (va == null) return asc ? -1 : 1
  if (vb == null) return asc ? 1 : -1
  if (typeof va === 'number' && typeof vb === 'number')
    return asc ? va - vb : vb - va
  return asc
    ? String(va).localeCompare(String(vb))
    : String(vb).localeCompare(String(va))
}

// 全选状态
const allChecked = computed(() => {
  if (!dataArray.value.length) return false
  return dataArray.value.every((r) =>
    internalSelection.value.includes(r[rowKeyStr.value] as string | number)
  )
})
const indeterminate = computed(() => {
  if (!dataArray.value.length) return false
  return !allChecked.value && internalSelection.value.length > 0
})

// 总结行
const summaryRow = computed<Record<string, unknown> | null>(() => {
  if (!props.summary || !visibleColumns.value.length) return null
  const row: Record<string, unknown> = {}
  visibleColumns.value.forEach((col) => {
    if (!col.summary) return
    const values = sortedData.value
      .map((r) => r[col.key])
      .filter((v) => typeof v === 'number') as number[]
    if (!values.length) return
    if (col.summary === 'sum') {
      row[col.key] = values.reduce((s, v) => s + v, 0)
    } else if (col.summary === 'avg') {
      row[col.key] = +(values.reduce((s, v) => s + v, 0) / values.length).toFixed(2)
    } else if (typeof col.summary === 'function') {
      try {
        row[col.key] = col.summary(values, col)
      } catch {
        // ignore
      }
    }
  })
  emit('summary-computed', row)
  return row
})

// ======================== 方法 ========================
function getRowKey(row: Record<string, unknown>): string | number {
  return row[rowKeyStr.value] as string | number
}

function isSelected(row: Record<string, unknown>) {
  return internalSelection.value.includes(getRowKey(row))
}

function toggleRow(row: Record<string, unknown>) {
  const keyVal = getRowKey(row)
  const idx = internalSelection.value.indexOf(keyVal)
  if (idx >= 0) {
    internalSelection.value.splice(idx, 1)
  } else {
    internalSelection.value.push(keyVal)
  }
  emit('update:modelValue', [...internalSelection.value])
  emit('selection-change', [...internalSelection.value])
}

function toggleAll() {
  if (allChecked.value) {
    internalSelection.value = []
  } else {
    internalSelection.value = dataArray.value.map((r) => getRowKey(r))
  }
  emit('update:modelValue', [...internalSelection.value])
  emit('selection-change', [...internalSelection.value])
}

function cycleSort(col: TableColumn) {
  if (!col.sortable) return
  if (sortState.value.key !== col.key) {
    sortState.value = { key: col.key, order: 'asc' }
  } else {
    const current = sortState.value.order
    sortState.value.order = current === 'asc' ? 'desc' : current === 'desc' ? '' : 'asc'
    if (!sortState.value.order) sortState.value.key = ''
  }
  emit('sort-change', {
    key: sortState.value.key,
    order: sortState.value.order || null,
  })
}

function cellContent(row: Record<string, unknown>, col: TableColumn, rowIndex: number) {
  if (col.formatter) return col.formatter(row, col, rowIndex)
  return row[col.key]
}

function onRowClick(row: Record<string, unknown>, idx: number) {
  emit('row-click', row, idx)
}

function toggleExpand(row: Record<string, unknown>) {
  const key = getRowKey(row)
  if (expandedRows.value.has(key)) {
    expandedRows.value.delete(key)
  } else {
    expandedRows.value.add(key)
  }
}

function isExpanded(row: Record<string, unknown>) {
  return expandedRows.value.has(getRowKey(row))
}

function onAction(action: string, row: Record<string, unknown>, idx: number) {
  emit('action', action, row, idx)
}

// 样式
const wrapStyle = computed<CSSProperties>(() => {
  const st: CSSProperties = {}
  const maxH = props.maxHeight as string | number | undefined
  if (maxH) {
    st.maxHeight = typeof maxH === 'number' ? `${maxH}px` : maxH
  }
  return st
})

function getColStyle(col: TableColumn): CSSProperties {
  return {
    width: col.width
      ? typeof col.width === 'number'
        ? `${col.width}px`
        : col.width
      : undefined,
    minWidth: col.minWidth
      ? typeof col.minWidth === 'number'
        ? `${col.minWidth}px`
        : col.minWidth
      : undefined,
    textAlign: col.align || undefined,
  }
}
</script>

<template>
  <view
    class="lk-table"
    :class="[
      `lk-table--${props.mode}`,
      {
        'is-striped': props.striped,
        'is-bordered': props.bordered,
        'is-compact': props.compact,
        'has-sticky': props.stickyHeader,
      },
    ]"
  >
    <!-- ==================== 卡片模式 ==================== -->
    <template v-if="props.mode === 'card'">
      <!-- 工具栏 -->
      <view v-if="props.selectable || sortedData.length" class="lk-table__toolbar">
        <view v-if="props.selectable" class="lk-table__toolbar-left" @click="toggleAll">
          <view
            class="lk-table__checkbox"
            :class="{ 'is-checked': allChecked, 'is-indeterminate': indeterminate }"
          />
          <text class="lk-table__toolbar-text">
            {{ allChecked ? '取消全选' : '全选' }}
            <text v-if="internalSelection.length" class="lk-table__toolbar-count">
              ({{ internalSelection.length }})
            </text>
          </text>
        </view>
        <view class="lk-table__toolbar-right">
          <slot name="toolbar" />
        </view>
      </view>

      <!-- 卡片列表 -->
      <view class="lk-table__cards" :style="wrapStyle">
        <template v-if="!props.loading && sortedData.length">
          <view
            v-for="(row, ri) in sortedData"
            :key="getRowKey(row) ?? ri"
            class="lk-table__card"
            :class="{
              'is-selected': props.selectable && isSelected(row),
              'is-expanded': isExpanded(row),
            }"
            @click="onRowClick(row, ri)"
          >
            <!-- 选择框 -->
            <view
              v-if="props.selectable"
              class="lk-table__card-checkbox"
              @click.stop="toggleRow(row)"
            >
              <view
                class="lk-table__checkbox"
                :class="{ 'is-checked': isSelected(row) }"
              />
            </view>

            <!-- 卡片内容 -->
            <view class="lk-table__card-body">
              <!-- 主要信息 -->
              <view class="lk-table__card-main">
                <slot name="card-main" :row="row" :index="ri">
                  <template v-for="col in primaryColumns" :key="col.key">
                    <view class="lk-table__card-primary">
                      <slot :name="'col-' + col.key" :row="row" :column="col" :value="row[col.key]" :row-index="ri">
                        {{ cellContent(row, col, ri) }}
                      </slot>
                    </view>
                  </template>
                </slot>
              </view>

              <!-- 次要信息 -->
              <view v-if="secondaryColumns.length" class="lk-table__card-secondary">
                <slot name="card-secondary" :row="row" :index="ri">
                  <view
                    v-for="col in secondaryColumns"
                    :key="col.key"
                    class="lk-table__card-field"
                  >
                    <text class="lk-table__card-label">{{ col.title }}</text>
                    <text class="lk-table__card-value">
                      <slot :name="'col-' + col.key" :row="row" :column="col" :value="row[col.key]" :row-index="ri">
                        {{ cellContent(row, col, ri) }}
                      </slot>
                    </text>
                  </view>
                </slot>
              </view>

              <!-- 展开详情 -->
              <view v-if="props.expandable && isExpanded(row)" class="lk-table__card-expand">
                <slot name="expand" :row="row" :index="ri" />
              </view>
            </view>

            <!-- 展开按钮 -->
            <view
              v-if="props.expandable"
              class="lk-table__card-toggle"
              @click.stop="toggleExpand(row)"
            >
              <view class="lk-table__expand-icon" :class="{ 'is-expanded': isExpanded(row) }" />
            </view>

            <!-- 操作按钮 -->
            <view v-if="actionsData.length" class="lk-table__card-actions">
              <view
                v-for="(action, ai) in actionsData"
                :key="ai"
                class="lk-table__action"
                :class="[`lk-table__action--${action.type || 'default'}`]"
                @click.stop="onAction(action.key, row, ri)"
              >
                {{ action.text }}
              </view>
            </view>
          </view>
        </template>

        <!-- 空状态 -->
        <view v-else-if="!props.loading" class="lk-table__empty">
          <slot name="empty">
            <view class="lk-table__empty-icon">📋</view>
            <text class="lk-table__empty-text">{{ props.emptyText }}</text>
          </slot>
        </view>

        <!-- 加载中 -->
        <view v-if="props.loading" class="lk-table__loading">
          <view class="lk-table__loading-spinner" />
          <text class="lk-table__loading-text">加载中...</text>
        </view>
      </view>

      <!-- 总结 -->
      <view v-if="props.summary && summaryRow && !props.loading" class="lk-table__summary">
        <slot name="summary" :row="summaryRow">
          <view class="lk-table__summary-title">合计</view>
          <view class="lk-table__summary-content">
            <view
              v-for="col in visibleColumns.filter((c) => summaryRow && summaryRow[c.key] !== undefined)"
              :key="col.key"
              class="lk-table__summary-item"
            >
              <text class="lk-table__summary-label">{{ col.title }}</text>
              <text class="lk-table__summary-value">{{ summaryRow[col.key] }}</text>
            </view>
          </view>
        </slot>
      </view>
    </template>

    <!-- ==================== 传统表格模式 ==================== -->
    <template v-else>
      <view class="lk-table__wrapper" :style="wrapStyle">
        <scroll-view class="lk-table__scroll" scroll-x scroll-y :enhanced="true" :bounces="false">
          <!-- 表头 -->
          <view class="lk-table__header" :class="{ 'is-sticky': props.stickyHeader }">
            <view class="lk-table__tr lk-table__tr--head">
              <view v-if="props.selectable" class="lk-table__th lk-table__th--checkbox" @click="toggleAll">
                <view
                  class="lk-table__checkbox"
                  :class="{ 'is-checked': allChecked, 'is-indeterminate': indeterminate }"
                />
              </view>
              <view v-if="props.showIndex" class="lk-table__th lk-table__th--index">#</view>
              <view
                v-for="col in visibleColumns"
                :key="col.key"
                class="lk-table__th"
                :class="[
                  col.className,
                  {
                    'is-sortable': col.sortable,
                    'is-sorted-asc': sortState.key === col.key && sortState.order === 'asc',
                    'is-sorted-desc': sortState.key === col.key && sortState.order === 'desc',
                  },
                ]"
                :style="getColStyle(col)"
                @click="cycleSort(col)"
              >
                <slot :name="col.headerSlot || 'header-' + col.key" :column="col">
                  {{ col.title || col.key }}
                </slot>
                <view v-if="col.sortable" class="lk-table__sort-icons">
                  <view class="lk-table__sort-asc" />
                  <view class="lk-table__sort-desc" />
                </view>
              </view>
            </view>
          </view>

          <!-- 表体 -->
          <view class="lk-table__body">
            <template v-if="!props.loading && sortedData.length">
              <view
                v-for="(row, ri) in sortedData"
                :key="getRowKey(row) ?? ri"
                class="lk-table__tr"
                :class="{ 'is-selected': props.selectable && isSelected(row) }"
                @click="onRowClick(row, ri)"
              >
                <view
                  v-if="props.selectable"
                  class="lk-table__td lk-table__td--checkbox"
                  @click.stop="toggleRow(row)"
                >
                  <view
                    class="lk-table__checkbox"
                    :class="{ 'is-checked': isSelected(row) }"
                  />
                </view>
                <view v-if="props.showIndex" class="lk-table__td lk-table__td--index">
                  {{ ri + 1 }}
                </view>
                <view
                  v-for="col in visibleColumns"
                  :key="col.key + ri"
                  class="lk-table__td"
                  :class="col.className"
                  :style="getColStyle(col)"
                >
                  <slot
                    :name="'col-' + col.key"
                    :row="row"
                    :column="col"
                    :value="row[col.key]"
                    :row-index="ri"
                  >
                    {{ cellContent(row, col, ri) }}
                  </slot>
                </view>
              </view>
            </template>

            <!-- 空状态 -->
            <view v-else-if="!props.loading" class="lk-table__empty">
              <slot name="empty">
                {{ props.emptyText }}
              </slot>
            </view>

            <!-- 加载中 -->
            <view v-if="props.loading" class="lk-table__loading">
              <view class="lk-table__loading-spinner" />
              <text class="lk-table__loading-text">加载中...</text>
            </view>
          </view>

          <!-- 总结行 -->
          <view v-if="props.summary && summaryRow && !props.loading" class="lk-table__footer">
            <view class="lk-table__tr lk-table__tr--summary">
              <view v-if="props.selectable" class="lk-table__td lk-table__td--checkbox" />
              <view v-if="props.showIndex" class="lk-table__td lk-table__td--index">合计</view>
              <view
                v-for="col in visibleColumns"
                :key="col.key"
                class="lk-table__td"
                :style="getColStyle(col)"
              >
                <slot name="summary-cell" :column="col" :value="summaryRow[col.key]" :row="summaryRow">
                  {{ summaryRow[col.key] !== undefined ? summaryRow[col.key] : '' }}
                </slot>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </template>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
