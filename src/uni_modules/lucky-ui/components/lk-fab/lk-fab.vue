<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { ref, computed, watch, onMounted } from 'vue';
import LkIcon from '../lk-icon/lk-icon.vue';
import LkOverlay from '../lk-overlay/lk-overlay.vue';
import { fabProps, fabEmits, type FabAction } from './fab.props';

defineOptions({ name: 'LkFab' });

const props = defineProps(fabProps);
const emit = defineEmits(fabEmits);

// 系统信息
const systemInfo = uni.getSystemInfoSync();
const windowWidth = systemInfo.windowWidth;
const windowHeight = systemInfo.windowHeight;
const safeBottom = systemInfo.safeAreaInsets?.bottom || 0;

// 单位转换
function toRpx(val: string | number): number {
  if (typeof val === 'number') return val;
  if (val.endsWith('rpx')) return parseFloat(val);
  if (val.endsWith('px')) return parseFloat(val) * 2;
  return parseFloat(val);
}

function rpx2px(rpx: number): number {
  return uni.upx2px(rpx);
}

// 尺寸计算
const sizePx = computed(() => rpx2px(toRpx(props.size)));
const actionSizePx = computed(() => rpx2px(toRpx(props.actionSize)));
const offsetPx = computed(() => rpx2px(toRpx(props.offset)));
const safeBottomPx = computed(() => (props.safeAreaInsetBottom ? safeBottom : 0));

// 位置状态
const posX = ref(0);
const posY = ref(0);
const isDragging = ref(false);
const isExpanded = ref(props.modelValue);

// 拖拽相关
let dragStartX = 0;
let dragStartY = 0;
let startPosX = 0;
let startPosY = 0;
let dragStartTime = 0;
let hasMoved = false;
let velocity = { x: 0, y: 0 };
let lastPos = { x: 0, y: 0 };
let lastTime = 0;

// 初始化位置
function initPosition() {
  const offset = offsetPx.value;
  const size = sizePx.value;
  const safeB = safeBottomPx.value;

  switch (props.position) {
    case 'bottom-right':
      posX.value = windowWidth - size - offset;
      posY.value = windowHeight - size - offset - safeB;
      break;
    case 'bottom-left':
      posX.value = offset;
      posY.value = windowHeight - size - offset - safeB;
      break;
    case 'top-right':
      posX.value = windowWidth - size - offset;
      posY.value = offset + (systemInfo.statusBarHeight || 0);
      break;
    case 'top-left':
      posX.value = offset;
      posY.value = offset + (systemInfo.statusBarHeight || 0);
      break;
  }
}

onMounted(() => {
  initPosition();
});

// 同步 v-model
watch(
  () => props.modelValue,
  val => {
    isExpanded.value = val;
  }
);

// 拖拽处理
function onTouchStart(e: TouchEvent) {
  if (!props.draggable) return;
  if (!e.touches || e.touches.length === 0) return;

  const touch = e.touches[0];
  dragStartX = touch.clientX;
  dragStartY = touch.clientY;
  startPosX = posX.value;
  startPosY = posY.value;
  dragStartTime = Date.now();
  hasMoved = false;
  lastPos = { x: touch.clientX, y: touch.clientY };
  lastTime = Date.now();
  velocity = { x: 0, y: 0 };

  isDragging.value = true;
  emit('drag-start');
}

function onTouchMove(e: TouchEvent) {
  if (!isDragging.value) return;
  if (!e.touches || e.touches.length === 0) return;

  const touch = e.touches[0];
  const dx = touch.clientX - dragStartX;
  const dy = touch.clientY - dragStartY;

  // 计算速度
  const now = Date.now();
  const dt = now - lastTime;
  if (dt > 0) {
    velocity.x = (touch.clientX - lastPos.x) / dt;
    velocity.y = (touch.clientY - lastPos.y) / dt;
  }
  lastPos = { x: touch.clientX, y: touch.clientY };
  lastTime = now;

  // 判断是否移动
  if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
    hasMoved = true;
  }

  // 更新位置（带边界限制）
  const size = sizePx.value;
  let newX = startPosX + dx;
  let newY = startPosY + dy;

  // 边界阻尼
  const minX = 0;
  const maxX = windowWidth - size;
  const minY = systemInfo.statusBarHeight || 0;
  const maxY = windowHeight - size - safeBottomPx.value;

  if (newX < minX) newX = minX - (minX - newX) * 0.3;
  if (newX > maxX) newX = maxX + (newX - maxX) * 0.3;
  if (newY < minY) newY = minY - (minY - newY) * 0.3;
  if (newY > maxY) newY = maxY + (newY - maxY) * 0.3;

  posX.value = newX;
  posY.value = newY;
}

