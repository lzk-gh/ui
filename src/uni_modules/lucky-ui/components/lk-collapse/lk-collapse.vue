<script setup lang="ts">
import { ref, watch, provide } from 'vue';

defineOptions({ name:'LkCollapse' });

const props = defineProps({
  modelValue: { type: [Array, String, Number], default: () => [] },
  accordion: { type: Boolean, default: false }
});
const emit = defineEmits(['update:modelValue','change']);

const active = ref<any[]>([]);
watch(()=>props.modelValue, sync, { immediate: true });

function sync(){
  if(props.accordion) {
    active.value = props.modelValue ? [props.modelValue] : [];
  } else {
    active.value = Array.isArray(props.modelValue)? [...props.modelValue] : [];
  }
}
function toggle(name:any) {
  let next:any;
  if(props.accordion) {
    next = active.value[0] === name ? [] : [name];
    emit('update:modelValue', next[0] ?? '');
  } else {
    const set = new Set(active.value);
    set.has(name) ? set.delete(name) : set.add(name);
    next = Array.from(set);
    emit('update:modelValue', next);
  }
  active.value = Array.isArray(next)?next:[next];
  emit('change', props.accordion ? active.value[0] : active.value);
}

provide('LkCollapse', { active, accordion: props.accordion, toggle });
</script>

<template>
  <view class="lk-collapse">
    <slot />
  </view>
</template>

<style scoped lang="scss">
.lk-collapse {
  display:flex;
  flex-direction:column;
  gap: 12rpx;
}
</style>