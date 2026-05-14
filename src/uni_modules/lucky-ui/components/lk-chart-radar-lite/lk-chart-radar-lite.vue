<script setup lang="ts">
import type { StyleValue } from 'vue';
import { computed, onUnmounted, ref, watch } from 'vue';
import { useChartCanvas, type MaybeCanvas2DContext } from '../../composables/useChartCanvas';
import { LiteChartEffect, movingWindow } from '../../core/src/chart';
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
const effectPhase = ref(0);

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

function getEffectStrength() {
  if (props.effect === LiteChartEffect.None) return 0;
  if (props.effect === LiteChartEffect.Subtle) return 0.65;
  return 1;
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

function normalizeLoopPhase(value: number) {
  const phase = value % 1;
  return phase < 0 ? phase + 1 : phase;
}

function getLoopDistance(a: number, b: number) {
  const start = normalizeLoopPhase(a);
  const end = normalizeLoopPhase(b);
  const forward = Math.abs(end - start);
  return Math.min(forward, 1 - forward);
}

function buildRadarPoints(
  data: Array<RadarLiteItem & { max: number }>,
  cx: number,
  cy: number,
  radius: number
) {
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
  const effectStrength = getEffectStrength();
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

  if (effectStrength > 0) {
    const scanAngle = -Math.PI / 2 + Math.PI * 2 * effectPhase.value;
    const scanTail = 0.26 + effectStrength * 0.08;
    const beamX = cx + Math.cos(scanAngle) * radius;
    const beamY = cy + Math.sin(scanAngle) * radius;

    ctx.save();
    ctx.beginPath();
    drawPolygon(ctx, fullPoints);
    ctx.clip();

    const scanGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    scanGradient.addColorStop(0, rgbaFromHex(palette.brand100, 0.18 * effectStrength));
    scanGradient.addColorStop(0.52, rgbaFromHex(color, 0.15 * effectStrength));
    scanGradient.addColorStop(1, rgbaFromHex(color, 0));
    ctx.fillStyle = scanGradient;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, scanAngle - scanTail, scanAngle + 0.03);
    ctx.closePath();
    ctx.fill();

    const beamGradient = ctx.createLinearGradient(cx, cy, beamX, beamY);
    beamGradient.addColorStop(0, rgbaFromHex(palette.brand100, 0));
    beamGradient.addColorStop(0.45, rgbaFromHex(color, 0.12 * effectStrength));
    beamGradient.addColorStop(1, rgbaFromHex(palette.brand100, 0.92 * effectStrength));
    ctx.strokeStyle = beamGradient;
    ctx.lineWidth = 2.4 + effectStrength * 1.4;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(beamX, beamY);
    ctx.stroke();

    ctx.fillStyle = rgbaFromHex(color, 0.08 * effectStrength);
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.72, scanAngle - scanTail * 0.68, scanAngle + 0.01);
    ctx.lineTo(cx, cy);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = rgbaFromHex(palette.brand100, 0.26 * effectStrength);
    ctx.beginPath();
    ctx.arc(beamX, beamY, 7 + effectStrength * 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  if (props.showPoint) {
    ctx.save();
    radarPoints.forEach(point => {
      const pointPhase = normalizeLoopPhase((point.angle + Math.PI / 2) / (Math.PI * 2));
      const proximity = getLoopDistance(effectPhase.value, pointPhase);
      const directionalBoost = proximity < 0.12 ? 1 - proximity / 0.12 : 0;
      const highlight = effectStrength
        ? Math.max(movingWindow(effectPhase.value, pointPhase, 0.18), directionalBoost)
        : 0;
      ctx.fillStyle = rgbaFromHex(color, 0.08 + highlight * 0.16);
      ctx.beginPath();
      ctx.arc(point.x, point.y, 7 + highlight * 5, 0, Math.PI * 2);
      ctx.fill();
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
      ctx.textAlign =
        Math.abs(labelPoint.x - cx) < 8 ? 'center' : labelPoint.x > cx ? 'left' : 'right';
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

function syncEffectLoop() {
  chart.stopLoop();
  if (props.effect === LiteChartEffect.None) {
    effectPhase.value = 0;
    chart.scheduleRender(1);
    return;
  }
  if (!chart.ready.value || normalizedData.value.length < 3) return;

  chart.startLoop(props.effectDuration, frame => {
    effectPhase.value = frame.phase;
    chart.scheduleRender(1);
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
    props.effect,
    props.effectDuration,
  ],
  () => {
    renderWithAnimation();
    syncEffectLoop();
  },
  { deep: true }
);

watch(
  () => [chart.ready.value, normalizedData.value.length] as const,
  ([ready, length]) => {
    if (!ready || length < 3) {
      chart.stopLoop();
      return;
    }
    syncEffectLoop();
  },
  { immediate: true }
);

onUnmounted(() => {
  chart.stopLoop();
});
</script>

<template>
  <view :id="wrapperId" :class="classes" :style="rootStyle">
    <canvas :id="canvasId" class="lk-chart-radar-lite__canvas" type="2d" :canvas-id="canvasId" />
  </view>
</template>

<style lang="scss">
@use './lk-chart-radar-lite.scss';
</style>
