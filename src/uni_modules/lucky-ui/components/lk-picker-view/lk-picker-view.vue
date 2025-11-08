<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { PickerOption } from './types';
import { lkPickerViewProps, lkPickerViewEmits } from './types';

defineOptions({ name: 'LkPickerView' });

const props = defineProps(lkPickerViewProps);
const emit = defineEmits(lkPickerViewEmits);

function normalizeColumns(cols: any): PickerOption[][] {
  if (!Array.isArray(cols)) return [];
  if (cols.length === 0) return [];
  if (Array.isArray(cols[0])) return cols as PickerOption[][];
  return [cols as PickerOption[]];
}

const columns = computed(() => normalizeColumns(props.columns));

const selectedIndex = ref<number[]>([]);

function initByModel() {
  const cols = columns.value;
  const mv = props.modelValue;
  const idx: number[] = [];
  if (cols.length === 0) {
    selectedIndex.value = [];
    return;
  }
  if (cols.length === 1) {
    const v = mv;
    const i = cols[0].findIndex(o => o?.value === v);
    idx[0] = i >= 0 ? i : 0;
  } else {
    const arr = Array.isArray(mv) ? mv : [];
    cols.forEach((c, i) => {
      const v = arr[i];
      const j = c.findIndex(o => o?.value === v);
      idx[i] = j >= 0 ? j : 0;
    });
  }
  selectedIndex.value = idx;
}

watch(() => [props.columns, props.modelValue], initByModel, {
  immediate: true,
  deep: true,
});

function onChange(e: any) {
  // e.detail.value 是每列索引数组
  const idxs: number[] = e?.detail?.value || [];
  selectedIndex.value = idxs;
  const cols = columns.value;
  let value: any = null;
  if (cols.length === 1) {
    value = cols[0][idxs[0]]?.value;
  } else {
    value = cols.map((c, i) => c[idxs[i]]?.value);
  }
  emit('update:modelValue', value);
  emit('change', value);
}
</script>

<template>
  <picker-view :value="selectedIndex" @change="onChange" class="lk-picker-view">
    <picker-view-column v-for="(col, ci) in columns" :key="ci">
      <view class="lk-picker-view__item" v-for="(opt, oi) in col" :key="oi">{{
        opt.label
      }}</view>
    </picker-view-column>
  </picker-view>
</template>

<style scoped lang="scss">
.lk-picker-view {
  height: 560rpx;
}
.lk-picker-view__item {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
