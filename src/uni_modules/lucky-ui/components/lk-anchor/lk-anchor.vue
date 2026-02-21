<script setup lang="ts">
import { ref, provide, onMounted, nextTick, watch, computed } from 'vue';
import type { ComponentInternalInstance } from 'vue';
import { anchorProps } from './anchor.props';

defineOptions({ name: 'LkAnchor' });
const props = defineProps(anchorProps);
const emit = defineEmits(['change', 'click']);

const children = ref<ComponentInternalInstance[]>([]);
const activeHref = ref('');
const scrollIntoViewId = ref('');
const targets = ref<{ href: string; top: number; height: number }[]>([]);

const anchorStyle = computed(() => {
  const style: Record<string, string> = {};
  if (props.bgColor) style['--lk-anchor-bg-sidebar'] = props.bgColor;
  if (props.activeBgColor) style['--lk-anchor-bg-active'] = props.activeBgColor;
  if (props.textColor) style['--lk-anchor-text-color'] = props.textColor;
  if (props.activeColor) style['--lk-anchor-active-color'] = props.activeColor;
  return style;
});

function register(child: ComponentInternalInstance) {
  children.value.push(child);
}

function unregister(child: ComponentInternalInstance) {
  const idx = children.value.indexOf(child);
  if (idx > -1) children.value.splice(idx, 1);
}

// 测量目标元素位置
async function measureTargets(baseScrollTop: number = 0) {
  // 确保 DOM 已经渲染
  await nextTick();

  const hrefs = children.value.map(child => child?.props?.href as string).filter(href => !!href);

  if (hrefs.length === 0) {
    targets.value = [];
    return;
  }

  // 小程序端：组件内 createSelectorQuery 默认作用域在组件内，无法查到兄弟节点。
  // 这里显式绑定到当前 page，确保能查到页面内的所有节点。
  type SelectorQuery = ReturnType<typeof uni.createSelectorQuery>;
  let q: SelectorQuery | null = null;
  // #ifdef MP
  const pages = typeof getCurrentPages === 'function' ? getCurrentPages() : [];
  const page = Array.isArray(pages) ? pages[pages.length - 1] : null;
  const baseQuery = uni.createSelectorQuery();
  if (page) {
    const withIn = baseQuery as unknown as { in: (ctx: unknown) => SelectorQuery };
    q = withIn.in(page);
  } else {
    q = baseQuery;
  }
  // #endif
  // #ifndef MP
  q = uni.createSelectorQuery();
  // #endif

  if (!q) return;

  const hasContainer = !!props.targetContainer;
  if (hasContainer) q.select(props.targetContainer).boundingClientRect();
  hrefs.forEach(href => q.select(`#${href}`).boundingClientRect());

  type RectLike = { top?: number; height?: number } | null;
  const results = await new Promise<RectLike[]>(resolve => {
    q!.exec(res => resolve(Array.isArray(res) ? (res as RectLike[]) : []));
  });

  const containerRect = hasContainer ? results[0] : null;
  const startIndex = hasContainer ? 1 : 0;

  const measured = hrefs
    .map((href, idx) => {
      const rect = results[startIndex + idx];
      if (!rect) return null;
      const top = (rect.top || 0) - (containerRect?.top || 0) + Number(baseScrollTop || 0);
      return { href, top, height: rect.height || 0 };
    })
    .filter((i): i is { href: string; top: number; height: number } => !!i)
    .sort((a, b) => a.top - b.top);

  targets.value = measured;
}

// 滚动监听逻辑
function onScroll(scrollTop: number, headerHeight: number = 0) {
  if (targets.value.length === 0) return;
  const offset = Number(props.headerOffset) + headerHeight + 10; // +10 稍微增加一点容错

  let active = '';
  for (let i = 0; i < targets.value.length; i++) {
    const item = targets.value[i];
    const nextItem = targets.value[i + 1];
    if (scrollTop + offset >= item.top) {
      if (!nextItem || scrollTop + offset < nextItem.top) {
        active = item.href;
        break;
      }
    }
  }
  // 如果没找到，且滚动条很小，默认第一个
  if (!active && targets.value.length > 0 && scrollTop < targets.value[0].top) {
    active = targets.value[0].href;
  }

  if (active && active !== activeHref.value) {
    activeHref.value = active;
    emit('change', active);
  }
}

function handleClick(href: string) {
  activeHref.value = href;
  emit('click', href);
}

watch(activeHref, val => {
  if (val) scrollIntoViewId.value = `anchor-link-${val}`;
});

watch(
  () => children.value.length,
  () => {
    // children 注册完成后再测量，避免 setTimeout 依赖
    // 初始一般 scrollTop 为 0，页面如需更精准可手动传入 baseScrollTop 调用。
    measureTargets(0);
  }
);

provide('lkAnchor', {
  activeHref,
  register,
  unregister,
  handleClick,
  props,
});

defineExpose({ measureTargets, onScroll, scrollTo: handleClick, active: activeHref });

onMounted(() => {
  setTimeout(() => measureTargets(), 500);
});
</script>

<template>
  <view class="lk-anchor" :style="anchorStyle">
    <scroll-view
      scroll-y
      class="lk-anchor__scroll"
      :scroll-into-view="scrollIntoViewId"
      scroll-with-animation
      :show-scrollbar="false"
    >
      <view class="lk-anchor__wrapper">
        <slot></slot>
      </view>
      <view style="height: 20px"></view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
@use './index.scss';
</style>
