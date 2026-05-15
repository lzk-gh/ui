<script setup lang="ts">
import type { StyleValue } from 'vue';
import { computed, ref, watch, onUnmounted } from 'vue';
import { useChartCanvas } from '../../composables/useChartCanvas';
import type { MaybeCanvas2DContext } from '../../composables/useChartCanvas';
import {
  buildBrandPalette,
  resolveBrandBaseColor,
  mixRgb,
  hexToRgb,
  rgbaFromHex,
} from '../../utils/chart-colors';
import { chartBarProps, chartBarEmits } from './chart-bar.props';
import {
  areChartBarTooltipStatesEqual,
  CHART_BAR_EMPTY_TOOLTIP,
  clampChartBarIndex,
  getChartBarEffectiveIndex,
  getChartBarHoverIndexFromPoint,
  getChartBarMaxValue,
  getChartBarNextAutoTooltipIndex,
  getChartBarXAxisLabelInterval,
  normalizeChartBarValues,
  resolveChartBarHeightStyle,
  resolveChartBarInitialHoverIndex,
  resolveChartBarItemColor,
  resolveChartBarLayout,
  resolveChartBarRootStyle,
  resolveChartBarTooltipState,
  resolveChartBarTooltipStyle,
  resolveChartBarTooltipText,
} from './chart-bar.utils';

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

const heightStyle = computed(() => resolveChartBarHeightStyle(props.height));
const rootStyle = computed<StyleValue>(() => resolveChartBarRootStyle({
  heightStyle: heightStyle.value,
  customStyle: props.customStyle as StyleValue,
}));

const hoverIndex = ref<number>(-1);
const pulse = ref(0);
const tooltipState = ref({ ...CHART_BAR_EMPTY_TOOLTIP });

let autoTimer: number | undefined;

