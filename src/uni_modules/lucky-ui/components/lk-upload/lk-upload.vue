<script setup lang="ts">
import { ref, watch } from 'vue';
import { uploadProps, uploadEmits } from './upload.props';
defineOptions({ name: 'LkUpload' });

const props = defineProps(uploadProps);
const emit = defineEmits(uploadEmits);

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
    success(res: any) {
      const paths = res.tempFilePaths || (res.tempFiles as any[])?.map((f: any) => f.path) || [];
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
  files.value.splice(i, 1);
  emit('update:modelValue', [...files.value]);
  emit('remove', i);
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
    <view v-for="(f, i) in files" :key="f + i" class="lk-upload__item" @click="previewImage(i)">
      <image :src="f" mode="aspectFill" class="lk-upload__img" />
      <view v-if="deletable && !disabled" class="lk-upload__del" @click.stop="remove(i)">×</view>
    </view>
    <view v-if="selectable && files.length < max" class="lk-upload__add" @click="select">
      <lk-icon name="plus" size="44" />
      <text class="lk-upload__add-text">上传</text>
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
