<script setup lang="ts">
import { computed, defineProps, inject } from 'vue';

defineOptions({ name: 'LkCollapseItem' });

const props = defineProps({
  name: { type: [String, Number], required: true },
  title: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
});
const collapse = inject<any>('LkCollapse');
const open = computed(() => collapse.active.value.includes(props.name));

function toggle() {
  if (props.disabled) return;
  collapse.toggle(props.name);
}
</script>

<template>
  <view class="lk-collapse-item" :class="{ 'is-open': open, 'is-disabled': disabled }">
    <view class="lk-collapse-item__header" @click="toggle">
      <text class="lk-collapse-item__title">
        <slot name="title">{{ title }}</slot>
      </text>
      <lk-icon
        name="arrow-down"
        size="28"
        class="lk-collapse-item__arrow"
        :class="{ 'is-open': open }"
      />
    </view>
    <view class="lk-collapse-item__body" v-show="open">
      <slot />
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
