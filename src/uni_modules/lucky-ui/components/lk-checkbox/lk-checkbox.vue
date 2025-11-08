<script setup lang="ts">
import { inject, computed, useSlots } from 'vue';

defineOptions({ name: 'LkCheckbox' });

const props = defineProps({
  modelValue: { type: [Boolean, String, Number], default: undefined },
  label: { type: [String, Number, Boolean, Object], default: undefined },
  trueValue: { type: [Boolean, String, Number], default: true },
  falseValue: { type: [Boolean, String, Number], default: false },
  size: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  indeterminate: { type: Boolean, default: false },
  iconType: { type: String, default: '' }, // check | dot | icon (使用插槽)
  shape: { type: String, default: '' }, // square | circle
});
const emit = defineEmits(['update:modelValue', 'change']);

const slots = useSlots();
const group = inject<any>('LkCheckboxGroup', null);
const isGroup = computed(() => !!group?.isGroup);
const mergedSize = computed(() => props.size || group?.size || 'md');
const mergedIconType = computed(() => props.iconType || group?.iconType || 'check');
const mergedShape = computed(() => props.shape || group?.shape || 'square');
const hasIconSlot = computed(() => !!slots.icon);

const checked = computed(() => {
  if (isGroup.value) return group.checkedSet.value.has(props.label);
  return props.modelValue === props.trueValue;
});
const isDisabled = computed(() => (isGroup.value ? group.disabled : props.disabled));

function toggle() {
  if (isDisabled.value) return;
  if (isGroup.value) group.toggle(props.label, !checked.value);
  else {
    const target = checked.value ? props.falseValue : props.trueValue;
    emit('update:modelValue', target);
    emit('change', target);
  }
}
</script>

<template>
  <view
    class="lk-checkbox"
    :class="[
      `lk-checkbox--${mergedSize}`,
      `lk-checkbox--${mergedShape}`,
      `lk-checkbox--${mergedIconType}`,
      {
        'is-checked': checked,
        'is-disabled': isDisabled,
        'is-indeterminate': indeterminate,
      },
    ]"
    @click="toggle"
  >
    <view class="lk-checkbox__box">
      <!-- 默认勾选图标 -->
      <lk-icon
        v-if="mergedIconType === 'check' && !hasIconSlot && !indeterminate"
        name="check"
        class="lk-checkbox__icon lk-checkbox__check"
      />
      <!-- 不确定状态图标 -->
      <lk-icon
        v-else-if="indeterminate"
        name="minus"
        class="lk-checkbox__icon lk-checkbox__indeterminate"
      />
      <!-- 圆点图标 -->
      <view v-else-if="mergedIconType === 'dot'" class="lk-checkbox__icon lk-checkbox__dot" />
      <!-- 自定义插槽图标 -->
      <view
        v-else-if="mergedIconType === 'icon' || hasIconSlot"
        class="lk-checkbox__icon lk-checkbox__custom"
      >
        <slot
          name="icon"
          :checked="checked"
          :disabled="isDisabled"
          :indeterminate="indeterminate"
        />
      </view>
    </view>
    <view class="lk-checkbox__label"
      ><slot>{{ label }}</slot></view
    >
  </view>
</template>

<style lang="scss">
.lk-checkbox {
  --_size: var(--lk-choice-size-md);
  --_border-size: var(--lk-choice-border-size);
  --_radius: var(--lk-radius-sm);
  --_gap: 14rpx;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  font-size: 28rpx;
  line-height: 1.2;
  color: var(--lk-color-text);
  -webkit-tap-highlight-color: transparent;
  transition:
    color var(--lk-transition-fast),
    opacity var(--lk-transition-fast);

  &--sm {
    --_size: var(--lk-choice-size-sm);
    font-size: 26rpx;
  }
  &--lg {
    --_size: var(--lk-choice-size-lg);
    font-size: 30rpx;
  }

  &__box {
    width: var(--_size);
    height: var(--_size);
    border: var(--_border-size) solid var(--lk-color-border);
    border-radius: var(--_radius);
    background: var(--lk-color-bg-surface);
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      background var(--lk-transition-fast),
      border-color var(--lk-transition-fast),
      transform var(--lk-transition-fast);
    box-sizing: border-box;
  }

  &__icon {
    opacity: 0;
    transition:
      transform var(--lk-transition-fast),
      opacity var(--lk-transition-fast);
  }

  // 勾选图标样式
  &__check {
    transform: scale(0) rotate(0);
    color: #fff;
    font-size: calc(var(--_size) * 0.9);
  }

  // 不确定状态图标样式
  &__indeterminate {
    transform: scale(0) rotate(0);
    color: #fff;
    font-size: calc(var(--_size) * 0.7);
  }

  // 圆点图标样式
  &__dot {
    width: 48%;
    height: 48%;
    background: #fff;
    border-radius: 50%;
    transform: scale(0.2);
  }

  // 自定义图标样式
  &__custom {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: #fff;
    font-size: calc(var(--_size) * 0.7);
  }

  &__label {
    margin-left: var(--_gap);
  }

  // 圆形样式
  &--circle {
    .lk-checkbox__box {
      border-radius: 50%;
    }
  }

  &:active:not(.is-disabled) .lk-checkbox__box {
    transform: scale(0.94);
  }

  &.is-checked {
    .lk-checkbox__box {
      background: var(--lk-color-primary);
      border-color: var(--lk-color-primary);
    }
    .lk-checkbox__icon {
      opacity: 1;
    }
    .lk-checkbox__check {
      transform: scale(1) rotate(0);
    }
    .lk-checkbox__dot {
      transform: scale(1);
    }
  }

  &.is-indeterminate {
    .lk-checkbox__box {
      background: var(--lk-color-primary);
      border-color: var(--lk-color-primary);
    }
    .lk-checkbox__indeterminate {
      opacity: 1;
      transform: scale(1) rotate(0);
    }
  }

  &.is-disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
}
</style>
