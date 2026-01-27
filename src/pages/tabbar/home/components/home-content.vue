<template>
  <view class="home-content" :class="themeClass">
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
            <lk-input
              class="search-bar"
              fake
              prefix-icon="search"
              placeholder=""
              @click="goToSearch"
            >
              <view class="search-ticker">
                <lk-notice-bar
                  :messages="searchHints"
                  scrollable="vertical"
                  :speed="2"
                  no-background
                />
              </view>
            </lk-input>
            <lk-button @click="showFilter = true">
              <lk-icon name="sliders" size="32" color="var(--test-text-inverse)" />
            </lk-button>
          </view>

          <!-- 分类标签 -->
          <lk-horizontal-scroll hide-scrollbar>
            <lk-tag-group v-model="activeCategory" :wrap="false" :gap="30" size="lg">
              <lk-tag
                v-for="(item, index) in categories"
                :key="index"
                v-slot="{ checked }"
                :name="String(index)"
              >
                <lk-icon
                  v-if="item.icon"
                  :name="item.icon"
                  size="28"
                  :color="checked ? 'var(--test-text-inverse)' : 'var(--test-text-primary)'"
                />
                <text class="category-name">{{ item.name }}</text>
              </lk-tag>
            </lk-tag-group>
          </lk-horizontal-scroll>
        </view>
      </template>

      <template #item="{ item, height, loading, onImageLoad, onImageError }">
        <lk-card
          class="product-card"
          padding="0"
          :border="false"
          shadow="none"
          transparent
          @click="goToDetail(item)"
        >
          <template #cover>
            <view class="image-wrapper" :style="{ height: (height - (item.extraHeight || 90)) + 'px' }">
              <lk-skeleton
                class="product-image-skeleton"
                :loading="loading"
                :rows="1"
                row-width="100%"
                :row-height="`${height - (item.extraHeight || 90)}px`"
                animated
              />
              <lk-image
                :src="item.image"
                width="100%"
                height="100%"
                fit="cover"
                class="product-image"
                :show-loading="false"
                :style="{ opacity: loading ? 0 : 1 }"
                @load="onImageLoad"
                @error="onImageError"
              />
              <view class="favorite-icon">
                <lk-icon name="heart" size="24" color="#fff" />
              </view>
            </view>
          </template>
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
        </lk-card>
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
            <lk-tag-group v-model="activeCategoryName" class="tag-flex">
              <lk-tag
                v-for="c in categories"
                :key="c.name"
                :name="c.name"
              >
                {{ c.name }}
              </lk-tag>
            </lk-tag-group>
          </view>

          <view class="filter-group">
            <text class="group-title">Price Range</text>
            <view class="price-inputs">
              <lk-input class="price-input" placeholder="Min" type="number" border />
              <view class="dash">-</view>
              <lk-input class="price-input" placeholder="Max" type="number" border />
            </view>
          </view>

          <view class="filter-group">
            <text class="group-title">Sort By</text>
            <view class="tag-flex">
              <lk-tag
                v-for="s in ['Newest', 'Price: Low to High', 'Price: High to Low', 'Popular']"
                :key="s"
                class="filter-tag"
                size="md"
                type="light"
                bg-color="var(--test-bg-card)"
                text-color="var(--test-text-secondary)"
              >
                {{ s }}
              </lk-tag>
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
import { ref, computed } from 'vue';
import { useThemeStore } from '@/stores/theme';
import type { WaterfallItem } from '@/uni_modules/lucky-ui/components/lk-waterfall/waterfall.props';
import LkAvatar from '@/uni_modules/lucky-ui/components/lk-avatar/lk-avatar.vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import LkWaterfall from '@/uni_modules/lucky-ui/components/lk-waterfall/lk-waterfall.vue';
import LkNoticeBar from '@/uni_modules/lucky-ui/components/lk-notice-bar/lk-notice-bar.vue';
import LkPopup from '@/uni_modules/lucky-ui/components/lk-popup/lk-popup.vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkSkeleton from '@/uni_modules/lucky-ui/components/lk-skeleton/lk-skeleton.vue';
import LkCard from '@/uni_modules/lucky-ui/components/lk-card/lk-card.vue';
import LkTag from '@/uni_modules/lucky-ui/components/lk-tag/lk-tag.vue';
import LkTagGroup from '@/uni_modules/lucky-ui/components/lk-tag/lk-tag-group.vue';
import LkInput from '@/uni_modules/lucky-ui/components/lk-input/lk-input.vue';
import LkImage from '@/uni_modules/lucky-ui/components/lk-image/lk-image.vue';
import LkHorizontalScroll from '@/uni_modules/lucky-ui/components/lk-horizontal-scroll/lk-horizontal-scroll.vue';

