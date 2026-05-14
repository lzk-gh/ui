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

const DEFAULT_SIZE_MAP = {
  sm: { width: 170, height: 112, fontSize: 20, gapX: 40, gapY: 34 },
  md: { width: 260, height: 168, fontSize: 24, gapX: 60, gapY: 48 },
  lg: { width: 340, height: 224, fontSize: 32, gapX: 82, gapY: 64 },
} as const;

const effectiveParams = computed(() => {
  const sizeConfig = DEFAULT_SIZE_MAP[props.size as keyof typeof DEFAULT_SIZE_MAP] || DEFAULT_SIZE_MAP.md;

  return {
    width: props.width ?? sizeConfig.width,
    height: props.height ?? sizeConfig.height,
    fontSize: props.fontSize ?? sizeConfig.fontSize,
    gapX: props.gapX ?? sizeConfig.gapX,
    gapY: props.gapY ?? sizeConfig.gapY,
  };
});

const cellCount = computed(() => Math.max(1, props.rows) * Math.max(1, props.columns));
const watermarkItems = computed(() => Array.from({ length: cellCount.value }, (_, index) => index));

const rootClass = computed(() => [
  'lk-watermark',
  `lk-watermark--${props.variant}`,
  `is-size-${props.size}`,
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
  gap: `${addUnit(effectiveParams.value.gapY)} ${addUnit(effectiveParams.value.gapX)}`,
  gridTemplateColumns: `repeat(${Math.max(1, props.columns)}, ${addUnit(effectiveParams.value.width)})`,
}));

const itemStyle = computed<StyleValue>(() => ({
  width: addUnit(effectiveParams.value.width),
  height: addUnit(effectiveParams.value.height),
  transform: `rotate(${props.rotate}deg) skew(${props.skewX}deg, ${props.skewY}deg)`,
  fontSize: addUnit(effectiveParams.value.fontSize),
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
@use './lk-watermark.scss';
</style>
