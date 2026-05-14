<script setup lang="ts">
import { computed, provide, ref, watch, onMounted, nextTick } from 'vue';
import { tabbarEmits, tabbarProps, TabbarMode, type TabbarItemConfig } from './tabbar.props';
import { tabbarContextKey, type TabbarValue } from './context';

defineOptions({ name: 'LkTabbar' });

const props = defineProps(tabbarProps);
const emit = defineEmits(tabbarEmits);

type SafeAreaInfoLike = {
  screenHeight?: number;
  safeArea?: {
    bottom?: number;
  };
  safeAreaInsets?: {
    bottom?: number;
  };
};

const systemInfo: SafeAreaInfoLike =
  typeof uni !== 'undefined' ? (uni.getSystemInfoSync() as SafeAreaInfoLike) : {};

let preferRuntimeSafeArea = false;
// #ifdef MP || APP-PLUS
preferRuntimeSafeArea = true;
// #endif

function resolveSafeAreaBottom(info: SafeAreaInfoLike) {
  const insetBottom = info.safeAreaInsets?.bottom;
  if (typeof insetBottom === 'number') return Math.max(insetBottom, 0);

  const screenHeight = info.screenHeight;
  const safeAreaBottom = info.safeArea?.bottom;
  if (typeof screenHeight === 'number' && typeof safeAreaBottom === 'number') {
    return Math.max(screenHeight - safeAreaBottom, 0);
  }

  return 0;
}

const safeAreaBottom = resolveSafeAreaBottom(systemInfo);

// ============================================================================
// 子项管理
// ============================================================================
const itemCount = ref(0);
let itemIndexCounter = 0;

function registerItem() {
  const index = itemIndexCounter++;
  itemCount.value++;
  return {
    index,
    unregister: () => {
      itemCount.value--;
    },
  };
}

// ============================================================================
// Slider 模式相关
// ============================================================================
const sliderLeft = ref(0);
const sliderWidth = ref(0);
const tabbarRef = ref<HTMLElement | null>(null);

// 计算滑块位置
function updateSliderPosition(index: number) {
  if (props.mode !== TabbarMode.Slider) return;

  nextTick(() => {
    const totalItems = props.list.length || itemCount.value;
    if (totalItems <= 0) return;

    // 每个项目的宽度比例
    const itemWidth = 100 / totalItems;
    sliderLeft.value = index * itemWidth;
    sliderWidth.value = itemWidth;
  });
}

// 当激活项变化时更新滑块位置
watch(
  () => props.modelValue,
  val => {
    const index = typeof val === 'number' ? val : parseInt(val as string, 10) || 0;
    updateSliderPosition(index);
  },
  { immediate: true }
);

// 首次加载时更新滑块位置
onMounted(() => {
  const index =
    typeof props.modelValue === 'number'
      ? props.modelValue
      : parseInt(props.modelValue as string, 10) || 0;
  updateSliderPosition(index);
});

// ============================================================================
// 样式计算
// ============================================================================
const rootStyle = computed(() => {
  const style: Record<string, string | number> = {
    zIndex: props.zIndex,
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
  };

  if (props.safeArea && (preferRuntimeSafeArea || safeAreaBottom > 0)) {
    style['--lk-tabbar-safe-area-bottom'] = `${safeAreaBottom}px`;
  }
  if (props.bgColor) style['--lk-tabbar-bg'] = props.bgColor;
  if (props.activeColor) style['--lk-tabbar-active-color'] = props.activeColor;
  if (props.inactiveColor) style['--lk-tabbar-inactive-color'] = props.inactiveColor;

  return style;
});

const sliderStyle = computed(() => {
  return {
    left: `${sliderLeft.value}%`,
    width: `${sliderWidth.value}%`,
  };
});

const placeholderStyle = computed(() => {
  if (!props.safeArea || (!preferRuntimeSafeArea && safeAreaBottom <= 0)) return {};
  return {
    '--lk-tabbar-safe-area-bottom': `${safeAreaBottom}px`,
  };
});

// ============================================================================
// 事件处理
// ============================================================================
function setActive(val: TabbarValue, index: number, event?: unknown) {
  const item = props.list.length > 0 ? props.list[index] : undefined;
  emit('click', val, item, index, event);

  if (val === props.modelValue) {
    emit('reselect', val, item, index, event);
    return;
  }

  emit('update:modelValue', val);
  emit('change', val, item);

  // 更新滑块位置
  updateSliderPosition(index);

  // 如果开启了页面跳转
  if (props.switchPage && item?.pagePath) {
    uni.switchTab({
      url: item.pagePath,
      success: result => emit('switch-page-success', { value: val, item, index, result }),
      fail: error => emit('switch-page-fail', { value: val, item, index, error }),
    });
  }
}

