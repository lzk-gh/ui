<script setup lang="ts">
import { ref, provide, watch, onMounted, nextTick, computed, getCurrentInstance } from 'vue';

defineOptions({ name: 'LkTabs' });

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  lazy: { type: Boolean, default: true },
  type: { type: String, default: 'line' }, // line | card
  stretch: { type: Boolean, default: true }
});
const emit = defineEmits(['update:modelValue','change']);

const current = ref(props.modelValue);
watch(()=>props.modelValue, v => current.value = v);

const panes = ref<any[]>([]);
const instance = getCurrentInstance();

function register(pane:any) {
  // 以 name 作为唯一键，避免小程序端对象引用不一致导致判重失败
  const idx = panes.value.findIndex(p => p.name === pane.name);
  if (idx === -1) {
    panes.value.push({ name: pane.name, label: pane.label });
  } else {
    panes.value[idx] = { ...panes.value[idx], label: pane.label };
  }
  if (!current.value) {
    current.value = pane.name;
    emit('update:modelValue', current.value);
  }
  // 新增面板后更新滚动与指示条
  nextTick(() => {
    updateScrollIntoView();
    updateLinePosition();
  });
}
function unregister(pane:any) {
  const beforeLen = panes.value.length;
  panes.value = panes.value.filter(p => p.name !== pane.name);
  if (panes.value.length !== beforeLen) {
    nextTick(() => {
      updateScrollIntoView();
      updateLinePosition();
    });
  }
}

function setActive(name:any) {
  if(name === current.value) return;
  current.value = name;
  emit('update:modelValue', name);
  emit('change', name);
}

provide('LkTabs', {
  register,
  unregister,
  active: current,
  lazy: props.lazy
});

const scrollIntoViewId = ref<string>('');
const activeIndex = computed(() => panes.value.findIndex(p => p.name === current.value));
const lineStyle = ref({ transform: 'translateX(0)', width: '0' });

function updateScrollIntoView() {
  // 使激活项滚动到可视区域（scroll-view 支持 scroll-into-view）
  scrollIntoViewId.value = current.value != null ? `lk-tab-${String(current.value)}` : '';
}

function updateLinePosition() {
  if(props.type !== 'line') return;
  const idx = activeIndex.value;
  if(idx < 0) return;
  
  nextTick(() => {
    let query = (uni as any)?.createSelectorQuery?.();
    if(!query) return;
    // 作用域限定到当前组件实例，兼容小程序端
    if (query.in && instance?.proxy) query = query.in(instance.proxy);

    query.select('.lk-tabs__nav').boundingClientRect();
    // 需要获取横向滚动偏移
    if (query.select('.lk-tabs__nav').scrollOffset) {
      query.select('.lk-tabs__nav').scrollOffset();
    }
    query.selectAll('.lk-tabs__nav-item').boundingClientRect();

    query.exec((res: any[]) => {
      if (!res) return;
      const navRect = res[0];
      // 当调用了 scrollOffset 时，res: [navRect, offset, items]；否则为 [navRect, items]
      const hasOffset = res.length >= 3;
      const offsetObj = hasOffset ? res[1] : null;
      const itemRects = hasOffset ? res[2] : res[1];
      if(!navRect || !itemRects || !itemRects[idx]) return;

      const activeItem = itemRects[idx];
      const navLeft = navRect.left || 0;
      const scrollLeft = offsetObj?.scrollLeft || 0;

      // 计算指示条：相对内容容器的偏移，需要加上 scrollLeft
      const itemLeftInViewport = activeItem.left || 0;
      const itemLeft = itemLeftInViewport - navLeft + scrollLeft;
      const itemWidth = activeItem.width || 0;
      const lineWidth = itemWidth * 0.56; // 56% 宽度
      const translateX = itemLeft + (itemWidth - lineWidth) / 2;

      lineStyle.value = {
        transform: `translateX(${translateX}px)`,
        width: `${lineWidth}px`
      };
    });
  });
}

watch(current, () => { 
  updateScrollIntoView();
  updateLinePosition();
});
// 面板数量变化时也更新一次
watch(() => panes.value.length, () => {
  updateScrollIntoView();
  updateLinePosition();
});

onMounted(() => { 
  updateScrollIntoView();
  updateLinePosition();
});

// 手势滑动联动内容 -> 切换 tabs
let startX = 0;
let startY = 0;
let deltaX = 0;
let deltaY = 0;
let isTracking = false;
const SWIPE_THRESHOLD = 50; // px 阈值