function getEffectiveIndex(len: number) {
  return getChartBarEffectiveIndex({
    tooltip: props.tooltip,
    hoverIndex: hoverIndex.value,
    autoTooltip: props.autoTooltip,
    tooltipAlways: props.tooltipAlways,
    defaultIndex: props.defaultIndex,
    length: len,
  });
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

function roundedTopRectPath(
  ctx: MaybeCanvas2DContext,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
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

function buildGradient(ctx: MaybeCanvas2DContext, x: number, y: number, h: number, baseHex: string) {
  const base = hexToRgb(baseHex) ?? { r: 105, g: 101, b: 219 };
  const top = mixRgb({ r: 255, g: 255, b: 255 }, base, 0.35);
  const g = ctx.createLinearGradient(x, y, x, y + Math.max(1, h));
  g.addColorStop(0, `rgb(${Math.round(top.r)}, ${Math.round(top.g)}, ${Math.round(top.b)})`);
  g.addColorStop(1, baseHex);
  return g;
}

const tooltipStyle = computed<StyleValue>(() => resolveChartBarTooltipStyle(tooltipState.value));

function showTooltip(x: number, y: number, text: string, textWidth = text.length * 7) {
  const next = resolveChartBarTooltipState({
    x,
    y,
    text,
    textWidth,
    chartWidth: chart.size.value.width,
    px: chart.px,
  });
  if (areChartBarTooltipStatesEqual(tooltipState.value, next)) return;
  tooltipState.value = next;
}

function hideTooltip() {
  if (!tooltipState.value.visible) return;
  tooltipState.value = { ...CHART_BAR_EMPTY_TOOLTIP };
}

chart.setRenderer((info, progress) => {
  const { ctx, size } = info;
  const d = props.data || [];
  const pad = info.px(props.padding);
  const radius = info.px(props.barRadius);

  const palette = buildBrandPalette(resolveBrandBaseColor());

  const layout = resolveChartBarLayout({
    width: size.width,
    height: size.height,
    padding: pad,
    showXAxisLabel: props.showXAxisLabel,
    showAxis: props.showAxis,
    length: d.length,
    maxBarWidth: info.px(props.maxBarWidth),
  });

  if (!d.length || layout.innerWidth <= 0 || layout.innerHeight <= 0) {
    hideTooltip();
    return;
  }

  const values = normalizeChartBarValues(d);
  const maxV = getChartBarMaxValue(values);

  // axis/grid
  ctx.save();
  ctx.font = '10px sans-serif';
  ctx.textBaseline = 'middle';
  if (props.showAxis) {
    const ticks = Math.max(2, props.yAxisTicks);
    for (let t = 0; t <= ticks; t += 1) {
      const y = layout.plotBottom - (layout.innerHeight * t) / ticks;
      ctx.strokeStyle = rgbaFromHex(palette.brand800, 0.08);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(layout.plotLeft, y + 0.5);
      ctx.lineTo(layout.plotLeft + layout.innerWidth, y + 0.5);
      ctx.stroke();

      const val = (maxV * t) / ticks;
      ctx.fillStyle = rgbaFromHex(palette.brand800, 0.55);
      ctx.textAlign = 'right';
      ctx.fillText(String(Math.round(val)), layout.plotLeft - 6, y);
    }
    // y axis
    ctx.strokeStyle = rgbaFromHex(palette.brand800, 0.15);
    ctx.beginPath();
    ctx.moveTo(layout.plotLeft + 0.5, layout.plotTop);
    ctx.lineTo(layout.plotLeft + 0.5, layout.plotBottom);
    ctx.stroke();
  }
  // x axis baseline
  ctx.strokeStyle = rgbaFromHex(palette.brand800, 0.15);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(layout.plotLeft, layout.plotBottom + 0.5);
  ctx.lineTo(layout.plotLeft + layout.innerWidth, layout.plotBottom + 0.5);
  ctx.stroke();
  ctx.restore();

  const effectiveIndex = getEffectiveIndex(d.length);
  let tooltipRendered = false;

  for (let i = 0; i < d.length; i += 1) {
    const v = values[i] * progress;
    const h = (v / maxV) * layout.innerHeight;
    const x = layout.plotLeft + i * layout.step + (layout.step - layout.barWidth) / 2;
    const y = layout.plotTop + (layout.innerHeight - h);

    const baseHex = resolveChartBarItemColor(d[i], i, palette);
    const fill = props.gradient ? buildGradient(ctx, x, y, h, baseHex) : baseHex;

    ctx.save();
    ctx.fillStyle = fill;
    if (props.tooltip && effectiveIndex === i) {
      ctx.globalAlpha = 1;
    } else {
      ctx.globalAlpha = 0.92;
    }
    roundedTopRectPath(ctx, x, y, layout.barWidth, h, radius);
    ctx.fill();

    if (props.tooltip && effectiveIndex === i) {
      ctx.globalAlpha = 1;
      ctx.strokeStyle = rgbaFromHex(palette.brand800, 0.25 + 0.25 * pulse.value);
      ctx.lineWidth = 2 + 2 * pulse.value;
      roundedTopRectPath(ctx, x, y, layout.barWidth, h, radius);
      ctx.stroke();
    }
    ctx.restore();

    // tooltip
    if (props.tooltip && effectiveIndex === i) {
      const text = resolveChartBarTooltipText(d[i], values[i]);
      showTooltip(x + layout.barWidth / 2, y, text, ctx.measureText(text).width);
      tooltipRendered = true;
    }

    if (props.showXAxisLabel && i % getChartBarXAxisLabelInterval(d.length) === 0) {
      const label = d[i].label ? String(d[i].label) : '';
      if (label) {
        ctx.save();
        ctx.font = '10px sans-serif';
        ctx.fillStyle = rgbaFromHex(palette.brand800, 0.55);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(label, x + layout.barWidth / 2, layout.plotBottom + 6);
        ctx.restore();
      }
    }
  }

  if (!tooltipRendered) hideTooltip();
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
    hoverIndex.value = resolveChartBarInitialHoverIndex({
      tooltipAlways: props.tooltipAlways,
      autoTooltip: props.autoTooltip,
      defaultIndex: props.defaultIndex,
      length: (props.data || []).length,
    });
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
      hoverIndex.value = clampChartBarIndex(props.defaultIndex, len);
      autoTimer = setInterval(
        () => {
          if (!chart.ready.value) return;
          const next = getChartBarNextAutoTooltipIndex({
            hoverIndex: hoverIndex.value,
            length: len,
          });
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
      hoverIndex.value = clampChartBarIndex(props.defaultIndex, len);
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
  const layout = resolveChartBarLayout({
    width: chart.size.value.width,
    height: chart.size.value.height,
    padding: pad,
    showXAxisLabel: props.showXAxisLabel,
    showAxis: props.showAxis,
    length: d.length,
    maxBarWidth: chart.px(props.maxBarWidth),
  });
  if (layout.innerWidth <= 0) return;

  const idx = getChartBarHoverIndexFromPoint({
    x: p.x,
    plotLeft: layout.plotLeft,
    step: layout.step,
    length: d.length,
  });
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
  const next = keep ? clampChartBarIndex(props.defaultIndex, len) : -1;
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
    :style="rootStyle"
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
@use './lk-chart-bar.scss';
</style>
