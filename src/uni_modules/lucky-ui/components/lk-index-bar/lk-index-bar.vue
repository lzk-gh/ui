<script setup lang="ts">
import { ref } from 'vue';
import { indexBarProps, indexBarEmits } from './index-bar.props';

defineOptions({ name: 'LkIndexBar' });

const props = defineProps(indexBarProps);
const emit = defineEmits(indexBarEmits);

const active = ref('');

function scrollTo(letter: string) {
  emit('select', letter);
  active.value = letter;
  // #ifdef H5
  try {
    const root: any = props.scrollTarget ? document.querySelector(props.scrollTarget) : window;
    const el = (
      props.scrollTarget
        ? document.querySelector(`${props.scrollTarget} [data-lk-index-anchor="${letter}"]`)
        : document.querySelector(`[data-lk-index-anchor="${letter}"]`)
    ) as HTMLElement | null;
    if (el) {
      if (root === window) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else
        (root as HTMLElement).scrollTo({
          top: el.getBoundingClientRect().top + (root as HTMLElement).scrollTop,
          behavior: 'smooth',
        });
    }
  } catch (e) {}
  // #endif

  // #ifndef H5
  try {
    const q = uni.createSelectorQuery();
    const target = props.scrollTarget || '';
    const sel = `${target ? target + ' ' : ''}[data-lk-index-anchor="${letter}"]`;
    q.select(sel).boundingClientRect();
    // @ts-ignore 小程序端 API：scrollOffset 允许无参调用
    q.selectViewport().scrollOffset && q.selectViewport().scrollOffset();
    q.exec(res => {
      const rect = res[0];
      const viewport = res[1];
      if (rect && viewport) {
        uni.pageScrollTo({
          scrollTop: rect.top + viewport.scrollTop,
          duration: 200,
        });
      }
    });
  } catch (e) {}
  // #endif
}
</script>

<template>
  <view class="lk-index-bar">
    <slot />
    <view class="lk-index-bar__sidebar">
      <view
        v-for="ch in props.indexList"
        :key="ch"
        :class="['lk-index-bar__item', { 'is-active': active === ch }]"
        @click="scrollTo(ch)"
        >{{ ch }}</view
      >
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
