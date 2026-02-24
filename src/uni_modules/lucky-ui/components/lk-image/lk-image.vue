<script setup lang="ts">
import { reactive } from 'vue';
import { imageProps, imageEmits } from './image.props';

defineOptions({ name: 'LkImage' });

const props = defineProps(imageProps);
const emit = defineEmits(imageEmits);

const state = reactive({
  loading: true,
  error: false,
});

function onLoad(e: any) {
  state.loading = false;
  emit('load', e);
}
function onError(e: any) {
  state.loading = false;
  state.error = true;
  emit('error', e);
}
function onClick() {
  emit('click');
  if (props.preview && props.src) {
    // 微信小程序支持
    // #ifdef MP-WEIXIN
    uni.previewImage({ current: props.src, urls: [props.src] });
    // #endif
  }
}
</script>

<template>
  <view class="lk-image" :style="{ width, height, borderRadius: radius }" @click="onClick">
    <image
      v-if="!state.error"
      class="lk-image__inner"
      :src="src"
      :mode="fit"
      :lazy-load="lazy"
      @load="onLoad"
      @error="onError"
    />
    <view v-if="showLoading && state.loading" class="lk-image__placeholder">
      <lk-loading variant="spinner" size="40" />
    </view>
    <view v-else-if="showError && state.error" class="lk-image__placeholder">
      <lk-icon name="image" size="44" />
      <text class="lk-image__text">加载失败</text>
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