function onTouchEnd() {
  if (!isDragging.value) return;
  isDragging.value = false;

  const duration = Date.now() - dragStartTime;
  const size = sizePx.value;
  const minX = 0;
  const maxX = windowWidth - size;
  const minY = systemInfo.statusBarHeight || 0;
  const maxY = windowHeight - size - safeBottomPx.value;

  // 修正超出边界
  let finalX = Math.max(minX, Math.min(maxX, posX.value));
  const finalY = Math.max(minY, Math.min(maxY, posY.value));

  // 磁吸效果：吸附到最近的边
  if (props.magnetic) {
    const centerX = finalX + size / 2;
    const offset = offsetPx.value;

    // 根据速度预测最终位置
    const predictX = centerX + velocity.x * 150;

    if (predictX < windowWidth / 2) {
      finalX = offset;
    } else {
      finalX = windowWidth - size - offset;
    }
  }

  posX.value = finalX;
  posY.value = finalY;

  emit('drag-end', { x: finalX, y: finalY });

  // 如果是点击而非拖拽，触发点击
  if (!hasMoved && duration < 200) {
    handleClick();
  }
}

// 点击处理
function handleClick() {
  emit('click');
  if (props.actions.length > 0) {
    toggleExpand();
  }
}

function toggleExpand() {
  isExpanded.value = !isExpanded.value;
  emit('update:modelValue', isExpanded.value);
  if (isExpanded.value) {
    emit('open');
  } else {
    emit('close');
  }
}

function handleActionClick(action: FabAction) {
  if (action.disabled) return;
  emit('action-click', action);
  // 点击子按钮后收起
  isExpanded.value = false;
  emit('update:modelValue', false);
  emit('close');
}

function handleOverlayClick() {
  if (props.closeOnOverlay) {
    isExpanded.value = false;
    emit('update:modelValue', false);
    emit('close');
  }
}

// 样式计算
const themeColors: Record<string, string> = {
  primary: 'var(--lk-color-primary)',
};

const mainStyle = computed((): CSSProperties & Record<string, string | number> => {
  const color = themeColors[props.color] || props.color;
  return {
    left: `${posX.value}px`,
    top: `${posY.value}px`,
    width: `${sizePx.value}px`,
    height: `${sizePx.value}px`,
    zIndex: props.zIndex,
    '--fab-color': color,
    transition: isDragging.value ? 'none' : 'left 0.35s cubic-bezier(0.25, 1, 0.5, 1), top 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
  };
});

const mainClass = computed(() => [
  'lk-fab__main',
  {
    'is-expanded': isExpanded.value,
    'is-dragging': isDragging.value,
    'is-blur': props.blur,
  },
]);

// 子按钮位置计算
function getActionStyle(index: number) {
  const gap = rpx2px(24);
  const distance = (actionSizePx.value + gap) * (index + 1);
  const mainCenter = sizePx.value / 2;
  const actionCenter = actionSizePx.value / 2;
  const offsetToCenter = mainCenter - actionCenter;

  let x = offsetToCenter;
  let y = offsetToCenter;

  switch (props.direction) {
    case 'up':
      y = -distance + offsetToCenter;
      break;
    case 'down':
      y = distance + offsetToCenter;
      break;
    case 'left':
      x = -distance + offsetToCenter;
      break;
    case 'right':
      x = distance + offsetToCenter;
      break;
  }

  return {
    width: `${actionSizePx.value}px`,
    height: `${actionSizePx.value}px`,
    transform: isExpanded.value ? `translate(${x}px, ${y}px) scale(1)` : `translate(${offsetToCenter}px, ${offsetToCenter}px) scale(0)`,
    opacity: isExpanded.value ? 1 : 0,
    transitionDelay: isExpanded.value ? `${index * 0.05}s` : `${(props.actions.length - index - 1) * 0.03}s`,
  } as CSSProperties;
}

// 图标旋转
const iconStyle = computed(() => ({
  transform: isExpanded.value && !props.activeIcon ? 'rotate(45deg)' : 'rotate(0deg)',
  transition: 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
}));

const currentIcon = computed(() => {
  if (isExpanded.value && props.activeIcon) {
    return props.activeIcon;
  }
  return props.icon;
});
</script>

<template>
  <view class="lk-fab" :style="{ zIndex }">
    <!-- 遮罩 -->
    <LkOverlay
      v-if="overlay"
      :show="isExpanded"
      :z-index="zIndex - 1"
      @click="handleOverlayClick"
    />

    <!-- 主按钮容器 -->
    <view
      class="lk-fab__container"
      :style="mainStyle"
      @touchstart.stop.prevent="onTouchStart"
      @touchmove.stop.prevent="onTouchMove"
      @touchend.stop.prevent="onTouchEnd"
    >
      <!-- 子按钮 -->
      <view
        v-for="(action, index) in actions"
        :key="action.key"
        class="lk-fab__action"
        :class="{ 'is-disabled': action.disabled, 'is-blur': blur }"
        :style="getActionStyle(index)"
        @click.stop="handleActionClick(action)"
      >
        <LkIcon :name="action.icon" :size="40" />
        <text v-if="action.label" class="lk-fab__action-label">{{ action.label }}</text>
      </view>

      <!-- 主按钮 -->
      <view :class="mainClass">
        <view class="lk-fab__icon" :style="iconStyle">
          <LkIcon :name="currentIcon" :size="48" />
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
