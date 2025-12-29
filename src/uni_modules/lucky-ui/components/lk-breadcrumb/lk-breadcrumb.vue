<script setup lang="ts">
import { provide } from 'vue';
import { breadcrumbProps } from './breadcrumb.props';

defineOptions({ name: 'LkBreadcrumb' });
const props = defineProps(breadcrumbProps);
provide('LkBreadcrumb', { separator: props.separator });
</script>

<template>
  <view class="lk-breadcrumb">
    <slot />
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
