<script setup lang="ts">
/**
 * Lucky UI - LkTabbar（统一实现：FAB 绝对定位 + 运行时测量）
 * 特点：
 *  - 不用 flex order / 不拆左右插槽；fabIndex 任意位置跨端一致
 *  - fabIndex 语义（positionStrategy='between'）: 在第 fabIndex 个 item 之前插入(0=最左，length=最右)
 *  - positionStrategy='center-item' 时：FAB 对齐第 fabIndex 个 item 的中心
 *  - 通过测量 items DOM 计算 FAB x 坐标，绝对定位覆盖（浮动）
 *  - 可选 fabAvoidOverlap 减少遮挡：对相邻 item 增加 padding
 */
import {
  ref, computed, provide, onMounted, watch, onBeforeUnmount, nextTick
} from 'vue';

defineOptions({ name: 'LkTabbar' });

/** 组件属性（中文简洁注释） */
const props = defineProps({
  /** 双向绑定：当前激活项 name */
  modelValue: { type: [String, Number], default: '' },
  /** 是否固定在底部（true 时渲染占位并 fixed） */
  fixed: { type: Boolean, default: true },
  /** 是否适配底部安全区（全面屏底部 inset） */
  safeArea: { type: Boolean, default: true },
  /** 层级 z-index */
  zIndex: { type: Number, default: 100 },
  /** 背景色（blur 模式忽略） */
  background: { type: String, default: 'var(--lk-color-bg-surface)' },
  /** 激活态文字/图标颜色 */
  activeColor: { type: String, default: 'var(--lk-color-primary)' },
  /** 未激活态文字/图标颜色 */
  inactiveColor: { type: String, default: 'var(--lk-color-text-secondary)' },
  /** Tabbar 可见高度（rpx，不含安全区） */
  height: { type: [Number, String], default: 100 },

  /** 外观：flat | elevated | outline | blur | pill */
  variant: { type: String, default: 'flat' },
  /** 激活效果：scale | background | underline | lift */
  activeEffect: { type: String, default: 'background' },
  /** 形状：rounded | pill | square */
  shape: { type: String, default: 'rounded' },

  /** 是否启用 FAB */
  centralFab: { type: Boolean, default: false },
  /**
   * FAB 插入索引（整型）
   * positionStrategy='between'：表示位于第 fabIndex 个 item 之前(0..items.length)
   * positionStrategy='center-item'：表示对齐第 fabIndex 个 item 的中心(0..items.length-1)
   */
  fabIndex: { type: Number, default: -1 },
  /** FAB 上浮高度（视觉向上位移 rpx） */
  fabElevate: { type: Number, default: 28 },
  /** FAB 直径（rpx） */
  fabSize: { type: Number, default: 112 },
  /** FAB 图标名称（若存在优先显示图标） */
  fabIcon: { type: String, default: '' },
  /** FAB 文本（无图标时显示） */
  fabLabel: { type: String, default: '' },

  /** FAB 定位策略：between | center-item */
  fabIndexPositionStrategy: { type: String, default: 'between' },
  /** 避免 FAB 遮挡相邻项：true 时给两侧项增加内边距 */
  fabAvoidOverlap: { type: Boolean, default: false },
  /** FAB 避让额外内边距（rpx，左右应用） */
  fabAvoidPadding: { type: Number, default: 32 },

  /** 标签位置：below | beside | hidden */
  labelPosition: { type: String, default: 'below' },

  /** 激活背景色（background/lift 效果使用） */
  activeBgColor: { type: String, default: 'var(--lk-color-primary-bg-soft)' },
  /** 下划线颜色 */
  underlineColor: { type: String, default: 'var(--lk-color-primary)' },
  /** 下划线高度（rpx） */
  underlineHeight: { type: Number, default: 6 },
  /** 下划线圆角（rpx） */
  underlineRadius: { type: Number, default: 3 },

  /** 动画过渡时长（ms） */
  transitionMs: { type: Number, default: 240 },
  /** blur 模式模糊强度 */
  blurIntensity: { type: Number, default: 12 }
});

const emit = defineEmits(['update:modelValue','change','fabClick','mounted']);

type Item = { name: any; el?: HTMLElement | null };
const items = ref<Item[]>([]);
const innerValue = ref<any>(props.modelValue);
watch(() => props.modelValue, v => (innerValue.value = v));

function register(item: Item) {
  const exists = items.value.find(i => i.name === item.name);
  if (!exists) {
    items.value.push(item);
    if (innerValue.value === '' || innerValue.value === undefined || innerValue.value === null) {
      select(item.name, false);
    }
  } else {
    exists.el = item.el;
  }
  scheduleMeasure();
  nextTick(updateUnderline);
}
function unregister(name: any) {
  items.value = items.value.filter(i => i.name !== name);
  scheduleMeasure();
  nextTick(updateUnderline);
}
function getIndex(name: any) {
  return items.value.findIndex(i => i.name === name);
}

