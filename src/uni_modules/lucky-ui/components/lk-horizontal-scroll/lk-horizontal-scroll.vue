<script setup lang="ts">
import { computed } from 'vue';
import { horizontalScrollProps } from './horizontal-scroll.props';
import { addUnit } from '../../core/src/utils/unit';

defineOptions({ name: 'LkHorizontalScroll' });

const props = defineProps(horizontalScrollProps);

const containerStyle = computed(() => {
  const gap = addUnit(props.gap);
  const padding = addUnit(props.padding);
  return {
    '--lk-hs-gap': gap,
    paddingLeft: padding,
    paddingRight: padding,
  };
});
</script>

<template>
  <scroll-view
    class="lk-horizontal-scroll"
    :class="customClass"
    :style="customStyle"
    scroll-x
    :show-scrollbar="!hideScrollbar"
    enable-flex
  >
    <view class="lk-horizontal-scroll__container" :style="containerStyle">
      <slot />
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
@use './index.scss';
</style>
