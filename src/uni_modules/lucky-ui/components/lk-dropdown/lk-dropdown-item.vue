<script setup lang="ts">
import { inject, computed } from 'vue';

defineOptions({ name:'LkDropdownItem' });

const props = defineProps({
  name: { type:[String,Number], required:true },
  disabled: { type:Boolean, default:false },
  icon: { type:String, default:'' }
});
const dropdown = inject<any>('LkDropdown');
const active = computed(()=> dropdown?.active.value === props.name);

function click(){
  if(props.disabled) return;
  dropdown?.selectItem(props.name, { name: props.name });
}
</script>

<template>
  <view
      class="lk-dropdown-item"
      :class="{ 'is-active': active, 'is-disabled': disabled }"
      @click="click"
  >
    <lk-icon v-if="icon" :name="icon" size="34" class="lk-dropdown-item__icon" />
    <text class="lk-dropdown-item__label"><slot /></text>
    <lk-icon v-if="active" name="check" size="28" />
  </view>
</template>

<style scoped lang="scss">
.lk-dropdown-item {
  display:flex;
  align-items:center;
  gap: 16rpx;
  padding: 22rpx 32rpx;
  font-size: 28rpx;
  color: var(--lk-color-text);
  transition: background var(--lk-transition-fast), color var(--lk-transition-fast);
  &:active:not(.is-disabled){ background: var(--lk-color-primary-bg-soft); }
  &.is-active {
    color: var(--lk-color-primary);
    font-weight:600;
    background: var(--lk-color-primary-bg-soft);
  }
  &.is-disabled {
    opacity:.5; pointer-events:none;
  }
  &__icon { color: var(--lk-color-primary); }
}
</style>