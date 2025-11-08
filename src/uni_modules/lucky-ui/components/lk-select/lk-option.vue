<script setup lang="ts">
import { inject, computed } from 'vue';

defineOptions({ name: 'LkOption' });

const props = defineProps({
  value: { type: [String, Number], required: true },
  label: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
});

const select = inject<any>('LkSelect');
const selected = computed(() => select?.selectedValues.value.includes(props.value));

function choose() {
  if (props.disabled) return;
  select?.select(props.value, props.label || props.value);
}
select?.register({ value: props.value, label: props.label || props.value });
</script>

<template>
  <view
    class="lk-option"
    :class="{ 'is-selected': selected, 'is-disabled': disabled }"
    @click="choose"
  >
    <text class="lk-option__label"
      ><slot>{{ label || value }}</slot></text
    >
    <text v-if="selected" class="lk-option__check">✓</text>
  </view>
</template>

<style scoped lang="scss">
.lk-option {
  position: relative;
  display: flex;
  align-items: center;
  padding: 22rpx 32rpx;
  font-size: 28rpx;
  color: var(--lk-color-text);
  transition:
    background var(--lk-transition-fast),
    color var(--lk-transition-fast);
  &.is-selected {
    background: var(--lk-color-primary-bg-soft);
    color: var(--lk-color-primary);
    font-weight: 600;
  }
  &:active:not(.is-disabled) {
    background: var(--lk-color-primary-bg-soft);
  }
  &.is-disabled {
    opacity: 0.5;
    pointer-events: none;
  }
  &__check {
    margin-left: auto;
    font-size: 28rpx;
    color: var(--lk-color-primary);
  }
}
</style>
