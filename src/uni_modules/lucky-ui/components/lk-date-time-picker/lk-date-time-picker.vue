<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import LkPopup from '../lk-popup/lk-popup.vue';
import LkButton from '../lk-button/lk-button.vue';
import LkCalendar from '../lk-calendar/lk-calendar.vue';
import LkTimePicker from '../lk-time-picker/lk-time-picker.vue';
import { parseDate, formatDate } from '@/uni_modules/lucky-ui/utils/date-utils';

defineOptions({ name:'LkDateTimePicker' });

const props = defineProps({
  modelValue: { type:String, default:'' }, // YYYY-MM-DD HH:mm:ss
  placeholder: { type:String, default:'选择日期时间' },
  clearable: { type:Boolean, default:true },
  disabled: { type:Boolean, default:false },
  format: { type:String, default:'YYYY-MM-DD HH:mm:ss' },
  timeFormat: { type:String, default:'HH:mm:ss' }
});
const emit = defineEmits(['update:modelValue','change','open','close','clear']);

const show = ref(false);
const dateValue = ref('');
const timeValue = ref('');
watch(()=>props.modelValue, v=>{
  if(!v){ dateValue.value=''; timeValue.value=''; return; }
  const parts = v.split(' ');
  dateValue.value = parts[0] || '';
  timeValue.value = parts[1] || '';
},{ immediate:true });

const display = computed(()=> props.modelValue);

function open(){ if(props.disabled) return; show.value=true; emit('open'); }
function close(){ show.value=false; emit('close'); }
function clear(){
  dateValue.value=''; timeValue.value='';
  emit('update:modelValue','');
  emit('change','');
  emit('clear'); close();
}
function confirm(){
  if(!dateValue.value || !timeValue.value) return;
  const val = `${dateValue.value} ${timeValue.value}`;
  emit('update:modelValue', val);
  emit('change', val);
  close();
}
</script>

<template>
  <view class="lk-date-time-picker" :class="{ 'is-disabled': disabled }" @click="open">
    <text v-if="display" class="lk-date-time-picker__value">{{ display }}</text>
    <text v-else class="lk-date-time-picker__placeholder">{{ placeholder }}</text>
    <view v-if="clearable && display" class="lk-date-time-picker__clear" @click.stop="clear">×</view>
  </view>
  <lk-popup v-model="show" position="bottom">
    <view class="lk-date-time-picker__panel">
      <view class="dtp-section">
        <text class="dtp-section__title">日期</text>
        <lk-calendar v-model="dateValue" />
      </view>
      <view class="dtp-section">
        <text class="dtp-section__title">时间</text>
        <lk-time-picker v-model="timeValue" :format="timeFormat" />
      </view>
      <view class="lk-date-time-picker__actions">
        <lk-button size="small" variant="outline" @click="close">取消</lk-button>
        <lk-button size="small" :disabled="!dateValue || !timeValue" @click="confirm">确定</lk-button>
      </view>
    </view>
  </lk-popup>
</template>

<style scoped lang="scss">
.lk-date-time-picker {
  min-height: var(--lk-control-height-md);
  padding: 0 32rpx;
  display:flex; align-items:center;
  background: var(--lk-input-bg);
  border:2rpx solid var(--lk-input-border-color);
  border-radius: var(--lk-radius-lg);
  font-size:28rpx;
  &__placeholder { color: var(--lk-color-text-placeholder); }
  &__clear {
    margin-left:auto;
    padding:8rpx;
    font-size:36rpx;
    color: var(--lk-color-text-secondary);
  }
  &:active:not(.is-disabled){ border-color: var(--lk-input-border-color-active); }
  &.is-disabled { opacity:.5; }
}
.lk-date-time-picker__panel {
  padding:32rpx;
  display:flex;
  flex-direction:column;
  gap:32rpx;
}
.dtp-section {
  background: var(--lk-color-bg-surface);
  border-radius: var(--lk-radius-lg);
  padding: 16rpx 16rpx 24rpx;
  &__title {
    font-size: 26rpx;
    font-weight:600;
    margin-left: 4rpx;
    color: var(--lk-color-text-secondary);
  }
}
.lk-date-time-picker__actions {
  display:flex;
  justify-content:flex-end;
  gap:24rpx;
}
</style>