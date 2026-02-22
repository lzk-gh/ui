<script setup lang="ts">
import { computed, provide } from 'vue';
import { timelineProps } from './timeline.props';
import './index.scss';

defineOptions({ name: 'LkTimeline' });

const props = defineProps(timelineProps);

const ctx = computed(() => ({
  direction: props.direction,
  showLine: props.showLine,
  activeIndex: props.activeIndex,
  dotVariant: props.dotVariant,
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

