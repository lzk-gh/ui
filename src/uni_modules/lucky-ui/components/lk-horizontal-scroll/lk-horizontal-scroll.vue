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
    gap,
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
.lk-horizontal-scroll {
  width: 100%;
  padding: 0;
  margin: 0;
  border: 0;
  box-sizing: border-box;
  background: transparent;
  white-space: nowrap;

  // Hide scrollbar for web
  & ::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
    color: transparent;
  }

  &__container {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    box-sizing: border-box;
    margin: 0;
    border: 0;
  }
}
</style>
