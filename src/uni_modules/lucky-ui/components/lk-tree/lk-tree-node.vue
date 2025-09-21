<script setup lang="ts">
import { computed } from 'vue';

defineOptions({ name:'LkTreeNode' });

const props = defineProps({
  node: { type:Object, required:true },
  level: { type:Number, default:0 },
  checkable: { type:Boolean, default:true },
  selected: { type:Object, required:true } // Set
});
const emit = defineEmits(['toggle','check']);

const hasChildren = computed(()=> props.node.children && props.node.children.length);
const expanded = computed(()=> !!props.node.expand);
const isChecked = computed(()=> props.selected.has(props.node.value));
function toggleExpand(){
  if(!hasChildren.value) return;
  emit('toggle', props.node);
}
function onCheck(){
  emit('check', props.node);
}
</script>

<template>
  <view class="lk-tree-node">
    <view class="lk-tree-node__main" :style="{ paddingLeft: (level*32)+'rpx' }">
      <view class="lk-tree-node__expander" :class="{ 'is-leaf': !hasChildren }" @click="toggleExpand">
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
      <text class="lk-tree-node__label" :class="{ 'is-disabled': node.disabled }">{{ node.label }}</text>
    </view>
    <view v-if="hasChildren && expanded" class="lk-tree-node__children">
      <lk-tree-node
          v-for="c in node.children"
          :key="c.value"
          :node="c"
          :level="level+1"
          :checkable="checkable"
          :selected="selected"
          @toggle="$emit('toggle',$event)"
          @check="$emit('check',$event)"
      />
    </view>
  </view>
</template>

<style scoped lang="scss">
.lk-tree-node {
  display:flex;
  flex-direction:column;
  &__main {
    display:flex;
    align-items:center;
    gap:12rpx;
    min-height:72rpx;
    border-radius: var(--lk-radius-md);
    padding-right:12rpx;
    &:active { background: var(--lk-color-primary-bg-soft); }
  }
  &__expander {
    width:48rpx; height:48rpx;
    display:flex; align-items:center; justify-content:center;
    &.is-leaf { opacity:0; }
  }
  &__checkbox {
    width:40rpx; height:40rpx;
    border:2rpx solid var(--lk-color-primary);
    border-radius: var(--lk-radius-sm);
    display:flex; align-items:center; justify-content:center;
    background: var(--lk-color-bg-surface);
    &.is-checked {
      background: var(--lk-color-primary);
      .lk-tree-node__inner {
        width:60%; height:60%; background: var(--lk-color-text-inverse); border-radius:4rpx;
      }
    }
  }
  &__inner { width:0; height:0; }
  &__label { font-size:28rpx; color: var(--lk-color-text); }
  &__children {
    margin-left: 0;
    display:flex; flex-direction:column; gap:8rpx;
  }
  .is-disabled { opacity:.5; }
}
</style>