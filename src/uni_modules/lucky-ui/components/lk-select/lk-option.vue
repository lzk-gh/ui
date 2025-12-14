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
    <view class="lk-option__check">
      <text v-if="selected">✓</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.lk-option {
  position: relative;
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  font-size: 28rpx;
  color: var(--lk-color-text);
  border-radius: var(--lk-radius-md);
  transition: background-color 0.2s;
  user-select: none;
  cursor: pointer;

  &:hover:not(.is-disabled),
  &:active:not(.is-disabled) {
    background-color: var(--lk-color-bg-hover, #f5f5f5);
  }

  &.is-selected {
    background-color: var(--lk-color-primary-bg-soft);
    color: var(--lk-color-text);
    font-weight: 500;
  }

  &.is-disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  &__label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__check {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32rpx;
    height: 32rpx;
    margin-left: 16rpx;
    color: var(--lk-color-primary);
    font-size: 28rpx;
  }
}
</style>
