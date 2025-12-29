<script setup lang="ts">
import { computed, Fragment, h, useSlots } from 'vue';
import { spaceProps } from './space.props';

defineOptions({ name: 'LkSpace' });

const props = defineProps(spaceProps);

const sizeMap = { sm: 8, md: 16, lg: 24 } as const;

const gapX = computed(() =>
  Array.isArray(props.size)
    ? ((props.size as any)[0] ?? 0)
    : typeof props.size === 'number'
      ? props.size
      : sizeMap[props.size as 'sm' | 'md' | 'lg']
);
const gapY = computed(() =>
  Array.isArray(props.size)
    ? ((props.size as any)[1] ?? gapX.value)
    : typeof props.size === 'number'
      ? props.size
      : sizeMap[props.size as 'sm' | 'md' | 'lg']
);

const klass = computed(() => [
  'lk-space',
  `lk-space--${props.direction}`,
  `lk-space--align-${props.align}`,
  { 'lk-space--wrap': props.wrap },
]);

const style = computed((): any => ({
  '--gap-x': gapX.value + 'rpx',
  '--gap-y': gapY.value + 'rpx',
}));

const slots = useSlots();

function getChildren() {
  const children = slots.default ? slots.default() : [];
  const nodes = children.filter(v => v && (v as any).type !== Comment);
  if (!props.split) return nodes;
  const withSplit: any[] = [];
  nodes.forEach((n, i) => {
    withSplit.push(n);
    if (i < nodes.length - 1)
      withSplit.push(h('view', { class: 'lk-space__split' }, [props.split as any]));
  });
  return withSplit;
}
</script>

<template>
  <view :class="klass" :style="style">
    <slot />
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
