<script setup lang="ts">
import { computed, type StyleValue } from 'vue';
import { addUnit } from '@/uni_modules/lucky-ui/core/src/utils/unit';
import { watermarkProps } from './watermark.props';

defineOptions({ name: 'LkWatermark' });

const props = defineProps(watermarkProps);

const normalizedContent = computed(() => {
  const content = Array.isArray(props.content) ? props.content : [props.content];
  return content.filter(item => item !== '');
});

const cellCount = computed(() => Math.max(1, props.rows) * Math.max(1, props.columns));
const watermarkItems = computed(() => Array.from({ length: cellCount.value }, (_, index) => index));

const rootClass = computed(() => [
  'lk-watermark',
  `lk-watermark--${props.variant}`,
  props.customClass,
  {
    'is-full-page': props.fullPage,
  },
]);

const rootStyle = computed<StyleValue>(() => props.customStyle as StyleValue);

const layerStyle = computed<StyleValue>(() => ({
  zIndex: props.zIndex,
  color: props.color || undefined,
  opacity: props.opacity,
  gap: `${addUnit(props.gapY)} ${addUnit(props.gapX)}`,
  gridTemplateColumns: `repeat(${Math.max(1, props.columns)}, ${addUnit(props.width)})`,
}));

const itemStyle = computed<StyleValue>(() => ({
  width: addUnit(props.width),
  height: addUnit(props.height),
  transform: `rotate(${props.rotate}deg) skew(${props.skewX}deg, ${props.skewY}deg)`,
  fontSize: addUnit(props.fontSize),
  fontWeight: props.fontWeight,
}));
</script>

<template>
  <view :id="id" :class="rootClass" :style="rootStyle">
    <slot />
    <view v-if="visible && normalizedContent.length" class="lk-watermark__layer" :style="layerStyle">
      <view v-for="item in watermarkItems" :key="item" class="lk-watermark__item" :style="itemStyle">
        <text v-for="line in normalizedContent" :key="line" class="lk-watermark__text">
          {{ line }}
        </text>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
