<script setup lang="ts">
import type { StyleValue } from 'vue';
import { computed, provide, ref, watch, onMounted, nextTick } from 'vue';
import { tabbarEmits, tabbarProps, TabbarMode, type TabbarItemConfig } from './tabbar.props';
import { tabbarContextKey, type TabbarValue } from './context';
import {
  isTabbarBumpItem,
  resolveTabbarIndex,
  resolveTabbarItemActive,
  resolveTabbarItemClass,
  resolveTabbarListItemIcon,
  resolveTabbarPlaceholderStyle,
  resolveTabbarRootClass,
  resolveTabbarRootStyle,
  resolveTabbarSafeAreaBottom,
  resolveTabbarSliderMetrics,
  resolveTabbarSliderStyle,
  resolveTabbarStyleLayers,
  shouldShowTabbarBadge,
  shouldSwitchTabbarPage,
  resolveTabbarIconColor,
} from './tabbar.utils';

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
const safeAreaBottom = resolveTabbarSafeAreaBottom(systemInfo);

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
    const metrics = resolveTabbarSliderMetrics({
      mode: props.mode,
      totalItems,
      index,
    });
    if (!metrics) return;
    sliderLeft.value = metrics.left;
    sliderWidth.value = metrics.width;
  });
}

// 当激活项变化时更新滑块位置
watch(
  () => props.modelValue,
  val => {
    const index = resolveTabbarIndex(val);
    updateSliderPosition(index);
  },
  { immediate: true }
);

// 首次加载时更新滑块位置
onMounted(() => {
  updateSliderPosition(resolveTabbarIndex(props.modelValue));
});

// ============================================================================
// 样式计算
// ============================================================================
const rootStyle = computed(() => resolveTabbarRootStyle({
  zIndex: props.zIndex,
  safeArea: props.safeArea,
  preferRuntimeSafeArea,
  safeAreaBottom,
  bgColor: props.bgColor,
  activeColor: props.activeColor,
  inactiveColor: props.inactiveColor,
}));
const tabbarStyle = computed<StyleValue>(() => resolveTabbarStyleLayers({
  rootStyle: rootStyle.value,
  customStyle: props.customStyle as StyleValue,
}));

const sliderStyle = computed(() => resolveTabbarSliderStyle({
  left: sliderLeft.value,
  width: sliderWidth.value,
}));

const placeholderStyle = computed(() => resolveTabbarPlaceholderStyle({
  safeArea: props.safeArea,
  preferRuntimeSafeArea,
  safeAreaBottom,
}));
const rootClass = computed(() => resolveTabbarRootClass({
  customClass: props.customClass,
  mode: props.mode,
  fixed: props.fixed,
  safeArea: props.safeArea,
  border: props.border,
  glassBg: props.glassBg,
}));

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
  if (item?.pagePath && shouldSwitchTabbarPage({
    switchPage: props.switchPage,
    item,
  })) {
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
const isSliderMode = computed(() => props.mode === TabbarMode.Slider);

// 判断某个项是否是中间凸起项
function isBumpItem(index: number) {
  const total = props.list.length || itemCount.value;
  return isTabbarBumpItem({
    mode: props.mode,
    total,
    index,
  });
}

function getItemIconColor(active: boolean, bump: boolean) {
  return resolveTabbarIconColor({
    active,
    bump,
    activeColor: props.activeColor,
    inactiveColor: props.inactiveColor,
  });
}

function resolveListItemIcon(item: TabbarItemConfig, active: boolean) {
  return resolveTabbarListItemIcon({
    item,
    active,
  });
}
</script>

<template>
  <view
    :id="id"
    ref="tabbarRef"
    class="lk-tabbar"
    :class="rootClass"
    :style="tabbarStyle"
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
          :class="resolveTabbarItemClass({
            active: resolveTabbarItemActive(modelValue, index),
            bump: isBumpItem(index),
          })"
          @tap="onItemClick(index, item, $event)"
        >
          <!-- 凸起模式的特殊背景 -->
          <view v-if="isBumpItem(index)" class="lk-tabbar-item__bump-bg" />

          <view class="lk-tabbar-item__icon">
            <!-- 自定义图标(图片) -->
            <template v-if="item.customIcon">
              <image
                :src="resolveListItemIcon(item, resolveTabbarItemActive(modelValue, index))"
                class="lk-tabbar-item__custom-icon"
                mode="aspectFit"
              />
            </template>
            <!-- lk-icon 内置图标 -->
            <template v-else>
              <lk-icon
                :name="resolveListItemIcon(item, resolveTabbarItemActive(modelValue, index))"
                :size="isBumpItem(index) ? 52 : 44"
                :color="getItemIconColor(resolveTabbarItemActive(modelValue, index), isBumpItem(index))"
              />
            </template>

            <!-- 小红点 -->
            <view v-if="item.dot" class="lk-tabbar-item__dot" />
            <!-- 徽标 -->
            <view
              v-else-if="shouldShowTabbarBadge({
                dot: item.dot,
                badge: item.badge,
              })"
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
