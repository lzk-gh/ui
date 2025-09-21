<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
defineOptions({ name:'LkNoticeBar' });

const props = defineProps({
  text: { type:String, default:'' },
  speed: { type:Number, default:50 }, // px/s
  scrollable: { type:Boolean, default:true },
  closeable: { type:Boolean, default:false },
  icon: { type:String, default:'bell' },
  color: { type:String, default:'var(--lk-color-primary)' },
  background: { type:String, default:'var(--lk-color-primary-bg-soft)' }
});
const emit = defineEmits(['close','click']);

const wrapRef = ref<any>();
const contentRef = ref<any>();
const animation = ref<any>(null);
const needScroll = ref(false);
const duration = ref(0);

function calc(){
  if(!props.scrollable) return;
  const w = wrapRef.value?.getBoundingClientRect?.().width || 0;
  const c = contentRef.value?.getBoundingClientRect?.().width || 0;
  needScroll.value = c > w;
  if(needScroll.value){
    duration.value = c / props.speed;
    start();
  }
}
function start(){
  if(!needScroll.value) return;
  animation.value = {
    duration: duration.value,
    width: 'auto'
  };
}
function restart(){
  animation.value = null;
  nextTick(calc);
}

watch(()=>props.text, ()=> restart());
onMounted(()=> setTimeout(calc, 60));

function close(){
  emit('close');
}
function click(){ emit('click'); }
</script>

<template>
  <view class="lk-notice-bar" :style="{ background, color }" @click="click">
    <lk-icon v-if="icon" :name="icon" size="32" class="lk-notice-bar__icon" />
    <view class="lk-notice-bar__wrap" ref="wrapRef">
      <view
          ref="contentRef"
          class="lk-notice-bar__content"
          :class="{ 'is-scroll': needScroll }"
          :style="needScroll ? { animationDuration: duration + 's' } : {}"
      >
        <slot>{{ text }}</slot>
      </view>
    </view>
    <view v-if="closeable" class="lk-notice-bar__close" @click.stop="close">×</view>
  </view>
</template>

<style scoped lang="scss">
.lk-notice-bar {
  display:flex;
  align-items:center;
  gap: 16rpx;
  padding: 16rpx 20rpx;
  font-size: 24rpx;
  line-height: 1.4;
  overflow:hidden;
  border-radius: var(--lk-radius-pill);
  &__icon { color: var(--lk-color-primary); }
  &__wrap { flex:1; overflow:hidden; }
  &__content {
    white-space:nowrap;
    &.is-scroll {
      animation: nb-scroll linear infinite;
      padding-right: 80rpx;
    }
  }
  &__close {
    font-size:34rpx;
    line-height:1;
    padding: 4rpx 8rpx;
  }
}
@keyframes nb-scroll {
  0% { transform:translateX(0); }
  100% { transform:translateX(-100%); }
}
</style>