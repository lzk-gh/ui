<script lang="ts" setup>
import { computed, ref } from 'vue';
import { gridProps } from './grid.props';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import LkCarousel from '@/uni_modules/lucky-ui/components/lk-carousel/lk-carousel.vue';
import { useRipple } from '@/uni_modules/lucky-ui/composables/useRipple';

defineOptions({ name: 'LkGrid' });

const props = defineProps(gridProps);

const { rippleActive, rippleWaveStyle, triggerRipple } = useRipple();
const activeIndex = ref<string | number>(-1);

const gridStyle = computed(() => {
  return {
    gridTemplateColumns: props.columns
      ? `repeat(${props.columns}, 1fr)`
      : 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: props.gap ? `${props.gap}rpx` : '12rpx',
  };
});

// 计算分页：当启用 carousel 时按 (columns * rows) 分页
const pages = computed(() => {
  const list = props.items || [];
  const cols = props.columns || 1;
  const rows = props.rows || 1;
  const perPage = Math.max(1, cols * rows);
  const res: (typeof list)[] = [];
  for (let i = 0; i < list.length; i += perPage) {
    res.push(list.slice(i, i + perPage));
  }
  return res;
});

function onItemClick(item: any, index: number, pageIndex: number = 0, event: any) {
  // Generate unique key for grid item
  const uniqueKey = `${pageIndex}-${index}`;
  activeIndex.value = uniqueKey;
  triggerRipple(event);

  // TODO: Emit click event if needed, or handle navigation
}
</script>

<template>
  <lk-carousel
    v-if="props.carousel && props.items && props.items.length"
    :carousel-list="pages"
    :auto-height="true"
    :auto-play="false"
    :loop="false"
    :indicator-overlay="false"
  >
    <template #default="{ item: page, index: pageIndex }">
      <view class="lk-grid" :style="gridStyle">
        <view
          v-for="(it, idx) in page"
          :key="idx"
          class="lk-grid__item lk-ripple"
          :class="{ 'lk-ripple--active': rippleActive && activeIndex === `${pageIndex}-${idx}` }"
          :style="{ gap: (itemGap || 8) + 'rpx' }"
          @tap="onItemClick(it, Number(idx), Number(pageIndex), $event)"
        >
          <lk-icon v-if="it.icon" :name="it.icon" size="36" />
          <text class="lk-grid__item-text">{{ it.text }}</text>
          <view class="lk-ripple__wave" :style="rippleWaveStyle" />
        </view>
      </view>
    </template>
  </lk-carousel>

  <view v-else class="lk-grid" :style="gridStyle">
    <template v-if="items && items.length">
      <view
        v-for="(item, index) in items"
        :key="index"
        class="lk-grid__item lk-ripple"
        :class="{ 'lk-ripple--active': rippleActive && activeIndex === `0-${index}` }"
        :style="{ gap: (itemGap || 8) + 'rpx' }"
        @tap="onItemClick(item, index, 0, $event)"
      >
        <lk-icon v-if="item.icon" :name="item.icon" size="36" />
        <text class="lk-grid__item-text">{{ item.text }}</text>
        <view class="lk-ripple__wave" :style="rippleWaveStyle" />
      </view>
    </template>
    <slot v-else></slot>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
