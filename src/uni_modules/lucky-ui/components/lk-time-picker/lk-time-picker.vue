<script setup lang="ts">
import type { StyleValue } from 'vue';
import { ref, watch, computed } from 'vue';
import LkPopup from '../lk-popup/lk-popup.vue';
import LkButton from '../lk-button/lk-button.vue';
import { timePickerProps, timePickerEmits } from './time-picker.props';

defineOptions({ name: 'LkTimePicker' });

const props = defineProps(timePickerProps);
const emit = defineEmits(timePickerEmits);

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
watch(
  () => props.show,
  value => {
    if (value !== undefined) show.value = value;
  },
  { immediate: true }
);

const hasSecond = computed(() => props.format.includes('ss'));
const display = computed(() => props.modelValue || '');
const cls = computed(() => ['lk-time-picker', { 'is-disabled': props.disabled }, props.customClass]);
const style = computed(() => props.customStyle as StyleValue);

function buildValue() {
  const { h, m, s } = timeParts.value;
  return hasSecond.value
    ? `${h || '00'}:${m || '00'}:${s || '00'}`
    : `${h || '00'}:${m || '00'}`;
}

function setShow(value: boolean) {
  if (show.value === value) return;
  show.value = value;
  emit('update:show', value);
  if (value) {
    emit('open');
  } else {
    emit('close');
  }
}

function open() {
  if (props.disabled) return;
  setShow(true);
}
function close() {
  setShow(false);
}
function clear() {
  if (props.disabled) return;
  emit('update:modelValue', '');
  emit('change', '');
  emit('clear');
  close();
}
function pick(col: 'h' | 'm' | 's', v: string) {
  timeParts.value[col] = v;
  emit('select', buildValue(), col);
}
function confirm() {
  const final = buildValue();
  emit('update:modelValue', final);
  emit('change', final);
  emit('confirm', final);
  close();
}

function cancel() {
  emit('cancel', buildValue());
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
  <view :id="id" :class="cls" :style="style" @tap="open">
    <text v-if="display" class="lk-time-picker__value">{{ display }}</text>
    <text v-else class="lk-time-picker__placeholder">{{ placeholder }}</text>
    <view v-if="clearable && display && !disabled" class="lk-time-picker__clear" @tap.stop="clear">×</view>
  </view>
  <lk-popup :model-value="show" position="bottom" @update:model-value="setShow">
    <view class="lk-time-picker__panel">
      <view class="lk-time-picker__columns">
        <scroll-view scroll-y class="lk-time-picker__col">
          <view
            v-for="h in hours"
            :key="h"
            class="lk-time-picker__item"
            :class="{ 'is-active': h === timeParts.h }"
            @tap="pick('h', h)"
            >{{ h }}</view
          >
        </scroll-view>
        <scroll-view scroll-y class="lk-time-picker__col">
          <view
            v-for="m in minutes"
            :key="m"
            class="lk-time-picker__item"
            :class="{ 'is-active': m === timeParts.m }"
            @tap="pick('m', m)"
            >{{ m }}</view
          >
        </scroll-view>
        <scroll-view v-if="hasSecond" scroll-y class="lk-time-picker__col">
          <view
            v-for="s in seconds"
            :key="s"
            class="lk-time-picker__item"
            :class="{ 'is-active': s === timeParts.s }"
            @tap="pick('s', s)"
            >{{ s }}</view
          >
        </scroll-view>
      </view>
      <view class="lk-time-picker__actions">
        <lk-button size="sm" variant="outline" @click="cancel">取消</lk-button>
        <lk-button size="sm" @click="confirm">确定</lk-button>
      </view>
    </view>
  </lk-popup>
</template>

<style lang="scss">
@use './index.scss';
</style>
