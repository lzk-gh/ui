<script setup lang="ts">
import { computed } from 'vue';
import type { CSSProperties } from 'vue';
import { cardProps } from './card.props';

defineOptions({ name: 'LkCard' });

const props = defineProps(cardProps);

const cardClass = computed(() => {
  return [
    'lk-card',
    {
      'is-border': props.border,
      'is-hover': props.hoverable,
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

  const shadow = shadowMap[props.shadow];
  if (shadow) {
    style['--_shadow'] = shadow;
  }

  return style;
});
</script>

<template>
  <view :class="cardClass" :style="cardStyle">
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
      <view class="lk-card__title">
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
    >
      <slot name="footer" />
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
