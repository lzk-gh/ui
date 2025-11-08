<script setup lang="ts">
import { ref, watch } from 'vue';
defineOptions({ name: 'LkUpload' });

const props = defineProps({
  modelValue: { type: Array as () => string[], default: () => [] },
  multiple: { type: Boolean, default: true },
  max: { type: Number, default: 9 },
  disabled: { type: Boolean, default: false },
  accept: { type: String, default: 'image/*' },
  selectable: { type: Boolean, default: true },
  sizeType: { type: Array as () => string[], default: () => ['compressed'] },
  capture: { type: Array as () => string[], default: () => [] },
  deletable: { type: Boolean, default: true },
  preview: { type: Boolean, default: true },
});
const emit = defineEmits(['update:modelValue', 'change', 'remove', 'add', 'oversize']);

const files = ref<string[]>([...props.modelValue]);
watch(
  () => props.modelValue,
  v => (files.value = [...v])
);

function select() {
  if (props.disabled || !props.selectable) return;
  if (files.value.length >= props.max) return;
  // #ifdef MP
  uni.chooseImage({
    count: props.max - files.value.length,
    sizeType: props.sizeType as any,
    sourceType: ['album', 'camera'],
    success(res) {
      const paths = res.tempFilePaths || res.tempFiles?.map((f: any) => f.path) || [];
      add(paths);
    },
  });
  // #endif
  // #ifdef H5
  const el = document.createElement('input');
  el.type = 'file';
  if (props.accept) el.accept = props.accept;
  if (props.multiple) el.multiple = true;
  el.onchange = () => {
    const list = Array.from(el.files || []);
    const urls = list.map(f => URL.createObjectURL(f));
    add(urls);
  };
  el.click();
  // #endif
}
function add(list: string[]) {
  const merged = files.value.concat(list).slice(0, props.max);
  files.value = merged;
  emit('update:modelValue', merged);
  emit('add', list);
  emit('change', merged);
}
function remove(i: number) {
  const removed = files.value.splice(i, 1);
  emit('update:modelValue', [...files.value]);
  emit('remove', removed[0]);
  emit('change', [...files.value]);
}
function previewImage(i: number) {
  if (!props.preview) return;
  // #ifdef MP
  uni.previewImage({ current: files.value[i], urls: files.value });
  // #endif
  // #ifdef H5
  window.open(files.value[i], '_blank');
  // #endif
}
</script>

<template>
  <view class="lk-upload" :class="{ 'is-disabled': disabled }">
    <view
      v-for="(f, i) in files"
      :key="f + i"
      class="lk-upload__item"
      @click="previewImage(i)"
    >
      <image :src="f" mode="aspectFill" class="lk-upload__img" />
      <view v-if="deletable && !disabled" class="lk-upload__del" @click.stop="remove(i)"
        >×</view
      >
    </view>
    <view v-if="selectable && files.length < max" class="lk-upload__add" @click="select">
      <lk-icon name="plus" size="44" />
      <text class="lk-upload__add-text">上传</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.lk-upload {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
  &.is-disabled {
    opacity: 0.55;
  }
  &__item,
  &__add {
    width: 180rpx;
    height: 180rpx;
    background: var(--lk-color-primary-bg-soft);
    border-radius: var(--lk-radius-md);
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__img {
    width: 100%;
    height: 100%;
    display: block;
  }
  &__del {
    position: absolute;
    right: 8rpx;
    top: 8rpx;
    background: rgba(0, 0, 0, 0.55);
    color: #fff;
    font-size: 30rpx;
    line-height: 1;
    padding: 4rpx 12rpx 8rpx;
    border-radius: var(--lk-radius-pill);
  }
  &__add {
    flex-direction: column;
    gap: 8rpx;
    color: var(--lk-color-primary);
    font-size: 24rpx;
    &:active {
      background: var(--lk-color-primary);
      color: var(--lk-color-text-inverse);
    }
  }
  &__add-text {
    font-size: 22rpx;
  }
}
</style>
