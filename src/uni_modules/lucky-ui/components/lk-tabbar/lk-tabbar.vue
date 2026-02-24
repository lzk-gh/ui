<script setup lang="ts">
import { computed, provide, ref, watch, onMounted, nextTick } from 'vue';
import { tabbarEmits, tabbarProps, TabbarMode, type TabbarItemConfig } from './tabbar.props';
import { tabbarContextKey, type TabbarValue } from './context';

defineOptions({ name: 'LkTabbar' });

const props = defineProps(tabbarProps);
const emit = defineEmits(tabbarEmits);

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

// ============================================================================
// 事件处理
// ============================================================================
function setActive(val: TabbarValue, index: number) {
  if (val === props.modelValue) return;

  emit('update:modelValue', val);

  const item = props.list.length > 0 ? props.list[index] : undefined;
  emit('change', val, item);

  // 更新滑块位置
  updateSliderPosition(index);

  // 如果开启了页面跳转
  if (props.switchPage && item?.pagePath) {
    uni.switchTab({ url: item.pagePath });
  }
}

// 点击 list 模式的 item
function onItemClick(index: number, _item: TabbarItemConfig) {
  setActive(index, index);
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
          @tap="onItemClick(index, item)"
        >
          <!-- 凸起模式的特殊背景 -->
          <view v-if="isBumpItem(index)" class="lk-tabbar-item__bump-bg" />

          <view class="lk-tabbar-item__icon">
            <!-- 自定义图标(图片) -->
            <template v-if="item.customIcon">
              <image
                :src="modelValue === index && item.selectedIcon ? item.selectedIcon : item.icon"
                class="lk-tabbar-item__custom-icon"
                mode="aspectFit"
              />
            </template>
            <!-- lk-icon 内置图标 -->
            <template v-else>
              <lk-icon
                :name="modelValue === index && item.selectedIcon ? item.selectedIcon : item.icon"
                :size="isBumpItem(index) ? 52 : 44"
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
  <view v-if="fixed" class="lk-tabbar__placeholder" :class="{ 'lk-tabbar--safe-area': safeArea }" />
</template>

<style lang="scss">
@use './index.scss';
</style>
