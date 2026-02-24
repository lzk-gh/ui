<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue';
import { useTheme } from '@/uni_modules/lucky-ui/theme';
import LkAnchor from '../../uni_modules/lucky-ui/components/lk-anchor/lk-anchor.vue';
import LkAnchorLink from '../../uni_modules/lucky-ui/components/lk-anchor/lk-anchor-link.vue';

const { themeClass, toggleTheme } = useTheme();

const list = [
  { name: '人气热销', id: 'c1' },
  { name: '超值套餐', id: 'c2' },
  { name: '季节限定', id: 'c3' },
  { name: '鲜果茶', id: 'c4' },
  { name: '纯茶系列', id: 'c5' },
  { name: '加料', id: 'c6' },
  { name: '周边', id: 'c7' },
];

const anchorRef = ref();
const scrollIntoViewId = ref('');
const currentScrollTop = ref(0);
const instance = getCurrentInstance();
const hasMeasuredTargets = ref(false);

type AnchorMeasuredItem = { href: string; top: number; height: number };

function measureAndSyncTargets(baseScrollTop: number = currentScrollTop.value) {
  if (!instance?.proxy) return;

  const query = uni.createSelectorQuery();
  query.in(instance.proxy);
  query.select('#anchor-content').boundingClientRect();
  list.forEach(item => query.select(`#${item.id}`).boundingClientRect());

  query.exec((res) => {
    const results = Array.isArray(res) ? (res as Array<{ top?: number; height?: number } | null>) : [];
    const containerRect = results[0];
    const measured: AnchorMeasuredItem[] = list
      .map((item, index) => {
        const rect = results[index + 1];
        if (!rect || typeof rect.top !== 'number') return null;
        return {
          href: item.id,
          top: rect.top - (containerRect?.top || 0) + Number(baseScrollTop || 0),
          height: Number(rect.height || 0),
        };
      })
      .filter((item): item is AnchorMeasuredItem => !!item)
      .sort((a, b) => a.top - b.top);

    if (measured.length > 0) {
      hasMeasuredTargets.value = true;
      anchorRef.value?.setTargets?.(measured, baseScrollTop);
    }
  });
}

function getGoodsImage(sectionId: string, index: number) {
  return `https://picsum.photos/seed/lucky-anchor-${sectionId}-${index}/320/320`;
}

const handleAnchorClick = (href: string) => {
  scrollIntoViewId.value = href;
};

const onScroll = (e: { detail: { scrollTop: number } }) => {
  currentScrollTop.value = e.detail.scrollTop;
  if (!hasMeasuredTargets.value) {
    measureAndSyncTargets(e.detail.scrollTop);
  }
};

onMounted(() => {
  setTimeout(() => {
    measureAndSyncTargets(currentScrollTop.value);
  }, 600);
});
</script>

<template>
  <view class="anchor-demo" :class="themeClass">
    <view class="header">
      <view class="title">点餐示例 (Milk Tea Style)</view>
      <view class="theme-toggle" @click="toggleTheme">切换主题</view>
    </view>

    <view class="container">
      <view class="sidebar">
        <!-- 为了实现右侧一致的点餐风格，设置白色的激活背景 active-bg-color="#ffffff" -->
        <lk-anchor
          ref="anchorRef"
          target-container="#anchor-content"
          :show-line="true"
          active-bg-color="var(--lk-color-bg-container)"
          :scroll-top="currentScrollTop"
          @click="handleAnchorClick"
        >
          <lk-anchor-link
            v-for="(item, index) in list"
            :key="index"
            :href="item.id"
            :title="item.name"
          />
        </lk-anchor>
      </view>

      <scroll-view
        id="anchor-content"
        class="content"
        scroll-y
        scroll-with-animation
        :scroll-into-view="scrollIntoViewId"
        @scroll="onScroll"
      >
        <view v-for="(item, index) in list" :id="item.id" :key="index" class="section">
          <view class="section-title">{{ item.name }}</view>
          <view class="goods-list">
            <view v-for="g in 4" :key="g" class="goods-item">
              <image
                class="goods-img"
                :src="getGoodsImage(item.id, g)"
                mode="aspectFill"
              />
              <view class="goods-info">
                <view class="goods-name">{{ item.name }}商品 {{ g }}</view>
                <view class="goods-desc">月售 100+</view>
                <view class="goods-price">¥ 18.00</view>
              </view>
            </view>
          </view>
        </view>
        <view style="height: 400rpx"></view>
      </scroll-view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.anchor-demo {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  background-color: var(--lk-color-bg-container);
  border-bottom: 1rpx solid var(--lk-color-border-light);
  font-weight: bold;
}

.theme-toggle {
  font-size: 24rpx;
  color: var(--lk-color-primary);
}

.container {
  flex: 1;
  display: flex;
  overflow: hidden;
  background-color: var(--lk-color-bg-container);
}

.sidebar {
  width: 190rpx; // 稍微宽一点
  height: 100%;
  background-color: var(--lk-color-bg-surface-variant);
}

.content {
  flex: 1;
  height: 100%;
  background-color: var(--lk-color-bg-container);
}

.section {
  padding: 20rpx 20rpx 0 20rpx;
  &-title {
    font-size: 28rpx;
    font-weight: bold;
    color: var(--lk-color-text);
    margin-bottom: 20rpx;
  }
}

.goods-list {
  .goods-item {
    display: flex;
    margin-bottom: 40rpx;

    .goods-img {
      width: 160rpx;
      height: 160rpx;
      background-color: var(--lk-color-bg-surface-variant);
      border-radius: 12rpx;
      margin-right: 20rpx;
      flex-shrink: 0;
    }

    .goods-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .goods-name {
        font-size: 30rpx;
        color: var(--lk-color-text);
        font-weight: 500;
      }
      .goods-desc {
        font-size: 22rpx;
        color: var(--lk-color-text-secondary);
      }
      .goods-price {
        font-size: 32rpx;
        font-weight: bold;
        color: var(--lk-color-danger);
      }
    }
  }
}
</style>
