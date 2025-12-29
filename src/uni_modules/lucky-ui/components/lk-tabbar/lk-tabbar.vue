<script setup lang="ts">
import { computed, ref, onMounted, provide } from 'vue';
import { tabbarProps, tabbarEmits } from './tabbar.props';
import type { TabbarType } from './tabbar.props';

defineOptions({ name: 'LkTabbar' });

const props = defineProps(tabbarProps);

const emit = defineEmits(tabbarEmits);

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

<style lang="scss">
@use './index.scss';
</style>
