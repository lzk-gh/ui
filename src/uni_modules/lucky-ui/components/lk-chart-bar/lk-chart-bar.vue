<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue';
import { useChartCanvas } from '../../composables/useChartCanvas';
import {
  buildBrandPalette,
  resolveBrandBaseColor,
  mixRgb,
  hexToRgb,
  rgbaFromHex,
} from '../../utils/chart-colors';
import { chartBarProps, chartBarEmits, type BarChartItem } from './chart-bar.props';

defineOptions({ name: 'LkChartBar' });

const props = defineProps(chartBarProps);
const emit = defineEmits(chartBarEmits);

let uidSeed = 0;
function uid(prefix: string) {
  uidSeed += 1;
  return `${prefix}-${Date.now()}-${uidSeed}`;
}

const wrapperId = computed(() => props.id || uid('lk-chart-bar'));
const canvasId = computed(() => `${wrapperId.value}__canvas`);

const heightStyle = computed(() => {
  const h = props.height;
  if (typeof h === 'number') return `${h}rpx`;
  if (typeof h === 'string' && /^\d+$/.test(h)) return `${h}rpx`;
  return String(h);
});

const hoverIndex = ref<number>(-1);
const pulse = ref(0);

let autoTimer: number | undefined;

function clampIndex(i: number, len: number) {
  if (len <= 0) return -1;
  return Math.max(0, Math.min(len - 1, i));
}

function getEffectiveIndex(len: number) {
  if (!props.tooltip) return -1;
  const hasHover = hoverIndex.value >= 0 && hoverIndex.value < len;
  if (hasHover) return hoverIndex.value;
  if (props.autoTooltip || props.tooltipAlways) return clampIndex(props.defaultIndex, len);
  return -1;
}

function triggerPulse() {
  if (!props.highlightPulse) return;
  chart.animateTo(
    280,
    p => {
      // 0..1..0
      pulse.value = Math.sin(p * Math.PI);
      chart.scheduleRender(1);
    },
    () => {
      pulse.value = 0;
    }
  );
}

const chart = useChartCanvas({
  wrapperId: wrapperId.value,
  canvasId: canvasId.value,
  autoSize: true,
});

function roundedTopRectPath(ctx: any, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.max(0, Math.min(r, w / 2, h));
  const right = x + w;
  const bottom = y + h;

  ctx.beginPath();
  ctx.moveTo(x, bottom);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.lineTo(right - radius, y);
  ctx.arcTo(right, y, right, y + radius, radius);
  ctx.lineTo(right, bottom);
  ctx.closePath();
}

function resolveItemColor(
  item: BarChartItem,
  index: number,
  palette: ReturnType<typeof buildBrandPalette>
) {
  if (item.color) return item.color;
  const candidates = [
    palette.brand600,
    palette.brand500,
    palette.brand700,
    palette.brand400,
    palette.brand800,
  ];
  return candidates[index % candidates.length];
}

function buildGradient(ctx: any, x: number, y: number, h: number, baseHex: string) {
  const base = hexToRgb(baseHex) ?? { r: 105, g: 101, b: 219 };
  const top = mixRgb({ r: 255, g: 255, b: 255 }, base, 0.35);
  const g = ctx.createLinearGradient(x, y, x, y + Math.max(1, h));
  g.addColorStop(0, `rgb(${Math.round(top.r)}, ${Math.round(top.g)}, ${Math.round(top.b)})`);
  g.addColorStop(1, baseHex);
  return g;
}

function drawTooltip(
  ctx: any,
  x: number,
  y: number,
  text: string,
  palette: ReturnType<typeof buildBrandPalette>
) {
  const padX = 8;
  ctx.save();
  ctx.font = '12px sans-serif';
  const metrics = ctx.measureText(text);
  const w = Math.max(24, metrics.width + padX * 2);
  const h = 22;

  let tx = x - w / 2;
  let ty = y - h - 10;
  tx = Math.max(6, Math.min(tx, chart.size.value.width - w - 6));
  ty = Math.max(6, ty);

  const bg = rgbaFromHex(palette.brand800, 0.9);
  ctx.fillStyle = bg;

  const r = 8;
  ctx.beginPath();
  ctx.moveTo(tx + r, ty);
  ctx.arcTo(tx + w, ty, tx + w, ty + h, r);
  ctx.arcTo(tx + w, ty + h, tx, ty + h, r);
  ctx.arcTo(tx, ty + h, tx, ty, r);
  ctx.arcTo(tx, ty, tx + w, ty, r);
  ctx.closePath();
  ctx.fill();

  // 小尖角
  ctx.beginPath();
  ctx.moveTo(x, ty + h);
  ctx.lineTo(x - 6, ty + h + 6);
  ctx.lineTo(x + 6, ty + h + 6);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, tx + padX, ty + h / 2);
  ctx.restore();
}

