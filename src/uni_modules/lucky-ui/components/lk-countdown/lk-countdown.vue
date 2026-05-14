<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { countdownEmits, countdownProps, type CountdownTimeData } from './countdown.props';
import { useLocale } from '../../composables/useLocale';

defineOptions({ name: 'LkCountdown' });

const props = defineProps(countdownProps);
const emit = defineEmits(countdownEmits);
const { t } = useLocale('countdown');

type SegmentKind = 'value' | 'separator' | 'unit';

interface Segment {
  key: string;
  kind: SegmentKind;
  value: string;
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

let timer: ReturnType<typeof setTimeout> | null = null;
let deadline = 0;
let expectedTime = 0;

const remaining = ref(0);
const running = ref(false);
const finished = ref(false);

const classes = computed(() => [
  'lk-countdown',
  `lk-countdown--${props.variant}`,
  `lk-countdown--${props.size}`,
  `lk-countdown--${props.type}`,
  {
    'is-running': running.value,
    'is-finished': finished.value,
    'is-millisecond': props.millisecond,
  },
  props.customClass,
]);

const interval = computed(() => (props.millisecond ? 30 : SECOND));

const baseDuration = computed(() => Math.max(0, normalizeDuration()));

const timeData = computed(() => getTimeData(visibleRemaining.value));

const visibleRemaining = computed(() => {
  if (props.showZero) return remaining.value;
  return finished.value ? 0 : remaining.value;
});

const formattedText = computed(() => {
  const formatted = props.formatter?.(timeData.value);
  return formatted !== undefined && formatted !== null
    ? String(formatted)
    : formatTime(props.format, timeData.value);
});

const segments = computed<Segment[]>(() => parseSegments(formattedText.value));

watch(
  () => [props.time, props.targetTime],
  () => {
    reset(props.autoStart);
  }
);

watch(
  () => props.millisecond,
  () => {
    if (!running.value) return;
    clearTimer();
    expectedTime = Date.now() + interval.value;
    timer = setTimeout(tick, interval.value);
  }
);

onMounted(() => {
  reset(props.autoStart);
});

onUnmounted(() => {
  clearTimer();
});

function normalizeDuration() {
  if (props.targetTime !== '') {
    const timestamp = normalizeTargetTime(props.targetTime);
    return timestamp ? timestamp - Date.now() : 0;
  }
  return props.time;
}

function normalizeTargetTime(value: string | number) {
  if (typeof value === 'number') {
    return value < 1e12 ? value * 1000 : value;
  }
  const trimmed = value.trim();
  if (!trimmed) return 0;
  const numeric = Number(trimmed);
  if (Number.isFinite(numeric)) {
    return numeric < 1e12 ? numeric * 1000 : numeric;
  }
  const parsed = new Date(trimmed.replace(/-/g, '/')).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

function getTimeData(total: number): CountdownTimeData {
  const safeTotal = Math.max(0, total);
  const hasDayToken = /D{1,2}/.test(props.format);
  const days = Math.floor(safeTotal / DAY);
  const hours = hasDayToken ? Math.floor((safeTotal % DAY) / HOUR) : Math.floor(safeTotal / HOUR);
  const minutes = Math.floor((safeTotal % HOUR) / MINUTE);
  const seconds = Math.floor((safeTotal % MINUTE) / SECOND);
  const milliseconds = Math.floor(safeTotal % SECOND);
  return {
    total: safeTotal,
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
  };
}

function formatTime(format: string, data: CountdownTimeData) {
  let output = format || 'HH:mm:ss';
  if (props.trimZeroDay && data.days <= 0) {
    output = output
      .replace(/D{1,2}\s*天\s*/, '')
      .replace(/D{1,2}\s*d\s*/i, '')
      .replace(/D{1,2}\s*[:：-]\s*/, '');
  }
  const values: Record<string, string> = {
    DD: pad(data.days, 2),
    D: String(data.days),
    HH: pad(data.hours, 2),
    H: String(data.hours),
    mm: pad(data.minutes, 2),
    m: String(data.minutes),
    ss: pad(data.seconds, 2),
    s: String(data.seconds),
    SSS: pad(data.milliseconds, 3),
    SS: pad(Math.floor(data.milliseconds / 10), 2),
    S: String(Math.floor(data.milliseconds / 100)),
  };
  return output.replace(/DD|D|HH|H|mm|m|ss|s|SSS|SS|S/g, token => values[token] ?? token);
}

function pad(value: number, length: number) {
  if (!props.padZero) return String(value);
  return String(value).padStart(length, '0');
}

function parseSegments(text: string) {
  const unitMap = {
    day: props.unitMap.day || t('day'),
    hour: props.unitMap.hour || t('hour'),
    minute: props.unitMap.minute || t('minute'),
    second: props.unitMap.second || t('second'),
    millisecond: props.unitMap.millisecond || t('millisecond'),
  };
  const unitValues = Object.values(unitMap).filter((item): item is string => !!item);
  const source = text || '0';
  const result: Segment[] = [];
  let index = 0;

  while (index < source.length) {
    const unit = unitValues.find(item => source.slice(index).startsWith(item));
    if (unit) {
      result.push({ key: `unit-${index}`, kind: 'unit', value: unit });
      index += unit.length;
      continue;
    }

    const char = source[index];
    result.push({
      key: `${/\d/.test(char) ? 'value' : 'separator'}-${index}`,
      kind: /\d/.test(char) ? 'value' : 'separator',
      value: char,
    });
    index += 1;
  }

  return result;
}

function tick() {
  const next = Math.max(0, deadline - Date.now());
  remaining.value = next;
  emit('change', getTimeData(next));

  if (next <= 0) {
    finish();
    return;
  }

  const now = Date.now();
  const drift = Math.max(0, now - expectedTime);
  expectedTime = now + interval.value;
  timer = setTimeout(tick, Math.max(16, interval.value - drift));
}

function start() {
  if (running.value || remaining.value <= 0) return;
  clearTimer();
  running.value = true;
  finished.value = false;
  deadline = Date.now() + remaining.value;
  expectedTime = Date.now() + interval.value;
  emit('start');
  timer = setTimeout(tick, interval.value);
}

function pause() {
  if (!running.value) return;
  remaining.value = Math.max(0, deadline - Date.now());
  running.value = false;
  clearTimer();
  emit('pause', remaining.value);
}

function reset(autoStart = props.autoStart) {
  clearTimer();
  running.value = false;
  finished.value = false;
  remaining.value = baseDuration.value;
  emit('reset', remaining.value);
  emit('change', getTimeData(remaining.value));
  if (autoStart && remaining.value > 0) start();
  if (remaining.value <= 0) finished.value = true;
}

function finish() {
  clearTimer();
  running.value = false;
  finished.value = true;
  remaining.value = 0;
  emit('finish');
}

function clearTimer() {
  if (!timer) return;
  clearTimeout(timer);
  timer = null;
}

defineExpose({
  start,
  pause,
  reset,
  getTimeData: () => timeData.value,
  getRemaining: () => remaining.value,
});
</script>

<template>
  <view :id="props.id" :class="classes" :style="props.customStyle as any">
    <slot :time-data="timeData" :formatted="formattedText" :remaining="remaining">
      <text v-if="props.prefix" class="lk-countdown__affix lk-countdown__prefix">
        {{ props.prefix }}
      </text>
      <view class="lk-countdown__body">
        <text
          v-for="segment in segments"
          :key="segment.key"
          class="lk-countdown__segment"
          :class="`lk-countdown__segment--${segment.kind}`"
        >
          {{ segment.value }}
        </text>
      </view>
      <text v-if="props.suffix" class="lk-countdown__affix lk-countdown__suffix">
        {{ props.suffix }}
      </text>
    </slot>
  </view>
</template>

<style lang="scss">
@use './lk-countdown.scss';
</style>
