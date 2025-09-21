<script setup lang="ts">
import { ref, computed } from 'vue';
defineOptions({ name:'LkCalendar' });

const props = defineProps({
  modelValue: { type:String, default:'' }, // YYYY-MM-DD
  min: { type:String, default:'' },
  max: { type:String, default:'' },
  firstDay: { type:Number, default:1 }, // 0 Sunday
  showHeader: { type:Boolean, default:true }
});
const emit = defineEmits(['update:modelValue','change','month-change']);

const today = new Date();
const cur = ref<{y:number; m:number}>(()=> {
  if(props.modelValue){
    const d=new Date(props.modelValue);
    if(!isNaN(+d)) return { y:d.getFullYear(), m: d.getMonth()+1 };
  }
  return { y: today.getFullYear(), m: today.getMonth()+1 };
});

function pad(n:number){ return n<10? '0'+n : ''+n; }
function format(y:number,m:number,d:number){ return `${y}-${pad(m)}-${pad(d)}`; }

const days = computed(()=>{
  const { y,m } = cur.value;
  const first = new Date(y,m-1,1);
  const startWeek = (first.getDay() - props.firstDay + 7) % 7;
  const len = new Date(y,m,0).getDate();
  const arr:any[]=[];
  for(let i=0;i<startWeek;i++){ arr.push(null); }
  for(let d=1; d<=len; d++){
    const dateStr = format(y,m,d);
    arr.push({
      d,
      dateStr,
      isToday: dateStr === format(today.getFullYear(), today.getMonth()+1, today.getDate()),
      selected: dateStr === props.modelValue
    });
  }
  return arr;
});

function changeMonth(delta:number){
  let { y,m } = cur.value;
  m += delta;
  if(m<1){ m=12; y--; }
  else if(m>12){ m=1; y++; }
  cur.value = { y,m };
  emit('month-change', { year:y, month:m });
}

function select(day:any){
  if(!day) return;
  emit('update:modelValue', day.dateStr);
  emit('change', day.dateStr);
}
</script>

<template>
  <view class="lk-calendar">
    <view v-if="showHeader" class="lk-calendar__header">
      <view class="lk-calendar__nav" @click="changeMonth(-1)">‹</view>
      <text class="lk-calendar__ym">{{ cur.y }} - {{ cur.m }}</text>
      <view class="lk-calendar__nav" @click="changeMonth(1)">›</view>
    </view>
    <view class="lk-calendar__week">
      <text v-for="w in 7" :key="w">{{ ['日','一','二','三','四','五','六'][(w-1+firstDay)%7] }}</text>
    </view>
    <view class="lk-calendar__grid">
      <view
          v-for="(d,i) in days"
          :key="i"
          class="lk-calendar__cell"
          :class="{ 'is-empty': !d, 'is-today': d?.isToday, 'is-selected': d?.selected }"
          @click="select(d)"
      >
        <text v-if="d">{{ d.d }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.lk-calendar {
  width:100%;
  display:flex;
  flex-direction:column;
  gap: 16rpx;
  font-size:26rpx;
  &__header {
    display:flex;
    align-items:center;
    justify-content:space-between;
    font-weight:600;
  }
  &__nav {
    width:64rpx; height:64rpx;
    display:flex; align-items:center; justify-content:center;
    background: var(--lk-color-primary-bg-soft);
    color: var(--lk-color-primary);
    border-radius: var(--lk-radius-pill);
    &:active { background: var(--lk-color-primary); color: var(--lk-color-text-inverse); }
  }
  &__week {
    display:grid;
    grid-template-columns: repeat(7, 1fr);
    text-align:center;
    font-size:22rpx;
    color: var(--lk-color-text-secondary);
  }
  &__grid {
    display:grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8rpx;
  }
  &__cell {
    height: 84rpx;
    display:flex;
    align-items:center;
    justify-content:center;
    border-radius: var(--lk-radius-md);
    background: var(--lk-color-primary-bg-soft);
    color: var(--lk-color-text);
    &.is-empty { background: transparent; }
    &.is-today { box-shadow: 0 0 0 2rpx var(--lk-color-primary); }
    &.is-selected {
      background: var(--lk-color-primary);
      color: var(--lk-color-text-inverse);
      font-weight:600;
    }
    &:active:not(.is-empty) {
      filter: brightness(.92);
    }
  }
}
</style>