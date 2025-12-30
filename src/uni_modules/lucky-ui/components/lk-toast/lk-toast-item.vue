<script setup lang="ts">
import { useTransition } from '@/uni_modules/lucky-ui/composables/useTransition';
import { toastStore, type ToastItem } from './toast-manager';

defineOptions({ name: 'LkToastItem' });

const props = defineProps<{
  item: ToastItem;
}>();

const { classes, styles, display } = useTransition(
  () => props.item.visible,
  {
    name: props.item.transition || 'slide-up',
    duration: 300,
  },
  {
    onAfterLeave: () => {
      toastStore.remove(props.item.id);
    },
  }
);
</script>

<template>
  <view
    v-if="display"
    class="lk-toast-mgr__item"
    :class="['pos-' + item.position]"
    @click="toastStore.close(item.id)"
  >
    <view class="lk-toast-mgr__inner" :class="classes" :style="styles">
      <text class="lk-toast-mgr__text">{{ item.message }}</text>
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
