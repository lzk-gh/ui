<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onMounted, ref, watch } from 'vue';
import LkVirtualList from '@/uni_modules/lucky-ui/components/lk-virtual-list/lk-virtual-list.vue';

type AnyItem = Record<string, any> & { id?: string | number };

// Convert rpx/px/number to px
function toPx(val: string | number | undefined, fallback = 0): number {
  if (val === undefined || val === null) return fallback;
  if (typeof val === 'number') return val;
  const v = String(val).trim();
  if (v.endsWith('rpx') || v.endsWith('upx')) {
    const n = parseFloat(v);
    // @ts-ignore
    return typeof uni !== 'undefined' && (uni as any).upx2px ? (uni as any).upx2px(n) : n;
  }
  if (v.endsWith('px')) return parseFloat(v);
  const num = parseFloat(v);
  return isNaN(num) ? fallback : num;
}

const props = defineProps({
  // 原始数据项（可以包含 width/height 或 ratio 字段；若都没有，将使用 estimateHeight）
  items: { type: Array as () => AnyItem[], default: () => [] },
  // 视口高度（传给虚拟列表）
  height: { type: [Number, String], default: 600 },
  // 列数
  column: { type: Number, default: 2 },
  // 列间距/行间距
  gap: { type: [Number, String], default: 8 },
  // 容器左右内边距（用于计算列宽）
  paddingX: { type: [Number, String], default: 0 },
  // 行单元高度（像素粒度）；越小越平滑，但开销更大
  rowUnit: { type: [Number, String], default: 50 },
  // 当项未提供高度信息时的估算高度
  estimateHeight: { type: Number, default: 200 },
  // 为每个 item 计算像素高度的键名，默认读取 item.height；也可传 'ratio'（按宽度*ratio 计算）
  heightKey: { type: String, default: 'height' },
  // 触底/预取
  lowerThreshold: { type: [Number, String], default: '80rpx' },
  prefetchRows: { type: Number, default: 0 },
  // 滚动行为透传
  dynamicOverscan: { type: Boolean, default: true },
  maxOverscanRows: { type: Number, default: 24 },
  overscanBoostFactor: { type: Number, default: 0.6 },
  buffer: { type: Number, default: 6 },
  enablePassive: { type: Boolean, default: true },
  enhanced: { type: Boolean, default: true },
  bounces: { type: Boolean, default: false },
  scrollAnchoring: { type: Boolean, default: true },
  scrollWithAnimation: { type: Boolean, default: false },
});

const emit = defineEmits<{
  (e: 'prefetch'): void;
  (e: 'reach-bottom'): void;
  (e: 'scroll', payload: { scrollTop: number; start: number; end: number }): void;
}>();

const wrapperRef = ref();
const uid = getCurrentInstance()?.uid ?? Math.floor(Math.random() * 1e6);
const rootId = `lk-waterfall-${uid}`;
const containerWidth = ref<number>(0);
const gapPx = computed(() => toPx(props.gap, 8));
const paddingXPx = computed(() => toPx(props.paddingX, 0));
const rowUnitPx = computed(() => Math.max(1, Math.round(toPx(props.rowUnit, 50))));
const heightPx = computed(() => toPx(props.height, 600));

const columnWidth = computed(() => {
  const w = Math.max(0, containerWidth.value - paddingXPx.value * 2);
  const cols = Math.max(1, props.column);
  return cols > 1 ? (w - gapPx.value * (cols - 1)) / cols : w;
});

type Placed = {
  index: number;
  id: string | number;
  top: number;
  left: number;
  width: number;
  height: number;
};

const placed = ref<Placed[]>([]);
const totalHeightPx = ref(0);

const rowsCount = computed(() => Math.ceil(totalHeightPx.value / rowUnitPx.value));
const virtItems = computed(() =>
  Array.from({ length: Math.max(0, rowsCount.value) }, (_, i) => ({ _row: i }))
);

function getItemHeightPx(item: AnyItem): number {
  const cw = Math.max(1, columnWidth.value);
  if (props.heightKey === 'ratio') {
    const r = Number(item.ratio);
    if (isFinite(r) && r > 0) return Math.round(cw * r);
  }
  const h = Number((item as any)[props.heightKey]);
  if (isFinite(h) && h > 0) return Math.round(h);
  return Math.round(props.estimateHeight);
}

