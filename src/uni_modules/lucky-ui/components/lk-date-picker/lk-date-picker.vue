<script setup lang="ts">
import { ref, watch } from 'vue';
import LkPopup from '../lk-popup/lk-popup.vue';
import LkCalendar from '../lk-calendar/lk-calendar.vue';
import LkButton from '../lk-button/lk-button.vue';

defineOptions({ name:'LkDatePicker' });

const props = defineProps({
  modelValue: { type:String, default:'' },
  placeholder: { type:String, default:'选择日期' },
  clearable: { type:Boolean, default:true },
  disabled: { type:Boolean, default:false }
});
const emit = defineEmits(['update:modelValue','change','open','close','clear']);

const inner = ref(props.modelValue);
watch(()=>props.modelValue, v=> inner.value=v);

const show = ref(false);
function toggle(v?:boolean){
  if(props.disabled) return;
  const next = v!==undefined? v: !show.value;
  show.value = next;
  emit(next?'open':'close');
}
function onSelect(val:string){
  inner.value = val;
}
function confirm(){
  emit('update:modelValue', inner.value);
  emit('change', inner.value);
  show.value=false;
}
function clear(){
  inner.value='';
  emit('update:modelValue','');
  emit('change','');
  emit('clear');
}
</script>

<template>
  <view class="lk-date-picker" :class="{ 'is-disabled': disabled }" @click="toggle(true)">
    <text v-if="inner" class="lk-date-picker__value">{{ inner }}</text>
    <text v-else class="lk-date-picker__placeholder">{{ placeholder }}</text>
    <view v-if="clearable && inner" class="lk-date-picker__clear" @click.stop="clear">×</view>
  </view>
  <lk-popup v-model="show" position="bottom">
    <view class="lk-date-picker__panel">
      <lk-calendar v-model="inner" />
      <view class="lk-date-picker__actions">
        <lk-button size="small" variant="outline" @click="toggle(false)">取消</lk-button>
        <lk-button size="small" @click="confirm">确定</lk-button>
      </view>
    </view>
  </lk-popup>
</template>

<style scoped lang="scss">
.lk-date-picker {
  min-height: var(--lk-control-height-md);
  padding: 0 32rpx;
  display:flex; align-items:center;
  background: var(--lk-input-bg);
  border: 2rpx solid var(--lk-input-border-color);
  border-radius: var(--lk-radius-lg);
  font-size: 28rpx;
  color: var(--lk-color-text);
  &__placeholder { color: var(--lk-color-text-placeholder); }
  &__clear {
    margin-left:auto;
    font-size: 36rpx;
    color: var(--lk-color-text-secondary);
    padding: 8rpx;
  }
  &.is-disabled { opacity:.55; }
  &:active:not(.is-disabled){
    border-color: var(--lk-input-border-color-active);
  }
}
.lk-date-picker__panel {
  padding: 32rpx;
  display:flex;
  flex-direction:column;
  gap: 32rpx;
}
.lk-date-picker__actions {
  display:flex;
  justify-content:flex-end;
  gap: 24rpx;
}
</style>