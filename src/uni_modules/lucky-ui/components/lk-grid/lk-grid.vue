<script lang="ts" setup>
import { computed } from 'vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import LkCarousel from '@/uni_modules/lucky-ui/components/lk-carousel/lk-carousel.vue';

defineOptions({ name: 'LkGrid' });

const props = defineProps<{
  columns?: number;
  gap?: number;
  itemGap?: number;
  // 是否启用滑动分页（使用 lk-carousel）
  carousel?: boolean;
  // 每页行数（与 columns 一起决定每页 item 数量）
  rows?: number;
  items?: { icon?: string; text: string }[];
}>();

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
</script>

<template>
  <lk-carousel
    v-if="props.carousel && props.items && props.items.length"
    :carouselList="pages"
    :autoHeight="true"
    :auto-play="false"
    :loop="false"
    :indicator-overlay="false"
  >
    <template #default="{ item: page }">
      <view class="lk-grid" :style="gridStyle">
        <view
          v-for="(it, idx) in page"
          :key="idx"
          class="lk-grid-item"
          :style="{ gap: (itemGap || 8) + 'rpx' }"
        >
          <lk-icon v-if="it.icon" :name="it.icon" />
          {{ it.text }}
        </view>
      </view>
    </template>
  </lk-carousel>

  <view v-else class="lk-grid" :style="gridStyle">
    <view
      v-if="items"
      v-for="(item, index) in items"
      :key="index"
      class="lk-grid-item"
      :style="{ gap: (itemGap || 8) + 'rpx' }"
    >
      <lk-icon v-if="item.icon" :name="item.icon" />
      {{ item.text }}
    </view>
    <slot v-else></slot>
  </view>
</template>

<style lang="scss" scoped>
.lk-grid {
  display: grid;
  text-align: center;
}

.lk-grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
