<script setup lang="ts">
import { computed } from 'vue';
import { lkNumberKeyboardProps, lkNumberKeyboardEmits } from './types';
import LkPopup from '../lk-popup/lk-popup.vue';

defineOptions({ name: 'LkNumberKeyboard' });

const props = defineProps(lkNumberKeyboardProps);
const emit = defineEmits(lkNumberKeyboardEmits);

const baseKeys = Array.from({ length: 9 }, (_, i) => String(i + 1));

function shuffledDigits() {
  const arr = baseKeys.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const keys = computed(() => (props.random ? shuffledDigits() : baseKeys));

function onKey(key: string) {
  if (key === 'del') {
    emit('delete');
    return;
  }
  if (key === 'ok') {
    emit('confirm');
    emit('update:visible', false);
    return;
  }
  if (key === '.' && !props.allowDecimal) return;
  emit('input', key);
}

function onClose() {
  emit('close');
  emit('update:visible', false);
}
</script>

<template>
  <lk-popup
    :model-value="props.visible"
    position="bottom"
    :round="true"
    :z-index="props.zIndex"
    @update:modelValue="v => emit('update:visible', v)"
    @close="onClose"
  >
    <view class="lk-nkb">
      <view class="lk-nkb__body">
        <view class="lk-nkb__row">
          <button class="lk-nkb__key" v-for="k in keys.slice(0, 3)" :key="k" @click="onKey(k)">
            {{ k }}
          </button>
        </view>
        <view class="lk-nkb__row">
          <button class="lk-nkb__key" v-for="k in keys.slice(3, 6)" :key="k" @click="onKey(k)">
            {{ k }}
          </button>
        </view>
        <view class="lk-nkb__row">
          <button class="lk-nkb__key" v-for="k in keys.slice(6, 9)" :key="k" @click="onKey(k)">
            {{ k }}
          </button>
        </view>
        <view class="lk-nkb__row">
          <button class="lk-nkb__key" v-if="props.extraKey" @click="onKey(props.extraKey)">
            {{ props.extraKey }}
          </button>
          <button class="lk-nkb__key" @click="onKey('0')">0</button>
          <button class="lk-nkb__key lk-nkb__key--del" @click="onKey('del')">⌫</button>
        </view>
      </view>
      <button class="lk-nkb__confirm" @click="onKey('ok')">
        {{ props.confirmText }}
      </button>
    </view>
  </lk-popup>
</template>

<style scoped lang="scss">
.lk-nkb {
  display: flex;
}
.lk-nkb__body {
  flex: 1;
  padding: 8rpx;
}
.lk-nkb__row {
  display: flex;
  gap: 8rpx;
  margin-bottom: 8rpx;
}
.lk-nkb__key {
  flex: 1;
  height: 96rpx;
  border-radius: var(--lk-radius-md);
  background: var(--lk-color-bg-elevated);
  border: none;
  font-size: 32rpx;
}
.lk-nkb__key--del {
  font-size: 28rpx;
}
.lk-nkb__confirm {
  width: 200rpx;
  margin: 8rpx 8rpx 8rpx 0;
  background: var(--lk-color-primary);
  color: #fff;
  border: none;
  border-radius: var(--lk-radius-md);
  font-size: 28rpx;
}
</style>
