<script lang="ts" setup>
import { computed } from 'vue';
import type { StyleValue } from 'vue';
import { baseProps, LkProp } from '../common/props';

defineOptions({ name: 'LkCarouselItem' });

const props = defineProps({
  ...baseProps,
  src: LkProp.string(''),
});

const itemClass = computed(() => ['lk-carousel-item', props.customClass]);
const itemStyle = computed<StyleValue>(() => props.customStyle as StyleValue);
</script>

<template>
  <view :class="itemClass" :style="itemStyle">
    <image
      v-if="src"
      class="lk-carousel-item__image"
      :src="src"
      mode="aspectFill"
      :draggable="false"
    />
    <slot v-else />
  </view>
</template>

<style lang="scss" scoped>
.lk-carousel-item {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: inherit;

  &__image {
    width: 100%;
    height: 100%;
    display: block;
    will-change: transform;
  }
}
</style>
