<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue';
import { useChartCanvas } from '../../composables/useChartCanvas';
import { buildBrandPalette, resolveBrandBaseColor, rgbaFromHex } from '../../utils/chart-colors';
import { chartLineProps, chartLineEmits, type LineChartPoint } from './chart-line.props';

defineOptions({ name: 'LkChartLine' });

const props = defineProps(chartLineProps);
const emit = defineEmits(chartLineEmits);

let uidSeed = 0;
function uid(prefix: string) {
  uidSeed += 1;
  return `${prefix}-${Date.now()}-${uidSeed}`;
}

const wrapperId = computed(() => props.id || uid('lk-chart-line'));
const canvasId = computed(() => `${wrapperId.value}__canvas`);

const heightStyle = computed(() => {
  const h = props.height;
  if (typeof h === 'number') return `${h}rpx`;
  if (typeof h === 'string' && /^\d+$/.test(h)) return `${h}rpx`;
  return String(h);
});

const hoverIndex = ref(-1);
const autoFrom = ref<number | null>(null);
const autoTo = ref<number | null>(null);
const autoT = ref(1);
const pulse = ref(0);

let autoTimer: number | undefined;

function clampIndex(i: number, len: number) {
  if (len <= 0) return -1;
  return Math.max(0, Math.min(len - 1, i));
}

function isAutoAnimating() {
  return autoFrom.value != null && autoTo.value != null && autoT.value < 1;
}

function triggerPulse() {
  if (!props.highlightPulse) return;
  chart.animateTo(
    320,
    p => {
      pulse.value = Math.sin(p * Math.PI);
      chart.scheduleRender(1);
    },
    () => {
      pulse.value = 0;
    }
  );
}

function setHover(idx: number) {
  const len = (props.data || []).length;
  const clamped = clampIndex(idx, len);
  if (clamped !== hoverIndex.value) {
    hoverIndex.value = clamped;
    emit('hoverChange', clamped);
  }
}

function animateHoverTo(nextIndex: number) {
  const len = (props.data || []).length;
  if (len <= 0) return;
  const from = clampIndex(hoverIndex.value < 0 ? props.defaultIndex : hoverIndex.value, len);
  const to = clampIndex(nextIndex, len);
  autoFrom.value = from;
  autoTo.value = to;
  autoT.value = 0;
  triggerPulse();
  chart.animateTo(
    260,
    p => {
      autoT.value = p;
      chart.scheduleRender(1);
    },
    () => {
      autoT.value = 1;
      setHover(to);
      autoFrom.value = null;
      autoTo.value = null;
    }
  );
}

const chart = useChartCanvas({
  wrapperId: wrapperId.value,
  canvasId: canvasId.value,
  autoSize: true,
});

type Pt = { x: number; y: number; v: number; label?: string };

function catmullRomToBezier(points: Pt[]) {
  // 返回每段的控制点：[{cp1x,cp1y,cp2x,cp2y,endx,endy}]
  const result: Array<{
    cp1x: number;
    cp1y: number;
    cp2x: number;
    cp2y: number;
    x: number;
    y: number;
  }> = [];
  const n = points.length;
  if (n < 2) return result;

  for (let i = 0; i < n - 1; i += 1) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(n - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    result.push({ cp1x, cp1y, cp2x, cp2y, x: p2.x, y: p2.y });
  }
  return result;
}

