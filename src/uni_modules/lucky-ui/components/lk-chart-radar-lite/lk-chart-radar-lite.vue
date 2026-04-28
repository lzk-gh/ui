<script setup lang="ts">
import type { StyleValue } from 'vue';
import { computed, watch } from 'vue';
import { useChartCanvas, type MaybeCanvas2DContext } from '../../composables/useChartCanvas';
import { buildBrandPalette, resolveBrandBaseColor, rgbaFromHex } from '../../utils/chart-colors';
import { chartRadarLiteProps, type RadarLiteItem } from './chart-radar-lite.props';

defineOptions({ name: 'LkChartRadarLite' });

const props = defineProps(chartRadarLiteProps);

let uidSeed = 0;
function uid(prefix: string) {
  uidSeed += 1;
  return `${prefix}-${Date.now()}-${uidSeed}`;
}

interface RadarPoint {
  label: string;
  value: number;
  ratio: number;
  angle: number;
  x: number;
  y: number;
}

const wrapperId = computed(() => props.id || uid('lk-chart-radar-lite'));
const canvasId = computed(() => `${wrapperId.value}__canvas`);

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

const classes = computed(() => ['lk-chart-radar-lite', props.customClass]);

const chart = useChartCanvas({
  wrapperId: wrapperId.value,
  canvasId: canvasId.value,
  autoSize: true,
});

const normalizedData = computed(() =>
  (props.data || [])
    .filter(item => item.label && Number.isFinite(item.value))
    .map(item => ({
      ...item,
      max: Math.max(1, item.max ?? props.max),
    }))
);

function resolveColor() {
  const palette = buildBrandPalette(resolveBrandBaseColor());
  if (!props.color || props.color === 'primary') return palette.brand600;
  return props.color;
}

function getPoint(cx: number, cy: number, radius: number, angle: number, ratio: number) {
  return {
    x: cx + Math.cos(angle) * radius * ratio,
    y: cy + Math.sin(angle) * radius * ratio,
  };
}

function drawPolygon(
  ctx: MaybeCanvas2DContext,
  points: Array<{ x: number; y: number }>,
  closePath = true
) {
  if (!points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let index = 1; index < points.length; index += 1) {
    ctx.lineTo(points[index].x, points[index].y);
  }
  if (closePath) ctx.closePath();
}

function buildRadarPoints(data: Array<RadarLiteItem & { max: number }>, cx: number, cy: number, radius: number) {
  const count = data.length;
  return data.map((item, index): RadarPoint => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / count;
    const ratio = Math.max(0, Math.min(1, item.value / item.max));
    const point = getPoint(cx, cy, radius, angle, ratio);
    return {
      label: item.label,
      value: item.value,
      ratio,
      angle,
      x: point.x,
      y: point.y,
    };
  });
}

chart.setRenderer((info, progress) => {
  const { ctx, size } = info;
  const data = normalizedData.value;
  if (data.length < 3) return;

  const palette = buildBrandPalette(resolveBrandBaseColor());
  const color = resolveColor();
  const padding = info.px(props.padding);
  const cx = size.width / 2;
  const cy = size.height / 2;
  const radius = Math.max(1, Math.min(size.width, size.height) / 2 - padding);
  const levels = Math.max(2, Math.round(props.levels));
  const fullPoints = data.map((item, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / data.length;
    return {
      label: item.label,
      angle,
      ...getPoint(cx, cy, radius, angle, 1),
    };
  });

  ctx.save();
  ctx.strokeStyle = rgbaFromHex(palette.brand800, 0.1);
  ctx.lineWidth = 1;
  for (let level = 1; level <= levels; level += 1) {
    const ratio = level / levels;
    const gridPoints = fullPoints.map(point => getPoint(cx, cy, radius, point.angle, ratio));
    drawPolygon(ctx, gridPoints);
    ctx.stroke();
  }
  fullPoints.forEach(point => {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  });
  ctx.restore();

  const radarPoints = buildRadarPoints(data, cx, cy, radius).map(point => ({
    ...point,
    x: cx + (point.x - cx) * progress,
    y: cy + (point.y - cy) * progress,
  }));

  const fillGradient = ctx.createRadialGradient(cx, cy, 1, cx, cy, radius);
  fillGradient.addColorStop(0, rgbaFromHex(color, 0.3));
  fillGradient.addColorStop(1, rgbaFromHex(color, 0.12));
  ctx.save();
  drawPolygon(ctx, radarPoints);
  ctx.fillStyle = fillGradient;
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  if (props.showPoint) {
    ctx.save();
    radarPoints.forEach(point => {
      ctx.fillStyle = rgbaFromHex(palette.brand100, 1);
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  if (props.showLabel) {
    ctx.save();
    ctx.font = '11px sans-serif';
    ctx.fillStyle = rgbaFromHex(palette.brand800, 0.68);
    ctx.textBaseline = 'middle';
    fullPoints.forEach(point => {
      const labelPoint = getPoint(cx, cy, radius + 18, point.angle, 1);
      ctx.textAlign = Math.abs(labelPoint.x - cx) < 8 ? 'center' : labelPoint.x > cx ? 'left' : 'right';
      ctx.fillText(point.label, labelPoint.x, labelPoint.y);
    });
    ctx.restore();
  }
});

function renderWithAnimation() {
  chart.animateTo(Math.max(0, props.animationDuration), progress => {
    chart.scheduleRender(progress);
  });
}

watch(
  () => [
    props.data,
    props.height,
    props.padding,
    props.levels,
    props.max,
    props.color,
    props.showLabel,
    props.showPoint,
  ],
  () => renderWithAnimation(),
  { deep: true }
);
</script>

<template>
  <view :id="wrapperId" :class="classes" :style="rootStyle">
    <canvas
      :id="canvasId"
      class="lk-chart-radar-lite__canvas"
      type="2d"
      :canvas-id="canvasId"
    />
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
