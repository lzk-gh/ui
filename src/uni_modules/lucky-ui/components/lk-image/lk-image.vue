<script setup lang="ts">
import type { StyleValue } from 'vue';
import { computed, reactive, watch } from 'vue';
import { imageProps, imageEmits } from './image.props';

defineOptions({ name: 'LkImage' });

const props = defineProps(imageProps);
const emit = defineEmits(imageEmits);

const state = reactive({
  loading: true,
  error: false,
});

watch(
  () => props.src,
  () => {
    state.loading = true;
    state.error = false;
  }
);

function onLoad(e: unknown) {
  state.loading = false;
  emit('load', e);
}

function onError(e: unknown) {
  state.loading = false;
  state.error = true;
  emit('error', e);
}
function onClick(event?: unknown) {
  emit('click', { src: props.src, event });
  if (props.preview && props.src) {
    const urls = [props.src];
    emit('preview', { src: props.src, urls, event });
    uni.previewImage({
      current: props.src,
      urls,
      success: result => emit('preview-success', { src: props.src, result }),
      fail: error => emit('preview-fail', { src: props.src, error }),
    });
  }
}

const rootStyle = computed<StyleValue>(() => [
  { width: props.width, height: props.height, borderRadius: props.radius },
  props.customStyle as StyleValue,
]);
</script>

<template>
  <view :id="id" class="lk-image" :class="customClass" :style="rootStyle" @tap="onClick">
    <image
      v-if="!state.error"
      class="lk-image__inner"
      :src="src"
      :mode="fit"
      :lazy-load="lazy"
      @load="onLoad"
      @error="onError"
    />
    <view
      v-if="showLoading && state.loading"
      class="lk-image__placeholder lk-image__placeholder--loading"
    />
    <view v-else-if="showError && state.error" class="lk-image__placeholder">
      <lk-icon name="image" size="44" />
      <text class="lk-image__text">加载失败</text>
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
