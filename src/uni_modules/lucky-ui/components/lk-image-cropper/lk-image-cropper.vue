<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { imageCropperProps, imageCropperEmits } from './image-cropper.props';
import LkPopup from '../lk-popup/lk-popup.vue';

defineOptions({ name: 'LkImageCropper' });

const props = defineProps(imageCropperProps);
const emit = defineEmits(imageCropperEmits);

const box = ref<any>(null);
const img = ref<any>(null);
const state = ref({ x: 0, y: 0, scale: 1 });
let startX = 0,
  startY = 0,
  startScale = 1,
  pinchStartDist = 0;

function getAspectNumber() {
  const a = props.aspectRatio as any;
  if (typeof a === 'number') return a;
  if (a === '4:3') return 4 / 3;
  if (a === '16:9') return 16 / 9;
  return 1; // '1:1'
}

function onTouchStart(e: any) {
  const touches = e.touches || e.changedTouches || [];
  if (touches.length >= 2 && props.scalable) {
    const [t1, t2] = [touches[0], touches[1]];
    pinchStartDist = Math.hypot(t1.pageX - t2.pageX, t1.pageY - t2.pageY);
    startScale = state.value.scale;
  } else if (props.movable) {
    const t = touches[0] || e;
    startX = t.pageX - state.value.x;
    startY = t.pageY - state.value.y;
  }
}
function onTouchMove(e: any) {
  const touches = e.touches || e.changedTouches || [];
  if (touches.length >= 2 && props.scalable) {
    const [t1, t2] = [touches[0], touches[1]];
    const dist = Math.hypot(t1.pageX - t2.pageX, t1.pageY - t2.pageY);
    let next = startScale * (dist / (pinchStartDist || 1));
    next = Math.max(props.minZoom, Math.min(props.maxZoom, next));
    state.value.scale = next;
  } else if (props.movable) {
    const t = touches[0] || e;
    state.value.x = t.pageX - startX;
    state.value.y = t.pageY - startY;
  }
}

function onConfirm() {
  // #ifdef H5
  try {
    const boxEl = box.value as HTMLElement;
    const imgEl = img.value as HTMLImageElement;
    const rect = boxEl.getBoundingClientRect();
    const canvas = document.createElement('canvas');
    const aspect = getAspectNumber();
    const w = rect.width;
    const h = w / aspect;
    canvas.width = Math.round(w);
    canvas.height = Math.round(h);
    const ctx = canvas.getContext('2d')!;

    const cx = rect.left + w / 2 - state.value.x;
    const cy = rect.top + h / 2 - state.value.y;
    const scale = state.value.scale;

    const imgW = imgEl.naturalWidth * scale;
    const imgH = imgEl.naturalHeight * scale;

    const dx = w / 2 - (imgW / 2 - (cx - rect.left));
    const dy = h / 2 - (imgH / 2 - (cy - rect.top));

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imgEl, dx, dy, imgW, imgH);

    const dataURL = canvas.toDataURL('image/png');
    emit('confirm', dataURL);
    return;
  } catch (e) {
    /* ignore */
  }
  // #endif
  emit('confirm', '');
}

function onCancel() {
  emit('cancel');
}

onMounted(() => {});
</script>

<template>
  <lk-popup
    :model-value="props.visible"
    position="bottom"
    :round="true"
    @update:modelValue="(v: any) => $emit('update:visible', v)"
  >
    <view class="lk-cropper">
      <view
        class="lk-cropper__stage"
        ref="box"
        @touchstart.stop.prevent="onTouchStart"
        @touchmove.stop.prevent="onTouchMove"
      >
        <image
          ref="img"
          :src="props.src"
          class="lk-cropper__img"
          :style="{
            transform: `translate(${state.x}px, ${state.y}px) scale(${state.scale})`,
          }"
          mode="aspectFit"
        />
        <view class="lk-cropper__mask">
          <view class="lk-cropper__crop" :class="{ 'is-round': props.round }" />
        </view>
      </view>
      <view class="lk-cropper__toolbar">
        <button class="lk-cropper__btn" @click="onCancel">
          {{ props.cancelText }}
        </button>
        <button class="lk-cropper__btn is-primary" @click="onConfirm">
          {{ props.confirmText }}
        </button>
      </view>
    </view>
  </lk-popup>
</template>

<style lang="scss">
@use './index.scss';
</style>
