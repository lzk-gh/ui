<script setup lang="ts">
import { reactive, defineProps, defineEmits } from 'vue';

defineOptions({ name: 'LkImage' });

const props = defineProps({
  src: { type: String, default: '' },
  width: { type: String, default: '100%' },
  height: { type: String, default: 'auto' },
  radius: { type: String, default: 'var(--lk-radius-md)' },
  fit: { type: String, default: 'cover' },
  lazy: { type: Boolean, default: false },
  showLoading: { type: Boolean, default: true },
  showError: { type: Boolean, default: true },
  preview: { type: Boolean, default: false },
});
const emit = defineEmits(['load', 'error', 'click']);

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
    wx.previewImage({ current: props.src, urls: [props.src] });
    // #endif
  }
}
</script>

<template>
  <view
    class="lk-image"
    :style="{ width, height, borderRadius: radius }"
    @click="onClick"
  >
    <image
      v-if="!state.error"
      class="lk-image__inner"
      :src="src"
      :mode="fit"
      @load="onLoad"
      @error="onError"
      :lazy-load="lazy"
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

<style scoped lang="scss">
.lk-image {
  position: relative;
  overflow: hidden;
  background: var(--lk-color-primary-bg-soft);
  .lk-image__inner {
    width: 100%;
    height: 100%;
    display: block;
  }
  &__placeholder {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12rpx;
    color: var(--lk-color-text-secondary);
    font-size: 22rpx;
  }
  &__text {
    font-size: 24rpx;
  }
}
</style>
