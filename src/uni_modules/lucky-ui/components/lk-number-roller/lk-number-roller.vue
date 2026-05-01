<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { numberRollerProps } from './number-roller.props';

defineOptions({ name: 'LkNumberRoller' });

const props = defineProps(numberRollerProps);

const digitsPool = Object.freeze(Array.from({ length: 10 }, (_, i) => i));

interface DigitSegment {
  key: string;
  type: 'digit';
  digit: number;
}

interface SymbolSegment {
  key: string;
  type: 'symbol';
  symbol: string;
}

type Segment = DigitSegment | SymbolSegment;

const classes = computed(() => ['lk-number-roller', props.customClass]);

const rollerStyle = computed(() => ({
  '--lk-number-roller-speed': props.autoplay ? `${Math.max(props.speed, 16)}ms` : '0ms',
  '--lk-number-roller-easing': props.easing,
  '--lk-number-roller-digit-height': `${props.digitHeight}rpx`,
}));

function trackStyle(digit: number) {
  return {
    transform: `translate3d(0, calc(${digit} * -1 * var(--lk-number-roller-digit-height)), 0)`,
  };
}

const formattedText = computed(() => normalizeValue(props.value));

const segments = computed<Segment[]>(() => buildSegments(formattedText.value));

const animatedDigitByKey = ref<Record<string, number>>({});

const renderSegments = computed<Segment[]>(() => {
  if (!props.autoplay) return segments.value;
  return segments.value.map(seg => {
    if (seg.type !== 'digit') return seg;
    const current = animatedDigitByKey.value[seg.key];
    return {
      ...seg,
      digit: typeof current === 'number' ? current : seg.digit,
    } as Segment;
  });
});

function primeAndAnimateDigits() {
  if (!props.autoplay) return;
  const next: Record<string, number> = { ...animatedDigitByKey.value };
  let hasNewKey = false;
  for (const seg of segments.value) {
    if (seg.type !== 'digit') continue;
    if (!(seg.key in next)) {
      next[seg.key] = 0;
      hasNewKey = true;
    }
  }
  if (hasNewKey) animatedDigitByKey.value = next;
  nextTick(() => {
    const updated: Record<string, number> = { ...animatedDigitByKey.value };
    for (const seg of segments.value) {
      if (seg.type !== 'digit') continue;
      updated[seg.key] = seg.digit;
    }
    animatedDigitByKey.value = updated;
  });
}

onMounted(() => {
  primeAndAnimateDigits();
});

watch(
  () => segments.value,
  () => {
    primeAndAnimateDigits();
  }
);

function normalizeValue(value: number | string): string {
  const formatted = props.formatter?.(value);
  if (formatted !== undefined && formatted !== null) {
    const custom = String(formatted).trim();
    return custom || '0';
  }

  if (typeof value === 'number') {
    return formatNumeric(value, String(value));
  }

  const raw = String(value ?? '').trim();
  if (!raw) return '0';

  if (/^-?\d+(\.\d+)?$/.test(raw)) {
    return formatNumeric(Number(raw), raw);
  }

  return raw;
}

function formatNumeric(num: number, raw: string): string {
  const decimals =
    typeof props.decimals === 'number' && props.decimals >= 0
      ? props.decimals
      : extractDecimalLength(raw);
  const normalized = decimals !== null ? num.toFixed(decimals) : raw;
  return injectSeparators(normalized);
}

function extractDecimalLength(text: string): number | null {
  if (!text.includes('.')) return null;
  const decimal = text.split('.')[1];
  return decimal && decimal.length > 0 ? decimal.length : null;
}

function injectSeparators(input: string): string {
  const [intRaw, decimalRaw = ''] = input.split('.');
  const sign = intRaw.startsWith('-') ? '-' : '';
  const absoluteInt = sign ? intRaw.slice(1) : intRaw;
  const groupedInt = props.grouping
    ? absoluteInt.replace(/\B(?=(\d{3})+(?!\d))/g, props.groupSeparator)
    : absoluteInt;
  const decimalPart = decimalRaw ? `${props.decimalSeparator}${decimalRaw}` : '';
  const result = `${sign}${groupedInt}${decimalPart}`;
  return result || '0';
}

function buildSegments(value: string): Segment[] {
  const source = value || '0';
  return source.split('').map((char, index) => {
    if (/^\d$/.test(char)) {
      return { key: `digit-${index}`, type: 'digit', digit: Number(char) } as Segment;
    }
    return { key: `symbol-${index}-${char}`, type: 'symbol', symbol: char } as Segment;
  });
}
</script>

<template>
  <view :class="classes" :style="[rollerStyle, props.customStyle as any]">
    <template v-for="segment in renderSegments" :key="segment.key">
      <view v-if="segment.type === 'digit'" class="lk-number-roller__segment">
        <view class="lk-number-roller__window">
          <view
            class="lk-number-roller__track"
            :style="trackStyle(segment.digit)"
          >
            <text v-for="digit in digitsPool" :key="digit" class="lk-number-roller__digit">{{
              digit
            }}</text>
          </view>
        </view>
      </view>
      <text v-else class="lk-number-roller__symbol">{{ segment.symbol }}</text>
    </template>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
