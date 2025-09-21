<script setup lang="ts">
import { computed, watch, onMounted, onBeforeUnmount } from 'vue';

defineOptions({ name: 'LkOverlay' });

const props = defineProps({
  show: { type: Boolean, default: false },
  zIndex: { type: Number, default: 1200 },
  opacity: { type: Number, default: 0.55 },
  closeOnClick: { type: Boolean, default: true },
  lockScroll: { type: Boolean, default: true },
  duration: { type: Number, default: 240 }
});
const emit = defineEmits(['click','update:show','after-enter','after-leave']);

const styleVar = computed(()=> ({
  zIndex: props.zIndex,
  background: `rgba(0,0,0,${props.opacity})`,
  animationDuration: props.duration + 'ms'
}));

function onClick() {
  emit('click');
  if(props.closeOnClick) emit('update:show', false);
}

function lock() {
  if(!props.lockScroll) return;
  // #ifdef H5
  document.body.style.overflow = 'hidden';
  // #endif
}
function unlock() {
  if(!props.lockScroll) return;
  // #ifdef H5
  document.body.style.overflow = '';
  // #endif
}

watch(()=>props.show, v=> v?lock():unlock());
onMounted(()=> props.show && lock());
onBeforeUnmount(unlock);
</script>

<template>
  <view
      v-if="show"
      class="lk-overlay"
      :style="styleVar"
      @click="onClick"
      @touchmove.stop.prevent
  />
</template>

<style scoped lang="scss">
.lk-overlay {
  position: fixed;
  left:0; top:0; right:0; bottom:0;
  animation: lk-overlay-fade in forwards;
  animation: lk-overlay-fade .24s;
}
@keyframes lk-overlay-fade { from{ opacity:0; } to{ opacity:1; } }
</style>