// 点击 list 模式的 item
function onItemClick(index: number, _item: TabbarItemConfig, event: unknown) {
  setActive(index, index, event);
}

// ============================================================================
// 提供给子组件的上下文
// ============================================================================
provide(tabbarContextKey, {
  active: computed(() => props.modelValue),
  setActive,
  mode: computed(() => props.mode),
  activeColor: computed(() => props.activeColor),
  inactiveColor: computed(() => props.inactiveColor),
  itemCount: computed(() => props.list.length || itemCount.value),
  registerItem,
});

// ============================================================================
// 辅助计算
// ============================================================================
const isBumpMode = computed(() => props.mode === TabbarMode.Bump);
const isSliderMode = computed(() => props.mode === TabbarMode.Slider);
const middleIndex = computed(() => Math.floor((props.list.length || itemCount.value) / 2));

// 判断某个项是否是中间凸起项
function isBumpItem(index: number) {
  if (!isBumpMode.value) return false;
  const total = props.list.length || itemCount.value;
  return total % 2 === 1 && index === middleIndex.value;
}

function getItemIconColor(active: boolean, bump: boolean) {
  if (bump) return 'var(--lk-color-text-inverse)';
  if (active) return props.activeColor || 'var(--lk-color-primary)';
  return props.inactiveColor || 'var(--lk-color-text-secondary)';
}

function resolveFillIconName(iconName: string) {
  if (!iconName || iconName.endsWith('-fill')) return iconName;
  return `${iconName}-fill`;
}

function resolveListItemIcon(item: TabbarItemConfig, active: boolean) {
  if (active && item.selectedIcon) return item.selectedIcon;
  if (active && item.activeIconFill) return resolveFillIconName(item.icon);
  return item.icon;
}
</script>

<template>
  <view
    :id="id"
    ref="tabbarRef"
    class="lk-tabbar"
    :class="[
      customClass,
      `lk-tabbar--${mode}`,
      {
        'lk-tabbar--fixed': fixed,
        'lk-tabbar--safe-area': safeArea,
        'lk-tabbar--border': border,
        'lk-tabbar--glass': glassBg,
      },
    ]"
    :style="[rootStyle, customStyle as any]"
  >
    <!-- Slider 模式下的滑块指示器 -->
    <view v-if="isSliderMode" class="lk-tabbar__slider" :style="sliderStyle">
      <view class="lk-tabbar__slider-inner" />
    </view>

    <view class="lk-tabbar__wrapper">
      <!-- List 模式渲染 -->
      <template v-if="list.length > 0">
        <view
          v-for="(item, index) in list"
          :key="index"
          class="lk-tabbar-item"
          :class="{
            'is-active': modelValue === index,
            'lk-tabbar-item--bump': isBumpItem(index),
          }"
          @tap="onItemClick(index, item, $event)"
        >
          <!-- 凸起模式的特殊背景 -->
          <view v-if="isBumpItem(index)" class="lk-tabbar-item__bump-bg" />

          <view class="lk-tabbar-item__icon">
            <!-- 自定义图标(图片) -->
            <template v-if="item.customIcon">
              <image
                :src="resolveListItemIcon(item, modelValue === index)"
                class="lk-tabbar-item__custom-icon"
                mode="aspectFit"
              />
            </template>
            <!-- lk-icon 内置图标 -->
            <template v-else>
              <lk-icon
                :name="resolveListItemIcon(item, modelValue === index)"
                :size="isBumpItem(index) ? 52 : 44"
                :color="getItemIconColor(modelValue === index, isBumpItem(index))"
              />
            </template>

            <!-- 小红点 -->
            <view v-if="item.dot" class="lk-tabbar-item__dot" />
            <!-- 徽标 -->
            <view
              v-else-if="item.badge !== undefined && item.badge !== ''"
              class="lk-tabbar-item__badge"
            >
              <text>{{ item.badge }}</text>
            </view>
          </view>

          <view v-if="item.text" class="lk-tabbar-item__label">{{ item.text }}</view>
        </view>
      </template>

      <!-- Slot 模式渲染 -->
      <slot v-else />
    </view>
  </view>

  <!-- fixed 时撑起占位，避免内容被遮挡 -->
  <view
    v-if="fixed"
    class="lk-tabbar__placeholder"
    :class="{ 'lk-tabbar--safe-area': safeArea }"
    :style="placeholderStyle"
  />
</template>

<style lang="scss">
@use './lk-tabbar.scss';
</style>
