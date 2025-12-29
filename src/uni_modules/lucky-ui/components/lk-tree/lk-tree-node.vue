<script setup lang="ts">
import { computed } from 'vue';

defineOptions({ name: 'LkTreeNode' });

const props = defineProps({
  node: { type: Object, required: true },
  level: { type: Number, default: 0 },
  checkable: { type: Boolean, default: true },
  selected: { type: Object, required: true }, // Set
});
const emit = defineEmits(['toggle', 'check']);

const hasChildren = computed(() => props.node.children && props.node.children.length);
const expanded = computed(() => !!props.node.expand);
const isChecked = computed(() => props.selected.has(props.node.value));
function toggleExpand() {
  if (!hasChildren.value) return;
  emit('toggle', props.node);
}
function onCheck() {
  emit('check', props.node);
}
</script>

<template>
  <view class="lk-tree-node">
    <view class="lk-tree-node__main" :style="{ paddingLeft: level * 32 + 'rpx' }">
      <view
        class="lk-tree-node__expander"
        :class="{ 'is-leaf': !hasChildren }"
        @click="toggleExpand"
      >
        <lk-icon v-if="hasChildren" :name="expanded ? 'arrow-down' : 'arrow-right'" size="28" />
      </view>
      <view
        v-if="checkable"
        class="lk-tree-node__checkbox"
        :class="{ 'is-checked': isChecked }"
        @click="onCheck"
      >
        <view class="lk-tree-node__inner"></view>
      </view>
      <text class="lk-tree-node__label" :class="{ 'is-disabled': node.disabled }">{{
        node.label
      }}</text>
    </view>
    <view v-if="hasChildren && expanded" class="lk-tree-node__children">
      <lk-tree-node
        v-for="c in node.children"
        :key="c.value"
        :node="c"
        :level="level + 1"
        :checkable="checkable"
        :selected="selected"
        @toggle="$emit('toggle', $event)"
        @check="$emit('check', $event)"
      />
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
