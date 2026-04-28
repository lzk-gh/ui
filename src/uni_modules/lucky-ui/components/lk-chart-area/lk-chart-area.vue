<script setup lang="ts">
import type { StyleValue } from 'vue';
import { computed, ref, watch } from 'vue';
import { useChartCanvas, type MaybeCanvas2DContext } from '../../composables/useChartCanvas';
import {
  formatCompactNumber,
  getLiteChartPositions,
  getNearestPointIndex,
  type LiteChartPosition,
} from '../../core/src/chart';
import { buildBrandPalette, resolveBrandBaseColor, rgbaFromHex } from '../../utils/chart-colors';
import { chartAreaEmits, chartAreaProps } from './chart-area.props';

defineOptions({ name: 'LkChartArea' });

const props = defineProps(chartAreaProps);
const emit = defineEmits(chartAreaEmits);

let uidSeed = 0;
function uid(prefix: string) {
  uidSeed += 1;
  return `${prefix}-${Date.now()}-${uidSeed}`;
}

const wrapperId = computed(() => props.id || uid('lk-chart-area'));
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
  'lk-chart-area',
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

function drawSmoothPath(ctx: MaybeCanvas2DContext, points: LiteChartPosition[]) {
  if (!points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const middleX = (previous.x + current.x) / 2;
    ctx.quadraticCurveTo(previous.x, previous.y, middleX, (previous.y + current.y) / 2);
  }
  const last = points[points.length - 1];
  ctx.lineTo(last.x, last.y);
}

function drawTooltip(
  ctx: MaybeCanvas2DContext,
  point: LiteChartPosition,
  text: string,
  palette: ReturnType<typeof buildBrandPalette>
) {
  ctx.save();
  ctx.font = '12px sans-serif';
  const paddingX = 8;
  const width = Math.max(34, ctx.measureText(text).width + paddingX * 2);
  const height = 24;
  const x = Math.max(6, Math.min(point.x - width / 2, chart.size.value.width - width - 6));
  const y = Math.max(6, point.y - height - 12);
  const radius = 9;

  ctx.fillStyle = rgbaFromHex(palette.brand800, 0.88);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = rgbaFromHex(palette.brand100, 1);
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + paddingX, y + height / 2);
  ctx.restore();
}

chart.setRenderer((info, progress) => {
  const { ctx, size } = info;
  const data = props.data || [];
  const padding = info.px(props.padding);
  const labelHeight = props.showXAxisLabel ? 18 : 0;
  const plotHeight = Math.max(0, size.height - labelHeight);
  const lineWidth = info.px(props.lineWidth);
  const points = getLiteChartPositions(data, size.width, plotHeight, padding);
  if (points.length < 2) return;

  const color = resolveColor();
  const palette = buildBrandPalette(resolveBrandBaseColor());
  const bottom = plotHeight - padding;
  const animatedPoints = points.map(point => ({
    ...point,
    y: bottom - (bottom - point.y) * progress,
  }));

  if (props.showGrid) {
    ctx.save();
    ctx.strokeStyle = rgbaFromHex(palette.brand800, 0.08);
    ctx.lineWidth = 1;
    for (let index = 0; index <= 3; index += 1) {
      const y = padding + ((bottom - padding) * index) / 3;
      ctx.beginPath();
      ctx.moveTo(padding, y + 0.5);
      ctx.lineTo(size.width - padding, y + 0.5);
      ctx.stroke();
    }
    ctx.restore();
  }

  const areaGradient = ctx.createLinearGradient(0, padding, 0, bottom);
  areaGradient.addColorStop(0, rgbaFromHex(color, 0.28));
  areaGradient.addColorStop(1, rgbaFromHex(color, 0));
  ctx.save();
  ctx.fillStyle = areaGradient;
  drawSmoothPath(ctx, animatedPoints);
  ctx.lineTo(animatedPoints[animatedPoints.length - 1].x, bottom);
  ctx.lineTo(animatedPoints[0].x, bottom);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  const lineGradient = ctx.createLinearGradient(padding, 0, size.width - padding, 0);
  lineGradient.addColorStop(0, rgbaFromHex(color, 0.72));
  lineGradient.addColorStop(0.55, color);
  lineGradient.addColorStop(1, rgbaFromHex(palette.brand800, 0.9));
  ctx.save();
  ctx.strokeStyle = lineGradient;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  drawSmoothPath(ctx, animatedPoints);
  ctx.stroke();
  ctx.restore();

  const activeIndex =
    hoverIndex.value >= 0 && hoverIndex.value < animatedPoints.length
      ? hoverIndex.value
      : props.defaultIndex >= 0
        ? Math.min(props.defaultIndex, animatedPoints.length - 1)
        : -1;

  if (activeIndex >= 0) {
    const active = animatedPoints[activeIndex];
    ctx.save();
    ctx.strokeStyle = rgbaFromHex(palette.brand800, 0.12);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(active.x, padding);
    ctx.lineTo(active.x, bottom);
    ctx.stroke();
    ctx.fillStyle = rgbaFromHex(palette.brand100, 1);
    ctx.beginPath();
    ctx.arc(active.x, active.y, lineWidth * 1.55, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(active.x, active.y, lineWidth, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    if (props.tooltip) drawTooltip(ctx, active, formatCompactNumber(active.value), palette);
  }

  if (props.showXAxisLabel) {
    ctx.save();
    ctx.fillStyle = rgbaFromHex(palette.brand800, 0.48);
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const first = points[0];
    const last = points[points.length - 1];
    ctx.fillText(first.label || '', first.x, size.height - labelHeight / 2);
    ctx.fillText(last.label || '', last.x, size.height - labelHeight / 2);
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
  const labelHeight = props.showXAxisLabel ? 18 : 0;
  const positions = getLiteChartPositions(
    props.data || [],
    chart.size.value.width,
    chart.size.value.height - labelHeight,
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
    props.showGrid,
    props.showXAxisLabel,
    props.defaultIndex,
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
    <canvas :id="canvasId" class="lk-chart-area__canvas" type="2d" :canvas-id="canvasId" />
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
