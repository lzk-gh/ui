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

<style lang="scss">
@use './index.scss';
</style>
