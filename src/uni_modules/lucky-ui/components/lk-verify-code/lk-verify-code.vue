<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import { lkVerifyCodeProps, lkVerifyCodeEmits } from './types';

defineOptions({ name: 'LkVerifyCode' });

const props = defineProps(lkVerifyCodeProps);
const emit = defineEmits(lkVerifyCodeEmits);

const val = ref(props.modelValue || '');
const inputRef = ref<any>(null);

watch(() => props.modelValue, v => { if (v !== val.value) val.value = v || ''; });

function focus() {
  // #ifdef H5
  try { inputRef.value && inputRef.value.focus && inputRef.value.focus(); } catch (e) {}
  // #endif
}

function onInput(e: any) {
  let v = e?.detail?.value ?? e?.target?.value ?? '';
  if (props.type === 'number') v = v.replace(/\D+/g, '');
  if (v.length > props.length) v = v.slice(0, props.length);
  val.value = v;
  emit('update:modelValue', v);
  if (v.length === props.length) emit('finish', v);
}

function onKeydown(e: any) {
  // 允许退格
}

onMounted(async () => { if (props.autofocus) await nextTick().then(focus); });
</script>

<template>
  <view class="lk-vc" @click="focus">
    <input class="lk-vc__input" :value="val" :maxlength="props.length" :type="props.type" @input="onInput" ref="inputRef" />
    <view class="lk-vc__boxes">
      <view v-for="i in props.length" :key="i" class="lk-vc__box">
        <text v-if="props.mask && i <= val.length">•</text>
        <text v-else>{{ val[i-1] || '' }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.lk-vc { position: relative; }
.lk-vc__input { position: absolute; opacity: 0; pointer-events: none; height:0; width:0; }
.lk-vc__boxes { display:flex; gap: 12rpx; }
.lk-vc__box { width: 84rpx; height: 84rpx; border: 2rpx solid var(--lk-color-border); border-radius: var(--lk-radius-md); display:flex; align-items:center; justify-content:center; font-size: 36rpx; }
</style>
