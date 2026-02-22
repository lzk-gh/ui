<script setup lang="ts">
import { ref, provide, onMounted, nextTick, watch, computed } from 'vue';
import { anchorProps } from './anchor.props';

defineOptions({ name: 'LkAnchor' });
const props = defineProps(anchorProps);
const emit = defineEmits(['change', 'click']);

type AnchorChild = { props?: { href?: string } };
const children = ref<AnchorChild[]>([]);
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

function register(child: AnchorChild) {
  children.value.push(child);
}

function unregister(child: AnchorChild) {
  const idx = children.value.indexOf(child);
  if (idx > -1) children.value.splice(idx, 1);
}

function setTargets(nextTargets: Array<{ href: string; top: number; height?: number }>, baseScrollTop: number = 0) {
  const normalized = (Array.isArray(nextTargets) ? nextTargets : [])
    .map(item => ({
      href: item.href,
      top: Number(item.top || 0),
      height: Number(item.height || 0),
    }))
    .filter(item => !!item.href)
    .sort((a, b) => a.top - b.top);

  targets.value = normalized;
  resolveActiveByScroll(baseScrollTop);
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

  // 在小程序中，组件内的 createSelectorQuery 作用域被限制在组件本身，
  // 无法跨组件查找到父级/兄弟组件中的目标元素。
  // 必须使用页面实例的 createSelectorQuery 才能全页面查询。
  const q = uni.createSelectorQuery();
  // #ifdef MP
  const pages = typeof getCurrentPages === 'function' ? getCurrentPages() : [];
  const page = Array.isArray(pages) ? pages[pages.length - 1] : null;
  if (page) {
    (q as unknown as { in: (ctx: unknown) => ReturnType<typeof uni.createSelectorQuery> }).in(page);
  }
  // #endif

  const hasContainer = !!props.targetContainer;
  if (hasContainer) q.select(props.targetContainer).boundingClientRect();
  hrefs.forEach(href => q.select(`#${href}`).boundingClientRect());

  type RectLike = { top?: number; height?: number } | null;
  const results = await new Promise<RectLike[]>(resolve => {
    q.exec(res => resolve(Array.isArray(res) ? (res as RectLike[]) : []));
  });

  const containerRect = hasContainer ? results[0] : null;
  const startIndex = hasContainer ? 1 : 0;

  const measured = hrefs
    .map((href, idx) => {
      const rect = results[startIndex + idx];
      if (!rect) return null;
      // 核心计算公式：目标元素视口Top - 容器视口Top + 此时传入的容器已滚动距离
      const top = (rect.top || 0) - (containerRect?.top || 0) + Number(baseScrollTop || 0);
      return { href, top, height: rect.height || 0 };
    })
    .filter((i): i is { href: string; top: number; height: number } => !!i)
    .sort((a, b) => a.top - b.top);

  targets.value = measured;

  // 测量完毕后立刻计算一次当前激活项，解决初始无激活项的问题
  resolveActiveByScroll(baseScrollTop);
}

function resolveActiveByScroll(scrollTop: number, headerHeight: number = 0) {
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

// 滚动监听逻辑
function onScroll(scrollTop: number, headerHeight: number = 0) {
  // 移除了小程序每次滚动都重测位置的代码，解决高度计算错乱与高亮漂移
  resolveActiveByScroll(scrollTop, headerHeight);
}

function handleClick(href: string) {
  activeHref.value = href;
  // #ifdef H5
  try {
    const target = document.getElementById(href);
    if (target && props.targetContainer) {
      const container = document.querySelector(props.targetContainer) as HTMLElement | null;
      if (container) {
        const top = target.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
        container.scrollTo({ top, behavior: 'smooth' });
      }
    }
  } catch {
    // ignore
  }
  // #endif
  emit('click', href);
}

watch(activeHref, val => {
  if (val) scrollIntoViewId.value = `anchor-link-${val}`;
});

watch(
  () => children.value.length,
  () => {
    // children 注册完成后再测量，避免 setTimeout 依赖
    measureTargets(props.scrollTop || 0);
  }
);

watch(
  () => props.scrollTop,
  (val) => {
    onScroll(val);
  }
);

provide('lkAnchor', {
  activeHref,
  register,
  unregister,
  handleClick,
  props,
});

defineExpose({ measureTargets, setTargets, onScroll, scrollTo: handleClick, active: activeHref });

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
