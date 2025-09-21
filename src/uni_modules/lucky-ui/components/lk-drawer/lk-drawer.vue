<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import LkOverlay from '../lk-overlay/lk-overlay.vue';

defineOptions({ name:'LkDrawer' });

const props = defineProps({
  modelValue: { type:Boolean, default:false },
  side: { type:String, default:'right' }, // left | right
  width: { type:String, default:'70%' },
  overlay: { type:Boolean, default:true },
  closeOnOverlay: { type:Boolean, default:true },
  zIndex: { type:Number, default:1400 },
  lockScroll: { type:Boolean, default:true },
  title: { type:String, default:'' },
  showClose: { type:Boolean, default:true }
});
const emit = defineEmits(['update:modelValue','open','close','after-enter','after-leave']);

const display = ref(false);
const anim = ref<'enter'|'leave'|''>('');

watch(()=>props.modelValue, v=>{
  v?open():close();
},{ immediate:true });

function open(){
  if(display.value) return;
  display.value = true;
  anim.value='enter';
  emit('open');
  setTimeout(()=> emit('after-enter'), 260);
}
function close(){
  if(!display.value) return;
  anim.value='leave';
  emit('close');
  setTimeout(()=>{
    display.value=false;
    emit('after-leave');
  },260);
}
function overlayClick(){
  if(props.closeOnOverlay) emit('update:modelValue', false);
}

const cls = computed(()=>[
  'lk-drawer',
  `lk-drawer--${props.side}`,
  { 'is-enter': anim.value==='enter', 'is-leave': anim.value==='leave' }
]);
</script>

<template>
  <lk-overlay
      v-if="overlay && display"
      :show="true"
      :z-index="zIndex"
      :lock-scroll="lockScroll"
      @click="overlayClick"
  />
  <view v-if="display" :class="cls" :style="{ width, zIndex: zIndex+1 }" @touchmove.stop>
    <view v-if="title || showClose" class="lk-drawer__header">
      <text v-if="title" class="lk-drawer__title">{{ title }}</text>
      <view v-if="showClose" class="lk-drawer__close" @click="emit('update:modelValue', false)">×</view>
    </view>
    <view class="lk-drawer__body">
      <slot />
    </view>
  </view>
</template>

<style scoped lang="scss">
.lk-drawer {
  position: fixed;
  top:0; bottom:0;
  background: var(--lk-color-bg-surface);
  color: var(--lk-color-text);
  display:flex;
  flex-direction:column;
  box-shadow: var(--lk-shadow-lg);
  animation: none;
  &--right { right:0; animation: drawer-in-r .26s; }
  &--left { left:0; animation: drawer-in-l .26s; }
  &.is-leave.lk-drawer--right { animation: drawer-out-r .26s forwards; }
  &.is-leave.lk-drawer--left { animation: drawer-out-l .26s forwards; }

  &__header {
    padding: 32rpx 36rpx;
    font-size: 32rpx;
    font-weight:600;
    display:flex;
    align-items:center;
    justify-content:space-between;
  }
  &__close {
    font-size: 42rpx;
    line-height:1;
    padding: 4rpx 12rpx;
    border-radius: var(--lk-radius-sm);
    color: var(--lk-color-text-secondary);
    &:active { background: var(--lk-color-primary-bg-soft); color: var(--lk-color-primary); }
  }
  &__body {
    flex:1;
    padding: 0 36rpx 40rpx;
    overflow-y:auto;
    font-size: 28rpx;
    line-height: 1.6;
  }
}
@keyframes drawer-in-r { from{ transform:translateX(100%);} to{transform:translateX(0);} }
@keyframes drawer-out-r { from{ transform:translateX(0);} to{transform:translateX(100%);} }
@keyframes drawer-in-l { from{ transform:translateX(-100%);} to{transform:translateX(0);} }
@keyframes drawer-out-l { from{ transform:translateX(0);} to{transform:translateX(-100%);} }
</style>