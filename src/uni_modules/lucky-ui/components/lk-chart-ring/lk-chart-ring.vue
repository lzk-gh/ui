<script setup lang="ts">
import type { StyleValue } from 'vue';
import { computed, watch } from 'vue';
import { useChartCanvas } from '../../composables/useChartCanvas';
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
  return [{
    label: props.title || 'Progress',
    value: Math.max(0, Math.min(props.value, max)),
  }];
});

const centerTitle = computed(() => {
  if (props.title) return props.title;
  if (props.segments.length) {
    const total = normalizedSegments.value.reduce((sum, item) => sum + item.value, 0);
    return `${Math.round(total)}`;
  }
  const percent = Math.round((Math.max(0, Math.min(props.value, props.max)) / Math.max(1, props.max)) * 100);
  return `${percent}%`;
});

const centerSubtitle = computed(() => props.subtitle || (props.segments.length ? 'Total' : 'Completed'));

function resolveSegmentColor(segment: RingChartSegment, index: number) {
  if (segment.color) return segment.color;
  const palette = buildBrandPalette(resolveBrandBaseColor());
  const colors = [palette.brand600, palette.brand400, palette.brand700, palette.brand300];
  return colors[index % colors.length];
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

  segments.forEach((segment, index) => {
    const sweep = (segment.value / total) * Math.PI * 2 * progress;
    ctx.strokeStyle = resolveSegmentColor(segment, index);
    ctx.beginPath();
    ctx.arc(cx, cy, radius, start, start + sweep);
    ctx.stroke();
    start += (segment.value / total) * Math.PI * 2;
  });

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
  ],
  () => renderWithAnimation(),
  { deep: true }
);
</script>

<template>
  <view :id="wrapperId" :class="classes" :style="rootStyle">
    <canvas
      :id="canvasId"
      class="lk-chart-ring__canvas"
      type="2d"
      :canvas-id="canvasId"
    />
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