defineProps<{
  contentHeight: string;
}>();

const themeStore = useThemeStore();
const themeClass = computed(() => themeStore.themeClass);

const showFilter = ref(false);
const activeCategoryName = ref('All Items');
const resetFilter = () => {
  activeCategoryName.value = 'All Items';
};

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
const activeCategory = ref<string | number>('0');
const categories = [
  { name: 'All Items', icon: 'grid' },
  { name: 'Dress', icon: 'list' },
  { name: 'T-Shirt', icon: 'box' },
  { name: 'Pants', icon: 'list' },
];

const mockAdjectives = ['Modern', 'Casual', 'Street', 'Light', 'Floral', 'Classic', 'Luxurious', 'Vintage', 'Minimalist', 'Cozy'];
const mockNouns = ['T-Shirt', 'Dress', 'Jacket', 'Pants', 'Gown', 'Hoodie', 'Skirts', 'Blazer', 'Sweater', 'Cardigan'];
const mockTypes = ['Modern', 'Style', 'Luxury', 'Casual', 'Summer', 'Winter', 'Autumn', 'Spring'];
const searchHints = ['Search: New arrivals', 'Search: Summer dresses', 'Search: Cozy hoodies', 'Search: Minimalist tees'];

const generateMockData = (count: number): ProductItem[] => {
  const newItems: ProductItem[] = [];
  for (let i = 0; i < count; i++) {
    const id = products.value.length + i + 1;
    const adj = mockAdjectives[Math.floor(Math.random() * mockAdjectives.length)];
    const noun = mockNouns[Math.floor(Math.random() * mockNouns.length)];
    const type = mockTypes[Math.floor(Math.random() * mockTypes.length)];
    const ratio = 1.0 + Math.random() * 0.35;

    newItems.push({
      id,
      title: `${adj} ${noun}`,
      type: `${type} style`,
      price: (50 + Math.random() * 500).toFixed(2),
      rating: (4.5 + Math.random() * 0.5).toFixed(1),
      image: `https://picsum.photos/400/${Math.floor(400 * ratio)}?random=${id}`,
      ratio,
      extraHeight: 90,
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

  setTimeout(() => {
    const nextData = generateMockData(6);
    products.value = [...products.value, ...nextData];
    isLoading.value = false;
  }, 1000);
};

/** 跳转到搜索页 */
const goToSearch = () => {
  uni.navigateTo({ url: '/pages_sub/search/index' });
};

/** 跳转到详情页 */
const goToDetail = (_item: WaterfallItem) => {
  uni.navigateTo({ url: '/pages_sub/product-detail/index' });
};
</script>

<style lang="scss" scoped>
@import '@/styles/test-page.scss';

.home-content {
  background-color: $test-bg-page;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  flex: 1;
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
    --_bg: #{$test-bg-card};
    --_border: #{$test-border-color};
    --_radius: 24rpx;
    --_height: 100rpx;
    --_px: 30rpx;

    :deep(.lk-input__fake) {
      height: 100rpx;
      display: flex;
      align-items: center;
    }

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
}

.product-card {
  width: 100%;
  box-sizing: border-box;
  padding: 0;

  .image-wrapper {
    position: relative;
    width: 100%;
    border-radius: 24rpx;
    overflow: hidden;
    background-color: $test-gray-100;

    .product-image-skeleton {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1;
      pointer-events: none;
    }

    .product-image {
      width: 100%;
      height: 100%;
      display: block;
      transition: opacity 0.3s ease;
      position: relative;
      z-index: 2;
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
      }

      .price-inputs {
        display: flex;
        align-items: center;
        gap: 20rpx;

        .price-input {
          flex: 1;
          border-radius: 20rpx;
          text-align: center;

          :deep(.lk-input__inner) {
            height: 80rpx;
            font-size: 28rpx;
            text-align: center;
          }
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
