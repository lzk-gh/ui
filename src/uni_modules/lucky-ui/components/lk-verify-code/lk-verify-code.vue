<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import { verifyCodeProps, verifyCodeEmits } from './verify-code.props';

defineOptions({ name: 'LkVerifyCode' });

const props = defineProps(verifyCodeProps);
const emit = defineEmits(verifyCodeEmits);

const val = ref(props.modelValue || '');
const inputRef = ref<any>(null);

watch(
  () => props.modelValue,
  v => {
    if (v !== val.value) val.value = v || '';
  }
);

function focus() {
  // #ifdef H5
  try {
    inputRef.value && inputRef.value.focus && inputRef.value.focus();
  } catch (e) {}
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

onMounted(async () => {
  if (props.autofocus) await nextTick().then(focus);
});
</script>

<template>
  <view class="lk-vc" @click="focus">
    <input
      class="lk-vc__input"
      :value="val"
      :maxlength="props.length"
      :type="props.type"
      @input="onInput"
      ref="inputRef"
    />
    <view class="lk-vc__boxes">
      <view v-for="i in props.length" :key="i" class="lk-vc__box">
        <text v-if="props.mask && i <= val.length">•</text>
        <text v-else>{{ val[i - 1] || '' }}</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
