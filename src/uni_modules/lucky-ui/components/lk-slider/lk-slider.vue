<script setup lang="ts">
import {
  ref,
  watch,
  computed,
  inject,
  getCurrentInstance,
  onMounted,
  nextTick,
  type CSSProperties,
  type StyleValue,
} from 'vue';
import { formContextKey } from '../lk-form/context';
import type { SliderValue } from './slider.props';
import { sliderProps, sliderEmits } from './slider.props';

defineOptions({ name: 'LkSlider' });

const props = defineProps(sliderProps);
const emit = defineEmits(sliderEmits);
const form = inject(formContextKey, null);

const currentVal = ref<number[]>([]);
const dragging = ref(false);
const draggingIndex = ref(-1);

const instance = getCurrentInstance();
const trackId = `lk-slider-track-${instance?.uid ?? Math.random().toString(36).slice(2)}`;
const trackRect = ref<{ left: number; width: number }>({ left: 0, width: 0 });

watch(
  () => props.modelValue,
  newVal => {
    if (dragging.value) return;
    initValue(newVal);
  },
  { immediate: true, deep: true }
);

function initValue(val: number | number[]) {
  if (props.range) {
    if (Array.isArray(val)) {
      currentVal.value = [val[0] ?? props.min, val[1] ?? props.max];
    } else {
      currentVal.value = [props.min, Number(val)];
    }
  } else {
    currentVal.value = [Array.isArray(val) ? val[0] : Number(val)];
  }
}

// --- 计算属性 ---

function getPercent(value: number) {
  const range = props.max - props.min;
  if (range <= 0) return 0;
  return Math.max(0, Math.min(100, ((value - props.min) / range) * 100));
}

// 计算间断点的位置数组
const stops = computed(() => {
  if (!props.showStops || props.step <= 0) return [];
  const range = props.max - props.min;
  const stepCount = Math.floor(range / props.step);
  const result: number[] = [];

  // 超过 50 个点就不显示了，避免性能问题和密集恐惧症
  if (stepCount > 50) return [];

  for (let i = 1; i < stepCount; i++) {
    result.push(((i * props.step) / range) * 100);
  }
  return result;
});

const barStyle = computed(() => {
  const style: CSSProperties = {};
  if (props.activeColor) style.backgroundColor = props.activeColor;
  if (dragging.value) style.transition = 'none';

  if (props.range) {
    const p1 = getPercent(Math.min(currentVal.value[0], currentVal.value[1]));
    const p2 = getPercent(Math.max(currentVal.value[0], currentVal.value[1]));
    style.left = `${p1}%`;
    style.width = `${p2 - p1}%`;
  } else {
    style.width = `${getPercent(currentVal.value[0])}%`;
  }
  return style;
});

const rootClass = computed(() => [
  'lk-slider',
  `lk-slider--${props.size}`,
  { 'is-disabled': props.disabled, 'is-dragging': dragging.value },
  props.customClass,
]);

const rootStyle = computed(() => {
  const style: CSSProperties = {
    ...(props.customStyle as CSSProperties),
  };
  if (props.activeColor) style['--_active-bg'] = props.activeColor;
  if (props.inactiveColor) style['--_inactive-bg'] = props.inactiveColor;
  return style;
});

const trackStyle = computed(() => {
  const style: CSSProperties = {};
  if (props.barHeight) style.height = props.barHeight;
  if (props.inactiveColor) style.backgroundColor = props.inactiveColor;
  return style;
});

function getThumbStyle(index: number) {
  const percent = getPercent(currentVal.value[index]);
  const style: CSSProperties = { left: `${percent}%` };
  if (dragging.value) style.transition = 'none';
  style.zIndex = draggingIndex.value === index ? 2 : 1;
  return style;
}

const blockCustomStyle = computed(() => {
  const style: CSSProperties = {};
  if (props.blockSize) {
    style.width = props.blockSize;
    style.height = props.blockSize;
  }
  if (props.blockColor) style.backgroundColor = props.blockColor;
  return style;
});

// --- 逻辑 ---

function measureTrack(): Promise<{ left: number; width: number }> {
  return new Promise(resolve => {
    const q = uni.createSelectorQuery();
    if (instance?.proxy) q.in(instance.proxy);
    q.select(`#${trackId}`)
      .boundingClientRect(data => {
        const node = Array.isArray(data) ? data[0] : data;
        trackRect.value = { left: node?.left ?? 0, width: node?.width ?? 0 };
        resolve(trackRect.value);
      })
      .exec();
  });
}

type SliderPointerEvent = {
  changedTouches?: ArrayLike<{ clientX?: number }>;
  touches?: ArrayLike<{ clientX?: number }>;
  clientX?: number;
  detail?: number | { x?: number };
};

function getPointX(e: Event | SliderPointerEvent): number {
  const event = e as SliderPointerEvent;
  const detailX =
    typeof event.detail === 'object' && event.detail !== null ? event.detail.x : undefined;
  return (
    event.changedTouches?.[0]?.clientX ??
    event.touches?.[0]?.clientX ??
    event.clientX ??
    detailX ??
    0
  );
}

