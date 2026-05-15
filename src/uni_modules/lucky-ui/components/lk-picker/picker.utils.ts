import type { PickerColumns, PickerMode, PickerOption, PickerValue } from './picker.props';

export type PickerPrimitiveValue = string | number;

export function normalizePickerColumns(columns: PickerColumns): PickerOption[][] {
  if (!Array.isArray(columns) || columns.length === 0) return [];
  if (Array.isArray(columns[0])) return columns as PickerOption[][];
  return [columns as PickerOption[]];
}

export function buildCascadePickerColumns(
  data: PickerOption[],
  value: PickerPrimitiveValue[]
): PickerOption[][] {
  const result: PickerOption[][] = [];
  let currentLevel = data;

  for (let i = 0; currentLevel && currentLevel.length > 0; i++) {
    result.push(currentLevel);
    const index =
      value[i] !== undefined ? currentLevel.findIndex(item => item.value === value[i]) : 0;
    const selected = currentLevel[Math.max(0, index)] || currentLevel[0];
    currentLevel = selected?.children || [];
  }

  return result;
}

export function resolvePickerColumns(options: {
  mode: PickerMode;
  columns: PickerColumns;
  innerValue: PickerPrimitiveValue[];
}): PickerOption[][] {
  if (options.mode === 'cascade' && Array.isArray(options.columns)) {
    return buildCascadePickerColumns(options.columns as PickerOption[], options.innerValue);
  }

  return normalizePickerColumns(options.columns);
}

export function syncPickerInnerValueFromModel(options: {
  mode: PickerMode;
  modelValue: PickerValue | undefined;
}): PickerPrimitiveValue[] {
  if (options.mode !== 'cascade' && options.mode !== 'multi') return [];
  return Array.isArray(options.modelValue) ? options.modelValue.slice() : [];
}

export function resolvePickerIndexes(options: {
  mode: PickerMode;
  columns: PickerOption[][];
  modelValue: PickerValue | undefined;
}): number[] {
  if (!options.columns.length) return [];

  if (options.mode === 'single') {
    const index = options.columns[0].findIndex(option => option.value === options.modelValue);
    return [Math.max(0, index)];
  }

  const value = Array.isArray(options.modelValue) ? options.modelValue : [];
  return options.columns.map((column, index) => {
    const optionIndex = column.findIndex(option => option.value === value[index]);
    return Math.max(0, optionIndex);
  });
}

export function getPickerValueByIndexes(options: {
  mode: PickerMode;
  columns: PickerOption[][];
  indexes: number[];
}): PickerValue {
  if (options.mode === 'single') {
    return options.columns[0]?.[options.indexes[0]]?.value ?? '';
  }

  return options.columns.map((column, index) => column[options.indexes[index]]?.value ?? '');
}

export function getPickerOptionsByIndexes(
  columns: PickerOption[][],
  indexes: number[]
): PickerOption[] {
  return columns
    .map((column, index) => column[indexes[index]])
    .filter((item): item is PickerOption => !!item);
}

export function resolveCascadePickerIndexes(options: {
  nextIndexes: number[];
  previousIndexes: number[];
  mode: PickerMode;
}): number[] {
  const indexes = [...options.nextIndexes];
  if (options.mode !== 'cascade') return indexes;

  for (let i = 0; i < indexes.length; i++) {
    if (indexes[i] !== options.previousIndexes[i]) {
      for (let j = i + 1; j < indexes.length; j++) {
        indexes[j] = 0;
      }
      break;
    }
  }

  return indexes;
}

export function resolvePickerDistanceBucket(options: {
  selectedIndexes: number[];
  columnIndex: number;
  optionIndex: number;
}): 0 | 1 | 2 | 3 {
  const selected = options.selectedIndexes[options.columnIndex];
  if (selected === undefined) return 3;
  return Math.min(Math.abs(options.optionIndex - selected), 3) as 0 | 1 | 2 | 3;
}

export function resolvePickerItemLabelClass(options: {
  selectedIndexes: number[];
  columnIndex: number;
  optionIndex: number;
}): string {
  const bucket = resolvePickerDistanceBucket(options);
  return `lk-picker__item-label lk-picker__item-label--dist${bucket}`;
}

export function resolvePickerViewHeight(options: {
  itemHeight: number;
  visibleCount: number;
}): string {
  return `${options.itemHeight * options.visibleCount}rpx`;
}

export function resolvePickerViewWrapStyle(itemHeight: number): string {
  return `--lk-picker-item-height: ${itemHeight}rpx;`;
}

export function resolvePickerIndicatorStyle(itemHeight: number): string {
  return [
    `height: ${itemHeight}rpx`,
    'background: transparent',
    'border: none',
    'border-width: 0',
    'border-top: none',
    'border-bottom: none',
    'border-left: none',
    'border-right: none',
    'border-color: transparent',
    'outline: none',
    'box-shadow: none',
  ].join(';');
}

export function resolvePickerMaskStyle(): string {
  return [
    'background-image: linear-gradient(to bottom, var(--lk-picker-bg), transparent), linear-gradient(to top, var(--lk-picker-bg), transparent)',
    'background-position: top, bottom',
    'background-size: 100% 50%',
    'background-repeat: no-repeat',
  ].join(';');
}

export function resolvePickerClass(options: {
  inline: boolean;
  customClass: unknown;
}) {
  return [
    'lk-picker',
    {
      'lk-picker--inline': options.inline,
    },
    options.customClass,
  ];
}
