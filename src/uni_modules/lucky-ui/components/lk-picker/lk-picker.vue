<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  pickerProps,
  pickerEmits,
  type PickerOption,
} from './picker.props';
import LkPopup from '../lk-popup/lk-popup.vue';

defineOptions({ name: 'LkPicker' });

const props = defineProps(pickerProps);
const emit = defineEmits(pickerEmits);

type PickerValue = string | number | (string | number)[];

// 当前选中的索引数组
const selectedIndexes = ref<number[]>([]);
// 内部值
const innerValue = ref<(string | number)[]>([]);

// 标准化列数据
function normalizeColumns(cols: PickerOption[] | PickerOption[][]): PickerOption[][] {
  if (!Array.isArray(cols) || cols.length === 0) return [];
  if (Array.isArray(cols[0])) return cols as PickerOption[][];
  return [cols as PickerOption[]];
}

// 计算列数据
const computedColumns = computed<PickerOption[][]>(() => {
  if (props.mode === 'cascade' && Array.isArray(props.columns)) {
    // 级联模式：根据当前选择动态计算列
    return buildCascadeColumns(props.columns as PickerOption[], innerValue.value);
  }

  return normalizeColumns(props.columns);
});

// 构建级联列
function buildCascadeColumns(data: PickerOption[], value: (string | number)[]): PickerOption[][] {
  const result: PickerOption[][] = [];
  let currentLevel = data;

  for (let i = 0; currentLevel && currentLevel.length > 0; i++) {
    result.push(currentLevel);
    const idx =
      value[i] !== undefined ? currentLevel.findIndex(item => item.value === value[i]) : 0;
    const selected = currentLevel[Math.max(0, idx)] || currentLevel[0];
    currentLevel = selected?.children || [];
  }

  return result;
}

// 根据 modelValue 初始化选中索引
function initIndexes() {
  const cols = computedColumns.value;
  const mv = props.modelValue;

  if (!cols.length) {
    selectedIndexes.value = [];
    return;
  }

  if (props.mode === 'single') {
    const idx = cols[0].findIndex(o => o.value === mv);
    selectedIndexes.value = [Math.max(0, idx)];
  } else {
    const arr = Array.isArray(mv) ? mv : [];
    innerValue.value = arr.slice();
    selectedIndexes.value = cols.map((col, i) => {
      const idx = col.findIndex(o => o.value === arr[i]);
      return Math.max(0, idx);
    });
  }
}

function syncInnerValueFromModel() {
  if (props.mode === 'cascade' || props.mode === 'multi') {
    innerValue.value = Array.isArray(props.modelValue)
      ? (props.modelValue as (string | number)[]).slice()
      : [];
  }
}

function getValueByIndexes(indexes: number[]): PickerValue {
  const cols = computedColumns.value;

  if (props.mode === 'single') {
    return cols[0]?.[indexes[0]]?.value ?? '';
  }

  return cols.map((col, i) => col[indexes[i]]?.value ?? '');
}

function resetDraftSelection() {
  syncInnerValueFromModel();
  initIndexes();
}

watch(
  () => [props.modelValue, props.columns, props.mode],
  () => {
    resetDraftSelection();
  },
  { immediate: true, deep: true }
);

watch(
  () => props.visible,
  visible => {
    if (visible && !props.inline) {
      resetDraftSelection();
    }
  }
);

// picker-view change 事件
function onChange(e: { detail: { value: number[] } }) {
  const idxs = [...(e?.detail?.value || [])];

  // 检测是否级联列变化
  if (props.mode === 'cascade') {
    for (let i = 0; i < idxs.length; i++) {
      if (idxs[i] !== selectedIndexes.value[i]) {
        // 重置后续列的索引
        for (let j = i + 1; j < idxs.length; j++) {
          idxs[j] = 0;
        }
        break;
      }
    }
  }

  selectedIndexes.value = idxs;

  // 滚动时只更新内部草稿，避免频繁触发 v-model 与 change。
  if (props.mode !== 'single') {
    innerValue.value = getValueByIndexes(idxs) as (string | number)[];
  }
}

