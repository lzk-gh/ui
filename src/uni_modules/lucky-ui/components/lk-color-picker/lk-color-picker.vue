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
    <view class="lk-cp__preview" :style="{ background: preview }"></view>

    <view
      class="lk-cp__sv"
      ref="svRef"
      @touchstart.prevent.stop="onSvTouch"
      @touchmove.prevent.stop="onSvTouch"
      :style="{ background: `hsl(${hsv.h}, 100%, 50%)` }"
    >
      <view class="lk-cp__sv-white"></view>
      <view class="lk-cp__sv-black"></view>
      <view
        class="lk-cp__sv-thumb"
        :style="{ left: svThumb.x * 100 + '%', top: svThumb.y * 100 + '%' }"
      ></view>
    </view>

    <view
      class="lk-cp__hue"
      ref="hueRef"
      @touchstart.prevent.stop="onHueTouch"
      @touchmove.prevent.stop="onHueTouch"
    >
      <view class="lk-cp__hue-thumb" :style="{ left: (hsv.h / 360) * 100 + '%' }"></view>
    </view>

    <view
      v-if="props.alpha"
      class="lk-cp__alpha"
      ref="alphaRef"
      @touchstart.prevent.stop="onAlphaTouch"
      @touchmove.prevent.stop="onAlphaTouch"
    >
      <view
        class="lk-cp__alpha-bar"
        :style="{
          background: `linear-gradient(90deg, rgba(0,0,0,0), ${preview})`,
        }"
      ></view>
      <view class="lk-cp__alpha-thumb" :style="{ left: (hsv.a || 1) * 100 + '%' }"></view>
    </view>

    <view v-if="props.preset && props.preset.length" class="lk-cp__preset">
      <button
        v-for="p in props.preset"
        :key="p"
        class="lk-cp__preset-item"
        :style="{ background: p }"
        @click="pickPreset(p)"
      ></button>
    </view>
  </view>
</template>

<style scoped lang="scss">
.lk-color-picker {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.lk-cp__preview {
  height: 64rpx;
  border-radius: var(--lk-radius-sm);
  border: 2rpx solid var(--lk-color-border);
}
.lk-cp__sv {
  position: relative;
  width: 100%;
  height: 320rpx;
  border-radius: var(--lk-radius-sm);
  overflow: hidden;
}
.lk-cp__sv-white {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #fff 0%, rgba(255, 255, 255, 0) 100%);
}
.lk-cp__sv-black {
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, #000 0%, rgba(0, 0, 0, 0) 100%);
}
.lk-cp__sv-thumb {
  position: absolute;
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  border: 2rpx solid #fff;
  box-shadow: 0 0 0 2rpx rgba(0, 0, 0, 0.25);
  transform: translate(-50%, -50%);
}
.lk-cp__hue {
  position: relative;
  height: 32rpx;
  border-radius: var(--lk-radius-sm);
  background: linear-gradient(90deg, red, yellow, lime, cyan, blue, magenta, red);
}
.lk-cp__hue-thumb {
  position: absolute;
  top: 50%;
  width: 16rpx;
  height: 32rpx;
  background: #fff;
  border-radius: 4rpx;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 0 2rpx rgba(0, 0, 0, 0.25);
}
.lk-cp__alpha {
  position: relative;
  height: 32rpx;
  border-radius: var(--lk-radius-sm);
  background: repeating-conic-gradient(#eee 0% 25%, #fff 0% 50%) 50% / 20rpx 20rpx;
}
.lk-cp__alpha-bar {
  position: absolute;
  inset: 0;
  border-radius: inherit;
}
.lk-cp__alpha-thumb {
  position: absolute;
  top: 50%;
  width: 16rpx;
  height: 32rpx;
  background: #fff;
  border-radius: 4rpx;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 0 2rpx rgba(0, 0, 0, 0.25);
}
.lk-cp__preset {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}
.lk-cp__preset-item {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  border: 2rpx solid var(--lk-color-border);
}
</style>
