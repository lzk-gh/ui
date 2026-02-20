<script setup lang="ts">
import {
  ref,
  onMounted,
  onBeforeUnmount,
  computed,
  getCurrentInstance,
  nextTick,
} from 'vue';
import { stickyProps } from './sticky.props';

defineOptions({ name: 'LkSticky' });

const props = defineProps(stickyProps);
const emit = defineEmits<{ (e: 'change', value: boolean): void }>();

const root = ref<HTMLElement | null>(null);
const isSticky = ref(false);
type MpStickyObserver = {
  relativeToViewport: (opts: { top: number }) => void;
  observe: (selector: string, callback: (res: { intersectionRatio?: number }) => void) => void;
  disconnect?: () => void;
};
let io: IntersectionObserver | MpStickyObserver | null = null;

const style = computed((): Record<string, string | number> => ({
  position: 'sticky',
  top: `${props.offsetTop  }rpx`,
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
      const h5Observer = new IntersectionObserver(
        entries => {
          const entry = entries[0];
          const nowSticky = entry.intersectionRatio === 0; // 到达顶部时不可见
          if (nowSticky !== isSticky.value) {
            isSticky.value = nowSticky;
            emit('change', isSticky.value);
          }
        },
        { rootMargin: `-${props.offsetTop}px 0px 0px 0px`, threshold: [0, 1] }
      );
      h5Observer.observe(sentry);
      io = h5Observer;
    }
    // #endif

    // #ifndef H5
    // 小程序端
    // @ts-ignore
    const uniAny = uni as unknown as {
      createIntersectionObserver?: (instance?: unknown) => MpStickyObserver;
    };
    if (uniAny && uniAny.createIntersectionObserver) {
      const mpObserver = uniAny.createIntersectionObserver(getCurrentInstance());
      mpObserver.relativeToViewport({ top: props.offsetTop });
      mpObserver.observe('.lk-sticky__sentry', (res: { intersectionRatio?: number }) => {
        const nowSticky = (res.intersectionRatio ?? 1) === 0;
        if (nowSticky !== isSticky.value) {
          isSticky.value = nowSticky;
          emit('change', isSticky.value);
        }
      });
      io = mpObserver;
    }
    // #endif
  } catch {
    // 忽略，保持基础吸顶可用
  }
}

onMounted(async () => {
  await nextTick();
  observe();
});

onBeforeUnmount(() => {
  try {
    if (io && io.disconnect) {
      io.disconnect();
    }
  } catch {
    // ignore
  }
});
</script>

<template>
  <view ref="root" class="lk-sticky" :style="style">
    <view
      class="lk-sticky__sentry"
      style="position: absolute; top: 0; left: 0; width: 1px; height: 1px"
    />
    <slot />
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