function select(name:any, trigger=true) {
  if (name === innerValue.value) return;
  innerValue.value = name;
  emit('update:modelValue', name);
  if (trigger) emit('change', name);
  nextTick(updateUnderline);
}
const active = computed(()=> innerValue.value);

/* 安全区换算 */
const systemInfo = ref<any>({});
const safeAreaBottomPx = ref(0);
const safeAreaBottomRpx = computed(()=> {
  if (!props.safeArea) return 0;
  if (!safeAreaBottomPx.value) return 0;
  const ww = systemInfo.value.windowWidth || 375;
  return Math.round(safeAreaBottomPx.value * 750 / ww);
});
function computeSafeArea() {
  try {
    // #ifdef MP
    const info = uni.getSystemInfoSync();
    systemInfo.value = info;
    if (info.safeArea && info.safeArea.bottom) {
      const gap = info.screenHeight - info.safeArea.bottom;
      if (gap > 0) safeAreaBottomPx.value = gap;
    }
    // #endif
    // #ifdef H5
    systemInfo.value = { windowWidth: window.innerWidth };
    // #endif
  } catch(e){}
}

const baseHeightRpx = computed(()=> {
  const v = typeof props.height === 'number' ? props.height : parseInt(props.height+'',10);
  return isNaN(v) ? 100 : v;
});
const totalBarHeightRpx = computed(()=> baseHeightRpx.value + safeAreaBottomRpx.value);

const placeholderStyle = computed(()=> props.fixed ? { height: totalBarHeightRpx.value + 'rpx' } : {});
const rootStyle = computed(()=> ({
  zIndex: props.zIndex,
  height: totalBarHeightRpx.value + 'rpx'
}));

const boxStyle = computed(() => ({
  minHeight: baseHeightRpx.value + 'rpx',
  background: props.variant === 'blur'
      ? 'rgba(var(--lk-bg-blur-rgb,255,255,255),0.68)'
      : (props.variant === 'outline' ? 'transparent' : props.background),
  backdropFilter: props.variant === 'blur' ? `blur(${props.blurIntensity}px)` : undefined,
  WebkitBackdropFilter: props.variant === 'blur' ? `blur(${props.blurIntensity}px)` : undefined,
  transition: `background ${props.transitionMs}ms, backdrop-filter ${props.transitionMs}ms`,
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
  width: '100%',
  boxSizing: 'border-box'
}));

const tabbarClass = computed(()=>[
  'lk-tabbar',
  { 'is-fixed': props.fixed }
]);
const boxClass = computed(()=>[
  'lk-tabbar__box',
  `lk-tabbar__box--variant-${props.variant}`,
  `lk-tabbar__box--shape-${props.shape}`,
  `lk-tabbar__box--effect-${props.activeEffect}`,
  `lk-tabbar__box--labels-${props.labelPosition}`,
  { 'has-fab': props.centralFab }
]);

/* 下划线 */
const underlineStyle = ref<any>({ opacity:0 });
function updateUnderline() {
  if (props.activeEffect !== 'underline') return;
  const act = items.value.find(i=> i.name === innerValue.value);
  if (!act || !act.el) {
    underlineStyle.value = { opacity:0 };
    return;
  }
  const el = act.el!;
  const rect = el.getBoundingClientRect?.();
  const parent = el.parentElement?.getBoundingClientRect?.();
  if (!rect || !parent) return;
  underlineStyle.value = {
    width: rect.width + 'px',
    transform: `translateX(${rect.left - parent.left}px)`,
    opacity: 1
  };
}

/* FAB 绝对定位计算 */
const fabStyle = ref<any>({ display: 'none' });

