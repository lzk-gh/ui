<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { areaPickerProps, areaPickerEmits } from './area-picker.props';
import { simpleChina, type RegionNode } from './data';
import LkPicker from '../lk-picker/lk-picker.vue';

defineOptions({ name: 'LkAreaPicker' });

const props = defineProps(areaPickerProps);
const emit = defineEmits(areaPickerEmits);

const inner = ref<string[]>(props.modelValue || []);

watch(
  () => props.modelValue,
  v => (inner.value = v?.slice() || [])
);

const dataSource = computed<RegionNode[]>(() => props.data || simpleChina);

function buildColumns(value: string[]) {
  const provs = dataSource.value;
  const pIdx = Math.max(
    0,
    provs.findIndex(p => p.code === value[0])
  );
  const p = provs[pIdx] || provs[0];
  const cands1 = provs.map(p => ({ label: p.name, value: p.code }));

  const cities = p?.children || [];
  const cIdx = Math.max(
    0,
    cities.findIndex(c => c.code === value[1])
  );
  const c = cities[cIdx] || cities[0];
  const cands2 = cities.map(c => ({ label: c.name, value: c.code }));

  const dists = c?.children || [];
  const dIdx = Math.max(
    0,
    dists.findIndex(d => d.code === value[2])
  );
  const cands3 = dists.map(d => ({ label: d.name, value: d.code }));

  return props.level === 2 ? [cands1, cands2] : [cands1, cands2, cands3];
}

const columns = computed(() => buildColumns(inner.value));

function onChange(v: any) {
  // v 是新值（可能是单列/多列），我们需纠正后续列
  const arr = Array.isArray(v) ? v.slice() : [v];
  inner.value = arr;
  emit('update:modelValue', inner.value);
  emit('change', inner.value);
}
function onConfirm(v: any) {
  emit('confirm', Array.isArray(v) ? v : v ? [v] : []);
  emit('update:visible', false);
}
function onCancel() {
  emit('cancel');
  emit('update:visible', false);
}
</script>

<template>
  <lk-picker
    :columns="columns"
    v-model="inner"
    v-model:visible="(props as any).visible"
    :title="props.title"
    @change="onChange"
    @confirm="onConfirm"
    @cancel="onCancel"
  />
</template>

<style scoped lang="scss"></style>
