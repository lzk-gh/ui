<script setup lang="ts">
import { computed } from 'vue';
defineOptions({ name:'LkPagination' });

const props = defineProps({
  total: { type:Number, required:true },
  pageSize: { type:Number, default:10 },
  modelValue: { type:Number, default:1 },
  pagerCount: { type:Number, default:5 },
  size: { type:String, default:'md' }
});
const emit = defineEmits(['update:modelValue','change']);

const pageCount = computed(()=> Math.max(1, Math.ceil(props.total / props.pageSize)));
const current = computed(()=> Math.min(Math.max(1, props.modelValue), pageCount.value));

function change(p:number){
  if(p<1 || p>pageCount.value || p===current.value) return;
  emit('update:modelValue', p);
  emit('change', p);
}
function pages(){
  const half = Math.floor(props.pagerCount/2);
  let start = Math.max(1, current.value - half);
  let end = start + props.pagerCount -1;
  if(end>pageCount.value){
    end = pageCount.value;
    start = Math.max(1, end - props.pagerCount +1);
  }
  const arr=[];
  for(let i=start;i<=end;i++) arr.push(i);
  return arr;
}
</script>

<template>
  <view class="lk-pagination" :class="[`lk-pagination--${size}`]">
    <view class="lk-pagination__btn" :class="{ 'is-disabled': current===1 }" @click="change(current-1)">‹</view>
    <view
        v-for="p in pages()"
        :key="p"
        class="lk-pagination__page"
        :class="{ 'is-active': p===current }"
        @click="change(p)"
    >{{ p }}</view>
    <view class="lk-pagination__btn" :class="{ 'is-disabled': current===pageCount }" @click="change(current+1)">›</view>
  </view>
</template>

<style scoped lang="scss">
.lk-pagination {
  display:inline-flex;
  align-items:center;
  gap: 12rpx;
  font-size: 26rpx;
  &__btn, &__page {
    min-width: 56rpx;
    height: 56rpx;
    padding: 0 12rpx;
    display:flex; align-items:center; justify-content:center;
    border-radius: var(--lk-radius-pill);
    background: var(--lk-color-primary-bg-soft);
    color: var(--lk-color-primary);
    font-weight:500;
    transition: background var(--lk-transition-fast), color var(--lk-transition-fast), filter var(--lk-transition-fast);
    &:active:not(.is-disabled){ background: var(--lk-color-primary); color:var(--lk-color-text-inverse); }
  }
  &__page.is-active {
    background: var(--lk-color-primary);
    color: var(--lk-color-text-inverse);
  }
  &__btn.is-disabled {
    opacity:.35;
  }
  &--sm { font-size:22rpx; .lk-pagination__btn, .lk-pagination__page { height:48rpx; min-width:48rpx; } }
  &--lg { font-size:30rpx; .lk-pagination__btn, .lk-pagination__page { height:64rpx; min-width:64rpx; } }
}
</style>