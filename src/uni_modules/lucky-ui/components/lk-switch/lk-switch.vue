<script setup lang="ts">
import { computed } from 'vue';
import { switchProps, switchEmits } from './switch.props';

defineOptions({ name: 'LkSwitch' });

const props = defineProps(switchProps);
const emit = defineEmits(switchEmits);

const checked = computed(() => props.modelValue === props.activeValue);
let changing = false;

async function toggle() {
  if (props.disabled || props.loading || changing) return;
  const target = checked.value ? props.inactiveValue : props.activeValue;
  if (props.beforeChange) {
    changing = true;
    try {
      const ok = await props.beforeChange(target);
      if (!ok) {
        changing = false;
        return;
      }
    } catch {
      changing = false;
      return;
    }
  }
  emit('update:modelValue', target);
  emit('change', target);
  changing = false;
}
function onClick() {
  emit('click');
  toggle();
}
</script>

<template>
  <view
    class="lk-switch"
    :class="[
      `lk-switch--${size}`,
      { 'is-checked': checked, 'is-disabled': disabled, 'is-loading': loading },
    ]"
    @click="onClick"
  >
    <view class="lk-switch__knob">
      <view v-if="loading" class="lk-switch__spinner" />
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
