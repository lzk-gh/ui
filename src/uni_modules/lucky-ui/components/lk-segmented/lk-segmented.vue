<!-- F:\luckyone\ui\src\uni_modules\lucky-ui\components\lk-segmented\lk-segmented.vue -->
<script setup lang="ts">
import { ref, watch, nextTick, getCurrentInstance, computed, onMounted } from 'vue';
import { segmentedProps, segmentedEmits, type SegmentedOption } from './segmented.props';

/* 工具：把 16rpx / 20px -> 真实 px */
function toPx(v: string | number) {
  if (typeof v === 'number') return v;
  return /rpx$/.test(v) ? uni.upx2px(parseFloat(v)) : parseFloat(v);
}

defineOptions({ name: 'LkSegmented' });
const props = defineProps(segmentedProps);
const emit = defineEmits(segmentedEmits);
const inst = getCurrentInstance();

const active = ref(props.modelValue);
const sliderStyle = ref<Record<string, string>>({ opacity: '0' });

/* 根节点注入变量 */
const rootStyle = computed<Record<string, string>>(() => {
  const s: Record<string, string> = {
    '--lk-seg-radius': props.radius || 'var(--lk-radius-pill)',
    '--lk-seg-duration': `${props.duration}ms`,
    '--lk-seg-easing': props.easing,
    '--lk-seg-inset': props.inset,
    '--lk-seg-gutter': props.gutter,
  };
  if (props.height) s['--lk-seg-height'] = props.height;
  return s;
});

/* 选择 */
function select(opt: SegmentedOption) {
  if (opt.disabled || opt.value === active.value) return;
  active.value = opt.value;
  emit('update:modelValue', opt.value);
  emit('change', opt.value);
  updateSlider();
}

/* 监听 */
watch(
  () => props.modelValue,
  v => {
    active.value = v;
    updateSlider();
  }
);
watch(
  [() => props.options, () => props.size, () => props.block, () => props.inset, () => props.gutter],
  () => nextTick(updateSlider),
  { deep: true }
);

/* 计算滑块 */
function updateSlider() {
  nextTick(() => {
    const q = uni.createSelectorQuery().in(inst);
    q.select('.lk-segmented').boundingClientRect();
    q.selectAll('.lk-segmented__item').boundingClientRect();
    q.exec(res => {
      const wrap = res?.[0];
      const items = res?.[1];
      if (!wrap || !items?.length) return;

      const idx = props.options.findIndex(o => o.value === active.value);
      if (idx < 0 || !items[idx]) {
        sliderStyle.value.opacity = '0';
        return;
      }

      const insetPx = toPx(props.inset);
      const offset = items[idx].left - wrap.left - insetPx;
      sliderStyle.value = {
        width: `${items[idx].width}px`,
        transform: `translateX(${offset}px)`,
        opacity: '1',
        transition: props.animated
          ? `width ${props.duration}ms ${props.easing}, transform ${props.duration}ms ${props.easing}, opacity 180ms ease`
          : 'none',
      };
    });
  });
}

onMounted(() => setTimeout(updateSlider, 50));
</script>

<template>
  <view
    class="lk-segmented"
    :class="[`lk-segmented--${size}`, { 'lk-segmented--block': block }]"
    :style="rootStyle"
  >
    <!-- 滑块 -->
    <view class="lk-segmented__slider" :style="sliderStyle" />

    <!-- 选项 -->
    <view
      v-for="opt in options"
      :key="opt.value"
      class="lk-segmented__item"
      :class="{ 'is-active': opt.value === active, 'is-disabled': opt.disabled }"
      @click="select(opt)"
    >
      <!-- 默认插槽 (可被自定义) -->
      <slot name="item" :option="opt" :active="opt.value === active">
        <text class="lk-segmented__label">{{ opt.label }}</text>
      </slot>
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
