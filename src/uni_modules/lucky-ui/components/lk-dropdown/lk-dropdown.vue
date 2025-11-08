<script setup lang="ts">
import { ref, provide, watch } from 'vue';

defineOptions({ name: 'LkDropdown' });

const props = defineProps({
  modelValue: { type: [String, Number], default: '' }, // active menu name
  trigger: { type: String, default: 'click' }, // click | hover
  placement: { type: String, default: 'bottom' },
  closeOnSelect: { type: Boolean, default: true },
});
const emit = defineEmits(['update:modelValue', 'change', 'show', 'hide', 'select']);

const open = ref(false);
const active = ref(props.modelValue);
watch(
  () => props.modelValue,
  v => (active.value = v)
);

function toggle(v?: boolean) {
  const next = v !== undefined ? v : !open.value;
  if (next === open.value) return;
  open.value = next;
  emit(next ? 'show' : 'hide');
}
function selectItem(name: any, payload: any) {
  active.value = name;
  emit('update:modelValue', name);
  emit('select', payload);
  emit('change', name);
  if (props.closeOnSelect) toggle(false);
}

function onTriggerEnter() {
  if (props.trigger === 'hover') toggle(true);
}
function onTriggerLeave() {
  if (props.trigger === 'hover') toggle(false);
}
function onTriggerClick() {
  if (props.trigger === 'click') toggle();
}

provide('LkDropdown', {
  active,
  selectItem,
  closeOnSelect: props.closeOnSelect,
});
</script>

<template>
  <view class="lk-dropdown" @mouseenter="onTriggerEnter" @mouseleave="onTriggerLeave">
    <view class="lk-dropdown__trigger" @click="onTriggerClick">
      <slot />
    </view>
    <view v-if="open" class="lk-dropdown__menu lk-elevated">
      <slot name="menu" />
    </view>
  </view>
</template>

<style scoped lang="scss">
.lk-dropdown {
  display: inline-block;
  position: relative;
  &__trigger {
    display: inline-flex;
    align-items: center;
  }
  &__menu {
    position: absolute;
    min-width: 220rpx;
    top: 100%;
    left: 0;
    margin-top: 12rpx;
    background: var(--lk-color-bg-surface);
    border: 2rpx solid var(--lk-color-border-weak);
    border-radius: var(--lk-radius-lg);
    box-shadow: var(--lk-shadow-base);
    padding: 12rpx 0;
    animation: lk-dd-in 0.18s;
    z-index: 2400;
  }
}
@keyframes lk-dd-in {
  from {
    opacity: 0;
    transform: translateY(-6rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
