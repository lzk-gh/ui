<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
defineOptions({ name: 'LkTooltip' });

const props = defineProps({
  content: { type: String, default: '' },
  show: { type: Boolean, default: false },
  trigger: { type: String, default: 'hover' }, // hover | click | manual
  placement: { type: String, default: 'top' }, // top|bottom|left|right
  disabled: { type: Boolean, default: false },
  offset: { type: Number, default: 8 }
});
const emit = defineEmits(['update:show','show','hide']);

const internal = ref(props.show);
watch(()=>props.show, v=> { if(props.trigger==='manual') internal.value=v; });

const wrapperRef = ref<any>();
const tipRef = ref<any>();
const visible = computed(()=> internal.value && !props.disabled);

function toggle(next?:boolean){
  if(props.trigger==='manual') return;
  internal.value = next!==undefined? next : !internal.value;
  emit('update:show', internal.value);
  internal.value ? emit('show') : emit('hide');
}

function onEnter(){ if(props.trigger==='hover') toggle(true); }
function onLeave(){ if(props.trigger==='hover') toggle(false); }
function onClick(){ if(props.trigger==='click') toggle(); }

const posStyle = ref<any>({});
function updatePos(){
  if(!visible.value) return;
  const w = wrapperRef.value?.getBoundingClientRect?.();
  const t = tipRef.value?.getBoundingClientRect?.();
  if(!w||!t) return;
  let top=0,left=0;
  switch(props.placement){
    case 'top':
      top = w.top - t.height - props.offset;
      left = w.left + (w.width - t.width)/2;
      break;
    case 'bottom':
      top = w.bottom + props.offset;
      left = w.left + (w.width - t.width)/2;
      break;
    case 'left':
      top = w.top + (w.height - t.height)/2;
      left = w.left - t.width - props.offset;
      break;
    case 'right':
      top = w.top + (w.height - t.height)/2;
      left = w.right + props.offset;
      break;
  }
  posStyle.value = {
    top: top + 'px',
    left: left + 'px'
  };
}
watch(visible, v=>{
  if(v) setTimeout(updatePos, 16);
});
function onWindowResize(){ updatePos(); }
onMounted(()=> {
  if(typeof window!=='undefined'){
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('scroll', onWindowResize, true);
  }
});
onBeforeUnmount(()=>{
  if(typeof window!=='undefined'){
    window.removeEventListener('resize', onWindowResize);
    window.removeEventListener('scroll', onWindowResize, true);
  }
});
</script>

<template>
  <view
      ref="wrapperRef"
      class="lk-tooltip-wrapper"
      @mouseenter="onEnter"
      @mouseleave="onLeave"
      @click="onClick"
  >
    <slot />
    <view
        v-if="visible"
        ref="tipRef"
        class="lk-tooltip"
        :class="[`lk-tooltip--${placement}`]"
        :style="posStyle"
        @click.stop
    >
      <slot name="content">{{ content }}</slot>
      <view class="lk-tooltip__arrow" />
    </view>
  </view>
</template>

<style scoped lang="scss">
.lk-tooltip-wrapper { display:inline-block; position:relative; }
.lk-tooltip {
  position: fixed;
  z-index: 3000;
  background: var(--lk-color-text);
  color: var(--lk-color-text-inverse);
  padding: 12rpx 20rpx;
  font-size: 24rpx;
  border-radius: var(--lk-radius-md);
  line-height: 1.4;
  max-width: 480rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,.18);
  animation: lk-to-fade .18s;
  &__arrow {
    width: 0; height:0;
    position:absolute;
    border: 12rpx solid transparent;
  }
  &--top .lk-tooltip__arrow {
    bottom:-24rpx; left:50%; transform:translateX(-50%);
    border-top-color: var(--lk-color-text);
  }
  &--bottom .lk-tooltip__arrow {
    top:-24rpx; left:50%; transform:translateX(-50%);
    border-bottom-color: var(--lk-color-text);
  }
  &--left .lk-tooltip__arrow {
    right:-24rpx; top:50%; transform:translateY(-50%);
    border-left-color: var(--lk-color-text);
  }
  &--right .lk-tooltip__arrow {
    left:-24rpx; top:50%; transform:translateY(-50%);
    border-right-color: var(--lk-color-text);
  }
}
@keyframes lk-to-fade { from{ opacity:0; transform:scale(.92);} to{ opacity:1; transform:scale(1);} }
</style>