<template>
  <view class="search-page" :class="themeClass">
    <!-- 搜索头 -->
    <view class="search-header">
      <view class="back-btn" @click="goBack">
        <lk-icon name="chevron-left" size="40" color="var(--test-text-primary)" />
      </view>
      <view class="search-input-wrap">
        <lk-icon name="search" size="32" color="var(--test-text-tertiary)" />
        <input
          v-model="searchQuery"
          class="search-input"
          placeholder="Search items..."
          auto-focus
          @confirm="handleSearch"
        />
        <lk-icon v-if="searchQuery" name="x" size="28" color="var(--test-text-tertiary)" @click="searchQuery = ''" />
      </view>
    </view>

    <scroll-view scroll-y class="search-content" show-scrollbar="false">
      <!-- 搜索建议/历史 -->
      <view v-if="!hasSearched" class="search-history">
        <view class="section-header">
          <text class="section-title">Recent Searches</text>
          <lk-icon name="trash" size="32" color="var(--test-text-tertiary)" @click="clearHistory" />
        </view>
        <view class="tag-list">
          <view v-for="(tag, i) in historyTags" :key="i" class="history-tag" @click="quickSearch(tag)">
            <text>{{ tag }}</text>
          </view>
        </view>

        <view class="section-header" style="margin-top: 40rpx;">
          <text class="section-title">Popular Trends</text>
        </view>
        <view class="tag-list">
          <view v-for="(tag, i) in hotTags" :key="i" class="hot-tag" @click="quickSearch(tag)">
            <lk-icon name="lightning-fill" size="24" color="#FFD700" style="margin-right: 8rpx;" />
            <text>{{ tag }}</text>
          </view>
        </view>
      </view>

      <!-- 搜索结果 (复用瀑布流风格) -->
      <view v-else class="search-results">
        <lk-waterfall
          :items="results"
          height="100%"
          :gutter="16"
          :row-gap="24"
          :padding-x="16"
          :padding-y="0"
          card-radius="24"
        >
          <template #item="{ item, height }">
            <view class="product-card">
              <view class="image-wrapper" :style="{ height: (height - 90) + 'px' }">
                <image :src="item.image" mode="aspectFill" class="product-image" />
              </view>
              <view class="product-info">
                <text class="product-title">{{ item.title }}</text>
                <text class="product-price">${{ item.price }}</text>
              </view>
            </view>
          </template>
        </lk-waterfall>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import LkWaterfall from '@/uni_modules/lucky-ui/components/lk-waterfall/lk-waterfall.vue';

const activeTab = inject('activeTab', ref('home'));
const themeClass = inject('themeClass', ref('lk-theme-light'));
const searchQuery = ref('');
const hasSearched = ref(false);

const historyTags = ref(['Jacket', 'Summer Dress', 'Denim', 'Sneakers']);
const hotTags = ref(['Modern Style', 'Luxury', 'Casual Summer', 'Winter Wear']);

const results = ref<any[]>([]);

const goBack = () => {
  activeTab.value = 'home';
};

const handleSearch = () => {
  if (!searchQuery.value) return;
  hasSearched.value = true;
  // 模拟数据
  results.value = Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    title: `Result for ${searchQuery.value} ${i+1}`,
    price: (Math.random() * 200 + 50).toFixed(2),
    image: `https://picsum.photos/400/${400 + i*10}?random=search-${i}`,
    ratio: 1.2,
    extraHeight: 90
  }));
};

const quickSearch = (tag: string) => {
  searchQuery.value = tag;
  handleSearch();
};

const clearHistory = () => {
  historyTags.value = [];
};
</script>

<style lang="scss" scoped>
@import '@/styles/test-page.scss';

.search-page {
  background-color: $test-bg-page;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.search-header {
  padding: 30rpx 40rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  background-color: $test-bg-card;

  .search-input-wrap {
    flex: 1;
    height: 88rpx;
    background: $test-gray-100;
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    padding: 0 24rpx;

    .search-input {
      flex: 1;
      margin-left: 16rpx;
      font-size: 28rpx;
      color: $test-text-primary;
    }
  }
}

.search-content {
  flex: 1;
  padding: 40rpx;
  box-sizing: border-box;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;

  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: $test-text-primary;
  }
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;

  .history-tag, .hot-tag {
    padding: 16rpx 32rpx;
    background: $test-bg-card;
    border: 1px solid $test-border-color;
    border-radius: 40rpx;
    font-size: 26rpx;
    color: $test-text-secondary;
    display: flex;
    align-items: center;
  }

  .hot-tag {
    border-color: rgba($test-primary, 0.2);
    color: $test-text-primary;
  }
}

.product-card {
  background: $test-bg-card;
  border-radius: 24rpx;
  overflow: hidden;

  .image-wrapper {
    width: 100%;
    background: $test-gray-100;
  }

  .product-info {
    padding: 16rpx;
    .product-title {
      font-size: 26rpx;
      color: $test-text-primary;
      display: block;
      margin-bottom: 8rpx;
    }
    .product-price {
      font-size: 28rpx;
      font-weight: bold;
      color: $test-text-primary;
    }
  }
}
</style>