function drawTooltip(
  ctx: any,
  x: number,
  y: number,
  text: string,
  palette: ReturnType<typeof buildBrandPalette>
) {
  ctx.save();
  ctx.font = '12px sans-serif';
  const padX = 8;
  const padY = 6;
  const metrics = ctx.measureText(text);
  const w = Math.max(24, metrics.width + padX * 2);
  const h = 22;

  let tx = x - w / 2;
  let ty = y - h - 12;
  tx = Math.max(6, Math.min(tx, chart.size.value.width - w - 6));
  ty = Math.max(6, ty);

  ctx.fillStyle = rgbaFromHex(palette.brand800, 0.9);
  const r = 8;
  ctx.beginPath();
  ctx.moveTo(tx + r, ty);
  ctx.arcTo(tx + w, ty, tx + w, ty + h, r);
  ctx.arcTo(tx + w, ty + h, tx, ty + h, r);
  ctx.arcTo(tx, ty + h, tx, ty, r);
  ctx.arcTo(tx, ty, tx + w, ty, r);
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
  const lw = info.px(props.lineWidth);

  const palette = buildBrandPalette(resolveBrandBaseColor());

  const xLabelH = props.showXAxisLabel ? 18 : 0;
  const yLabelW = props.showAxis ? 36 : 0;
  const innerW = Math.max(0, size.width - pad * 2 - yLabelW);
  const innerH = Math.max(0, size.height - pad * 2 - xLabelH);
  if (!d.length || innerW <= 0 || innerH <= 0) return;

  const values = d.map(i => (Number.isFinite(i.value) ? i.value : 0));
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const span = Math.max(1e-6, maxV - minV);

  const plotLeft = pad + yLabelW;
  const plotTop = pad;
  const plotBottom = pad + innerH;

  const pts: Pt[] = d.map((it, i) => {
    const x = plotLeft + (innerW * i) / Math.max(1, d.length - 1);
    const v = (it.value - minV) / span;
    const y = plotTop + innerH - v * innerH * progress;
    return { x, y, v: it.value, label: it.label };
  });

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

      const val = minV + (span * t) / ticks;
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

  // optional area gradient (to x axis)
  if (props.areaGradient) {
    const segs = catmullRomToBezier(pts);
    ctx.save();
    const g = ctx.createLinearGradient(0, plotTop, 0, plotBottom);
    g.addColorStop(0, rgbaFromHex(palette.brand600, 0.22));
    g.addColorStop(1, rgbaFromHex(palette.brand600, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, plotBottom);
    ctx.lineTo(pts[0].x, pts[0].y);
    for (const s of segs) {
      ctx.bezierCurveTo(s.cp1x, s.cp1y, s.cp2x, s.cp2y, s.x, s.y);
    }
    ctx.lineTo(pts[pts.length - 1].x, plotBottom);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // line (bezier)
  ctx.save();
  if (props.gradient) {
    const lg = ctx.createLinearGradient(plotLeft, 0, plotLeft + innerW, 0);
    lg.addColorStop(0, palette.brand400);
    lg.addColorStop(0.6, palette.brand600);
    lg.addColorStop(1, palette.brand800);
    ctx.strokeStyle = lg;
  } else {
    ctx.strokeStyle = palette.brand600;
  }
  ctx.lineWidth = lw;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  const segs = catmullRomToBezier(pts);
  for (const s of segs) {
    ctx.bezierCurveTo(s.cp1x, s.cp1y, s.cp2x, s.cp2y, s.x, s.y);
  }
  ctx.stroke();
  ctx.restore();

  // points
  ctx.save();
  for (let i = 0; i < pts.length; i += 1) {
    const p = pts[i];
    const isHover = props.tooltip && hoverIndex.value === i;
    ctx.beginPath();
    ctx.fillStyle = isHover ? palette.brand800 : palette.brand600;
    ctx.arc(p.x, p.y, isHover ? 5 : 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // tooltip (touch/always/auto)
  const hasHover = hoverIndex.value >= 0 && hoverIndex.value < pts.length;
  const shouldShow =
    props.tooltip && (hasHover || props.tooltipAlways || props.autoTooltip || isAutoAnimating());

  let cursorX: number | null = null;
  let cursorY: number | null = null;
  let cursorText = '';

  if (shouldShow) {
    if (isAutoAnimating() && autoFrom.value != null && autoTo.value != null) {
      const a = pts[autoFrom.value];
      const b = pts[autoTo.value];
      cursorX = a.x + (b.x - a.x) * autoT.value;
      cursorY = a.y + (b.y - a.y) * autoT.value;
      const v = a.v + (b.v - a.v) * autoT.value;
      const label = (d[autoTo.value]?.label ? String(d[autoTo.value]?.label) : '') || '';
      cursorText = label
        ? `${label}: ${Math.round(v * 100) / 100}`
        : String(Math.round(v * 100) / 100);
    } else {
      const idx = hasHover ? hoverIndex.value : clampIndex(props.defaultIndex, pts.length);
      const p = pts[idx];
      cursorX = p.x;
      cursorY = p.y;
      const label = p.label ? String(p.label) : '';
      cursorText = label ? `${label}: ${p.v}` : String(p.v);
    }
  }

  if (shouldShow && cursorX != null && cursorY != null) {
    ctx.save();
    ctx.strokeStyle = rgbaFromHex(palette.brand800, 0.18 + 0.18 * pulse.value);
    ctx.lineWidth = 1 + 1 * pulse.value;
    ctx.beginPath();
    ctx.moveTo(cursorX + 0.5, plotTop);
    ctx.lineTo(cursorX + 0.5, plotBottom);
    ctx.stroke();
    ctx.restore();

    drawTooltip(ctx, cursorX, cursorY, cursorText, palette);
  }

  if (props.showXAxisLabel) {
    const step = innerW / Math.max(1, d.length - 1);
    const stride = Math.max(1, Math.ceil(d.length / 6));
    ctx.save();
    ctx.font = '10px sans-serif';
    ctx.fillStyle = rgbaFromHex(palette.brand800, 0.55);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let i = 0; i < d.length; i += stride) {
      const label = d[i].label ? String(d[i].label) : '';
      if (!label) continue;
      const x = plotLeft + step * i;
      ctx.fillText(label, x, plotBottom + 6);
    }
    ctx.restore();
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
          const current = clampIndex(
            hoverIndex.value < 0 ? props.defaultIndex : hoverIndex.value,
            len
          );
          const next = (current + 1) % len;
          animateHoverTo(next);
        },
        Math.max(300, props.autoTooltipInterval)
      ) as unknown as number;
      return;
    }

    if (props.tooltipAlways) {
      hoverIndex.value = clampIndex(props.defaultIndex, len);
      chart.scheduleRender(1);
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
  const step = innerW / Math.max(1, d.length - 1);
  const idx = Math.max(0, Math.min(d.length - 1, Math.round((p.x - plotLeft) / step)));
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
