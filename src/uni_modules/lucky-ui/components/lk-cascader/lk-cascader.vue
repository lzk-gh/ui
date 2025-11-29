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
function clickNode(level: number, n: Node) {
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
  let list: Node[] = props.options;
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
        <lk-button size="small" variant="outline" @click="close">关闭</lk-button>
      </view>
    </view>
  </lk-popup>
</template>

<style scoped lang="scss">
.lk-cascader {
  min-height: var(--lk-control-height-md);
  padding: 0 32rpx;
  display: flex;
  align-items: center;
  background: var(--lk-input-bg);
  border: 2rpx solid var(--lk-input-border-color);
  border-radius: var(--lk-radius-lg);
  font-size: 28rpx;
  &__placeholder {
    color: var(--lk-color-text-placeholder);
  }
  &__clear {
    margin-left: auto;
    font-size: 36rpx;
    padding: 8rpx;
    color: var(--lk-color-text-secondary);
  }
  &:active:not(.is-disabled) {
    border-color: var(--lk-input-border-color-active);
  }
  &.is-disabled {
    opacity: 0.5;
  }
}
.lk-cascader__panel {
  padding: 32rpx 16rpx 32rpx 16rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}
.lk-cascader__cols {
  display: flex;
  gap: 16rpx;
  min-height: 480rpx;
  max-height: 480rpx;
}
.lk-cascader__col {
  width: 260rpx;
  background: var(--lk-color-bg-surface);
  border-radius: var(--lk-radius-lg);
  padding: 8rpx;
}
.lk-cascader__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 24rpx;
  font-size: 26rpx;
  border-radius: var(--lk-radius-md);
  margin-bottom: 8rpx;
  background: var(--lk-color-primary-bg-soft);
  color: var(--lk-color-text);
  &.is-active {
    background: var(--lk-color-primary);
    color: var(--lk-color-text-inverse);
    font-weight: 600;
  }
  &.is-disabled {
    opacity: 0.4;
  }
}
.lk-cascader__arrow {
  color: currentColor;
}
.lk-cascader__actions {
  display: flex;
  justify-content: flex-end;
  padding: 0 16rpx;
}
</style>