function onCancel() {
  resetDraftSelection();
  emit('cancel');
  emit('update:visible', false);
}

function onConfirm() {
  const value = getValueByIndexes(selectedIndexes.value);

  emit('update:modelValue', value);
  emit('change', value);
  emit('confirm', value);
  emit('update:visible', false);
}

// 计算 picker-view 高度
const viewHeight = computed(() => `${props.itemHeight * props.visibleCount}rpx`);
const viewWrapStyle = computed(() => `--lk-picker-item-height: ${props.itemHeight}rpx;`);
const indicatorStyle = computed(() => [
  `height: ${props.itemHeight}rpx`,
  'background: transparent',
  'border-top: var(--lk-rpx-2) solid var(--lk-picker-indicator-border)',
  'border-bottom: var(--lk-rpx-2) solid var(--lk-picker-indicator-border)',
].join(';'));
// ⚠️可能存在平台差异：picker-view 的遮罩层由各端原生实现，需通过 mask-style 覆盖默认浅色渐隐。
const maskStyle = computed(() => [
  'background-image: linear-gradient(to bottom, var(--lk-picker-bg), transparent), linear-gradient(to top, var(--lk-picker-bg), transparent)',
  'background-position: top, bottom',
  'background-size: 100% 50%',
  'background-repeat: no-repeat',
].join(';'));
</script>

<template>
  <!-- 内联模式 -->
  <view v-if="inline" class="lk-picker lk-picker--inline">
    <view v-if="title" class="lk-picker__header">
      <text class="lk-picker__title">{{ title }}</text>
    </view>
    <view class="lk-picker__view-wrap" :style="viewWrapStyle">
      <view class="lk-picker__selection" />
      <picker-view
        :value="selectedIndexes"
        class="lk-picker__view"
        :indicator-style="indicatorStyle"
        :mask-style="maskStyle"
        :style="{ height: viewHeight }"
        @change="onChange"
      >
        <picker-view-column v-for="(col, ci) in computedColumns" :key="ci">
          <view
            v-for="(opt, oi) in col"
            :key="oi"
            class="lk-picker__item"
            :style="{ height: itemHeight + 'rpx', lineHeight: itemHeight + 'rpx' }"
          >
            {{ opt.label }}
          </view>
        </picker-view-column>
      </picker-view>
    </view>
  </view>

  <!-- 弹出模式 -->
  <lk-popup
    v-else
    :model-value="visible"
    position="bottom"
    :round="round"
    @update:model-value="(v: boolean) => emit('update:visible', v)"
  >
    <view class="lk-picker">
      <view class="lk-picker__toolbar">
        <view class="lk-picker__btn lk-picker__btn--cancel" @tap="onCancel">
          {{ cancelText }}
        </view>
        <view class="lk-picker__title">{{ title }}</view>
        <view class="lk-picker__btn lk-picker__btn--confirm" @tap="onConfirm">
          {{ confirmText }}
        </view>
      </view>
      <view class="lk-picker__view-wrap" :style="viewWrapStyle">
        <view class="lk-picker__selection" />
        <picker-view
          :value="selectedIndexes"
          class="lk-picker__view"
          :indicator-style="indicatorStyle"
          :mask-style="maskStyle"
          :style="{ height: viewHeight }"
          @change="onChange"
        >
          <picker-view-column v-for="(col, ci) in computedColumns" :key="ci">
            <view
              v-for="(opt, oi) in col"
              :key="oi"
              class="lk-picker__item"
              :style="{ height: itemHeight + 'rpx', lineHeight: itemHeight + 'rpx' }"
            >
              {{ opt.label }}
            </view>
          </picker-view-column>
        </picker-view>
      </view>
    </view>
  </lk-popup>
</template>

<style lang="scss">
@use './index.scss';
</style>
