<script setup lang="ts">
import { computed, ref, onMounted, provide } from 'vue';

defineOptions({ name: 'LkTabbar' });

type TabbarType = 'TIC' | 'FAB' | 'CONCISE' | 'CAPSULE';

const props = defineProps<{
  modelValue?: string;
  fixed?: boolean;
  safeArea?: boolean;
  zIndex?: number;
  type?: TabbarType;
  // 自定义样式能力
  backgroundColor?: string; // 背景颜色
  topBorder?: boolean; // 顶部边框
  topLeftRadius?: number | string; // 左上角圆角
  topRightRadius?: number | string; // 右上角圆角
  topShadow?: boolean; // 顶部阴影
  activeColor?: string; // 激活颜色（图标/文字）
  inactiveColor?: string; // 未激活颜色（图标/文字）
  // 全局磨砂效果（可在任何 type 上启用）
  frosted?: boolean;
  // FAB 相关
  fabSize?: number | string; // FAB 直径
  // 胶囊相关参数（用于 CAPSULE 类型）
  capsuleWidth?: number | string; // 胶囊容器宽度（数字视为 rpx）
  capsuleOffset?: number | string; // 胶囊距离底部/上浮位移（数字视为 rpx）
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void;
  (e: 'change', val: string): void;
  (e: 'fab-click'): void;
}>();

// 获取系统信息（用于安全区与占位高度）
const sys =
  typeof uni !== 'undefined'
    ? uni.getSystemInfoSync()
    : ({ safeArea: { bottom: 0 }, windowHeight: 0 } as any);
const safeAreaInfo = sys.safeArea || { bottom: 0 };

// 维护子项注册顺序，用于默认选中第一个
const itemValues = ref<string[]>([]);

// 计算激活索引与指示器位置（仅 TIC 使用）
const activeValue = computed(() => props.modelValue ?? itemValues.value[0] ?? '');
const activeIndex = computed(() => Math.max(0, itemValues.value.indexOf(activeValue.value)));
const itemCount = computed(() => Math.max(1, itemValues.value.length));
const indicatorStyle = computed(() => {
  // TIC 类型：根据激活项移动
  if ((props.type ?? 'TIC') === 'TIC') {
    const leftPercent = ((activeIndex.value + 0.5) / itemCount.value) * 100;
    return { left: leftPercent + '%' } as Record<string, string>;
  }
  // FAB 类型：固定居中
  if (props.type === 'FAB') {
    return { left: '50%' } as Record<string, string>;
  }
  return {} as Record<string, string>;
});

function formatSize(v?: number | string) {
  if (v == null) return undefined;
  return typeof v === 'number' ? `${v}rpx` : v;
}

