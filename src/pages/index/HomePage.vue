<template>
  <view class="home-page" :class="themeClass">
    <lk-waterfall
      :items="products"
      height="100%"
      :gutter="16"
      :row-gap="20"
      :padding-x="20"
      :padding-y="0"
      card-radius="24"
      @load-more="handleLoadMore"
    >
      <template #header>
        <view class="header-container">
          <!-- 用户头像与欢迎语 -->
          <view class="header-section">
            <view class="user-info">
              <text class="welcome-text">Hello, Welcome 👋</text>
              <text class="user-name">Albert Stevano</text>
            </view>
            <lk-avatar
              src="https://picsum.photos/100/100?random=100"
              size="80"
              round
            />
          </view>

          <!-- 搜索与筛选 -->
          <view class="search-section">
            <view class="search-bar" @click="activeTab = 'search'">
              <lk-icon name="search" size="32" color="var(--test-text-tertiary)" />
              <view class="search-ticker">
                <lk-notice-bar
                  :messages="searchHints"
                  scrollable="vertical"
                  :speed="2"
                  no-background
                />
              </view>
            </view>
            <lk-button>
              <lk-icon name="sliders" size="32" color="var(--test-text-inverse)" @click="showFilter = true" />
            </lk-button>
          </view>

          <!-- 分类标签 -->
          <scroll-view scroll-x class="category-scroll" show-scrollbar="false">
            <view class="category-list">
              <view
                v-for="(item, index) in categories"
                :key="index"
                :class="['category-item', activeCategory === index ? 'active' : '']"
                @click="activeCategory = index"
              >
                <lk-icon
                  v-if="item.icon"
                  :name="item.icon"
                  size="28"
                  :color="activeCategory === index ? 'var(--test-text-inverse)' : 'var(--test-text-primary)'"
                />
                <text class="category-name">{{ item.name }}</text>
              </view>
            </view>
          </scroll-view>
        </view>
      </template>

      <template #item="{ item, height }">
        <view class="product-card" @click="goToDetail(item)">
          <view class="image-wrapper" :style="{ height: (height - (item.extraHeight || 90)) + 'px' }">
            <image :src="item.image" mode="aspectFill" class="product-image" />
            <view class="favorite-icon">
              <lk-icon name="heart" size="24" color="#fff" />
            </view>
          </view>
          <view class="product-info">
            <text class="product-title">{{ item.title }}</text>
            <text class="product-type">{{ item.type }}</text>
            <view class="price-row">
              <text class="product-price">${{ item.price }}</text>
              <view class="rating-box">
                <lk-icon name="star-fill" size="24" color="#FFD700" />
                <text class="rating-text">{{ item.rating }}</text>
              </view>
            </view>
          </view>
        </view>
      </template>
      <!-- 底部加载状态与安全区占位 -->
      <template #loading>
        <view class="loading-footer">
          <view v-if="isLoading" class="loading-status">
            <view class="dot-jump"></view>
            <view class="dot-jump"></view>
            <view class="dot-jump"></view>
          </view>
          <view class="safe-area-bottom"></view>
        </view>
      </template>
    </lk-waterfall>

    <!-- 交互增强：筛选弹窗 -->
    <lk-popup v-model="showFilter" position="right" width="600rpx">
      <view class="filter-panel" :class="themeClass">
        <view class="filter-header">
          <text class="filter-title">Filters</text>
          <text class="reset-btn" @click="resetFilter">Reset</text>
        </view>

        <scroll-view scroll-y class="filter-body">
          <view class="filter-group">
            <text class="group-title">Category</text>
            <view class="tag-flex">
              <view
                v-for="c in categories"
                :key="c.name"
                :class="['filter-tag', activeCategoryName === c.name ? 'active' : '']"
                @click="activeCategoryName = c.name"
              >
                {{ c.name }}
              </view>
            </view>
          </view>

          <view class="filter-group">
            <text class="group-title">Price Range</text>
            <view class="price-inputs">
              <input class="price-input" placeholder="Min" type="number" />
              <view class="dash">-</view>
              <input class="price-input" placeholder="Max" type="number" />
            </view>
          </view>

          <view class="filter-group">
            <text class="group-title">Sort By</text>
            <view class="tag-flex">
              <view v-for="s in ['Newest', 'Price: Low to High', 'Price: High to Low', 'Popular']" :key="s" class="filter-tag">
                {{ s }}
              </view>
            </view>
          </view>
        </scroll-view>

        <view class="filter-footer">
          <lk-button type="primary" block radius="40" @click="showFilter = false">Apply Filters</lk-button>
        </view>
      </view>
    </lk-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import type { WaterfallItem } from '@/uni_modules/lucky-ui/components/lk-waterfall/waterfall.props';
