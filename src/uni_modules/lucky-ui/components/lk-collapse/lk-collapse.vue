<script setup lang="ts">
import { ref, watch, provide, computed } from 'vue';
import { collapseProps, collapseEmits } from './collapse.props';

defineOptions({ name: 'LkCollapse' });

const props = defineProps(collapseProps);
const emit = defineEmits(collapseEmits);

const active = ref<any[]>([]);
watch(() => props.modelValue, sync, { immediate: true });

function sync() {
  if (props.accordion) {
    active.value = props.modelValue ? [props.modelValue] : [];
  } else {
    active.value = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
  }
}
function toggle(name: any) {
  let next: any;
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

const classes = computed(() => [
  'lk-collapse',
  `lk-collapse--${props.type}`,
  {
    'has-border': props.border
  },
  props.customClass
]);

provide('LkCollapse', { 
  active, 
  accordion: props.accordion, 
  type: props.type,
  border: props.border,
  toggle 
});
</script>

<template>
  <view :class="classes" :style="props.customStyle">
    <slot />
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