function measureFab() {
  if (!props.centralFab) {
    fabStyle.value = { display: 'none' };
    return;
  }
  // 合法性判断
  const count = items.value.length;
  if (count === 0) {
    fabStyle.value = { display: 'none' };
    return;
  }

  // 找到一个容器（任取第一个 item 的 parent）
  const firstEl = items.value[0].el as HTMLElement | null;
  if (!firstEl || !firstEl.parentElement) return;
  const containerRect = firstEl.parentElement.getBoundingClientRect?.();
  if (!containerRect) return;

  const fabSizePx = rpxToPx(props.fabSize);
  let leftPx = 0;

  if (props.fabIndexPositionStrategy === 'between') {
    // between 模式：允许 0..count
    let idx = props.fabIndex;
    if (idx < 0) {
      // 自动居中：在中间 gap
      idx = Math.floor(count / 2);
    }
    if (idx > count) idx = count;

    // 计算参考点 = gap 中点
    if (idx === 0) {
      // 最左 gap：使用第一个 item 左 + 负半 FAB
      const firstRect = items.value[0].el?.getBoundingClientRect?.();
      if (!firstRect) return;
      leftPx = firstRect.left - fabSizePx / 2;
    } else if (idx === count) {
      // 最右 gap：最后一个右边 - 半 FAB
      const lastRect = items.value[count - 1].el?.getBoundingClientRect?.();
      if (!lastRect) return;
      leftPx = lastRect.right - fabSizePx / 2;
    } else {
      const prevRect = items.value[idx - 1].el?.getBoundingClientRect?.();
      const nextRect = items.value[idx].el?.getBoundingClientRect?.();
      if (!prevRect || !nextRect) return;
      const mid = (prevRect.right + nextRect.left) / 2;
      leftPx = mid - fabSizePx / 2;
    }
  } else {
    // center-item 模式：对齐某个 item 的中心 (0..count-1)
    let idx = props.fabIndex;
    if (idx < 0 || idx >= count) {
      // 自动取中间 item
      idx = Math.floor((count - 1) / 2);
    }
    const rect = items.value[idx].el?.getBoundingClientRect?.();
    if (!rect) return;
    const center = (rect.left + rect.right) / 2;
    leftPx = center - fabSizePx / 2;
  }

  // 约束在容器内
  if (leftPx < containerRect.left) leftPx = containerRect.left;
  if (leftPx + fabSizePx > containerRect.right) leftPx = containerRect.right - fabSizePx;

  const offsetX = leftPx - containerRect.left;

  fabStyle.value = {
    display: 'flex',
    position: 'absolute',
    left: '0px',
    top: '0px',
    transform: `translate(${offsetX}px, -${props.fabElevate}rpx)`,
    width: props.fabSize + 'rpx',
    height: props.fabSize + 'rpx'
  };

  // 避让：给左/右相邻项 padding
  if (props.fabAvoidOverlap) {
    applyAvoidOverlap(offsetX, fabSizePx, containerRect.width);
  } else {
    clearAvoidOverlap();
  }
}

/* 将 rpx 转成 px（基于 750 设计宽） */
function rpxToPx(rpx: number | string): number {
  const v = typeof rpx === 'number' ? rpx : parseInt(rpx+'',10);
  const pxBase = systemInfo.value.windowWidth || 375;
  return v * pxBase / 750;
}

/* 避让逻辑：找到最接近 FAB 中心的左右 item，增加 padding */
const avoidPrev = ref<HTMLElement|null>(null);
const avoidNext = ref<HTMLElement|null>(null);
function applyAvoidOverlap(offsetX: number, fabSizePx: number, containerW: number) {
  const fabCenter = offsetX + fabSizePx / 2;
  let prev: { el: HTMLElement, center: number } | null = null;
  let next: { el: HTMLElement, center: number } | null = null;

  items.value.forEach(it => {
    const rect = it.el?.getBoundingClientRect?.();
    const parentRect = it.el?.parentElement?.getBoundingClientRect?.();
    if (!rect || !parentRect) return;
    const center = rect.left - parentRect.left + rect.width / 2;
    if (center <= fabCenter) {
      if (!prev || center > prev.center) prev = { el: it.el!, center };
    } else {
      if (!next || center < next.center) next = { el: it.el!, center };
    }
  });

  clearAvoidOverlap();

  const padRpx = props.fabAvoidPadding;
  const pad = padRpx + 'rpx';
  if (prev) {
    avoidPrev.value = prev.el;
    prev.el.style.paddingRight = pad;
  }
  if (next) {
    avoidNext.value = next.el;
    next.el.style.paddingLeft = pad;
  }
}
function clearAvoidOverlap() {
  if (avoidPrev.value) {
    avoidPrev.value.style.paddingRight = '';
    avoidPrev.value = null;
  }
  if (avoidNext.value) {
    avoidNext.value.style.paddingLeft = '';
    avoidNext.value = null;
  }
}

/* 节流测量 */
let measureTimer: any = null;
function scheduleMeasure() {
  if (measureTimer) return;
  measureTimer = setTimeout(()=> {
    measureTimer = null;
    nextTick(measureFab);
    nextTick(updateUnderline);
  }, 50);
}

/* 事件监听（H5 resize） */
function onResize() {
  scheduleMeasure();
}

onMounted(()=> {
  computeSafeArea();
  emit('mounted');
  // #ifdef H5
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);
  // #endif
  scheduleMeasure();
});
onBeforeUnmount(()=> {
  items.value = [];
  // #ifdef H5
  window.removeEventListener('resize', onResize);
  window.removeEventListener('orientationchange', onResize);
  // #endif
});