import LkAvatar from '@/uni_modules/lucky-ui/components/lk-avatar/lk-avatar.vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import LkWaterfall from '@/uni_modules/lucky-ui/components/lk-waterfall/lk-waterfall.vue';
import LkNoticeBar from '@/uni_modules/lucky-ui/components/lk-notice-bar/lk-notice-bar.vue';
import LkPopup from '@/uni_modules/lucky-ui/components/lk-popup/lk-popup.vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';

defineProps<{
  contentHeight: string;
}>();

const activeTab = inject('activeTab', ref('home'));
const themeClass = inject('themeClass', ref('lk-theme-light'));

const showFilter = ref(false);
const activeCategoryName = ref('All Items');
const resetFilter = () => { activeCategoryName.value = 'All Items'; };

type ProductItem = WaterfallItem & {
  id: number;
  title: string;
  type: string;
  price: string;
  rating: string;
  image: string;
  ratio: number;
  extraHeight: number;
};

const products = ref<ProductItem[]>([]);
const activeCategory = ref(0);
const categories = [
  { name: 'All Items', icon: 'grid' },
  { name: 'Dress', icon: 'list' },
  { name: 'T-Shirt', icon: 'box' },
  { name: 'Pants', icon: 'list' }
];

const mockAdjectives = ['Modern', 'Casual', 'Street', 'Light', 'Floral', 'Classic', 'Luxurious', 'Vintage', 'Minimalist', 'Cozy'];
const mockNouns = ['T-Shirt', 'Dress', 'Jacket', 'Pants', 'Gown', 'Hoodie', 'Skirts', 'Blazer', 'Sweater', 'Cardigan'];
const mockTypes = ['Modern', 'Style', 'Luxury', 'Casual', 'Summer', 'Winter', 'Autumn', 'Spring'];
const searchHints = [
  'Search: New arrivals',
  'Search: Summer dresses',
  'Search: Cozy hoodies',
  'Search: Minimalist tees'
];

const generateMockData = (count: number): ProductItem[] => {
  const newItems: ProductItem[] = [];
  for (let i = 0; i < count; i++) {
    const id = products.value.length + i + 1;
    const adj = mockAdjectives[Math.floor(Math.random() * mockAdjectives.length)];
    const noun = mockNouns[Math.floor(Math.random() * mockNouns.length)];
    const type = mockTypes[Math.floor(Math.random() * mockTypes.length)];
    // 随机宽高比 1.0 - 1.35
    const ratio = 1.0 + Math.random() * 0.35;

    newItems.push({
      id,
      title: `${adj} ${noun}`,
      type: `${type} style`,
      price: (50 + Math.random() * 500).toFixed(2),
      rating: (4.5 + Math.random() * 0.5).toFixed(1),
      image: `https://picsum.photos/400/${Math.floor(400 * ratio)}?random=${id}`,
      ratio,
      extraHeight: 90
    });
  }
  return newItems;
};

// 初始化数据
products.value = generateMockData(10);

const isLoading = ref(false);
const handleLoadMore = () => {
  if (isLoading.value) return;
  isLoading.value = true;

  // 模拟网络请求
  setTimeout(() => {
    const nextData = generateMockData(6);
    products.value = [...products.value, ...nextData];
    isLoading.value = false;
  }, 1000);
};

const goToDetail = (_item: WaterfallItem) => {
  // 模拟切换到详情页
  activeTab.value = 'detail';
};
</script>

<style lang="scss" scoped>
@import '@/styles/test-page.scss';

.home-page {
  background-color: $test-bg-page;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}

:deep(.lk-waterfall__scroll) {
  width: 100%;
}

:deep(.lk-waterfall__content) {
  width: 100%;
}

.header-container {
  padding: 30rpx 30rpx 20rpx;
  flex-shrink: 0;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
  flex-shrink: 0;

  .user-info {
    display: flex;
    flex-direction: column;

    .welcome-text {
      font-size: 24rpx;
      color: $test-text-tertiary;
      margin-bottom: 4rpx;
    }

    .user-name {
      font-size: 36rpx;
      font-weight: bold;
      color: $test-text-primary;
    }
  }
}

