<script setup lang="ts">
import { ref, watch, computed, inject, getCurrentInstance, onMounted, nextTick } from 'vue';
import { formContextKey } from '../lk-form/context';

defineOptions({ name: 'LkSlider' });

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  disabled: { type: Boolean, default: false },
  showValue: { type: Boolean, default: true },
  prop: { type: String, default: '' }
});
const emit = defineEmits(['update:modelValue','change','input','dragstart','dragend']);

const form = inject(formContextKey, null);

const val = ref(props.modelValue);
watch(()=>props.modelValue, v=> val.value=v);

const pct = computed(()=> {
  const range = props.max - props.min;
  if (range <= 0) return 0;
  const p = ((val.value - props.min) / range) * 100;
  return Math.max(0, Math.min(100, p));
});

// 实例与 track 唯一 id，便于小程序选择器定位
const instance = getCurrentInstance();
const trackId = `lk-slider-track-${instance?.uid ?? Math.random().toString(36).slice(2)}`;

// 轨道的测量结果（兼容小程序，不能直接用 getBoundingClientRect）
const trackRect = ref<{ left: number; width: number }>({ left: 0, width: 0 });

function measureTrack(): Promise<{ left: number; width: number }>{
  return new Promise(resolve => {
    const q = uni.createSelectorQuery();
    if (instance?.proxy) q.in(instance.proxy as any);
    q.select(`#${trackId}`).boundingClientRect((data: any) => {
      const left = data?.left ?? 0;
      const width = data?.width ?? 0;
      trackRect.value = { left, width };
      resolve(trackRect.value);
    }).exec();
  });
}

function getPointX(e: any): number {
  return (
    e?.changedTouches?.[0]?.clientX ??
    e?.touches?.[0]?.clientX ??
    e?.clientX ??
    e?.detail?.x ??
    e?.changedTouches?.[0]?.pageX ??
    e?.touches?.[0]?.pageX ??
    e?.pageX ?? 0
  );
}

onMounted(() => {
  nextTick(() => { measureTrack(); });
});

function setFromPercent(p:number){
  const range = props.max - props.min;
  let raw = props.min + range * p/100;
  const stepVal = props.step && props.step > 0 ? props.step : 1;
  raw = Math.round(raw / stepVal) * stepVal;
  raw = Math.min(props.max, Math.max(props.min, raw));
  if(raw !== val.value){
    val.value = raw;
    emit('update:modelValue', raw);
    emit('input', raw);
  }
}

async function onTrackClick(e:any){
  if(props.disabled) return;
  if (trackRect.value.width <= 0) await measureTrack();
  const rect = trackRect.value;
  if(rect.width <= 0) return;
  const clientX = getPointX(e);
  const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) *100));
  setFromPercent(percent);
  emit('change', val.value);
  if(props.prop) form?.emitFieldChange(props.prop, val.value);
}

let dragging = false;
function onDragStart(e:any){
  if(props.disabled) return;
  dragging = true;
  emit('dragstart');
}
async function onDragMove(e:any){
  if(!dragging) return;
  if (trackRect.value.width <= 0) await measureTrack();
  const rect = trackRect.value;
  if(rect.width <= 0) return;
  const clientX = getPointX(e);
  const percent = Math.max(0, Math.min(100, ((clientX - rect.left)/rect.width)*100));
  setFromPercent(percent);
}
function onDragEnd(){
  if(!dragging) return;
  dragging = false;
  emit('dragend');
  emit('change', val.value);
  if(props.prop) form?.emitFieldChange(props.prop, val.value);
}

const trackRef = ref<any>();
</script>

<template>
  <view class="lk-slider" :class="{ 'is-disabled': disabled }">
    <view class="lk-slider__track" :id="trackId" ref="trackRef" @click.stop="onTrackClick"
          @touchstart.stop.prevent="onDragStart"
          @touchmove.stop.prevent="onDragMove"
          @touchend.stop.prevent="onDragEnd"
          @mousedown.stop.prevent="onDragStart"
          @mousemove.stop.prevent="onDragMove"
          @mouseup.stop.prevent="onDragEnd">
      <view class="lk-slider__bar" :style="{ width: pct + '%' }"></view>
      <view
          class="lk-slider__thumb"
          :style="{ left: pct + '%' }"
          @touchstart.stop.prevent="onDragStart"
          @mousedown.stop.prevent="onDragStart"
      >
        <view class="lk-slider__thumb-dot"></view>
      </view>
    </view>
    <text v-if="showValue" class="lk-slider__value">{{ val }}</text>
  </view>
</template>

<style scoped lang="scss">
.lk-slider {
  display: flex;
  align-items: center;
  gap: 20rpx;
  &__track {
    position: relative;
    flex: 1;
    height: 12rpx;
    background: var(--lk-color-primary-bg-soft);
    border-radius: 12rpx;
  }
  &__bar {
    position: absolute;
    left:0; top:0; bottom:0;
    background: var(--lk-color-primary);
    border-radius: inherit;
  }
  &__thumb {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 48rpx;
    height: 48rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--lk-color-primary);
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,.2);
    transition: transform var(--lk-transition-fast);
    &:active {
      transform: translate(-50%, -50%) scale(1.08);
    }
  }
  &__thumb-dot {
    width: 50%;
    height: 50%;
    background: var(--lk-color-text-inverse);
    border-radius: 50%;
    opacity: .8;
  }
  &__value {
    min-width: 80rpx;
    font-size: 24rpx;
    color: var(--lk-color-text-secondary);
    text-align: right;
  }
  &.is-disabled { opacity: .5; }
}
</style>