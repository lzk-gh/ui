<script setup lang="ts">
import { computed, provide } from 'vue';
import { timelineProps } from './timeline.props';

defineOptions({ name: 'LkTimeline' });

const props = defineProps(timelineProps);

const ctx = computed(() => ({
  direction: props.direction,
  total: props.total,
  showLine: props.showLine,
  activeIndex: props.activeIndex,
  dotVariant: props.dotVariant,
  lineVariant: props.lineVariant,
  lineMode: props.lineMode,
  lineAnimated: props.lineAnimated,
}));

provide('LkTimelineCtx', ctx);

const rootClass = computed(() => [
  'lk-timeline',
  `lk-timeline--${props.direction}`,
]);
</script>

<template>
  <view :class="rootClass" role="list">
    <slot />
  </view>
</template>

<style lang="scss">
@use './lk-timeline.scss';
</style>