.search-section {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 40rpx;
  flex-shrink: 0;

  .search-bar {
    flex: 1;
    height: 100rpx;
    background: $test-bg-card;
    border-radius: 24rpx;
    display: flex;
    align-items: center;
    padding: 0 30rpx;
    border: 1px solid $test-border-color;

    .search-ticker {
      flex: 1;
      margin-left: 20rpx;
      font-size: 28rpx;
      color: $test-text-tertiary;
      :deep(.lk-notice-bar) {
        height: 100%;
        display: flex;
        align-items: center;
      }
      :deep(.lk-notice-bar__message) {
        font-size: 28rpx;
        color: $test-text-tertiary;
      }
    }
  }

  .filter-btn {
    width: 100rpx;
    height: 100rpx;
    background: $test-text-primary;
    border-radius: 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.category-scroll {
  margin-bottom: 40rpx;
  flex-shrink: 0;
}

.category-list {
  display: flex;
  gap: 20rpx;
  padding-right: 30rpx;

  .category-item {
    display: flex;
    align-items: center;
    gap: 12rpx;
    padding: 20rpx 36rpx;
    background: $test-bg-card;
    border: 1px solid $test-border-color;
    border-radius: 24rpx;
    transition: all 0.3s;
    flex-shrink: 0;

    &.active {
      background: $test-text-primary;
      border-color: $test-text-primary;
      .category-name {
        color: $test-text-inverse;
      }
    }

    .category-name {
      font-size: 28rpx;
      color: $test-text-primary;
      font-weight: 500;
    }
  }
}

.product-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0;

  .image-wrapper {
    position: relative;
    width: 100%;
    border-radius: 24rpx;
    overflow: hidden;
    background-color: $test-gray-100;

    .product-image {
      width: 100%;
      height: 100%;
      display: block;
    }

    .favorite-icon {
      position: absolute;
      top: 24rpx;
      right: 24rpx;
      width: 60rpx;
      height: 60rpx;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(4rpx);
    }
  }

  .product-info {
    padding: 14rpx 12rpx 8rpx;
    flex-shrink: 0;
    box-sizing: border-box;

    .product-title {
      font-size: 28rpx;
      font-weight: bold;
      color: $test-text-primary;
      display: block;
      margin-bottom: 6rpx;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .product-type {
      font-size: 22rpx;
      color: $test-text-secondary;
      display: block;
      margin-bottom: 10rpx;
    }

    .price-row {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .product-price {
        font-size: 32rpx;
        font-weight: bold;
        color: $test-text-primary;
      }

      .rating-box {
        display: flex;
        align-items: center;
        gap: 6rpx;

        .rating-text {
          font-size: 24rpx;
          color: $test-text-primary;
          font-weight: 500;
        }
      }
    }
  }
}

.safe-area-bottom {
  height: 150rpx;
  flex-shrink: 0;
}

.loading-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.loading-status {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12rpx;
  padding: 30rpx 0;

  .dot-jump {
    width: 12rpx;
    height: 12rpx;
    background: $test-text-primary;
    border-radius: 50%;
    animation: dot-jump 0.6s infinite alternate;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

@keyframes dot-jump {
  from {
    transform: translateY(0);
    opacity: 0.4;
  }
  to {
    transform: translateY(-10rpx);
    opacity: 1;
  }
}

// 筛选弹窗样式
.filter-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: $test-bg-page;

  .filter-header {
    padding: 40rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: $test-bg-card;

    .filter-title {
      font-size: 36rpx;
      font-weight: bold;
      color: $test-text-primary;
    }

    .reset-btn {
      font-size: 26rpx;
      color: $test-primary;
    }
  }

  .filter-body {
    flex: 1;
    padding: 40rpx;
    box-sizing: border-box;

    .filter-group {
      margin-bottom: 50rpx;

      .group-title {
        font-size: 30rpx;
        font-weight: bold;
        color: $test-text-primary;
        margin-bottom: 24rpx;
        display: block;
      }

      .tag-flex {
        display: flex;
        flex-wrap: wrap;
        gap: 20rpx;

        .filter-tag {
          padding: 16rpx 32rpx;
          background: $test-bg-card;
          border: 1px solid $test-border-color;
          border-radius: 40rpx;
          font-size: 26rpx;
          color: $test-text-secondary;

          &.active {
            background: $test-text-primary;
            color: $test-text-inverse;
            border-color: $test-text-primary;
          }
        }
      }

      .price-inputs {
        display: flex;
        align-items: center;
        gap: 20rpx;

        .price-input {
          flex: 1;
          height: 80rpx;
          background: $test-bg-card;
          border-radius: 20rpx;
          text-align: center;
          font-size: 28rpx;
          border: 1px solid $test-border-color;
        }

        .dash {
          color: $test-text-tertiary;
        }
      }
    }
  }

  .filter-footer {
    padding: 40rpx;
    background-color: $test-bg-card;
  }
}
</style>


