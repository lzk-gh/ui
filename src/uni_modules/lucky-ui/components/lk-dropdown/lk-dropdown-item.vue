<script setup lang="ts">
import { inject, computed } from 'vue';

defineOptions({ name: 'LkDropdownItem' });

const props = defineProps({
  name: { type: [String, Number], required: true },
  disabled: { type: Boolean, default: false },
  icon: { type: String, default: '' },
});
const dropdown = inject<any>('LkDropdown');
const active = computed(() => dropdown?.active.value === props.name);

function click() {
  if (props.disabled) return;
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

<style lang="scss">
@use './index.scss';
</style>
