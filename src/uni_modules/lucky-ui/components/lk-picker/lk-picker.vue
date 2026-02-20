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

watch(
  () => [props.modelValue, props.columns, props.mode],
  () => {
    if (props.mode === 'region' || props.mode === 'cascade' || props.mode === 'multi') {
      innerValue.value = Array.isArray(props.modelValue)
        ? (props.modelValue as (string | number)[]).slice()
        : [];
    }
    initIndexes();
  },
  { immediate: true, deep: true }
);

// picker-view change 事件
function onChange(e: { detail: { value: number[] } }) {
  const idxs = e?.detail?.value || [];
  const cols = computedColumns.value;

  // 检测是否级联列变化
  if (props.mode === 'region' || props.mode === 'cascade') {
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

  // 计算选中的值
  let value: string | number | (string | number)[];
  if (props.mode === 'single') {
    value = cols[0]?.[idxs[0]]?.value ?? '';
  } else {
    value = cols.map((col, i) => col[idxs[i]]?.value ?? '');
    innerValue.value = value as (string | number)[];
  }

  emit('update:modelValue', value);
  emit('change', value);
}

function onCancel() {
  emit('cancel');
  emit('update:visible', false);
}

function onConfirm() {
  const cols = computedColumns.value;
  const idxs = selectedIndexes.value;

  let value: string | number | (string | number)[];
  if (props.mode === 'single') {
    value = cols[0]?.[idxs[0]]?.value ?? '';
  } else {
    value = cols.map((col, i) => col[idxs[i]]?.value ?? '');
  }

  emit('confirm', value);
  emit('update:visible', false);
}

// 计算 picker-view 高度
const viewHeight = computed(() => `${props.itemHeight * props.visibleCount  }rpx`);
</script>

<template>
  <!-- 内联模式 -->
  <view v-if="inline" class="lk-picker lk-picker--inline">
    <view v-if="title" class="lk-picker__header">
      <text class="lk-picker__title">{{ title }}</text>
    </view>
    <picker-view
      :value="selectedIndexes"
      class="lk-picker__view"
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
        <view class="lk-picker__btn lk-picker__btn--cancel" @click="onCancel">
          {{ cancelText }}
        </view>
        <view class="lk-picker__title">{{ title }}</view>
        <view class="lk-picker__btn lk-picker__btn--confirm" @click="onConfirm">
          {{ confirmText }}
        </view>
      </view>
      <picker-view
        :value="selectedIndexes"
        class="lk-picker__view"
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
  </lk-popup>
</template>

<style lang="scss">
@use './index.scss';
</style>