function layoutItems() {
  const items = props.items;
  const cols = Math.max(1, props.column);
  const cw = Math.max(1, columnWidth.value);
  const g = gapPx.value;

  const colHeights = Array.from({ length: cols }, () => 0);
  const out: Placed[] = [];

  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const h = getItemHeightPx(it);
    // pick the column with min height
    let col = 0;
    let minH = colHeights[0];
    for (let c = 1; c < cols; c++) {
      if (colHeights[c] < minH) {
        minH = colHeights[c];
        col = c;
      }
    }
    const left = col * (cw + g);
    const top = colHeights[col];
    out.push({
      index: i,
      id: (it.id ?? i) as any,
      top,
      left,
      width: cw,
      height: h,
    });
    colHeights[col] = top + h + g;
  }

  placed.value = out;
  totalHeightPx.value = Math.max(0, Math.max(...colHeights) - (items.length > 0 ? g : 0));
}

async function measureWidth() {
  await nextTick();
  try {
    // H5/小程序测量：通过唯一 id 获取容器宽度
    const query = uni.createSelectorQuery();
    query
      .select(`#${rootId}`)
      .boundingClientRect((rect: any) => {
        if (rect && rect.width) {
          containerWidth.value = rect.width;
          layoutItems();
        }
      })
      .exec();
  } catch (e) {
    // 兜底：使用系统窗口宽度
    const sys = uni.getSystemInfoSync?.();
    containerWidth.value = (sys as any)?.windowWidth || 375;
    layoutItems();
  }
}

watch(
  () => [props.items, props.column, gapPx.value, paddingXPx.value, columnWidth.value],
  () => {
    // 任何变化都重新布局
    layoutItems();
  }
);

onMounted(() => {
  measureWidth();
});

function onScroll(e: any) {
  emit('scroll', e);
}
function onReachBottom() {
  emit('reach-bottom');
}
function onPrefetch() {
  emit('prefetch');
}

// 根据虚拟窗口计算应渲染的卡片
const visibleCards = computed(() => {
  // 这些值来自虚拟列表插槽提供；这里仅占位，真正计算在模板中完成
  return placed.value;
});
</script>

<template>
  <view class="lk-waterfall" :id="rootId" ref="wrapperRef">
    <lk-virtual-list
      class="lk-waterfall__list"
      :items="virtItems"
      :item-height="rowUnitPx"
      :height="heightPx"
      :buffer="buffer"
      :dynamic-overscan="dynamicOverscan"
      :max-overscan-rows="maxOverscanRows"
      :overscan-boost-factor="overscanBoostFactor"
      :lower-threshold="lowerThreshold"
      :prefetch-rows="prefetchRows"
      :scroll-anchoring="scrollAnchoring"
      :scroll-with-animation="scrollWithAnimation"
      :enable-passive="enablePassive"
      :enhanced="enhanced"
      :bounces="bounces"
      @prefetch="onPrefetch"
      @reach-bottom="onReachBottom"
      @scroll="onScroll"
    >
      <template #default="{ start, end, itemHeight }">
        <view class="lk-waterfall__inner" :style="{ padding: '0 ' + paddingXPx + 'px' }">
          <view
            class="lk-waterfall__window"
            :style="{
              height: (end - start) * itemHeight + 'px',
              position: 'relative',
            }"
          >
            <template v-for="node in placed">
              <!-- 仅渲染与窗口相交的卡片 -->
              <view
                v-if="
                  node.top < end * itemHeight &&
                  node.top + node.height > start * itemHeight
                "
                :key="node.id + '-' + node.index"
                class="lk-waterfall__card"
                :style="{
                  position: 'absolute',
                  width: node.width + 'px',
                  height: node.height + 'px',
                  left: node.left + 'px',
                  top: node.top - start * itemHeight + 'px',
                }"
              >
                <!-- 插槽：对外暴露 item 和其原始索引 -->
                <slot
                  name="item"
                  :item="items[node.index]"
                  :index="node.index"
                  :style="{ width: '100%', height: '100%' }"
                >
                  <!-- 默认卡片（占位示例） -->
                  <view class="lk-waterfall__card-default">
                    <view class="ph" />
                    <view class="meta">
                      <text class="title">#{{ node.index + 1 }}</text>
                    </view>
                  </view>
                </slot>
              </view>
            </template>
          </view>
        </view>
      </template>
    </lk-virtual-list>
  </view>
</template>

<style scoped lang="scss">
.lk-waterfall {
  width: 100%;
}

.lk-waterfall__inner {
  width: 100%;
  box-sizing: border-box;
}

.lk-waterfall__card-default {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.lk-waterfall__card-default .ph {
  flex: 1;
  background: linear-gradient(135deg, #e9f0ff, #f5f7ff);
}
.lk-waterfall__card-default .meta {
  padding: 8px 10px;
  font-size: 12px;
  color: #666;
}
.lk-waterfall__card-default .title {
  color: #333;
}
</style>
