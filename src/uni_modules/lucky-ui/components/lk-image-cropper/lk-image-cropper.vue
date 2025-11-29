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

<style scoped lang="scss">
.lk-cropper {
  width: 100%;
}
.lk-cropper__stage {
  position: relative;
  width: 100%;
  height: 720rpx;
  overflow: hidden;
  background: #000;
}
.lk-cropper__img {
  position: absolute;
  left: 50%;
  top: 50%;
  transform-origin: center center;
  will-change: transform;
}
.lk-cropper__mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
}
.lk-cropper__crop {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 70%;
  aspect-ratio: 1 / 1;
  transform: translate(-50%, -50%);
  border: 4rpx solid rgba(255, 255, 255, 0.9);
  border-radius: var(--lk-radius-md);
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.45);
}
.lk-cropper__crop.is-round {
  border-radius: 50%;
}
.lk-cropper__toolbar {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 24rpx;
  border-top: 2rpx solid var(--lk-color-border);
  background: var(--lk-color-bg-surface);
}
.lk-cropper__btn {
  background: transparent;
  border: none;
  color: var(--lk-color-primary);
  font-size: 28rpx;
}
.lk-cropper__btn.is-primary {
  color: #fff;
  background: var(--lk-color-primary);
  padding: 12rpx 24rpx;
  border-radius: var(--lk-radius-md);
}
</style>