function onTouchStart(e: any) {
  const t = e?.changedTouches?.[0] || e?.touches?.[0];
  if(!t) return;
  isTracking = true;
  startX = t.pageX;
  startY = t.pageY;
  deltaX = 0;
  deltaY = 0;
}
function onTouchMove(e: any) {
  if(!isTracking) return;
  const t = e?.changedTouches?.[0] || e?.touches?.[0];
  if(!t) return;
  deltaX = t.pageX - startX;
  deltaY = t.pageY - startY;
}
function onTouchEnd() {
  if(!isTracking) return;
  isTracking = false;
  // 仅当横向意图明显时触发
  if(Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) < Math.abs(deltaY)) return;
  const idx = panes.value.findIndex(p=>p.name===current.value);
  if(idx < 0) return;
  if(deltaX < 0 && idx < panes.value.length - 1) {
    // 向左滑 -> 下一页
    setActive(panes.value[idx + 1].name);
  } else if(deltaX > 0 && idx > 0) {
    // 向右滑 -> 上一页
    setActive(panes.value[idx - 1].name);
  }
}

// 少量 tabs 时保持等分，多时自动切换为可滚动
const stretching = computed(() => props.stretch && panes.value.length <= 4);
</script>

<template>
  <view class="lk-tabs" :class="[`lk-tabs--${type}`, { 'is-stretch': stretching }]">
    <view class="lk-tabs__nav-wrapper">
      <slot name="left"></slot>
      <scroll-view
        scroll-x
        class="lk-tabs__nav"
        :scroll-into-view="scrollIntoViewId"
        :scroll-with-animation="true"
        :show-scrollbar="false"
        enable-flex
      >
        <view
            v-for="(pane, index) in panes"
            :key="pane.name"
            class="lk-tabs__nav-item"
            :class="{ 'is-active': pane.name === current }"
            :id="`lk-tab-${pane.name}`"
            @click="setActive(pane.name)"
        >
          <text class="lk-tabs__label">{{ pane.label }}</text>
        </view>
        <view v-if="type==='line'" class="lk-tabs__line" :style="lineStyle"></view>
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

<style scoped lang="scss">
.lk-tabs {
  display: flex;
  flex-direction: column;
  /* 内部样式变量 */
  --_nav-bg: var(--lk-color-bg-surface);
  --_active-color: var(--lk-color-primary);
  --_line-height: 8rpx; /* 指示条厚度 */
  --_line-radius: 999rpx; /* 圆角更顺滑 */
  &__nav-wrapper {
    display: flex;
    align-items: center;
    background: var(--_nav-bg);
    gap: 0;
  }
  &__nav {
    white-space: nowrap;
    display: flex;
    flex: 1;
    /* 移除内边距，避免与指示条定位产生视觉偏移 */
    padding: 0;
    position: relative;
    /* 隐藏 H5 默认滚动条 */
    -ms-overflow-style: none; /* IE/Edge */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar { display: none; width: 0; height: 0; }
  }
  
  &__nav-item {
    position: relative;
    padding: 24rpx 36rpx;
    font-size: 28rpx;
    color: var(--lk-color-text-secondary);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: color var(--lk-transition-fast);
    flex-shrink: 0;
    &:first-child { margin-left: 8rpx; }
    &:last-child { margin-right: 8rpx; }
    
    &.is-active {
      color: var(--_active-color);
      font-weight: 600;
    }
  }
  
  &__line {
    position: absolute;
    bottom: 0;
    left: 0;
    height: var(--_line-height);
    background: var(--lk-color-primary);
    border-radius: var(--_line-radius);
    /* 平滑过渡动画 */
    transition: transform 320ms cubic-bezier(0.4, 0, 0.2, 1), 
                width 320ms cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform, width;
    pointer-events: none;
  }
  
  
  &--card &__nav-item {
    margin: 12rpx 12rpx 0;
    background: var(--lk-color-primary-bg-soft);
    border-radius: var(--lk-radius-pill);
    padding: 18rpx 32rpx;
    &.is-active {
      background: var(--lk-color-primary);
      color: var(--lk-color-text-inverse);
    }
  }
  
  &--card &__line {
    display: none; /* card 类型不显示下划线 */
  }
  
  &__content {
    padding: 24rpx 4rpx;
  }
  
  &.is-stretch &__nav-item {
    flex: 1;
    justify-content: center;
  }
}
</style>