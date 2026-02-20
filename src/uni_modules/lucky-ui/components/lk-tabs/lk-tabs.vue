<script setup lang="ts">
import { ref, provide, watch, onMounted, nextTick, computed, getCurrentInstance } from 'vue';
import { tabsProps, tabsEmits } from './tabs.props';

defineOptions({ name: 'LkTabs' });

const props = defineProps(tabsProps);
const emit = defineEmits(tabsEmits);

const current = ref(props.modelValue);
watch(
  () => props.modelValue,
  v => (current.value = v)
);

const panes = ref<any[]>([]);
const instance = getCurrentInstance();

function register(pane: any) {
  const idx = panes.value.findIndex(p => p.name === pane.name);
  if (idx === -1) {
    panes.value.push(pane);
  } else {
    panes.value[idx] = pane;
  }
  if (!current.value && panes.value.length > 0) {
    current.value = panes.value[0].name;
    emit('update:modelValue', current.value);
  }
  nextTick(() => {
    updateScrollIntoView();
    updateLinePosition();
  });
}

function unregister(pane: any) {
  panes.value = panes.value.filter(p => p.name !== pane.name);
  nextTick(() => {
    updateScrollIntoView();
    updateLinePosition();
  });
}

function setActive(name: any) {
  if (name === current.value) return;
  current.value = name;
  emit('update:modelValue', name);
  emit('change', name);
}

provide('LkTabs', {
  register,
  unregister,
  active: current,
  lazy: props.lazy,
});

const scrollIntoViewId = ref<string>('');
const activeIndex = computed(() => panes.value.findIndex(p => p.name === current.value));
const lineStyle = ref({ transform: 'translateX(0)', width: '0' });

function updateScrollIntoView() {
  scrollIntoViewId.value = current.value != null ? "lk-tab-${String(current.value)}" : '';
}

function updateLinePosition() {
  if (props.type !== 'line') return;
  const idx = activeIndex.value;
  if (idx < 0) return;

  nextTick(() => {
    let query = (uni as any)?.createSelectorQuery?.();
    if (!query) return;
    if (query.in && instance?.proxy) query = query.in(instance.proxy);

    query.select('.lk-tabs__nav').boundingClientRect();
    if (query.select('.lk-tabs__nav').scrollOffset) {
      query.select('.lk-tabs__nav').scrollOffset();
    }
    query.selectAll('.lk-tabs__nav-item').boundingClientRect();

    query.exec((res: any[]) => {
      if (!res) return;
      const navRect = res[0];
      const hasOffset = res.length >= 3;
      const offsetObj = hasOffset ? res[1] : null;
      const itemRects = hasOffset ? res[2] : res[1];
      if (!navRect || !itemRects || !itemRects[idx]) return;

      const activeItem = itemRects[idx];
      const navLeft = navRect.left || 0;
      const scrollLeft = offsetObj?.scrollLeft || 0;

      const itemLeftInViewport = activeItem.left || 0;
      const itemLeft = itemLeftInViewport - navLeft + scrollLeft;
      const itemWidth = activeItem.width || 0;
      const lineWidth = itemWidth * 0.6; // 60% width
      const translateX = itemLeft + (itemWidth - lineWidth) / 2;

      lineStyle.value = {
        transform: `translateX(${translateX}px)`,
        width: `${lineWidth}px`,
      };
    });
  });
}

watch(current, () => {
  updateScrollIntoView();
  updateLinePosition();
});

watch(
  () => panes.value.length,
  () => {
    updateScrollIntoView();
    updateLinePosition();
  }
);

onMounted(() => {
  updateScrollIntoView();
  updateLinePosition();
});

// Swipe logic
let startX = 0;
let startY = 0;
let deltaX = 0;
let deltaY = 0;
let isTracking = false;
const SWIPE_THRESHOLD = 50;

function onTouchStart(e: any) {
  const t = e?.changedTouches?.[0] || e?.touches?.[0];
  if (!t) return;
  isTracking = true;
  startX = t.pageX;
  startY = t.pageY;
  deltaX = 0;
  deltaY = 0;
}
function onTouchMove(e: any) {
  if (!isTracking) return;
  const t = e?.changedTouches?.[0] || e?.touches?.[0];
  if (!t) return;
  deltaX = t.pageX - startX;
  deltaY = t.pageY - startY;
}
function onTouchEnd() {
  if (!isTracking) return;
  isTracking = false;
  if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) < Math.abs(deltaY)) return;
  const idx = panes.value.findIndex(p => p.name === current.value);
  if (idx < 0) return;
  if (deltaX < 0 && idx < panes.value.length - 1) {
    setActive(panes.value[idx + 1].name);
  } else if (deltaX > 0 && idx > 0) {
    setActive(panes.value[idx - 1].name);
  }
}

const stretching = computed(() => props.stretch && panes.value.length <= 4);
</script>

<template>
  <view class="lk-tabs" :class="['lk-tabs--' + type, { 'is-stretch': stretching }]">
    <view class="lk-tabs__header">
      <slot name="left"></slot>
      <scroll-view
        scroll-x
        class="lk-tabs__nav"
        :scroll-into-view="scrollIntoViewId"
        :scroll-with-animation="true"
        :show-scrollbar="false"
        enable-flex
      >
        <view class="lk-tabs__nav-wrap">
          <view
            v-for="(pane, index) in panes"
            :key="pane.name"
            class="lk-tabs__nav-item"
            :class="{ 'is-active': pane.name === current }"
            :id="'lk-tab-' + pane.name"
            @click="setActive(pane.name)"
          >
            <text class="lk-tabs__label">{{ pane.label }}</text>
          </view>
          <view v-if="type === 'line'" class="lk-tabs__line" :style="lineStyle"></view>
        </view>
      </scroll-view>
      <slot name="right"></slot>
    </view>
    <view
      class="lk-tabs__content"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <slot />
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>

