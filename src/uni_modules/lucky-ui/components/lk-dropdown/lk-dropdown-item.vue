<script setup lang="ts">
import { inject, computed } from 'vue';
import type { Ref } from 'vue';
import type { DropdownSelectPayload, DropdownValue } from './dropdown.props';

defineOptions({ name: 'LkDropdownItem' });

const props = defineProps({
  name: { type: [String, Number], required: true },
  disabled: { type: Boolean, default: false },
  icon: { type: String, default: '' },
});
const emit = defineEmits({
  click: (_payload: { name: string | number; event?: unknown }) => true,
  'click-disabled': (_payload: { name: string | number; event?: unknown }) => true,
});
interface DropdownContext {
  active: Ref<DropdownValue>;
  selectItem: (name: DropdownValue, payload: DropdownSelectPayload) => void;
}

const dropdown = inject<DropdownContext | null>('LkDropdown', null);
const active = computed(() => dropdown?.active.value === props.name);

function click(event: unknown) {
  const payload = { name: props.name, event };
  if (props.disabled) {
    emit('click-disabled', payload);
    return;
  }
  emit('click', payload);
  dropdown?.selectItem(props.name, payload);
}
</script>

<template>
  <view
    class="lk-dropdown-item"
    :class="{ 'is-active': active, 'is-disabled': disabled }"
    @tap="click"
  >
    <lk-icon v-if="icon" :name="icon" size="34" class="lk-dropdown-item__icon" />
    <text class="lk-dropdown-item__label"><slot /></text>
    <lk-icon v-if="active" name="check" size="28" />
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
