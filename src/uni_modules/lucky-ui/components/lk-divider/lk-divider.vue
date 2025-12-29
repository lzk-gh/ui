<script setup lang="ts">
import { computed } from 'vue';
import { dividerProps } from './divider.props';

defineOptions({ name: 'LkDivider' });

const props = defineProps(dividerProps);

const textStyle = computed(() => {
  const base: Record<string, string> = {
    position: 'absolute',
    top: '50%',
  };

  base.background = 'var(--lk-color-bg-body)';
  base.padding = '0 20rpx';

  const pos = props.textPosition as string | number;
  if (typeof pos === 'number') {
    base.left = `${pos}%`;
    base.transform = 'translateX(-50%) translateY(-50%)';
  } else if (typeof pos === 'string') {
    const pctMatch = /^\d+(\.\d+)?%$/.test(pos);
    if (pctMatch) {
      base.left = pos;
      base.transform = 'translateX(-50%) translateY(-50%)';
    } else if (pos === 'left') {
      base.left = '0%';
      base.transform = 'translateX(0) translateY(-50%)';
    } else if (pos === 'right') {
      base.left = '100%';
      base.transform = 'translateX(-100%) translateY(-50%)';
    } else {
      base.left = '50%';
      base.transform = 'translateX(-50%) translateY(-50%)';
    }
  } else {
    base.left = '50%';
    base.transform = 'translateX(-50%) translateY(-50%)';
  }
  return base;
});
</script>

<template>
  <view
    class="lk-divider"
    :class="[
      {
        'is-vertical': vertical,
        'is-dashed': dashed,
        'is-hairline': hairline,
        'has-text': text || $slots.default,
      },
    ]"
  >
    <text class="lk-divider__text" :style="textStyle">
      <slot>{{ text }}</slot>
    </text>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
