<script setup lang="ts">
/**
 * Lucky UI - lk-table (移动简约表格)
 * 特性（基础版）:
 *  - columns 数组驱动 + 插槽 (#col-<key>) 自定义单元格
 *  - 横向滚动 (多列) + 可选粘性表头
 *  - 条纹、边框、紧凑模式
 *  - 行点击 / 选择 (多选) / 显隐索引列
 *  - 简单排序 (前端本地)
 *  - 可选总结行 (自动数值求和, 允许自定义 #summary slot)
 *  - 空数据插槽 (#empty)
 *  - Loading 状态
 *  - 可限制最大高度，超出滚动
 *  - 移动端优化：较小内边距、可折叠溢出滚动条隐藏
 *
 * 后续可扩展：
 *  - 服务器分页 / 排序回调
 *  - 单选 radio 模式
 *  - 可展开行 (#expand-row)
 *  - 虚拟滚动 (大数据)
 *  - 列固定 / 列宽拖拽
 */
import { ref, computed, watch } from 'vue';
import LkCheckbox from '../lk-checkbox/lk-checkbox.vue';
import LkLoading from '../lk-loading/lk-loading.vue';
import { tableProps, tableEmits } from './table.props';
import type { TableColumn } from './table.props';

defineOptions({ name: 'LkTable' });

const props = defineProps(tableProps);
const emit = defineEmits(tableEmits);

const internalSelection = ref<any[]>([]);
const sortState = ref<{ key: string; order: '' | 'asc' | 'desc' }>({
  key: '',
  order: '',
});

/* 初始化排序 */
if (props.defaultSort?.key) {
  sortState.value = {
    key: props.defaultSort.key,
    order: (props.defaultSort.order === 'desc' ? 'desc' : 'asc') as any,
  };
}

/* 同步外部选择 */
watch(
  () => props.modelValue,
  v => {
    internalSelection.value = [...v];
  },
  { immediate: true }
);

/* 可见列（过滤 hidden）*/
const visibleColumns = computed(() => props.columns.filter(c => !c.hidden));

/* 排序后的数据 */
const sortedData = computed(() => {
  const { key, order } = sortState.value;
  if (!key || !order) return props.data;
  if (props.sortRemote) return props.data; // 交给外部
  const col = visibleColumns.value.find(c => c.key === key);
  if (!col) return props.data;
  const arr = [...props.data];
  const asc = order === 'asc';
  const method = col.sortMethod || defaultSortMethod;
  arr.sort((a, b) => method(a, b, asc));
  return arr;
});

function defaultSortMethod(a: any, b: any, asc: boolean) {
  const va = a[sortState.value.key];
  const vb = b[sortState.value.key];
  if (va == null && vb == null) return 0;
  if (va == null) return asc ? -1 : 1;
  if (vb == null) return asc ? 1 : -1;
  if (typeof va === 'number' && typeof vb === 'number') return asc ? va - vb : vb - va;
  return asc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
}

function cycleSort(col: TableColumn) {
  if (!col.sortable) return;
  if (sortState.value.key !== col.key) {
    sortState.value = { key: col.key, order: 'asc' };
  } else {
    const current = sortState.value.order;
    sortState.value.order = current === 'asc' ? 'desc' : current === 'desc' ? '' : 'asc';
    if (!sortState.value.order) sortState.value.key = '';
  }
  emit('sortChange', {
    key: sortState.value.key,
    order: sortState.value.order,
  });
}

/* 选择相关 */
function isSelected(row: any) {
  const k = row[props.rowKey];
  return internalSelection.value.includes(k);
}
function toggleRow(row: any) {
  const keyVal = row[props.rowKey];
  const idx = internalSelection.value.indexOf(keyVal);
  if (idx >= 0) internalSelection.value.splice(idx, 1);
  else internalSelection.value.push(keyVal);
  emit('update:modelValue', [...internalSelection.value]);
  emit('selectionChange', [...internalSelection.value]);
}
const allChecked = computed(() => {
  if (!props.data.length) return false;
  return props.data.every(r => internalSelection.value.includes(r[props.rowKey]));
});
const indeterminate = computed(() => {
  if (!props.data.length) return false;
  return !allChecked.value && internalSelection.value.length > 0;
});
function toggleAll() {
  if (allChecked.value) {
    internalSelection.value = [];
  } else {
    internalSelection.value = props.data.map(r => r[props.rowKey]);
  }
  emit('update:modelValue', [...internalSelection.value]);
  emit('selectionChange', [...internalSelection.value]);
}

/* 单元格内容 */
function cellContent(row: any, col: TableColumn, rowIndex: number) {
  if (col.formatter) return col.formatter(row, col, rowIndex);
  return row[col.key];
}

