<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import LkPopup from '../lk-popup/lk-popup.vue';
import LkButton from '../lk-button/lk-button.vue';
import { cascaderProps, cascaderEmits, type CascaderNode } from './cascader.props';

defineOptions({ name: 'LkCascader' });

const props = defineProps(cascaderProps);
const emit = defineEmits(cascaderEmits);

const show = ref(false);
const pathValues = ref<(string | number)[]>([]);
const columnOptions = ref<CascaderNode[][]>([]);

watch(
  () => props.modelValue,
  v => {
    pathValues.value = [...v];
    rebuild();
  },
  { immediate: true }
);

function open() {
  if (props.disabled) return;
  show.value = true;
  emit('open');
}
function close() {
  show.value = false;
  emit('close');
}
function clear() {
  pathValues.value = [];
  emit('update:modelValue', []);
  emit('change', []);
  emit('clear');
  close();
}

function rebuild() {
  const cols: CascaderNode[][] = [];
  let curList: CascaderNode[] = props.options;
  cols.push(curList);
  for (const val of pathValues.value) {
    const found = curList.find(n => n.value === val);
    if (found && found.children && found.children.length) {
      curList = found.children;
      cols.push(curList);
    } else {
      break;
    }
  }
  columnOptions.value = cols;
}
function clickNode(level: number, n: CascaderNode) {
  if (n.disabled) return;
  pathValues.value = pathValues.value.slice(0, level);
  pathValues.value[level] = n.value;
  rebuild();
  const isLeaf = !n.children || !n.children.length;
  if (isLeaf || props.changeOnSelect) {
    emit('update:modelValue', [...pathValues.value]);
    emit('change', [...pathValues.value]);
    if (isLeaf) close();
  }
}
const display = computed(() => {
  if (!props.modelValue.length) return '';
  // 查 label
  let labels: string[] = [];
  let list: CascaderNode[] = props.options;
  for (const v of props.modelValue) {
    const item = list.find(n => n.value === v);
    if (!item) break;
    labels.push(item.label);
    list = item.children || [];
  }
  return labels.join(' / ');
});
</script>

<template>
  <view class="lk-cascader" :class="{ 'is-disabled': disabled }" @click="open">
    <text v-if="display" class="lk-cascader__value">{{ display }}</text>
    <text v-else class="lk-cascader__placeholder">{{ placeholder }}</text>
    <view v-if="clearable && display" class="lk-cascader__clear" @click.stop="clear">×</view>
  </view>
  <lk-popup v-model="show" position="bottom">
    <view class="lk-cascader__panel">
      <view class="lk-cascader__cols">
        <scroll-view
          v-for="(col, idx) in columnOptions"
          :key="idx"
          scroll-y
          class="lk-cascader__col"
        >
          <view
            v-for="item in col"
            :key="item.value"
            class="lk-cascader__item"
            :class="{
              'is-active': pathValues[idx] === item.value,
              'is-disabled': item.disabled,
            }"
            @click="clickNode(idx, item)"
          >
            <text>{{ item.label }}</text>
            <lk-icon
              v-if="item.children && item.children.length"
              name="arrow-right"
              size="24"
              class="lk-cascader__arrow"
            />
          </view>
        </scroll-view>
      </view>
      <view class="lk-cascader__actions">
        <lk-button size="sm" variant="outline" @click="close">关闭</lk-button>
      </view>
    </view>
  </lk-popup>
</template>

<style lang="scss">
@use './index.scss';
</style>
