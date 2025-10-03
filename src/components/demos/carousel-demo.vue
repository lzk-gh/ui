<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-carousel :images="images1" />
    </demo-block>

    <demo-block title="自动播放">
      <lk-carousel :images="images1" autoplay :interval="3000" />
    </demo-block>

    <demo-block title="指示器位置">
      <lk-carousel :images="images1" indicator-position="bottom" />
    </demo-block>

    <demo-block title="自定义高度">
      <lk-carousel :images="images1" height="400rpx" />
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LkCarousel from '@/uni_modules/lucky-ui/components/lk-carousel/lk-carousel.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const images1 = ref([
  'https://picsum.photos/800/400?random=1',
  'https://picsum.photos/800/400?random=2',
  'https://picsum.photos/800/400?random=3'
]);
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
