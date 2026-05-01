<script setup lang="ts">
import { computed } from 'vue';
import { addUnit } from '@/uni_modules/lucky-ui/core/src/utils/unit';
import { metaRowProps } from './meta-row.props';

defineOptions({ name: 'LkMetaRow' });

const props = defineProps(metaRowProps);

const cls = computed(() => [
  'lk-meta-row',
  `lk-meta-row--${props.align}`,
  props.customClass,
]);

const styleVars = computed(() => ({
  '--lk-meta-row-gap': addUnit(props.gap),
  '--lk-meta-row-main-gap': addUnit(props.mainGap),
}));

const startStyle = computed(() => ({
  width: addUnit(props.startWidth),
  minWidth: addUnit(props.startWidth),
}));

const endStyle = computed(() => ({
  width: addUnit(props.endWidth),
  minWidth: addUnit(props.endWidth),
}));

const customStyleResolved = computed(() => {
  if (typeof props.customStyle === 'string') {
    return props.customStyle;
  }
  if (props.customStyle && typeof props.customStyle === 'object') {
    return props.customStyle as Record<string, string | number>;
  }
  return undefined;
});
</script>

<template>
  <view :id="id" :class="cls" :style="[styleVars, customStyleResolved]">
    <view class="lk-meta-row__start" :style="startStyle">
      <slot name="start" />
    </view>

    <view class="lk-meta-row__main">
      <view class="lk-meta-row__main-top">
        <slot name="main-top" />
      </view>
      <view class="lk-meta-row__main-bottom">
        <slot name="main-bottom" />
      </view>
    </view>

    <view class="lk-meta-row__end" :style="endStyle">
      <slot name="end" />
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
