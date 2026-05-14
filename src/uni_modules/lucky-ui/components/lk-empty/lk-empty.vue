<script setup lang="ts">
import type { StyleValue } from 'vue';
import { computed, onBeforeUnmount, onMounted, ref, useSlots } from 'vue';
import { addUnit } from '../../core/src/utils/unit';
import { DEFAULT_BRAND_COLOR, loadBrandColor } from '../../theme';
import { emptyEmits, emptyProps } from './empty.props';
import { getEmptyIllustrationSrc, getEmptyPreset } from './empty-illustrations';

defineOptions({ name: 'LkEmpty' });

const props = defineProps(emptyProps);
const emit = defineEmits(emptyEmits);
const slots = useSlots();
const runtimeBrandColor = ref(DEFAULT_BRAND_COLOR);
let brandObserver: MutationObserver | null = null;

const preset = computed(() => getEmptyPreset(props.name));
const resolvedTitle = computed(() => props.title || preset.value.title);
const resolvedDescription = computed(() => props.description || preset.value.description);
const resolvedColor = computed(() => props.color || runtimeBrandColor.value);
const resolvedImage = computed(
  () => props.image || props.src || getEmptyIllustrationSrc(props.name, resolvedColor.value)
);

const rootClass = computed(() => [
  'lk-empty',
  `lk-empty--${props.layout}`,
  {
    'lk-empty--no-image': !props.showImage,
  },
  props.customClass,
]);

const imageStyle = computed<StyleValue>(() => {
  const size = addUnit(props.imageSize);
  return {
    width: size,
    height: size,
  };
});

function handleLoad(event: unknown) {
  emit('load', event);
}

function handleError(event: unknown) {
  emit('error', event);
}

function readBrandColor() {
  // #ifdef H5
  if (typeof document !== 'undefined' && typeof window !== 'undefined') {
    const rootStyle = window.getComputedStyle(document.documentElement);
    const cssColor =
      rootStyle.getPropertyValue('--lk-color-primary').trim() ||
      rootStyle.getPropertyValue('--lk-brand-600').trim();
    if (/^#[a-f\d]{6}$/i.test(cssColor) || /^rgba?\(/i.test(cssColor)) return cssColor;
  }
  // #endif
  return loadBrandColor() || DEFAULT_BRAND_COLOR;
}

function syncBrandColor() {
  runtimeBrandColor.value = readBrandColor();
}

onMounted(() => {
  syncBrandColor();

  // #ifdef H5
  if (typeof document !== 'undefined' && typeof MutationObserver !== 'undefined') {
    brandObserver = new MutationObserver(syncBrandColor);
    brandObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style', 'data-theme'],
    });
  }
  // #endif
});

onBeforeUnmount(() => {
  brandObserver?.disconnect();
  brandObserver = null;
});
</script>

<template>
  <view :id="props.id" :class="rootClass" :style="props.customStyle as StyleValue">
    <view v-if="props.showImage" class="lk-empty__image-wrap">
      <slot name="image">
        <image
          class="lk-empty__image"
          :src="resolvedImage"
          :style="imageStyle"
          mode="aspectFit"
          @load="handleLoad"
          @error="handleError"
        />
      </slot>
    </view>

    <view v-if="slots.title || resolvedTitle" class="lk-empty__title">
      <slot name="title">{{ resolvedTitle }}</slot>
    </view>

    <view v-if="slots.description || resolvedDescription" class="lk-empty__description">
      <slot name="description">{{ resolvedDescription }}</slot>
    </view>

    <view v-if="slots.action" class="lk-empty__action">
      <slot name="action" />
    </view>
  </view>
</template>

<style lang="scss">
@use './lk-empty.scss';
</style>