chart.setRenderer((info, progress) => {
  const { ctx, size } = info;
  const d = props.data || [];
  const pad = info.px(props.padding);
  const radius = info.px(props.barRadius);

  const palette = buildBrandPalette(resolveBrandBaseColor());

  const xLabelH = props.showXAxisLabel ? 18 : 0;
  const yLabelW = props.showAxis ? 36 : 0;
  const innerW = Math.max(0, size.width - pad * 2 - yLabelW);
  const innerH = Math.max(0, size.height - pad * 2 - xLabelH);

  if (!d.length || innerW <= 0 || innerH <= 0) return;

  const values = d.map(i => (Number.isFinite(i.value) ? Math.max(0, i.value) : 0));
  const maxV = Math.max(1, ...values);

  const plotLeft = pad + yLabelW;
  const plotTop = pad;
  const plotBottom = pad + innerH;
  const step = innerW / d.length;
  const maxBarW = info.px(props.maxBarWidth);
  const autoBarW = step * 0.62;
  const barW = Math.max(2, Math.min(autoBarW, maxBarW > 0 ? maxBarW : autoBarW));

  // axis/grid
  ctx.save();
  ctx.font = '10px sans-serif';
  ctx.textBaseline = 'middle';
  if (props.showAxis) {
    const ticks = Math.max(2, props.yAxisTicks);
    for (let t = 0; t <= ticks; t += 1) {
      const y = plotBottom - (innerH * t) / ticks;
      ctx.strokeStyle = rgbaFromHex(palette.brand800, 0.08);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(plotLeft, y + 0.5);
      ctx.lineTo(plotLeft + innerW, y + 0.5);
      ctx.stroke();

      const val = (maxV * t) / ticks;
      ctx.fillStyle = rgbaFromHex(palette.brand800, 0.55);
      ctx.textAlign = 'right';
      ctx.fillText(String(Math.round(val)), plotLeft - 6, y);
    }
    // y axis
    ctx.strokeStyle = rgbaFromHex(palette.brand800, 0.15);
    ctx.beginPath();
    ctx.moveTo(plotLeft + 0.5, plotTop);
    ctx.lineTo(plotLeft + 0.5, plotBottom);
    ctx.stroke();
  }
  // x axis baseline
  ctx.strokeStyle = rgbaFromHex(palette.brand800, 0.15);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(plotLeft, plotBottom + 0.5);
  ctx.lineTo(plotLeft + innerW, plotBottom + 0.5);
  ctx.stroke();
  ctx.restore();

  const effectiveIndex = getEffectiveIndex(d.length);

  for (let i = 0; i < d.length; i += 1) {
    const v = values[i] * progress;
    const h = (v / maxV) * innerH;
    const x = plotLeft + i * step + (step - barW) / 2;
    const y = plotTop + (innerH - h);

    const baseHex = resolveItemColor(d[i], i, palette);
    const fill = props.gradient ? buildGradient(ctx, x, y, h, baseHex) : baseHex;

    ctx.save();
    ctx.fillStyle = fill;
    if (props.tooltip && effectiveIndex === i) {
      ctx.globalAlpha = 1;
    } else {
      ctx.globalAlpha = 0.92;
    }
    roundedTopRectPath(ctx, x, y, barW, h, radius);
    ctx.fill();

    if (props.tooltip && effectiveIndex === i) {
      ctx.globalAlpha = 1;
      ctx.strokeStyle = rgbaFromHex(palette.brand800, 0.25 + 0.25 * pulse.value);
      ctx.lineWidth = 2 + 2 * pulse.value;
      roundedTopRectPath(ctx, x, y, barW, h, radius);
      ctx.stroke();
    }
    ctx.restore();

    // tooltip
    if (props.tooltip && effectiveIndex === i) {
      const label = d[i].label ? String(d[i].label) : '';
      const text = label ? `${label}: ${values[i]}` : String(values[i]);
      drawTooltip(ctx, x + barW / 2, y, text, palette);
    }

    if (props.showXAxisLabel && i % Math.max(1, Math.ceil(d.length / 6)) === 0) {
      const label = d[i].label ? String(d[i].label) : '';
      if (label) {
        ctx.save();
        ctx.font = '10px sans-serif';
        ctx.fillStyle = rgbaFromHex(palette.brand800, 0.55);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(label, x + barW / 2, plotBottom + 6);
        ctx.restore();
      }
    }
  }
});

