<script setup lang="ts">
import type { StyleValue } from 'vue';
import { computed, ref, watch } from 'vue';
import {
  pickerProps,
  pickerEmits,
  type PickerOption,
  type PickerValue,
} from './picker.props';
import LkPopup from '../lk-popup/lk-popup.vue';
import { useLocale } from '../../composables/useLocale';
import {
  getPickerOptionsByIndexes,
  getPickerValueByIndexes,
  resolveCascadePickerIndexes,
  resolvePickerClass,
  resolvePickerColumns,
  resolvePickerIndicatorStyle,
  resolvePickerItemLabelClass,
  resolvePickerMaskStyle,
  resolvePickerViewHeight,
  resolvePickerViewWrapStyle,
  resolvePickerIndexes,
  syncPickerInnerValueFromModel,
  type PickerPrimitiveValue,
} from './picker.utils';

defineOptions({ name: 'LkPicker' });

const props = defineProps(pickerProps);
const emit = defineEmits(pickerEmits);
const { t } = useLocale('picker');

const resolvedConfirmText = computed(() => props.confirmText || t('confirm'));
const resolvedCancelText = computed(() => props.cancelText || t('cancel'));

// 当前选中的索引数组
const selectedIndexes = ref<number[]>([]);
// 内部值
const innerValue = ref<(string | number)[]>([]);

// 计算列数据
const computedColumns = computed<PickerOption[][]>(() => {
  return resolvePickerColumns({
    mode: props.mode,
    columns: props.columns,
    innerValue: innerValue.value,
  });
});

// 根据 modelValue 初始化选中索引
function initIndexes() {
  const cols = computedColumns.value;
  const mv = props.modelValue;

  if (!cols.length) {
    selectedIndexes.value = [];
    return;
  }

  if (props.mode === 'single') {
    selectedIndexes.value = resolvePickerIndexes({
      mode: props.mode,
      columns: cols,
      modelValue: mv,
    });
  } else {
    const arr = Array.isArray(mv) ? mv : [];
    innerValue.value = arr.slice();
    selectedIndexes.value = resolvePickerIndexes({
      mode: props.mode,
      columns: cols,
      modelValue: mv,
    });
  }
}

function syncInnerValueFromModel() {
  innerValue.value = syncPickerInnerValueFromModel({
    mode: props.mode,
    modelValue: props.modelValue,
  });
}

function getValueByIndexes(indexes: number[]): PickerValue {
  return getPickerValueByIndexes({
    mode: props.mode,
    columns: computedColumns.value,
    indexes,
  });
}

function getOptionsByIndexes(indexes: number[]): PickerOption[] {
  return getPickerOptionsByIndexes(computedColumns.value, indexes);
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
  (visible, oldVisible) => {
    if (visible === oldVisible) return;
    if (visible && !props.inline) {
      resetDraftSelection();
      emit('open');
    } else if (!visible && !props.inline) {
      emit('close');
    }
  }
);

// picker-view change 事件
function onChange(e: { detail: { value: number[] } }) {
  const idxs = resolveCascadePickerIndexes({
    nextIndexes: e?.detail?.value || [],
    previousIndexes: selectedIndexes.value,
    mode: props.mode,
  });

  selectedIndexes.value = idxs;

  // 滚动时只更新内部草稿，避免频繁触发 v-model 与 change。
  if (props.mode !== 'single') {
    innerValue.value = getValueByIndexes(idxs) as PickerPrimitiveValue[];
  }

  const value = getValueByIndexes(idxs);
  emit('pick', value, idxs, getOptionsByIndexes(idxs));
}

function onCancel() {
  resetDraftSelection();
  const value = getValueByIndexes(selectedIndexes.value);
  emit('cancel', value, selectedIndexes.value, getOptionsByIndexes(selectedIndexes.value));
  emit('update:visible', false);
}

function onConfirm() {
  const value = getValueByIndexes(selectedIndexes.value);
  const indexes = [...selectedIndexes.value];
  const options = getOptionsByIndexes(indexes);

  emit('update:modelValue', value);
  emit('change', value);
  emit('confirm', value, indexes, options);
  emit('update:visible', false);
}

/** 分层样式挂在 text 上：小程序 picker-view 内纯文本节点可能不继承 view 的字号/颜色/transform */
function itemLabelClass(ci: number, oi: number): string {
  return resolvePickerItemLabelClass({
    selectedIndexes: selectedIndexes.value,
    columnIndex: ci,
    optionIndex: oi,
  });
}

// 计算 picker-view 高度
const viewHeight = computed(() => resolvePickerViewHeight({
  itemHeight: props.itemHeight,
  visibleCount: props.visibleCount,
}));
const viewWrapStyle = computed(() => resolvePickerViewWrapStyle(props.itemHeight));
// 各端指示层：小程序原生主要靠此字符串去默认上下边线；与 lk-picker.scss 中伪元素覆盖互为补充。
const indicatorStyle = computed(() =>
  resolvePickerIndicatorStyle(props.itemHeight)
);
// ⚠️可能存在平台差异：picker-view 的遮罩层由各端原生实现，需通过 mask-style 覆盖默认浅色渐隐。
const maskStyle = computed(() => resolvePickerMaskStyle());
const cls = computed(() => [
  ...resolvePickerClass({
    inline: props.inline,
    customClass: props.customClass,
  }),
]);
const style = computed(() => props.customStyle as StyleValue);
</script>

<template>
  <!-- 内联模式 -->
  <view v-if="inline" :id="id" :class="cls" :style="style">
    <view v-if="title" class="lk-picker__header">
      <text class="lk-picker__title">{{ title }}</text>
    </view>
    <view class="lk-picker__view-wrap" :style="viewWrapStyle">
      <picker-view
        :value="selectedIndexes"
        class="lk-picker__view"
        indicator-class="lk-picker__indicator-host"
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
            <text :class="itemLabelClass(ci, oi)">{{ opt.label }}</text>
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
    <view :id="id" :class="cls" :style="style">
      <view class="lk-picker__toolbar">
        <view class="lk-picker__btn lk-picker__btn--cancel" @tap="onCancel">
          {{ resolvedCancelText }}
        </view>
        <view class="lk-picker__title">{{ title }}</view>
        <view class="lk-picker__btn lk-picker__btn--confirm" @tap="onConfirm">
          {{ resolvedConfirmText }}
        </view>
      </view>
      <view class="lk-picker__view-wrap" :style="viewWrapStyle">
        <picker-view
          :value="selectedIndexes"
          class="lk-picker__view"
          indicator-class="lk-picker__indicator-host"
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
              <text :class="itemLabelClass(ci, oi)">{{ opt.label }}</text>
            </view>
          </picker-view-column>
        </picker-view>
      </view>
    </view>
  </lk-popup>
</template>

<style lang="scss">
@use './lk-picker.scss';
</style>
