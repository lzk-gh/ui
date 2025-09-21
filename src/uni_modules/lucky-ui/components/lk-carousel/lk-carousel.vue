<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed, provide } from 'vue';

defineOptions({ name:'LkCarousel' });

const props = defineProps({
  modelValue: { type:Number, default:0 },
  autoplay: { type:Boolean, default:true },
  interval: { type:Number, default:3000 },
  loop: { type:Boolean, default:true },
  duration: { type:Number, default:400 }, // ms
  indicator: { type:Boolean, default:true },
  width: { type:String, default:'100%' },
  height: { type:String, default:'320rpx' },
  vertical: { type:Boolean, default:false }
});
const emit = defineEmits(['update:modelValue','change']);

const active = ref(props.modelValue);
watch(()=>props.modelValue, v=> active.value = v);

const slides = ref<any[]>([]);
function register(slide:any){
  slides.value.push(slide);
}
function unregister(slide:any){
  slides.value = slides.value.filter(s=>s!==slide);
}
provide('LkCarousel', { register, unregister, active });

let timer:any = null;
function start(){
  if(!props.autoplay) return;
  stop();
  timer = setInterval(()=> {
    next(1);
  }, props.interval);
}
function stop(){
  if(timer){ clearInterval(timer); timer=null; }
}
function next(step:number){
  const len = slides.value.length;
  if(!len) return;
  let idx = active.value + step;
  if(idx >= len) idx = props.loop ? 0 : len-1;
  if(idx < 0) idx = props.loop ? len-1 : 0;
  if(idx !== active.value){
    active.value = idx;
    emit('update:modelValue', idx);
    emit('change', idx);
  }
}
onMounted(()=> start());
onBeforeUnmount(()=> stop());
watch(()=>props.autoplay, v=> v?start():stop());

/* 手势 */
let startPos=0;
let dragging=false;
function onTouchStart(e:any){
  dragging=true;
  startPos = props.vertical ? (e.touches?e.touches[0].clientY:e.clientY) : (e.touches?e.touches[0].clientX:e.clientX);
  stop();
}
function onTouchEnd(e:any){
  if(!dragging) return;
  dragging=false;
  const endPos = props.vertical ? (e.changedTouches?e.changedTouches[0].clientY:e.clientY) : (e.changedTouches?e.changedTouches[0].clientX:e.clientX);
  const delta = endPos - startPos;
  const threshold = 40;
  if(delta > threshold) next(-1);
  else if(delta < -threshold) next(1);
  start();
}

const axis = computed(()=> props.vertical ? 'Y' : 'X');
</script>

<template>
  <view
      class="lk-carousel"
      :style="{ width, height }"
      @touchstart.passive="onTouchStart"
      @touchend="onTouchEnd"
  >
    <view
        class="lk-carousel__track"
        :style="{
        transform: vertical
          ? `translateY(-${active * 100}%)`
          : `translateX(-${active * 100}%)`,
        transition: `transform ${duration}ms cubic-bezier(.4,0,.2,1)`
      }"
    >
      <slot />
    </view>
    <view v-if="indicator" class="lk-carousel__dots">
      <view
          v-for="(s,i) in slides"
          :key="i"
          class="lk-carousel__dot"
          :class="{ 'is-active': i===active }"
          @click="next(i-active)"
      />
    </view>
    <view class="lk-carousel__tools">
      <view class="lk-carousel__btn prev" @click="next(-1)">‹</view>
      <view class="lk-carousel__btn next" @click="next(1)">›</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.lk-carousel {
  position:relative;
  overflow:hidden;
  border-radius: var(--lk-radius-lg);
  background: var(--lk-color-bg-surface);
  &__track {
    display:flex;
    width:100%;
    height:100%;
  }
  :global(.lk-carousel--vertical) &__track { flex-direction:column; }
  &__dots {
    position:absolute;
    left:50%;
    bottom: 12rpx;
    transform:translateX(-50%);
    display:flex;
    gap:16rpx;
    padding: 8rpx 18rpx;
    background: rgba(0,0,0,.35);
    border-radius: var(--lk-radius-pill);
    backdrop-filter: blur(4px);
  }
  &__dot {
    width:20rpx;
    height:20rpx;
    border-radius:50%;
    background: rgba(255,255,255,.5);
    &.is-active { background: var(--lk-color-primary); }
  }
  &__tools {
    position:absolute;
    top:50%; left:0; right:0;
    transform:translateY(-50%);
    display:flex;
    justify-content:space-between;
    padding:0 8rpx;
    pointer-events:none;
  }
  &__btn {
    pointer-events:auto;
    width:56rpx; height:56rpx;
    background: rgba(0,0,0,.35);
    color:#fff;
    display:flex; align-items:center; justify-content:center;
    border-radius: var(--lk-radius-pill);
    font-size:36rpx;
    user-select:none;
  }
}
</style>