function triggerIntro() {
  chart.animateTo(props.animationDuration, p => {
    chart.scheduleRender(p);
  });
}

function refresh() {
  if (!chart.ready.value) return;
  chart.scheduleRender(1);
}

watch(
  () => props.data,
  () => {
    if (!chart.ready.value) return;
    hoverIndex.value =
      props.tooltipAlways || props.autoTooltip
        ? clampIndex(props.defaultIndex, (props.data || []).length)
        : -1;
    triggerIntro();
  },
  { deep: true }
);

watch(
  () =>
    [
      props.autoTooltip,
      props.autoTooltipInterval,
      props.tooltipAlways,
      props.defaultIndex,
      (props.data || []).length,
    ] as const,
  () => {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = undefined;
    }
    const len = (props.data || []).length;
    if (!props.tooltip || len <= 0) return;

    if (props.autoTooltip) {
      hoverIndex.value = clampIndex(props.defaultIndex, len);
      autoTimer = setInterval(
        () => {
          if (!chart.ready.value) return;
          const next = (clampIndex(hoverIndex.value, len) + 1) % len;
          hoverIndex.value = next;
          emit('hoverChange', next);
          triggerPulse();
          refresh();
        },
        Math.max(300, props.autoTooltipInterval)
      ) as unknown as number;
      return;
    }

    if (props.tooltipAlways) {
      hoverIndex.value = clampIndex(props.defaultIndex, len);
      refresh();
    }
  },
  { immediate: true }
);

watch(
  () => chart.ready.value,
  v => {
    if (v) triggerIntro();
  }
);

function onMove(e: unknown) {
  if (!props.tooltip) return;
  const p = chart.getRelativePoint(e);
  if (!p) return;
  const d = props.data || [];
  if (!d.length) return;

  const pad = chart.px(props.padding);
  const yLabelW = props.showAxis ? 36 : 0;
  const innerW = Math.max(0, chart.size.value.width - pad * 2 - yLabelW);
  if (innerW <= 0) return;

  const plotLeft = pad + yLabelW;
  const step = innerW / d.length;
  const idx = Math.max(0, Math.min(d.length - 1, Math.floor((p.x - plotLeft) / step)));
  if (hoverIndex.value !== idx) {
    hoverIndex.value = idx;
    emit('hoverChange', idx);
    triggerPulse();
  }
  refresh();
}

function onEnd() {
  if (!props.tooltip) return;
  const len = (props.data || []).length;
  const keep = props.tooltipAlways || props.autoTooltip;
  const next = keep ? clampIndex(props.defaultIndex, len) : -1;
  if (hoverIndex.value !== next) {
    hoverIndex.value = next;
    emit('hoverChange', next);
    refresh();
  }
}

onUnmounted(() => {
  if (autoTimer) {
    clearInterval(autoTimer);
    autoTimer = undefined;
  }
});
</script>

<template>
  <view
    :id="wrapperId"
    class="lk-chart"
    :class="props.customClass"
    :style="[{ height: heightStyle }, props.customStyle]"
    @touchstart="onMove"
    @touchmove="onMove"
    @touchend="onEnd"
    @touchcancel="onEnd"
    @mousemove="onMove"
    @mouseleave="onEnd"
  >
    <canvas :id="canvasId" :canvas-id="canvasId" type="2d" class="lk-chart__canvas" />
  </view>
</template>

<style lang="scss">
.lk-chart {
  width: 100%;
  position: relative;
}
.lk-chart__canvas {
  width: 100%;
  height: 100%;
}
</style>
