<script setup lang="ts">
import { ref, watch, computed, inject } from 'vue';
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

const pct = computed(()=> ( (val.value - props.min) / (props.max - props.min) ) * 100);

function setFromPercent(p:number){
  const range = props.max - props.min;
  let raw = props.min + range * p/100;
  raw = Math.round(raw / props.step) * props.step;
  raw = Math.min(props.max, Math.max(props.min, raw));
  if(raw !== val.value){
    val.value = raw;
    emit('update:modelValue', raw);
    emit('input', raw);
  }
}

function onTrackClick(e:any){
  if(props.disabled) return;
  const rect = e.target.getBoundingClientRect?.() || {};
  const clientX = e.clientX || e.changedTouches?.[0]?.clientX;
  const percent = ((clientX - rect.left) / rect.width) *100;
  setFromPercent(percent);
  emit('change', val.value);
  if(props.prop) form?.emitFieldChange(props.prop);
}

let dragging = false;
function onDragStart(e:any){
  if(props.disabled) return;
  dragging = true;
  emit('dragstart');
}
function onDragMove(e:any){
  if(!dragging) return;
  const track = trackRef.value;
  if(!track) return;
  const rect = track.getBoundingClientRect?.() || {};
  const clientX = e.touches?.[0]?.clientX || e.clientX;
  const percent = ((clientX - rect.left)/rect.width)*100;
  setFromPercent(percent);
}
function onDragEnd(){
  if(!dragging) return;
  dragging = false;
  emit('dragend');
  emit('change', val.value);
  if(props.prop) form?.emitFieldChange(props.prop);
}

const trackRef = ref<any>();
</script>

<template>
  <view class="lk-slider" :class="{ 'is-disabled': disabled }">
    <view class="lk-slider__track" ref="trackRef" @click="onTrackClick">
      <view class="lk-slider__bar" :style="{ width: pct + '%' }"></view>
      <view
          class="lk-slider__thumb"
          :style="{ left: pct + '%' }"
          @touchstart.stop.prevent="onDragStart"
          @touchmove.stop.prevent="onDragMove"
          @touchend.stop.prevent="onDragEnd"
          @mousedown.stop.prevent="onDragStart"
          @mousemove.stop.prevent="onDragMove"
          @mouseup.stop.prevent="onDragEnd"
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