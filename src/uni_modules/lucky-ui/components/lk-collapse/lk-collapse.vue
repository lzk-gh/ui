<script setup lang="ts">
import { computed, provide, ref, watch, type StyleValue } from 'vue';
import { addUnit } from '@/uni_modules/lucky-ui/core/src/utils/unit';
import {
  collapseEmits,
  collapseInjectionKey,
  collapseProps,
  type CollapseName,
} from './collapse.props';

defineOptions({ name: 'LkCollapse' });

const props = defineProps(collapseProps);
const emit = defineEmits(collapseEmits);

const active = ref<CollapseName[]>([]);
watch(() => props.modelValue, sync, { immediate: true });

function sync() {
  if (props.accordion) {
    const value = Array.isArray(props.modelValue) ? props.modelValue[0] : props.modelValue;
    active.value = value === '' || value === undefined ? [] : [value];
  } else {
    active.value = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
  }
}

function toggle(name: CollapseName) {
  let next: CollapseName[];
  if (props.accordion) {
    next = active.value[0] === name ? [] : [name];
    emit('update:modelValue', next[0] ?? '');
  } else {
    const set = new Set(active.value);
    if (set.has(name)) {
      set.delete(name);
    } else {
      set.add(name);
    }
    next = Array.from(set);
    emit('update:modelValue', next);
  }
  active.value = Array.isArray(next) ? next : [next];
  emit('change', props.accordion ? active.value[0] : active.value);
}

const rootClass = computed(() => [
  'lk-collapse',
  `lk-collapse--${props.variant}`,
  props.customClass,
  {
    'is-bordered': props.bordered,
  },
]);

const rootStyle = computed<StyleValue>(() => [
  props.customStyle as StyleValue,
  {
    '--lk-collapse-gap': addUnit(props.gap),
  },
]);

provide(collapseInjectionKey, { active, accordion: props.accordion, toggle });
</script>

<template>
  <view :id="id" :class="rootClass" :style="rootStyle">
    <slot />
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