/* 总结行计算 */
const summaryRow = computed(() => {
  if (!props.summary || !visibleColumns.value.length) return null;
  const row: Record<string, any> = {};
  visibleColumns.value.forEach(col => {
    if (!col.summary) return;
    const values = sortedData.value.map(r => r[col.key]).filter(v => typeof v === 'number');
    if (!values.length) return;
    if (col.summary === 'sum') {
      row[col.key] = values.reduce((s, v) => s + v, 0);
    } else if (col.summary === 'avg') {
      row[col.key] = +(values.reduce((s, v) => s + v, 0) / values.length).toFixed(2);
    } else if (typeof col.summary === 'function') {
      try {
        row[col.key] = col.summary(values, col);
      } catch {}
    }
  });
  emit('summaryComputed', row);
  return row;
});

/* 行点击 */
function onRowClick(row: any, idx: number) {
  emit('rowClick', row, idx);
}

/* 宽高 style */
const wrapStyle = computed(() => {
  const st: any = {};
  if (props.maxHeight) {
    st.maxHeight = typeof props.maxHeight === 'number' ? `${props.maxHeight  }px` : props.maxHeight;
  }
  return st;
});
</script>

<template>
  <view
    class="lk-table"
    :class="[
      {
        'is-striped': striped,
        'is-bordered': bordered,
        'is-compact': compact,
        'has-sticky': stickyHeader,
      },
    ]"
  >
    <view class="lk-table__wrapper" :style="wrapStyle">
      <view class="lk-table__scroll">
        <!-- Header -->
        <view class="lk-table__header" :class="{ 'is-sticky': stickyHeader }">
          <view class="lk-table__tr lk-table__tr--head">
            <view v-if="selectable" class="lk-table__th lk-table__th--checkbox">
              <lk-checkbox
                :model-value="allChecked"
                :indeterminate="indeterminate"
                @update:model-value="toggleAll"
              />
            </view>
            <view v-if="showIndex" class="lk-table__th lk-table__th--index">#</view>
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
              :style="{
                width: col.width
                  ? typeof col.width === 'number'
                    ? col.width + 'px'
                    : col.width
                  : undefined,
                minWidth: col.minWidth
                  ? typeof col.minWidth === 'number'
                    ? col.minWidth + 'px'
                    : col.minWidth
                  : undefined,
                textAlign: col.align || undefined,
              }"
              @click="cycleSort(col)"
            >
              <slot :name="col.headerSlot || 'header-' + col.key" :column="col">
                {{ col.title || col.key }}
              </slot>
              <view v-if="col.sortable" class="lk-table__sort-icons">
                <i class="asc" />
                <i class="desc" />
              </view>
            </view>
          </view>
        </view>

        <!-- Body -->
        <view class="lk-table__body">
          <template v-if="!loading && sortedData.length">
            <view
              v-for="(row, ri) in sortedData"
              :key="row[rowKey] ?? ri"
              class="lk-table__tr"
              :class="{ 'is-selected': selectable && isSelected(row) }"
              @click="onRowClick(row, ri)"
            >
              <view
                v-if="selectable"
                class="lk-table__td lk-table__td--checkbox"
                @click.stop="toggleRow(row)"
              >
                <lk-checkbox :model-value="isSelected(row)" @update:model-value="toggleRow(row)" />
              </view>
              <view v-if="showIndex" class="lk-table__td lk-table__td--index">{{ ri + 1 }}</view>
              <view
                v-for="col in visibleColumns"
                :key="col.key + ri"
                class="lk-table__td"
                :class="col.className"
                :style="{
                  width: col.width
                    ? typeof col.width === 'number'
                      ? col.width + 'px'
                      : col.width
                    : undefined,
                  minWidth: col.minWidth
                    ? typeof col.minWidth === 'number'
                      ? col.minWidth + 'px'
                      : col.minWidth
                    : undefined,
                  textAlign: col.align || undefined,
                }"
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

          <view v-else-if="!loading" class="lk-table__empty">
            <slot name="empty">
              {{ emptyText }}
            </slot>
          </view>

          <view v-if="loading" class="lk-table__loading">
            <lk-loading variant="spinner" text="加载中..." />
          </view>
        </view>

        <!-- Summary -->
        <view v-if="summary && summaryRow" class="lk-table__footer">
          <view class="lk-table__tr lk-table__tr--summary">
            <view v-if="selectable" class="lk-table__td lk-table__td--checkbox summary-cell">
            </view>
            <view v-if="showIndex" class="lk-table__td lk-table__td--index summary-cell">合计</view>
            <template v-for="col in visibleColumns" :key="col.key">
              <view
                class="lk-table__td summary-cell"
                :style="{
                  width: col.width
                    ? typeof col.width === 'number'
                      ? col.width + 'px'
                      : col.width
                    : undefined,
                  textAlign: col.align || undefined,
                }"
              >
                <slot name="summary" :column="col" :value="summaryRow[col.key]" :row="summaryRow">
                  {{ summaryRow[col.key] !== undefined ? summaryRow[col.key] : '' }}
                </slot>
              </view>
            </template>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.lk-table {
  --_bg-head: var(--lk-color-bg-surface);
  --_bg-body: var(--lk-color-bg-surface);
  --_bg-hover: var(--lk-color-primary-bg-soft);
  --_bg-stripe: var(--lk-color-primary-bg-soft);
  --_border: var(--lk-color-border-weak);
  --_text: var(--lk-color-text);
  --_radius: var(--lk-radius-lg);
  position: relative;
  width: 100%;
  font-size: 26rpx;
  color: var(--_text);
  border-radius: var(--_radius);
  overflow: hidden;
  &.is-bordered {
    border: 2rpx solid var(--_border);
  }
  &__wrapper {
    width: 100%;
    position: relative;
  }
  &__scroll {
    width: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  /* Header */
  &__header {
    background: var(--_bg-head);
    &.is-sticky {
      position: sticky;
      top: 0;
      z-index: 10;
      box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.04);
    }
  }

  &__tr {
    display: flex;
    align-items: stretch;
    min-height: 88rpx;
    &--head {
      font-weight: 600;
      font-size: 26rpx;
      .lk-table__th {
        font-weight: 600;
      }
    }
    &--summary {
      font-weight: 600;
      background: var(--lk-color-primary-bg-soft);
      .summary-cell {
        font-size: 24rpx;
        color: var(--lk-color-primary-active);
      }
    }
  }

  &__th,
  &__td {
    flex-shrink: 0;
    padding: 0 28rpx;
    display: flex;
    align-items: center;
    position: relative;
    line-height: 1.3;
    background: transparent;
    font-size: 26rpx;
    min-width: 120rpx;
    box-sizing: border-box;
    &--checkbox {
      width: 88rpx;
      min-width: 88rpx;
      justify-content: center;
    }
    &--index {
      width: 72rpx;
      min-width: 72rpx;
      justify-content: center;
      font-variant-numeric: tabular-nums;
    }
  }

  &__th {
    height: 90rpx;
    background: var(--_bg-head);
    border-bottom: 2rpx solid var(--_border);
    font-weight: 500;
    &.is-sortable {
      cursor: pointer;
      user-select: none;
      padding-right: 56rpx;
    }
  }

  &__sort-icons {
    position: absolute;
    right: 20rpx;
    top: 50%;
    transform: translateY(-50%);
    width: 20rpx;
    display: flex;
    flex-direction: column;
    gap: 6rpx;
    .asc,
    .desc {
      width: 0;
      height: 0;
      border-left: 10rpx solid transparent;
      border-right: 10rpx solid transparent;
      opacity: 0.35;
    }
    .asc {
      border-bottom: 14rpx solid var(--lk-color-text);
    }
    .desc {
      border-top: 14rpx solid var(--lk-color-text);
    }
  }
  .is-sorted-asc .lk-table__sort-icons .asc,
  .is-sorted-desc .lk-table__sort-icons .desc {
    opacity: 1;
    filter: drop-shadow(0 0 4rpx var(--lk-color-primary-bg-soft));
  }

  &__body {
    background: var(--_bg-body);
  }

  &__td {
    border-bottom: 2rpx solid var(--_border);
    font-size: 26rpx;
    &.summary-cell {
      border-top: 2rpx solid var(--_border);
      border-bottom: none;
    }
  }

  /* 条纹 & hover */
  &.is-striped .lk-table__body .lk-table__tr:nth-child(2n) {
    background: var(--_bg-stripe);
  }
  .lk-table__body .lk-table__tr:not(.lk-table__tr--summary):not(.lk-table__tr--head):active {
    background: var(--_bg-hover);
  }
  .lk-table__tr.is-selected {
    background: var(--lk-color-primary-bg-soft);
    .lk-table__td,
    .lk-table__th {
      font-weight: 500;
      color: var(--lk-color-primary-active);
    }
  }

  &.is-compact {
    .lk-table__th,
    .lk-table__td {
      padding: 0 20rpx;
      min-height: 72rpx;
    }
    .lk-table__tr {
      min-height: 72rpx;
    }
  }

  &__empty {
    padding: 60rpx 20rpx;
    text-align: center;
    font-size: 26rpx;
    color: var(--lk-color-text-secondary);
  }

  &__loading {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20;
  }

  &__footer {
    .lk-table__tr--summary {
      border-top: 2rpx solid var(--_border);
    }
  }
}

/* 暗色适配（可针对 data-theme='dark' 做额外对比度增强） */
:deep([data-theme='dark']) .lk-table {
  --_bg-head: var(--lk-color-bg-surface);
  --_bg-body: var(--lk-color-bg-surface);
  --_bg-hover: rgba(255, 255, 255, 0.06);
  --_bg-stripe: rgba(255, 255, 255, 0.04);
  --_border: var(--lk-color-border-weak);
  &__loading {
    background: rgba(0, 0, 0, 0.45);
  }
}
</style>
