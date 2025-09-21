<script setup lang="ts">
import { provide } from 'vue';

defineOptions({ name:'LkRadioGroup' });
const props = defineProps({
  modelValue: { type:[String,Number,Boolean], default:null },
  size: { type:String, default:'md' },
  disabled: { type:Boolean, default:false },
  direction: { type:String, default:'row' }
});
const emit = defineEmits(['update:modelValue','change']);

function update(v:any){
  emit('update:modelValue', v);
  emit('change', v);
}

provide('LkRadioGroup', {
  isGroup:true,
  value: ()=>props.modelValue,
  update,
  size: props.size,
  disabled: props.disabled
});
</script>

<template>
  <view class="lk-radio-group" :class="[`is-${direction}`]"><slot /></view>
</template>

<style lang="scss">
.lk-radio-group {
  display:flex;
  flex-wrap:wrap;
  gap:20rpx 36rpx;
  &.is-column { flex-direction:column; }
}
</style>