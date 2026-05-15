<script setup lang="ts">
import { computed } from 'vue';
import { spaceProps } from './space.props';
import {
  resolveSpaceAlign,
  resolveSpaceClass,
  resolveSpaceStyle,
} from './space.utils';

defineOptions({ name: 'LkSpace' });

const props = defineProps(spaceProps);

const style = computed(() => resolveSpaceStyle(props.gap));

const mergedAlign = computed(() => {
  return resolveSpaceAlign({
    align: props.align,
    direction: props.direction,
  });
});

const klass = computed(() => resolveSpaceClass({
  direction: props.direction,
  align: mergedAlign.value,
  wrap: props.wrap,
  fill: props.fill,
}));
</script>

<template>
  <view class="lk-space-container">
    <view :class="klass" :style="style">
      <slot />
    </view>
  </view>
</template>

<style lang="scss">
@use './lk-space.scss';
</style>
