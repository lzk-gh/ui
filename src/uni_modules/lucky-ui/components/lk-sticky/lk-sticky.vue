<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed, getCurrentInstance, nextTick } from 'vue';
import { lkStickyProps } from './types';

defineOptions({ name: 'LkSticky' });

const props = defineProps(lkStickyProps);
const emit = defineEmits<{(e:'change', value:boolean):void}>();

const root = ref<HTMLElement|null>(null);
const isSticky = ref(false);
let io: any = null;

const style = computed((): any => ({
  position: 'sticky',
  top: props.offsetTop + 'rpx',
  zIndex: props.zIndex,
}));

function observe() {
  // 使用 IntersectionObserver 观察占位变化，判断是否吸顶
  // H5: window.IntersectionObserver；小程序：uni.createIntersectionObserver
  try {
    // #ifdef H5
    if (typeof IntersectionObserver !== 'undefined' && root.value) {
      const sentry = document.createElement('div');
      sentry.style.position = 'absolute';
      sentry.style.top = '0';
      sentry.style.width = '1px';
      sentry.style.height = '1px';
      root.value.prepend(sentry);
      io = new IntersectionObserver((entries)=>{
        const entry = entries[0];
        const nowSticky = entry.intersectionRatio === 0; // 到达顶部时不可见
        if (nowSticky !== isSticky.value) {
          isSticky.value = nowSticky;
          emit('change', isSticky.value);
        }
      }, { rootMargin: `-${props.offsetTop}px 0px 0px 0px`, threshold: [0,1] });
      io.observe(sentry);
    }
    // #endif

    // #ifndef H5
    // 小程序端
    // @ts-ignore
    const uniAny: any = (uni as any);
    if (uniAny && uniAny.createIntersectionObserver) {
      io = uniAny.createIntersectionObserver(getCurrentInstance());
      io.relativeToViewport({ top: props.offsetTop });
      io.observe('.lk-sticky__sentry', (res: any) => {
        const nowSticky = res.intersectionRatio === 0;
        if (nowSticky !== isSticky.value) {
          isSticky.value = nowSticky;
          emit('change', isSticky.value);
        }
      });
    }
    // #endif
  } catch (e) {
    // 忽略，保持基础吸顶可用
  }
}

onMounted(async () => {
  await nextTick();
  observe();
});

onBeforeUnmount(()=>{
  try { io && io.disconnect && io.disconnect(); } catch (e) {}
});
</script>

<template>
  <view class="lk-sticky" :style="style" ref="root">
    <view class="lk-sticky__sentry" style="position:absolute; top:0; left:0; width:1px; height:1px;" />
    <slot />
  </view>
</template>

<style scoped lang="scss">
.lk-sticky { width: 100%; }
</style>
