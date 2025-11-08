<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import LkPopup from '../lk-popup/lk-popup.vue';
import LkButton from '../lk-button/lk-button.vue';

defineOptions({ name: 'LkTimePicker' });

const props = defineProps({
  modelValue: { type: String, default: '' }, // HH:mm:ss
  format: { type: String, default: 'HH:mm:ss' }, // 支持裁剪秒
  placeholder: { type: String, default: '选择时间' },
  clearable: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  stepHour: { type: Number, default: 1 },
  stepMinute: { type: Number, default: 1 },
  stepSecond: { type: Number, default: 1 },
});
const emit = defineEmits(['update:modelValue', 'change', 'open', 'close', 'clear']);

const show = ref(false);
const timeParts = ref({ h: '', m: '', s: '' });

watch(
  () => props.modelValue,
  v => {
    if (!v) {
      timeParts.value = { h: '', m: '', s: '' };
      return;
    }
    const arr = v.split(':');
    timeParts.value = {
      h: arr[0] || '00',
      m: arr[1] || '00',
      s: arr[2] || '00',
    };
  },
  { immediate: true }
);

const hasSecond = computed(() => props.format.includes('ss'));
const display = computed(() => props.modelValue || '');
function open() {
  if (props.disabled) return;
  show.value = true;
  emit('open');
}
function close() {
  show.value = false;
  emit('close');
}
function clear() {
  emit('update:modelValue', '');
  emit('change', '');
  emit('clear');
  close();
}
function pick(col: 'h' | 'm' | 's', v: string) {
  timeParts.value[col] = v;
}
function confirm() {
  const { h, m, s } = timeParts.value;
  const final = hasSecond.value
    ? `${h || '00'}:${m || '00'}:${s || '00'}`
    : `${h || '00'}:${m || '00'}`;
  emit('update:modelValue', final);
  emit('change', final);
  close();
}

function gen(step: number, max: number) {
  const arr: string[] = [];
  for (let i = 0; i < max; i += step) {
    arr.push((i < 10 ? '0' : '') + i);
  }
  return arr;
}
const hours = computed(() => gen(props.stepHour, 24));
const minutes = computed(() => gen(props.stepMinute, 60));
const seconds = computed(() => gen(props.stepSecond, 60));
</script>

<template>
  <view class="lk-time-picker" :class="{ 'is-disabled': disabled }" @click="open">
    <text v-if="display" class="lk-time-picker__value">{{ display }}</text>
    <text v-else class="lk-time-picker__placeholder">{{ placeholder }}</text>
    <view v-if="clearable && display" class="lk-time-picker__clear" @click.stop="clear"
      >×</view
    >
  </view>
  <lk-popup v-model="show" position="bottom">
    <view class="lk-time-picker__panel">
      <view class="lk-time-picker__columns">
        <scroll-view scroll-y class="lk-time-picker__col">
          <view
            v-for="h in hours"
            :key="h"
            class="lk-time-picker__item"
            :class="{ 'is-active': h === timeParts.h }"
            @click="pick('h', h)"
            >{{ h }}</view
          >
        </scroll-view>
        <scroll-view scroll-y class="lk-time-picker__col">
          <view
            v-for="m in minutes"
            :key="m"
            class="lk-time-picker__item"
            :class="{ 'is-active': m === timeParts.m }"
            @click="pick('m', m)"
            >{{ m }}</view
          >
        </scroll-view>
        <scroll-view v-if="hasSecond" scroll-y class="lk-time-picker__col">
          <view
            v-for="s in seconds"
            :key="s"
            class="lk-time-picker__item"
            :class="{ 'is-active': s === timeParts.s }"
            @click="pick('s', s)"
            >{{ s }}</view
          >
        </scroll-view>
      </view>
      <view class="lk-time-picker__actions">
        <lk-button size="small" variant="outline" @click="close">取消</lk-button>
        <lk-button size="small" @click="confirm">确定</lk-button>
      </view>
    </view>
  </lk-popup>
</template>

<style scoped lang="scss">
.lk-time-picker {
  min-height: var(--lk-control-height-md);
  padding: 0 32rpx;
  display: flex;
  align-items: center;
  background: var(--lk-input-bg);
  border: 2rpx solid var(--lk-input-border-color);
  border-radius: var(--lk-radius-lg);
  font-size: 28rpx;
  color: var(--lk-color-text);
  &__placeholder {
    color: var(--lk-color-text-placeholder);
  }
  &__clear {
    margin-left: auto;
    font-size: 36rpx;
    padding: 8rpx;
    color: var(--lk-color-text-secondary);
  }
  &.is-disabled {
    opacity: 0.5;
  }
  &:active:not(.is-disabled) {
    border-color: var(--lk-input-border-color-active);
  }
}
.lk-time-picker__panel {
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}
.lk-time-picker__columns {
  display: flex;
  gap: 24rpx;
  height: 480rpx;
}
.lk-time-picker__col {
  width: 160rpx;
}
.lk-time-picker__item {
  height: 84rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--lk-radius-md);
  margin-bottom: 8rpx;
  background: var(--lk-color-primary-bg-soft);
  font-size: 28rpx;
  color: var(--lk-color-text);
  &.is-active {
    background: var(--lk-color-primary);
    color: var(--lk-color-text-inverse);
    font-weight: 600;
  }
}
.lk-time-picker__actions {
  display: flex;
  justify-content: flex-end;
  gap: 24rpx;
}
</style>