// 修正后的步长计算逻辑：基于 min 的相对偏移
function formatValue(percent: number): number {
  const range = props.max - props.min;
  const rawValue = props.min + range * percent;

  const step = props.step > 0 ? props.step : 1;
  // 计算走了多少个 step
  const steps = Math.round((rawValue - props.min) / step);
  // 重新计算吸附后的值
  let val = props.min + steps * step;

  // 精度修正 (解决 0.1 + 0.2 != 0.3 问题)
  val = parseFloat(val.toFixed(2));

  return Math.min(props.max, Math.max(props.min, val));
}

function emitValue(): SliderValue {
  return props.range ? [...currentVal.value].sort((a, b) => a - b) : currentVal.value[0];
}

function commitChange() {
  const finalVal = emitValue();
  emit('change', finalVal);
  if (props.validateEvent && props.prop) form?.emitFieldChange(props.prop, finalVal);
  return finalVal;
}

function updateValue(clientX: number, isClick = false): SliderValue | null {
  const rect = trackRect.value;
  if (rect.width <= 0) return null;

  const percent = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  const newValue = formatValue(percent);

  let index = draggingIndex.value;
  if (isClick || index === -1) {
    if (props.range) {
      const dist0 = Math.abs(currentVal.value[0] - newValue);
      const dist1 = Math.abs(currentVal.value[1] - newValue);
      index = dist0 <= dist1 ? 0 : 1;
    } else {
      index = 0;
    }
    draggingIndex.value = index;
  }

  if (currentVal.value[index] !== newValue) {
    const nextVal = [...currentVal.value];
    nextVal[index] = newValue;
    currentVal.value = nextVal;

    const nextEmitValue = emitValue();
    emit('update:modelValue', nextEmitValue);
    emit('input', nextEmitValue);
    return nextEmitValue;
  }
  return emitValue();
}

async function onTouchStart(e: Event | SliderPointerEvent) {
  if (props.disabled) return;
  await measureTrack();
  dragging.value = true;
  const clientX = getPointX(e);
  updateValue(clientX, true);
  emit('dragstart', emitValue(), draggingIndex.value, e);
}

function onTouchMove(e: Event | SliderPointerEvent) {
  if (props.disabled || !dragging.value) return;
  const clientX = getPointX(e);
  updateValue(clientX);
}

function onTouchEnd(e?: Event | SliderPointerEvent) {
  if (props.disabled || !dragging.value) return;
  const index = draggingIndex.value;
  dragging.value = false;
  draggingIndex.value = -1;
  const finalVal = commitChange();
  emit('dragend', finalVal, index, e);
}

async function onTrackClick(e: Event | SliderPointerEvent) {
  if (props.disabled || dragging.value) return;
  if (trackRect.value.width <= 0) await measureTrack();
  const clientX = getPointX(e);
  const nextValue = updateValue(clientX, true);
  if (nextValue !== null) {
    emit('click', nextValue, e);
    commitChange();
  }
  draggingIndex.value = -1;
}

onMounted(() => nextTick(() => measureTrack()));
</script>

<template>
  <view :id="id" :class="rootClass" :style="rootStyle">
    <view
      :id="trackId"
      class="lk-slider__track-container"
      @click="onTrackClick"
      @touchstart.stop.prevent="onTouchStart"
      @touchmove.stop.prevent="onTouchMove"
      @touchend.stop.prevent="onTouchEnd"
      @touchcancel="onTouchEnd"
      @mousedown.stop.prevent="onTouchStart"
      @mousemove.stop.prevent="onTouchMove"
      @mouseup.stop.prevent="onTouchEnd"
      @mouseleave="onTouchEnd"
    >
      <!-- 背景轨道 -->
      <view class="lk-slider__track" :style="trackStyle"></view>

      <!-- 激活条 -->
      <view class="lk-slider__bar" :style="barStyle"></view>

      <!-- 间断点 (Stops) -->
      <view
        v-for="stop in stops"
        :key="stop"
        class="lk-slider__stop"
        :style="{ left: stop + '%' }"
      ></view>

      <!-- 滑块 1 -->
      <view class="lk-slider__thumb-wrapper" :style="getThumbStyle(0)">
        <slot name="button" :value="currentVal[0]">
          <view class="lk-slider__thumb" :style="blockCustomStyle">
            <view v-if="showValue" class="lk-slider__tooltip">{{ currentVal[0] }}</view>
          </view>
        </slot>
      </view>

      <!-- 滑块 2（range 模式） -->
      <view v-if="range" class="lk-slider__thumb-wrapper" :style="getThumbStyle(1)">
        <slot name="button" :value="currentVal[1]">
          <view class="lk-slider__thumb" :style="blockCustomStyle">
            <view v-if="showValue" class="lk-slider__tooltip">{{ currentVal[1] }}</view>
          </view>
        </slot>
      </view>
    </view>

    <!-- 单滑块独立值显示（range 模式下值已内嵌在 thumb tooltip 中）-->
    <text v-if="showValue && !range" class="lk-slider__value">{{ currentVal[0] }}</text>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
