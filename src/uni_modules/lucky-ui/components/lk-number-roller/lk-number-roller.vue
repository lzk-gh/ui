<script setup lang="ts">
import { computed } from 'vue';
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

const digitHeightPx = computed(() => {
  const base = props.digitHeight || 56;
  if (typeof uni !== 'undefined' && typeof uni.upx2px === 'function') {
    const px = Number(uni.upx2px(base));
    if (!Number.isNaN(px)) return px;
  }
  return base;
});

const rollerStyle = computed(() => ({
  '--lk-number-roller-speed': props.autoplay ? `${Math.max(props.speed, 16)}ms` : '0ms',
  '--lk-number-roller-easing': props.easing,
  '--lk-number-roller-digit-height': `${props.digitHeight}rpx`,
  '--lk-number-roller-digit-height-px': `${digitHeightPx.value}px`,
}));

const formattedText = computed(() => normalizeValue(props.value));

const segments = computed<Segment[]>(() => buildSegments(formattedText.value));

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

/**
 * 将数值格式化为带千位分隔 & 指定小数位的字符串。
 * 复杂度较高，因此单独拆出方便维护。
 */
function formatNumeric(num: number, raw: string): string {
  const decimals =
    typeof props.decimals === 'number' && props.decimals >= 0 ? props.decimals : extractDecimalLength(raw);
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

function trackTransform(digit: number) {
  const safeHeight = digitHeightPx.value;
  const offset = Number((digit * safeHeight).toFixed(2));
  return `translate3d(0, ${-offset}px, 0)`;
}
</script>

<template>
  <view :class="classes" :style="[rollerStyle, props.customStyle]">
    <template v-for="segment in segments" :key="segment.key">
      <view v-if="segment.type === 'digit'" class="lk-number-roller__segment">
        <view class="lk-number-roller__window">
          <view class="lk-number-roller__track" :style="{ transform: trackTransform(segment.digit) }">
            <text v-for="digit in digitsPool" :key="digit" class="lk-number-roller__digit">{{ digit }}</text>
          </view>
        </view>
      </view>
      <text v-else class="lk-number-roller__symbol">{{ segment.symbol }}</text>
    </template>
  </view>
</template>

<style scoped lang="scss">
.lk-number-roller {
  display: inline-flex;
  align-items: flex-end;
  gap: 4rpx;
  font-weight: 600;
  font-size: 56rpx;
  line-height: 1;
  color: var(--lk-color-text);
  --lk-number-roller-digit-height: 56rpx;
  --lk-number-roller-speed: 800ms;
  --lk-number-roller-easing: cubic-bezier(0.33, 1, 0.68, 1);
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum' 1, 'lnum' 1;

  &__segment {
    display: inline-flex;
  }

  &__window {
    position: relative;
    overflow: hidden;
    height: var(--lk-number-roller-digit-height);
    min-width: 44rpx;
  }

  &__track {
    display: flex;
    flex-direction: column;
    transition-property: transform;
    transition-duration: var(--lk-number-roller-speed);
    transition-timing-function: var(--lk-number-roller-easing);
  }

  &__digit {
    height: var(--lk-number-roller-digit-height);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    color: inherit;
    line-height: 1;
  }

  &__symbol {
    display: inline-flex;
    align-items: flex-end;
    font-size: 40rpx;
    color: var(--lk-color-text-secondary);
    padding: 0 4rpx;
  }
}
</style>