watch([
  () => props.centralFab,
  () => props.fabIndex,
  () => props.fabSize,
  () => props.fabIndexPositionStrategy,
  () => props.fabAvoidOverlap
], scheduleMeasure);

provide('LkTabbar', {
  active,
  register,
  unregister,
  select,
  getIndex,
  activeColor: computed(()=> props.activeColor),
  inactiveColor: computed(()=> props.inactiveColor),
  baseHeightRpx,
  labelPosition: computed(()=> props.labelPosition),
  activeEffect: computed(()=> props.activeEffect),
  activeBgColor: computed(()=> props.activeBgColor),
  transitionMs: computed(()=> props.transitionMs),
  hasFab: computed(()=> props.centralFab),
  fabIndex: computed(()=> props.fabIndex),
  // 兼容旧接口 (不再需要 order 支持)
  supportsOrder: computed(()=> false)
});

function onFabClick() {
  emit('fabClick');
}
</script>

<template>
  <view v-if="props.fixed" class="lk-tabbar__placeholder" :style="placeholderStyle" />
  <view :class="tabbarClass" :style="rootStyle">
    <view :class="boxClass" :style="boxStyle">
      <!-- items slot -->
      <slot />

      <!-- underline -->
      <view
          v-if="props.activeEffect==='underline'"
          class="lk-tabbar__underline"
          :style="{
          ...underlineStyle,
          height: props.underlineHeight + 'rpx',
            borderRadius: props.underlineRadius + 'rpx',
            background: props.underlineColor,
            transition: 'transform '+props.transitionMs+'ms, width '+props.transitionMs+'ms, opacity '+props.transitionMs+'ms'
        }"
      />

      <!-- FAB (绝对定位) -->
      <view
          v-if="props.centralFab"
          class="lk-tabbar__fab"
          :style="fabStyle"
          @click="onFabClick"
      >
        <slot name="fab">
          <lk-icon v-if="props.fabIcon" :name="props.fabIcon" size="48" />
          <text v-else class="lk-tabbar__fab-text">{{ props.fabLabel || '+' }}</text>
        </slot>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.lk-tabbar__placeholder { width:100%; flex-shrink:0; }

.lk-tabbar {
  position: relative;
  width: 100%;
  display:flex;
  flex-direction:column;
  justify-content:flex-end;
  background:transparent;

  &.is-fixed {
    // #ifdef MP
    position:fixed;
    bottom:0;
    // #endif
    // #ifdef H5
    position:fixed;
    bottom:0;
    // #endif
  }
}

.lk-tabbar__box {
  position:relative;
  width:100%;
  box-sizing:border-box;

  &--variant-flat { box-shadow: 0 -4rpx 12rpx rgba(0,0,0,0.05); }
  &--variant-elevated { box-shadow: 0 -6rpx 24rpx rgba(0,0,0,0.12); }
  &--variant-outline { border-top: 2rpx solid var(--lk-color-border-weak); }
  &--variant-blur { box-shadow: 0 -4rpx 16rpx rgba(0,0,0,0.08); }
  &--variant-pill {
    padding: 0 16rpx;
    border: 2rpx solid var(--lk-color-border-weak);
    border-radius: 999rpx;
    box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.12);
  }

  &--shape-pill {
    width: calc(100% - 24rpx);
    margin: 0 auto;
    border-radius: 999rpx;
    overflow:hidden;
    box-shadow: inset 0 0 0 2rpx var(--lk-color-border-weak);
    
    &.lk-tabbar__box--variant-pill {
      width: auto;
      margin: 0;
      box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.12);
    }
  }
  &--shape-rounded {
    border-radius: var(--lk-radius-lg);
    overflow:hidden;
    
    &.lk-tabbar__box--variant-pill {
      border-radius: 999rpx;
      overflow: visible;
    }
  }
  &--shape-square { border-radius:0; }

  .lk-tabbar__underline {
    position:absolute;
    bottom:0;
    left:0;
    pointer-events:none;
  }

  .lk-tabbar__fab {
    display:flex;
    align-items:center;
    justify-content:center;
    border-radius:50%;
    background: var(--lk-color-primary);
    color: var(--lk-color-text-inverse);
    box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.25);
    font-size:40rpx;
    font-weight:600;
    transition: box-shadow var(--lk-transition-fast), transform var(--lk-transition-fast);
    &:active {
      transform: scale(.94);
      box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.2);
    }
  }
  .lk-tabbar__fab-text { font-size:40rpx; }
}

/* 暗色 */
:deep([data-theme='dark']) .lk-tabbar__box {
  &--variant-outline { border-top-color: var(--lk-color-border); }
  &--variant-pill {
    background: var(--lk-color-bg-surface);
    border: 2rpx solid var(--lk-color-border-weak);
  }
  &--shape-pill {
    background: var(--lk-color-bg-surface);
  }
}
</style>