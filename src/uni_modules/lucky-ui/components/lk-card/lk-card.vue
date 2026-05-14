<script setup lang="ts">
import { computed } from 'vue';
import type { CSSProperties, StyleValue } from 'vue';
import { useRipple } from '@/uni_modules/lucky-ui/composables/useRipple';
import { cardEmits, cardProps } from './card.props';

defineOptions({ name: 'LkCard' });

const props = defineProps(cardProps);
const emit = defineEmits(cardEmits);

const { rippleActive, rippleWaveStyle, triggerRipple } = useRipple({ duration: 800 });

const cardClass = computed(() => {
  return [
    'lk-card',
    props.customClass,
    {
      'is-border': props.border,
      'lk-ripple': props.ripple,
      'lk-ripple--active': props.ripple && rippleActive.value,
    },
  ];
});

const cardStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {};
  const shadowMap: Record<string, string> = {
    none: 'none',
    never: 'none',
    sm: 'var(--test-shadow-sm, var(--lk-shadow-sm))',
    md: 'var(--test-shadow-md, var(--lk-shadow-base))',
    base: 'var(--test-shadow-md, var(--lk-shadow-base))',
    lg: 'var(--test-shadow-lg, var(--lk-shadow-lg))',
  };

  if (props.transparent) {
    style['--_bg'] = 'transparent';
  } else if (props.bgColor) {
    style['--_bg'] = props.bgColor;
  }

  style['--_overflow'] = props.overflow;

  const shadow = shadowMap[props.shadow];
  if (shadow) {
    style['--_shadow'] = shadow;
  }

  return style;
});

const rootStyle = computed<StyleValue>(() => [cardStyle.value, props.customStyle as StyleValue]);

/**
 * 处理点击事件
 */
function handleClick(event: unknown) {
  if (props.ripple) triggerRipple(event);
  emit('click', event);
}

function handleHeaderClick(event: unknown) {
  emit('header-click', event);
}

function handleFooterClick(event: unknown) {
  emit('footer-click', event);
}
</script>

<template>
  <view :id="id" :class="cardClass" :style="rootStyle" @tap="handleClick">
    <view v-if="ripple" class="lk-ripple__wave" :style="rippleWaveStyle" />
    <!-- 封面图插槽：贴边显示 -->
    <view v-if="$slots.cover" class="lk-card__cover">
      <slot name="cover" />
    </view>

    <!-- 头部 -->
    <view
      v-if="title || $slots.header"
      class="lk-card__header"
      :style="{ padding: `${padding} ${padding} 0` }"
    >
      <view class="lk-card__title" @tap="handleHeaderClick">
        <slot name="header">
          <text class="lk-card__title-text">{{ title }}</text>
          <text v-if="subTitle" class="lk-card__subtitle">{{ subTitle }}</text>
        </slot>
      </view>
      <view v-if="$slots['header-extra']" class="lk-card__extra">
        <slot name="header-extra" />
      </view>
    </view>

    <!-- 内容主体 -->
    <view class="lk-card__body" :style="{ padding }">
      <slot />
    </view>

    <!-- 底部 -->
    <view
      v-if="$slots.footer"
      class="lk-card__footer"
      :style="{ padding: `0 ${padding} ${padding}` }"
      @tap="handleFooterClick"
    >
      <slot name="footer" />
    </view>
  </view>
</template>

<style lang="scss">
@use './lk-card.scss';
</style>
