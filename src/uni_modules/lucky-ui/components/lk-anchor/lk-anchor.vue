<script setup lang="ts">
import { onMounted, onBeforeUnmount, provide, ref } from 'vue';
import { anchorProps, anchorEmits } from './anchor.props';

defineOptions({ name: 'LkAnchor' });

const props = defineProps(anchorProps);
const emit = defineEmits(anchorEmits);

const active = ref('');
provide('lk-anchor-active', active);

let io: any = null;

onMounted(() => {
  // H5 优先：使用 IntersectionObserver 监听标题元素
  // #ifdef H5
  try {
    const headings = Array.from(
      document.querySelectorAll('[data-lk-anchor-target]')
    ) as HTMLElement[];
    io = new IntersectionObserver(
      entries => {
        // 选择顶部最接近的可见标题作为 active
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const top =
          visible[0] ||
          entries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        const id = top?.target?.getAttribute('id') || '';
        if (id && active.value !== `#${id}`) {
          active.value = `#${id}`;
          emit('change', active.value);
        }
      },
      { rootMargin: `-${props.offsetTop}px 0px 0px 0px`, threshold: [0, 1] }
    );
    headings.forEach(h => io.observe(h));
  } catch (e) {}
  // #endif
});

onBeforeUnmount(() => {
  try {
    io && io.disconnect && io.disconnect();
  } catch (e) {}
});
</script>

<template>
  <view
    class="lk-anchor"
    :class="{ 'lk-anchor--affix': props.affix }"
    :style="{ top: props.affix ? props.offsetTop + 'rpx' : undefined }"
  >
    <slot />
  </view>
</template>

<style scoped lang="scss">
.lk-anchor {
  position: relative;
}
.lk-anchor--affix {
  position: sticky;
}
</style>
