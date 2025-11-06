<script setup lang="ts">
import { computed, Fragment, h, useSlots } from 'vue';
import { lkSpaceProps } from './types';

defineOptions({ name: 'LkSpace' });

const props = defineProps(lkSpaceProps);

const sizeMap = { sm: 8, md: 16, lg: 24 } as const;

const gapX = computed(()=> Array.isArray(props.size) ? (props.size as any)[0] ?? 0 : (typeof props.size==='number' ? props.size : sizeMap[props.size as 'sm'|'md'|'lg']));
const gapY = computed(()=> Array.isArray(props.size) ? (props.size as any)[1] ?? (gapX.value) : (typeof props.size==='number' ? props.size : sizeMap[props.size as 'sm'|'md'|'lg']));

const klass = computed(()=>[
  'lk-space',
  `lk-space--${props.direction}`,
  `lk-space--align-${props.align}`,
  { 'lk-space--wrap': props.wrap }
]);

const style = computed((): any => ({
  '--gap-x': gapX.value + 'rpx',
  '--gap-y': gapY.value + 'rpx',
}));

const slots = useSlots();

function getChildren() {
  const children = slots.default ? slots.default() : [];
  const nodes = children.filter(v => (v && (v as any).type !== Comment));
  if (!props.split) return nodes;
  const withSplit: any[] = [];
  nodes.forEach((n, i) => {
    withSplit.push(n);
    if (i < nodes.length - 1) withSplit.push(h('view', { class: 'lk-space__split' }, [props.split as any]));
  });
  return withSplit;
}
</script>

<template>
  <view :class="klass" :style="style">
    <slot />
  </view>
</template>

<style scoped lang="scss">
.lk-space {
  display: inline-flex;
  &--horizontal { flex-direction: row; }
  &--vertical { flex-direction: column; }
  &--align-start { align-items: flex-start; }
  &--align-center { align-items: center; }
  &--align-end { align-items: flex-end; }
  &--align-baseline { align-items: baseline; }
  &--wrap { flex-wrap: wrap; }

  /* 使用 margin 模拟 gap，兼容性更好 */
  /* #ifdef H5 */
  > * { margin-right: var(--gap-x); margin-bottom: var(--gap-y); }
  &--vertical > * { margin-right: 0; }
  &--horizontal > * { margin-bottom: 0; }
  > *:last-child { margin-right: 0; margin-bottom: 0; }
  /* #endif */

  /* #ifndef H5 */
  > view { margin-right: var(--gap-x); margin-bottom: var(--gap-y); }
  &--vertical > view { margin-right: 0; }
  &--horizontal > view { margin-bottom: 0; }
  > view:last-child { margin-right: 0; margin-bottom: 0; }
  /* #endif */
}
.lk-space__split { display:inline-flex; align-items:center; margin: 0 var(--gap-x); }
</style>
