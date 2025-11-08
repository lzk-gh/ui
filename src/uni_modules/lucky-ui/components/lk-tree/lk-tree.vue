<script setup lang="ts">
import { ref, watch, computed } from 'vue';

defineOptions({ name: 'LkTree' });

interface TreeNode {
  label: string;
  value: string | number;
  children?: TreeNode[];
  disabled?: boolean;
  expand?: boolean;
  checked?: boolean;
  indeterminate?: boolean;
}

const props = defineProps({
  modelValue: {
    type: Array as () => Array<string | number>,
    default: () => [],
  }, // 选中值
  data: { type: Array as () => TreeNode[], default: () => [] },
  checkable: { type: Boolean, default: true },
  accordion: { type: Boolean, default: false },
});
const emit = defineEmits(['update:modelValue', 'change', 'toggle']);

const selected = ref<Set<string | number>>(new Set(props.modelValue));
watch(
  () => props.modelValue,
  v => {
    selected.value = new Set(v);
  },
  { immediate: true }
);

function toggle(node: TreeNode) {
  if (node.disabled) return;
  node.expand = !node.expand;
  if (props.accordion) collapseOthers(rootData.value, node);
  emit('toggle', node);
}
function collapseOthers(list: TreeNode[], keep: TreeNode) {
  for (const n of list) {
    if (n !== keep) n.expand = false;
    if (n.children) collapseOthers(n.children, keep);
  }
}
function check(node: TreeNode) {
  if (node.disabled) return;
  if (selected.value.has(node.value)) {
    selected.value.delete(node.value);
  } else {
    selected.value.add(node.value);
  }
  emitValue();
}
function emitValue() {
  const arr = Array.from(selected.value);
  emit('update:modelValue', arr);
  emit('change', arr);
}

const rootData = computed(() => props.data);
</script>

<template>
  <view class="lk-tree">
    <lk-tree-node
      v-for="n in rootData"
      :key="n.value"
      :node="n"
      :checkable="checkable"
      :selected="selected"
      @toggle="toggle"
      @check="check"
    />
  </view>
</template>

<style scoped lang="scss">
.lk-tree {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
</style>
