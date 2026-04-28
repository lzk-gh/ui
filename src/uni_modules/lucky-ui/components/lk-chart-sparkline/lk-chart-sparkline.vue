<script setup lang="ts">
import type { StyleValue } from 'vue';
import { computed, ref, watch } from 'vue';
import { useChartCanvas, type MaybeCanvas2DContext } from '../../composables/useChartCanvas';
import { getLiteChartPositions, getNearestPointIndex } from '../../core/src/chart';
import { buildBrandPalette, resolveBrandBaseColor, rgbaFromHex } from '../../utils/chart-colors';
import { chartSparklineEmits, chartSparklineProps } from './chart-sparkline.props';

defineOptions({ name: 'LkChartSparkline' });

const props = defineProps(chartSparklineProps);
const emit = defineEmits(chartSparklineEmits);

let uidSeed = 0;
function uid(prefix: string) {
  uidSeed += 1;
  return `${prefix}-${Date.now()}-${uidSeed}`;
}

const wrapperId = computed(() => props.id || uid('lk-chart-sparkline'));
const canvasId = computed(() => `${wrapperId.value}__canvas`);
const hoverIndex = ref(-1);

const heightStyle = computed(() => {
  const height = props.height;
  if (typeof height === 'number') return `${height}rpx`;
  if (/^\d+$/.test(String(height))) return `${height}rpx`;
  return String(height);
});

const rootStyle = computed<StyleValue>(() => [
  {
    height: heightStyle.value,
  },
  props.customStyle as StyleValue,
]);

const classes = computed(() => [
  'lk-chart-sparkline',
  {
    'is-interactive': props.tooltip,
  },
  props.customClass,
]);

const chart = useChartCanvas({
  wrapperId: wrapperId.value,
  canvasId: canvasId.value,
  autoSize: true,
});

function resolveColor() {
  const palette = buildBrandPalette(resolveBrandBaseColor());
  if (!props.color || props.color === 'primary') return palette.brand600;
  return props.color;
}

function drawLine(ctx: MaybeCanvas2DContext, points: Array<{ x: number; y: number }>) {
  if (!points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let index = 1; index < points.length; index += 1) {
    ctx.lineTo(points[index].x, points[index].y);
  }
}

chart.setRenderer((info, progress) => {
  const { ctx, size } = info;
  const data = props.data || [];
  const padding = info.px(props.padding);
  const lineWidth = info.px(props.lineWidth);
  const points = getLiteChartPositions(data, size.width, size.height, padding);
  if (points.length < 2) return;

  const color = resolveColor();
  const palette = buildBrandPalette(resolveBrandBaseColor());
  const animatedPoints = points.map(point => ({
    ...point,
    y: size.height - padding - (size.height - padding - point.y) * progress,
  }));
  const bottom = size.height - padding;

  if (props.area) {
    const gradient = ctx.createLinearGradient(0, padding, 0, bottom);
    gradient.addColorStop(0, rgbaFromHex(color, 0.2));
    gradient.addColorStop(1, rgbaFromHex(color, 0));
    ctx.save();
    ctx.fillStyle = gradient;
    drawLine(ctx, animatedPoints);
    ctx.lineTo(animatedPoints[animatedPoints.length - 1].x, bottom);
    ctx.lineTo(animatedPoints[0].x, bottom);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  ctx.save();
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = color;
  drawLine(ctx, animatedPoints);
  ctx.stroke();
  ctx.restore();

  const activeIndex =
    hoverIndex.value >= 0 && hoverIndex.value < animatedPoints.length
      ? hoverIndex.value
      : props.showEndPoint
        ? animatedPoints.length - 1
        : -1;

  if (activeIndex >= 0) {
    const active = animatedPoints[activeIndex];
    ctx.save();
    ctx.fillStyle = rgbaFromHex(palette.brand800, 0.12);
    ctx.beginPath();
    ctx.arc(active.x, active.y, lineWidth * 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(active.x, active.y, lineWidth, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
});

function renderWithAnimation() {
  chart.animateTo(Math.max(0, props.animationDuration), progress => {
    chart.scheduleRender(progress);
  });
}

function updateHover(event: unknown) {
  if (!props.tooltip) return;
  const point = chart.getRelativePoint(event);
  if (!point) return;
  const positions = getLiteChartPositions(
    props.data || [],
    chart.size.value.width,
    chart.size.value.height,
    chart.px(props.padding)
  );
  const index = getNearestPointIndex(positions, point.x);
  if (index !== hoverIndex.value) {
    hoverIndex.value = index;
    emit('hoverChange', index);
    chart.scheduleRender(1);
  }
}

function clearHover() {
  if (hoverIndex.value < 0) return;
  hoverIndex.value = -1;
  emit('hoverChange', -1);
  chart.scheduleRender(1);
}

watch(
  () => [
    props.data,
    props.height,
    props.padding,
    props.lineWidth,
    props.color,
    props.area,
    props.showEndPoint,
  ],
  () => renderWithAnimation(),
  { deep: true }
);
</script>

<template>
  <view
    :id="wrapperId"
    :class="classes"
    :style="rootStyle"
    @touchstart="updateHover"
    @touchmove="updateHover"
    @touchend="clearHover"
  >
    <canvas
      :id="canvasId"
      class="lk-chart-sparkline__canvas"
      type="2d"
      :canvas-id="canvasId"
    />
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
