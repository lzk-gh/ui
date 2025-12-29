<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { colorPickerProps, colorPickerEmits } from './color-picker.props';
import { hsvToRgb, formatFromHSV, parseToHSV } from './utils';

defineOptions({ name: 'LkColorPicker' });

const props = defineProps(colorPickerProps);
const emit = defineEmits(colorPickerEmits);

const hsv = ref({ h: 0, s: 1, v: 1, a: 1 });

watch(
  () => props.modelValue,
  v => {
    const parsed = parseToHSV(v || '', props.format);
    if (parsed) hsv.value = { h: parsed.h, s: parsed.s, v: parsed.v, a: parsed.a ?? 1 };
  },
  { immediate: true }
);

const colorStyle = computed(() => {
  const rgb = hsvToRgb(hsv.value);
  return { background: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` } as any;
});

const preview = computed(() => formatFromHSV(hsv.value, props.format, props.alpha));

function updateModel() {
  const out = formatFromHSV(hsv.value, props.format, props.alpha);
  emit('update:modelValue', out);
  emit('change', out);
}

// SV 面板拖动
const svRef = ref<any>(null);
const svThumb = ref({ x: 1, y: 0 }); // x=>s, y=>1-v

function onSvTouch(e: any) {
  const box: DOMRect | any = svRef.value?.getBoundingClientRect?.() || {
    left: 0,
    top: 0,
    width: 200,
    height: 160,
  };
  const t = e.touches?.[0] || e.changedTouches?.[0] || e;
  const x = Math.max(0, Math.min(box.width, t.pageX - box.left));
  const y = Math.max(0, Math.min(box.height, t.pageY - box.top));
  svThumb.value = { x: x / box.width, y: y / box.height };
  hsv.value.s = svThumb.value.x;
  hsv.value.v = 1 - svThumb.value.y;
  updateModel();
}

// Hue 条
const hueRef = ref<any>(null);
function onHueTouch(e: any) {
  const box: DOMRect | any = hueRef.value?.getBoundingClientRect?.() || {
    left: 0,
    width: 280,
  };
  const t = e.touches?.[0] || e.changedTouches?.[0] || e;
  const x = Math.max(0, Math.min(box.width, t.pageX - box.left));
  hsv.value.h = (x / box.width) * 360;
  updateModel();
}

// Alpha 条
const alphaRef = ref<any>(null);
function onAlphaTouch(e: any) {
  const box: DOMRect | any = alphaRef.value?.getBoundingClientRect?.() || {
    left: 0,
    width: 280,
  };
  const t = e.touches?.[0] || e.changedTouches?.[0] || e;
  const x = Math.max(0, Math.min(box.width, t.pageX - box.left));
  hsv.value.a = x / box.width;
  updateModel();
}

function pickPreset(c: string) {
  const parsed = parseToHSV(c, 'hex');
  if (parsed) {
    hsv.value = { h: parsed.h, s: parsed.s, v: parsed.v, a: parsed.a ?? 1 };
    updateModel();
  }
}

onMounted(() => {});
</script>

<template>
  <view class="lk-color-picker">
    <view class="lk-color-picker__preview" :style="{ background: preview }"></view>

    <view
      class="lk-color-picker__sv"
      ref="svRef"
      @touchstart.prevent.stop="onSvTouch"
      @touchmove.prevent.stop="onSvTouch"
      :style="{ background: `hsl(${hsv.h}, 100%, 50%)` }"
    >
      <view class="lk-color-picker__sv-white"></view>
      <view class="lk-color-picker__sv-black"></view>
      <view
        class="lk-color-picker__sv-thumb"
        :style="{ left: svThumb.x * 100 + '%', top: svThumb.y * 100 + '%' }"
      ></view>
    </view>

    <view
      class="lk-color-picker__hue"
      ref="hueRef"
      @touchstart.prevent.stop="onHueTouch"
      @touchmove.prevent.stop="onHueTouch"
    >
      <view class="lk-color-picker__hue-thumb" :style="{ left: (hsv.h / 360) * 100 + '%' }"></view>
    </view>

    <view
      v-if="props.alpha"
      class="lk-color-picker__alpha"
      ref="alphaRef"
      @touchstart.prevent.stop="onAlphaTouch"
      @touchmove.prevent.stop="onAlphaTouch"
    >
      <view
        class="lk-color-picker__alpha-bar"
        :style="{
          background: `linear-gradient(90deg, rgba(0,0,0,0), ${preview})`,
        }"
      ></view>
      <view class="lk-color-picker__alpha-thumb" :style="{ left: (hsv.a || 1) * 100 + '%' }"></view>
    </view>

    <view v-if="props.preset && props.preset.length" class="lk-color-picker__preset">
      <button
        v-for="p in props.preset"
        :key="p"
        class="lk-color-picker__preset-item"
        :style="{ background: p }"
        @click="pickPreset(p)"
      ></button>
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