function parseNumber(v?: number | string) {
  if (v == null) return undefined;
  if (typeof v === 'number') return v;
  const m = String(v).match(/(-?\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) : undefined;
}

const rootStyle = computed(() => {
  const style: Record<string, string | number> = {};
  if (props.zIndex != null) style.zIndex = props.zIndex;
  if (props.backgroundColor) style.backgroundColor = props.backgroundColor;
  if (props.activeColor) (style as any)['--lk-tabbar-active-color'] = props.activeColor;
  if (props.inactiveColor) (style as any)['--lk-tabbar-inactive-color'] = props.inactiveColor;
  if (props.backgroundColor) (style as any)['--lk-tabbar-background'] = props.backgroundColor;
  const tl = formatSize(props.topLeftRadius);
  const tr = formatSize(props.topRightRadius);
  if (tl) (style as any)['--lk-tabbar-top-left-radius'] = tl;
  if (tr) (style as any)['--lk-tabbar-top-right-radius'] = tr;
  const fab = formatSize(props.fabSize);
  if (fab) (style as any)['--lk-tabbar-fab-size'] = fab;
  const cw = formatSize(props.capsuleWidth);
  if (cw) (style as any)['--lk-tabbar-capsule-width'] = cw;
  const co = formatSize(props.capsuleOffset);
  if (co) (style as any)['--lk-tabbar-capsule-offset'] = co;
  // placeholder height: 基于 type 与尺寸计算（单位 rpx）
  let placeholder = 100; // default 100rpx
  const fabNum = parseNumber(props.fabSize) ?? 110;
  const capsuleOffsetNum = parseNumber(props.capsuleOffset) ?? 18;
  if ((props.type ?? 'TIC') === 'FAB') {
    placeholder = Math.max(100, fabNum);
  } else if (props.type === 'CAPSULE') {
    placeholder = 100 + capsuleOffsetNum;
  }
  (style as any)['--lk-tabbar-placeholder-height'] = `${placeholder}rpx`;
  return style;
});

function registerItem(val?: string) {
  const v = val ?? '';
  if (!v) return;
  if (!itemValues.value.includes(v)) itemValues.value.push(v);
}

function select(val?: string) {
  const v = val ?? '';
  if (!v) return;
  if (v !== props.modelValue) {
    emit('update:modelValue', v);
    emit('change', v);
  }
}

function getSafeAreaHeight() {
  // 底部安全区域高度
  return safeAreaInfo.bottom > 0 ? sys.windowHeight - safeAreaInfo.bottom : 0;
}

function getTabbarHeight() {
  // Tabbar 高度，默认 50px (约 100rpx)
  return 50;
}

// 如果外部未传 active，则在子项注册完成后默认选中第一项
onMounted(() => {
  if ((props.modelValue == null || props.modelValue === '') && itemValues.value.length > 0) {
    emit('update:modelValue', itemValues.value[0]);
  }
});

// 对外提供给子项使用的上下文
provide('lkTabbar', {
  activeValue: computed(() => props.modelValue ?? itemValues.value[0] ?? ''),
  select,
  registerItem,
});
// 额外提供 type 给子项
provide('lkTabbarType', props.type ?? 'TIC');
</script>

<template>
  <view
    class="lk-tabbar"
    :class="[
      `lk-tabbar--type-${props.type ?? 'TIC'}`,
      {
        'lk-tabbar--fixed': props.fixed,
        'lk-tabbar--safe-area': props.safeArea,
        'lk-tabbar--top-border': props.topBorder,
        'lk-tabbar--top-shadow': props.topShadow,
        'lk-tabbar--frosted': props.frosted,
      },
    ]"
    :style="rootStyle"
  >
    <template v-if="(props.type ?? 'TIC') === 'TIC'">
      <view class="lk-tabbar__items">
        <!-- 全局指示器：常驻，依据激活项平移 -->
        <view class="lk-tabbar__indicator" :style="indicatorStyle" />
        <slot />
      </view>
    </template>
    <template v-else-if="props.type === 'CONCISE'">
      <view class="lk-tabbar__items lk-tabbar__items--concise">
        <!-- concise 类型占位，后续可补充具体内容 -->
        <slot />
      </view>
    </template>
    <template v-else-if="props.type === 'FAB'">
      <view class="lk-tabbar__items lk-tabbar__items--fab">
        <!-- FAB 固定在中间的圆形按钮（可通过 named slot 覆盖内容） -->
        <slot />
        <view class="lk-tabbar__fab" @click="emit('fab-click')">
          <slot name="fab">
            <lk-icon name="plus-lg" size="40" />
          </slot>
        </view>
      </view>
    </template>
    <template v-else-if="props.type === 'CAPSULE'">
      <view class="lk-tabbar__items lk-tabbar__items--capsule">
        <slot />
      </view>
    </template>

    <!-- 占位符，当 fixed 时撑起高度 -->
    <view
      v-if="props.fixed"
      class="lk-tabbar__placeholder"
      :style="
        props.safeArea
          ? 'height: calc(var(--lk-tabbar-placeholder-height,100rpx) + env(safe-area-inset-bottom));'
          : 'height: var(--lk-tabbar-placeholder-height,100rpx);'
      "
    />
  </view>
</template>

