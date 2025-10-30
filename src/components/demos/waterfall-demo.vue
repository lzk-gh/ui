<template>
  <view class="demo-container">
    <text class="title">瀑布流演示（基于虚拟列表逐像素窗口）</text>

    <view class="toolbar">
      <text>卡片数：{{ list.length }}</text>
      <text v-if="loading" class="loading">加载中...</text>
    </view>

    <lk-waterfall
      :items="list"
      :column="cols"
      :gap="10"
      :padding-x="8"
      :height="viewport"
      :row-unit="60"
      :prefetch-rows="18"
      :lower-threshold="'120rpx'"
      @prefetch="onPrefetch"
      @reach-bottom="onReachBottom"
    >
      <template #item="{ item, index }">
        <view class="card" :style="{ background: item.bg }">
          <view class="card-meta">
            <text class="card-title">#{{ index + 1 }} {{ item.title }}</text>
            <text class="card-sub">h={{ item.height }}px</text>
          </view>
        </view>
      </template>
    </lk-waterfall>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import LkWaterfall from '@/uni_modules/lucky-ui/components/lk-waterfall/lk-waterfall.vue';

const list = ref<{ id: number; title: string; height: number; bg: string }[]>([]);
const loading = ref(false);
const pageSize = 60;
let currentPage = 0;
let totalPages = Infinity; // 无尽流示例

const cols = ref(2);
const viewport = ref(520);

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randColor() {
  const h = rand(0, 360);
  return `hsl(${h} 70% 92%)`;
}

async function loadNextPage() {
  if (loading.value) return;
  if (currentPage >= totalPages) return;
  loading.value = true;
  const pageToLoad = currentPage + 1;
  await new Promise((r) => setTimeout(r, 400));
  const startId = (pageToLoad - 1) * pageSize;
  const newItems = Array.from({ length: pageSize }, (_, i) => {
    const id = startId + i;
    return {
      id,
      title: `卡片 ${id + 1}`,
      // 生成 140~300px 的随机高度，体现非等高瀑布
      height: rand(140, 300),
      bg: randColor(),
    };
  });
  list.value.push(...newItems);
  currentPage = pageToLoad;
  loading.value = false;
}

onMounted(() => {
  loadNextPage();
});

function onPrefetch() {
  loadNextPage();
}
function onReachBottom() {
  loadNextPage();
}
</script>

<style scoped lang="scss">
.demo-container {
  padding: 16px;
}
.title {
  font-size: 18px;
  margin-bottom: 8px;
}
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;
}
.loading {
  color: #2979ff;
}
.card {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.card-meta {
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(2px);
}
.card-title {
  font-size: 14px;
  color: #333;
}
.card-sub {
  font-size: 12px;
  color: #888;
}
</style>
