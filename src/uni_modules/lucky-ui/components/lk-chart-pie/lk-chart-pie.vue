<script setup lang="ts">
import type { StyleValue } from 'vue';
import { computed, ref, watch, onUnmounted } from 'vue';
import { useChartCanvas } from '../../composables/useChartCanvas';
import { buildBrandPalette, resolveBrandBaseColor, rgbaFromHex } from '../../utils/chart-colors';
import { chartPieProps, chartPieEmits, type PieChartSlice } from './chart-pie.props';

defineOptions({ name: 'LkChartPie' });

const props = defineProps(chartPieProps);
const emit = defineEmits(chartPieEmits);

let uidSeed = 0;
function uid(prefix: string) {
  uidSeed += 1;
  return `${prefix}-${Date.now()}-${uidSeed}`;
}

const wrapperId = computed(() => props.id || uid('lk-chart-pie'));
const canvasId = computed(() => `${wrapperId.value}__canvas`);

const heightStyle = computed(() => {
  const h = props.height;
  if (typeof h === 'number') return `${h}rpx`;
  if (typeof h === 'string' && /^\d+$/.test(h)) return `${h}rpx`;
  return String(h);
});

const hoverIndex = ref(-1);
const pulse = ref(0);
const tooltipState = ref({ visible: false, x: 0, y: 0, width: 0, arrowX: 0, text: '' });

let autoTimer: number | undefined;