<style scoped lang="scss">
.lk-tabbar {
  display: flex;
  background-color: var(--lk-tabbar-background, var(--lk-color-bg-container));
  // 以 CSS 变量控制顶部圆角
  border-top-left-radius: var(--lk-tabbar-top-left-radius, 14rpx);
  border-top-right-radius: var(--lk-tabbar-top-right-radius, 14rpx);
  box-sizing: border-box;
  color: var(--lk-tabbar-inactive-color, var(--lk-color-text-secondary));

  &--top-border {
    border-top: 1px solid rgba(0, 0, 0, 0.06);
  }

  &--top-shadow {
    box-shadow: 0 -8rpx 28rpx rgba(0, 0, 0, 0.08);
  }

  &--type-TIC {
    // TIC 类型默认样式
  }
  &--type-CONCISE {
    // concise 类型样式，后续可补充
  }
  &--type-FAB {
    // fab 类型样式，后续可补充
  }
  &--type-FROSTED {
    background: rgba(255, 255, 255, 0.6);
    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);
    border: 1rpx solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 6rpx 28rpx rgba(0, 0, 0, 0.12);
  }
  &--frosted {
    background: rgba(255, 255, 255, 0.6);
    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);
    border: 1rpx solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 6rpx 28rpx rgba(0, 0, 0, 0.12);
  }

  &--type-CAPSULE {
    // 胶囊风格：整体居中、可见四角、距离底部一定距离
    background: transparent;
    .lk-tabbar__items--capsule {
      width: var(--lk-tabbar-capsule-width, 86%);
      margin: 0 auto;
      background: var(--lk-tabbar-background, #fff);
      border-radius: 36rpx;
      box-shadow: 0 12rpx 36rpx rgba(0, 0, 0, 0.12);
      padding: 10rpx 24rpx;
      display: flex;
      justify-content: space-around;
      transform: translateY(calc(-1 * var(--lk-tabbar-capsule-offset, 18rpx))); // 悬浮效果
      position: relative;
      z-index: 2;
    }
  }

  .lk-tabbar__items {
    position: relative;
    display: flex;
    justify-content: space-around;
    width: 100%;
    &--concise {
      // concise 类型样式占位
    }
    &--fab {
      padding-top: 20rpx; // 为悬浮按钮留出一些视觉空间
    }
    &--frosted {
      // 玻璃态类型样式占位
    }
  }

  .lk-tabbar__placeholder {
    width: 100%;
    height: var(--lk-tabbar-placeholder-height, 100rpx);
    pointer-events: none;
    display: block;
  }

  // 全局平移动画指示器（位于所有 item 背后）
  .lk-tabbar__indicator {
    position: absolute;
    top: -50%;
    width: 110rpx;
    height: 110rpx;
    background-color: var(--lk-tabbar-indicator-bg, var(--lk-color-primary));
    border-radius: 50%;
    margin-top: 6rpx;
    border: 12rpx solid var(--lk-tabbar-indicator-border, var(--lk-color-on-primary));
    transform: translateX(-50%);
    pointer-events: none;
    z-index: 0;
    transition: left 0.3s ease;

    // 左侧过渡弧形，随指示器一起移动
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: -42rpx;
      width: 40rpx;
      height: 40rpx;
      background: transparent;
      border-top-right-radius: 40rpx;
      box-shadow: 2rpx -12rpx 0 0 rgba(0, 0, 0, 0.08);
    }

    // 右侧对称弧形
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      right: -42rpx;
      width: 40rpx;
      height: 40rpx;
      background: transparent;
      border-top-left-radius: 40rpx;
      box-shadow: -2rpx -12rpx 0 0 rgba(0, 0, 0, 0.08);
    }
  }

  // FAB 中间固定按钮
  .lk-tabbar__fab {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(-50%, -50%);
    width: var(--lk-tabbar-fab-size, 110rpx);
    height: var(--lk-tabbar-fab-size, 110rpx);
    border-radius: 50%;
    background-color: var(--lk-tabbar-fab-bg, var(--lk-color-primary));
    border: 12rpx solid var(--lk-tabbar-fab-border, var(--lk-color-on-primary));
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    color: var(--lk-tabbar-active-color, var(--lk-color-on-primary));
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.18);

    // 左右弧形与 TIC 风格保持一致
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: -42rpx;
      width: 40rpx;
      height: 40rpx;
      background: transparent;
      border-top-right-radius: 40rpx;
      box-shadow: 2rpx -12rpx 0 0 #141414;
    }
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      right: -42rpx;
      width: 40rpx;
      height: 40rpx;
      background: transparent;
      border-top-left-radius: 40rpx;
      box-shadow: -2rpx -12rpx 0 0 #141414;
    }
  }
}
</style>
