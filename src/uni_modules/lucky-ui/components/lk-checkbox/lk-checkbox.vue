<script setup lang="ts">
import { inject, computed, useSlots } from 'vue';
import { checkboxProps, checkboxEmits } from './checkbox.props';

defineOptions({ name: 'LkCheckbox' });

const props = defineProps(checkboxProps);
const emit = defineEmits(checkboxEmits);

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
@use './index.scss';
</style>