function clampIndex(i: number, len: number) {
  if (len <= 0) return -1;
  return Math.max(0, Math.min(len - 1, i));
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

const chart = useChartCanvas({
  wrapperId: wrapperId.value,
  canvasId: canvasId.value,
  autoSize: true,
});

const tooltipStyle = computed<StyleValue>(() => ({
  left: `${tooltipState.value.x}px`,
  top: `${tooltipState.value.y}px`,
  width: `${tooltipState.value.width}px`,
  '--lk-chart-tooltip-arrow-x': `${tooltipState.value.arrowX}px`,
}));

function showTooltip(x: number, y: number, text: string, textWidth = text.length * 7) {
  const gap = chart.px(12);
  const minWidth = chart.px(48);
  const maxWidth = Math.max(minWidth, Math.min(chart.px(320), chart.size.value.width - gap * 2));
  const width = Math.min(maxWidth, Math.max(minWidth, textWidth + chart.px(32)));
  const maxLeft = Math.max(gap, chart.size.value.width - width - gap);
  const left = Math.max(gap, Math.min(x - width / 2, maxLeft));
  const arrowX = Math.max(chart.px(12), Math.min(x - left, width - chart.px(12)));
  const current = tooltipState.value;
  if (
    current.visible &&
    current.x === left &&
    current.y === y &&
    current.width === width &&
    current.arrowX === arrowX &&
    current.text === text
  ) {
    return;
  }
  tooltipState.value = { visible: true, x: left, y, width, arrowX, text };
}

function hideTooltip() {
  if (!tooltipState.value.visible) return;
  tooltipState.value = { visible: false, x: 0, y: 0, width: 0, arrowX: 0, text: '' };
}

function resolveSliceColor(
  slice: PieChartSlice,
  index: number,
  palette: ReturnType<typeof buildBrandPalette>
) {
  if (slice.color) return slice.color;
  const candidates = [
    palette.brand600,
    palette.brand500,
    palette.brand700,
    palette.brand400,
    palette.brand800,
  ];
  return candidates[index % candidates.length];
}

chart.setRenderer((info, progress) => {
  const { ctx, size } = info;
  const d = (props.data || []).filter(i => Number.isFinite(i.value) && i.value > 0);
  const pad = info.px(props.padding);

  const palette = buildBrandPalette(resolveBrandBaseColor());

  const w = size.width;
  const h = size.height;
  const cx = w / 2;
  const cy = h / 2;

  const radius = Math.max(0, Math.min(w, h) / 2 - pad);
  if (!d.length || radius <= 0) {
    hideTooltip();
    return;
  }

  const total = d.reduce((s, it) => s + it.value, 0);
  if (total <= 0) {
    hideTooltip();
    return;
  }

  const startBase = -Math.PI / 2;
  let start = startBase;

  // effective hover for always/auto
  const hasHover = hoverIndex.value >= 0 && hoverIndex.value < d.length;
  const effectiveIndex = props.tooltip
    ? hasHover
      ? hoverIndex.value
      : props.tooltipAlways || props.autoTooltip
        ? clampIndex(props.defaultIndex, d.length)
        : -1
    : -1;

  if (props.donut) {
    const thickness = Math.max(2, info.px(props.donutWidth));
    ctx.save();
    ctx.lineWidth = thickness;
    ctx.lineCap = 'round';

    if (props.showTrack) {
      ctx.strokeStyle = rgbaFromHex(palette.brand800, 0.08);
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(1, radius - thickness / 2), 0, Math.PI * 2);
      ctx.stroke();
    }

    for (let i = 0; i < d.length; i += 1) {
      const slice = d[i];
      const sweep = (slice.value / total) * Math.PI * 2;
      const end = start + sweep * progress;
      const color = resolveSliceColor(slice, i, palette);

      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(1, radius - thickness / 2), start, end);
      ctx.stroke();

      // hover highlight
      if (props.tooltip && effectiveIndex === i) {
        ctx.strokeStyle = rgbaFromHex(palette.brand800, 0.18 + 0.22 * pulse.value);
        ctx.lineWidth = thickness + 4 + 4 * pulse.value;
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(1, radius - thickness / 2), start, end);
        ctx.stroke();
        ctx.lineWidth = thickness;
      }

      start += sweep;
    }

    ctx.restore();
  } else {
    for (let i = 0; i < d.length; i += 1) {
      const slice = d[i];
      const sweep = (slice.value / total) * Math.PI * 2;
      const end = start + sweep * progress;
      const color = resolveSliceColor(slice, i, palette);

      ctx.save();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, start, end);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      start += sweep;
    }
  }

  // center info (avoid “just a ring”)
  if (props.showCenterText) {
    const title = props.centerTitle || 'Total';
    const active = effectiveIndex >= 0 ? d[effectiveIndex] : null;
    const activeLabel = active?.label ? String(active.label) : '';
    const activePercent = active ? Math.round((active.value / total) * 1000) / 10 : null;

    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = rgbaFromHex(palette.brand800, 0.6);
    ctx.font = '12px sans-serif';
    ctx.textBaseline = 'bottom';
    ctx.fillText(activeLabel || title, cx, cy - 2);

    ctx.fillStyle = rgbaFromHex(palette.brand800, 0.92);
    ctx.font = `bold 18px sans-serif`;
    ctx.textBaseline = 'top';
    const main =
      activePercent != null ? `${activePercent}%` : String(Math.round(total * 100) / 100);
    ctx.fillText(main, cx, cy + 2);
    ctx.restore();
  }

  // tooltip
  if (props.tooltip && effectiveIndex >= 0 && effectiveIndex < d.length) {
    const slice = d[effectiveIndex];
    const percent = Math.round((slice.value / total) * 1000) / 10;
    const label = slice.label ? String(slice.label) : '';
    const text = label ? `${label}: ${percent}%` : `${percent}%`;
    showTooltip(cx, cy - radius * 0.6, text, ctx.measureText(text).width);
  } else {
    hideTooltip();
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
    const len = (props.data || []).filter(i => Number.isFinite(i.value) && i.value > 0).length;
    if (!props.tooltip || len <= 0) return;

    if (props.autoTooltip) {
      hoverIndex.value = clampIndex(props.defaultIndex, len);
      autoTimer = setInterval(
        () => {
          if (!chart.ready.value) return;
          const next =
            (clampIndex(hoverIndex.value < 0 ? props.defaultIndex : hoverIndex.value, len) + 1) %
            len;
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

  const w = chart.size.value.width;
  const h = chart.size.value.height;
  const cx = w / 2;
  const cy = h / 2;

  const dx = p.x - cx;
  const dy = p.y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  const pad = chart.px(props.padding);
  const radius = Math.max(0, Math.min(w, h) / 2 - pad);
  if (radius <= 0) return;

  if (props.donut) {
    const thickness = Math.max(2, chart.px(props.donutWidth));
    const rOuter = radius;
    const rInner = Math.max(0, radius - thickness);
    if (dist < rInner || dist > rOuter) {
      if (hoverIndex.value !== -1) {
        hoverIndex.value = -1;
        emit('hoverChange', -1);
        refresh();
      }
      return;
    }
  } else {
    if (dist > radius) {
      if (hoverIndex.value !== -1) {
        hoverIndex.value = -1;
        emit('hoverChange', -1);
        refresh();
      }
      return;
    }
  }

  let angle = Math.atan2(dy, dx);
  // 转换到以 -PI/2 为起点、顺时针累加的角度
  angle -= -Math.PI / 2;
  if (angle < 0) angle += Math.PI * 2;

  const d = (props.data || []).filter(i => Number.isFinite(i.value) && i.value > 0);
  const total = d.reduce((s, it) => s + it.value, 0);
  if (!d.length || total <= 0) return;

  let acc = 0;
  let idx = -1;
  for (let i = 0; i < d.length; i += 1) {
    const sweep = (d[i].value / total) * Math.PI * 2;
    if (angle >= acc && angle < acc + sweep) {
      idx = i;
      break;
    }
    acc += sweep;
  }

  if (idx !== -1 && hoverIndex.value !== idx) {
    hoverIndex.value = idx;
    emit('hoverChange', idx);
    triggerPulse();
    refresh();
  }
}

function onEnd() {
  if (!props.tooltip) return;
  const len = (props.data || []).filter(i => Number.isFinite(i.value) && i.value > 0).length;
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
    :style="[{ height: heightStyle }, props.customStyle as any]"
    @touchstart="onMove"
    @touchmove="onMove"
    @touchend="onEnd"
    @touchcancel="onEnd"
    @mousemove="onMove"
    @mouseleave="onEnd"
  >
    <canvas :id="canvasId" :canvas-id="canvasId" type="2d" class="lk-chart__canvas" />
    <view v-if="tooltipState.visible" class="lk-chart__tooltip" :style="tooltipStyle">
      {{ tooltipState.text }}
    </view>
  </view>
</template>

<style lang="scss">
.lk-chart {
  width: 100%;
  position: relative;
  overflow: visible;
  z-index: var(--lk-z-index-tooltip);
}
.lk-chart__canvas {
  width: 100%;
  height: 100%;
  display: block;
}
.lk-chart__tooltip {
  position: absolute;
  max-width: var(--lk-rpx-320);
  padding: var(--lk-rpx-8) var(--lk-rpx-16);
  color: var(--lk-chart-tooltip-color, var(--lk-color-text-inverse));
  background: var(--lk-chart-tooltip-bg, var(--lk-color-text));
  border-radius: var(--lk-radius-sm);
  font-size: var(--lk-font-size-xs);
  line-height: var(--lk-line-height-tight);
  white-space: nowrap;
  pointer-events: none;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  transform: translateY(-100%) translateY(calc(var(--lk-rpx-10) * -1));
  z-index: var(--lk-z-index-tooltip);
  box-shadow: var(--lk-shadow-sm);
}
.lk-chart__tooltip::after {
  content: '';
  position: absolute;
  left: var(--lk-chart-tooltip-arrow-x, 50%);
  bottom: calc(var(--lk-rpx-6) * -1);
  width: var(--lk-rpx-12);
  height: var(--lk-rpx-12);
  background: inherit;
  transform: translateX(-50%) rotate(45deg);
}
</style>
