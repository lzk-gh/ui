<script setup lang="ts">
import { indexAnchorProps } from './index-bar.props';

defineOptions({ name: 'LkIndexAnchor' });

const props = defineProps(indexAnchorProps);
</script>

<template>
  <view class="lk-index-anchor" :data-lk-index-anchor="props.index">
    <view class="lk-index-anchor__title">{{ props.title || props.index }}</view>
    <slot />
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
