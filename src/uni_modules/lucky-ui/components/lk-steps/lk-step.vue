<script setup lang="ts">
import { inject, computed } from 'vue';
defineOptions({ name: 'LkStep' });

const props = defineProps({
  title: { type: String, default: '' },
  sub: { type: String, default: '' },
  index: { type: Number, default: 0 },
});
const ctx = inject<any>('LkSteps');
const active = computed(() => ctx?.props.current === props.index);
const finished = computed(() => ctx?.props.current > props.index);
const error = computed(() => ctx?.props.status === 'error' && active.value);
</script>

<template>
  <view
    class="lk-step"
    :class="{ 'is-active': active, 'is-finished': finished, 'is-error': error }"
  >
    <view class="lk-step__icon">
      <view class="lk-step__dot" />
      <lk-icon v-if="finished" name="check" size="26" class="lk-step__done" />
      <lk-icon v-if="error" name="x" size="26" class="lk-step__err" />
    </view>
    <view class="lk-step__content">
      <text class="lk-step__title">{{ title }}</text>
      <text v-if="sub" class="lk-step__sub">{{ sub }}</text>
    </view>
    <view class="lk-step__line" />
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
