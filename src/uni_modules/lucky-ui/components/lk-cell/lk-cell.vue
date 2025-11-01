<script setup lang="ts">
defineOptions({ name:'LkCell' });

const props = defineProps({
  title: { type: String, default: '' },
  label: { type: String, default: '' },
  value: { type: String, default: '' },
  icon: { type: String, default: '' },
  arrow: { type: Boolean, default: false },
  clickable: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  center: { type: Boolean, default: false }
});
const emit = defineEmits(['click']);

function onClick(){
  if(props.disabled) return;
  emit('click');
}
</script>

<template>
  <view
      class="lk-cell"
      :class="[{ 'is-clickable': clickable, 'is-disabled': disabled, 'is-center': center }]"
      @click="onClick"
  >
    <view class="lk-cell__left">
      <lk-icon v-if="icon" :name="icon" size="36" class="lk-cell__icon" />
      <view class="lk-cell__titles">
        <text v-if="$slots.title || title" class="lk-cell__title">
          <slot name="title">{{ title }}</slot>
        </text>
        <text v-if="$slots.label || label" class="lk-cell__label">
          <slot name="label">{{ label }}</slot>
        </text>
      </view>
    </view>
    <view class="lk-cell__right">
      <text v-if="$slots.value || value" class="lk-cell__value">
        <slot name="value">{{ value }}</slot>
      </text>
      <lk-icon v-if="arrow" name="arrow-right" size="30" class="lk-cell__arrow" />
    </view>
  </view>
</template>

<style scoped lang="scss">
.lk-cell {
  display:flex;
  align-items:flex-start;
  padding: 28rpx 0;
  background: var(--lk-color-bg-surface);
  font-size: 28rpx;
  position: relative;
  &.is-center { align-items: center; }
  &.is-clickable:active { background: var(--lk-color-primary-bg-soft); }
  &.is-disabled { opacity: .5; }
  &__left {
    display:flex;
    align-items:flex-start;
    flex:1;
    gap: 20rpx;
  }
  &__icon { color: var(--lk-color-primary); }
  &__titles { display:flex; flex-direction:column; gap: 6rpx; }
  &__title { font-weight:500; }
  &__label { font-size: 24rpx; color: var(--lk-color-text-secondary); }
  &__right {
    display:flex;
    align-items:center;
    gap: 12rpx;
    font-size: 26rpx;
    color: var(--lk-color-text-secondary);
  }
  &__value { color: var(--lk-color-text-secondary); }
  &__arrow { color: var(--lk-color-text-secondary); }
}
</style>
