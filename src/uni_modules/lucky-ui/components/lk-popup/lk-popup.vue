<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import LkOverlay from '../lk-overlay/lk-overlay.vue';

defineOptions({ name: 'LkPopup' });

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  position: { type: String, default: 'center' }, // center|top|bottom|left|right
  round: { type: Boolean, default: true },
  overlay: { type: Boolean, default: true },
  closeOnOverlay: { type: Boolean, default: true },
  lockScroll: { type: Boolean, default: true },
  zIndex: { type: Number, default: 1300 },
  duration: { type: Number, default: 260 },
  safeArea: { type: Boolean, default: true }
});
const emit = defineEmits(['update:modelValue','open','close','click-overlay','after-enter','after-leave']);

const internalShow = ref(false);    // 实际渲染
const animState = ref<'enter'|'leave'|''>('');
const display = computed(()=> internalShow.value);

function open() {
  if(internalShow.value) return;
  internalShow.value = true;
  animState.value = 'enter';
  emit('open');
  setTimeout(()=> emit('after-enter'), props.duration);
}
function close() {
  if(!internalShow.value) return;
  animState.value = 'leave';
  emit('close');
  setTimeout(()=>{
    internalShow.value = false;
    emit('after-leave');
  }, props.duration);
}

watch(()=>props.modelValue, v => v?open():close(), { immediate: true });

function onOverlayClick() {
  emit('click-overlay');
  if(props.closeOnOverlay) emit('update:modelValue', false);
}

const klass = computed(()=>[
  'lk-popup',
  `lk-popup--${props.position}`,
  { 'is-round': props.round, 'is-enter': animState.value==='enter', 'is-leave': animState.value==='leave' }
]);

const boxStyle = computed(()=> ({
  zIndex: props.zIndex + 1,
  animationDuration: props.duration + 'ms'
}));
</script>

<template>
  <lk-overlay
      v-if="overlay && display"
      :show="true"
      :z-index="zIndex"
      :lock-scroll="lockScroll"
      :duration="duration"
      :close-on-click="closeOnOverlay"
      @click="onOverlayClick"
  />
  <view v-if="display" :class="klass" :style="boxStyle" @touchmove.stop>
    <slot />
    <view v-if="safeArea && (position==='bottom')" class="lk-popup__safe" />
  </view>
</template>

<style scoped lang="scss">
.lk-popup {
  position: fixed;
  background: var(--lk-color-bg-surface);
  color: var(--lk-color-text);
  box-shadow: var(--lk-shadow-base);
  max-width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  animation-fill-mode: forwards;

  &.is-round { border-radius: var(--lk-radius-lg); }

  &--center {
    left:50%; top:50%;
    transform: translate(-50%,-50%);
    &.is-enter { animation: lk-pop-in var(--dur) ease; }
    &.is-leave { animation: lk-pop-out var(--dur) ease; }
  }
  &--bottom {
    left:0; right:0; bottom:0;
    animation: lk-slide-up-in var(--dur) ease;
    &.is-leave { animation: lk-slide-up-out var(--dur) ease; }
    border-top-left-radius: var(--lk-radius-lg);
    border-top-right-radius: var(--lk-radius-lg);
  }
  &--top {
    left:0; right:0; top:0;
    animation: lk-slide-down-in var(--dur) ease;
    &.is-leave { animation: lk-slide-down-out var(--dur) ease; }
    border-bottom-left-radius: var(--lk-radius-lg);
    border-bottom-right-radius: var(--lk-radius-lg);
  }
  &--left {
    top:0; bottom:0; left:0; width:70%;
    animation: lk-slide-right-in var(--dur) ease;
    &.is-leave { animation: lk-slide-right-out var(--dur) ease; }
  }
  &--right {
    top:0; bottom:0; right:0; width:70%;
    animation: lk-slide-left-in var(--dur) ease;
    &.is-leave { animation: lk-slide-left-out var(--dur) ease; }
  }

  &__safe {
    height: env(safe-area-inset-bottom);
  }
}

/* 使用 CSS 变量接收 duration */
.lk-popup { --dur: inherit; }

@keyframes lk-pop-in { from { opacity:0; transform:translate(-50%,-50%) scale(.85);} to { opacity:1; transform:translate(-50%,-50%) scale(1);} }
@keyframes lk-pop-out { from { opacity:1; transform:translate(-50%,-50%) scale(1);} to { opacity:0; transform:translate(-50%,-50%) scale(.85);} }
@keyframes lk-slide-up-in { from { transform:translateY(100%);} to{ transform:translateY(0);} }
@keyframes lk-slide-up-out { from { transform:translateY(0);} to{ transform:translateY(100%);} }
@keyframes lk-slide-down-in { from { transform:translateY(-100%);} to{ transform:translateY(0);} }
@keyframes lk-slide-down-out { from { transform:translateY(0);} to{ transform:translateY(-100%);} }
@keyframes lk-slide-left-in { from { transform:translateX(100%);} to{ transform:translateX(0);} }
@keyframes lk-slide-left-out { from { transform:translateX(0);} to{ transform:translateX(100%);} }
@keyframes lk-slide-right-in { from { transform:translateX(-100%);} to{ transform:translateX(0);} }
@keyframes lk-slide-right-out { from { transform:translateX(0);} to{ transform:translateX(-100%);} }
</style>