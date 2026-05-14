<script setup lang="ts">
import type { StyleValue } from 'vue';
import { computed, onUnmounted, ref, watch } from 'vue';
import { useChartCanvas } from '../../composables/useChartCanvas';
import { LiteChartEffect, movingWindow, oscillate } from '../../core/src/chart';
import { buildBrandPalette, resolveBrandBaseColor, rgbaFromHex } from '../../utils/chart-colors';
import { chartRingProps, type RingChartSegment } from './chart-ring.props';

defineOptions({ name: 'LkChartRing' });

const props = defineProps(chartRingProps);

let uidSeed = 0;
function uid(prefix: string) {
  uidSeed += 1;
  return `${prefix}-${Date.now()}-${uidSeed}`;
}

const wrapperId = computed(() => props.id || uid('lk-chart-ring'));
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

const classes = computed(() => ['lk-chart-ring', props.customClass]);

const chart = useChartCanvas({
  wrapperId: wrapperId.value,
  canvasId: canvasId.value,
  autoSize: true,
});

const normalizedSegments = computed<RingChartSegment[]>(() => {
  if (props.segments.length) {
    return props.segments.filter(item => Number.isFinite(item.value) && item.value > 0);
  }
  const max = Math.max(1, props.max);
  return [
    {
      label: props.title || 'Progress',
      value: Math.max(0, Math.min(props.value, max)),
    },
  ];
});

const centerTitle = computed(() => {
  if (props.title) return props.title;
  if (props.segments.length) {
    const total = normalizedSegments.value.reduce((sum, item) => sum + item.value, 0);
    return `${Math.round(total)}`;
  }
  const percent = Math.round(
    (Math.max(0, Math.min(props.value, props.max)) / Math.max(1, props.max)) * 100
  );
  return `${percent}%`;
});

const centerSubtitle = computed(
  () => props.subtitle || (props.segments.length ? 'Total' : 'Completed')
);

function resolveSegmentColor(segment: RingChartSegment, index: number) {
  if (segment.color) return segment.color;
  const palette = buildBrandPalette(resolveBrandBaseColor());
  const colors = [palette.brand600, palette.brand400, palette.brand700, palette.brand300];
  return colors[index % colors.length];
}

function getEffectStrength() {
  if (props.effect === LiteChartEffect.None) return 0;
  if (props.effect === LiteChartEffect.Subtle) return 0.65;
  return 1;
}

chart.setRenderer((info, progress) => {
  const { ctx, size } = info;
  const palette = buildBrandPalette(resolveBrandBaseColor());
  const strokeWidth = Math.max(2, info.px(props.strokeWidth));
  const padding = info.px(props.padding);
  const cx = size.width / 2;
  const cy = size.height / 2;
  const radius = Math.max(1, Math.min(size.width, size.height) / 2 - padding - strokeWidth / 2);
  const segments = normalizedSegments.value;
  if (!segments.length) return;
  const effectStrength = getEffectStrength();

  ctx.save();
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = 'round';

  if (props.showTrack) {
    ctx.strokeStyle = rgbaFromHex(palette.brand800, 0.08);
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  const total = props.segments.length
    ? segments.reduce((sum, item) => sum + item.value, 0)
    : Math.max(1, props.max);
  let start = -Math.PI / 2;
  const pulse = effectStrength > 0 ? oscillate(effectPhase.value) * effectStrength : 0;
  const segmentCount = segments.length;
  const overlapAngle = segmentCount > 1 ? Math.min((strokeWidth * 1.6) / radius, Math.PI / 8) : 0;
  const drawnSegments: Array<{
    color: string;
    start: number;
    sweep: number;
    fullSweep: number;
    end: number;
  }> = [];

  function drawRingArc(color: string, from: number, to: number, lineCap: CanvasLineCap) {
    ctx.lineCap = lineCap;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, from, to);
    ctx.stroke();
  }

  segments.forEach((segment, index) => {
    const fullSweep = (segment.value / total) * Math.PI * 2;
    const end = start + fullSweep * progress;
    const sweep = Math.max(0, end - start);
    const color = resolveSegmentColor(segment, index);
    drawRingArc(color, start, end, segmentCount > 1 ? 'butt' : 'round');
    drawnSegments.push({ color, start, sweep, fullSweep, end });

    if (effectStrength > 0) {
      const highlight = movingWindow(
        effectPhase.value,
        (start + fullSweep / 2 + Math.PI / 2) / (Math.PI * 2),
        0.22
      );
      const sweepAngle = start + (sweep || 0) * effectPhase.value;
      const sweepX = cx + Math.cos(sweepAngle) * radius;
      const sweepY = cy + Math.sin(sweepAngle) * radius;
      ctx.save();
      ctx.fillStyle = rgbaFromHex(color, 0.08 + highlight * 0.08 + pulse * 0.04);
      ctx.beginPath();
      ctx.arc(sweepX, sweepY, strokeWidth * (0.18 + effectStrength * 0.06), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    start += fullSweep;
  });

  if (segmentCount > 1) {
    drawnSegments.forEach(segment => {
      const capSweep = Math.min(overlapAngle, segment.sweep, segment.fullSweep * 0.45);
      if (capSweep <= 0) return;
      const capEnd = segment.end;
      const capStart = capEnd - capSweep;
      drawRingArc(segment.color, capStart, capEnd, 'round');
    });
  }

  ctx.restore();

  if (props.showCenter) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = rgbaFromHex(palette.brand800, 0.95);
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(centerTitle.value, cx, cy - 8);
    ctx.fillStyle = rgbaFromHex(palette.brand800, 0.55);
    ctx.font = '12px sans-serif';
    ctx.fillText(centerSubtitle.value, cx, cy + 18);
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
  if (!chart.ready.value || !normalizedSegments.value.length) return;

  chart.startLoop(props.effectDuration, frame => {
    effectPhase.value = frame.phase;
    chart.scheduleRender(1);
  });
}

watch(
  () => [
    props.value,
    props.max,
    props.segments,
    props.height,
    props.strokeWidth,
    props.padding,
    props.showTrack,
    props.title,
    props.subtitle,
    props.showCenter,
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
  () => [chart.ready.value, normalizedSegments.value.length] as const,
  ([ready, length]) => {
    if (!ready || length <= 0) {
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
    <canvas :id="canvasId" class="lk-chart-ring__canvas" type="2d" :canvas-id="canvasId" />
  </view>
</template>

<style lang="scss">
@use './lk-chart-ring.scss';
</style>
