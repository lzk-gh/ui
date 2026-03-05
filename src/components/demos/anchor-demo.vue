<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue';
import LkAnchor from '../../uni_modules/lucky-ui/components/lk-anchor/lk-anchor.vue';
import LkAnchorLink from '../../uni_modules/lucky-ui/components/lk-anchor/lk-anchor-link.vue';

// ====== 分类数据 ======
const categories = [
  { id: 'c-hot',   name: '🔥 人气热卖', tag: 'HOT' },
  { id: 'c-set',   name: '🧋 超值套餐', tag: '' },
  { id: 'c-new',   name: '🌿 季节新品', tag: 'NEW' },
  { id: 'c-fruit', name: '🍓 鲜果茶', tag: '' },
  { id: 'c-milk',  name: '🥛 纯茶系列', tag: '' },
  { id: 'c-add',   name: '🍡 加料定制', tag: '' },
  { id: 'c-side',  name: '🍞 小食搭配', tag: '' },
];

// ====== 商品数据 ======
const goodsData: Record<string, { name: string; desc: string; price: string }[]> = {
  'c-hot':   [
    { name: '芝芝莓莓', desc: '草莓+芝士奶霜·爆款', price: '28' },
    { name: '多肉葡萄', desc: '新鲜葡萄·月售9999+', price: '26' },
    { name: '芋泥波波牛乳茶', desc: '满满芋泥·香甜丝滑', price: '32' },
    { name: '四季春拿铁', desc: '茶香与奶香的巧妙融合', price: '22' },
  ],
  'c-set':   [
    { name: '双人同享套餐', desc: '任选2杯+2份小食', price: '58' },
    { name: '好友分享套餐', desc: '任选4杯 好友畅饮', price: '99' },
    { name: '早餐元气套餐', desc: '1饮品+1三明治', price: '35' },
  ],
  'c-new':   [
    { name: '白桃乌龙', desc: '限定上市·限量供应', price: '30' },
    { name: '西柚绿茶', desc: '清爽夏日·酸甜开胃', price: '26' },
    { name: '椰椰芒果', desc: '热带风情·浓郁果香', price: '28' },
  ],
  'c-fruit': [
    { name: '满杯红柚', desc: '整颗红柚鲜榨', price: '29' },
    { name: '霸气玉油柑', desc: '余甘子回甘·清爽', price: '25' },
    { name: '满杯黄金芒', desc: '黄金芒果·香甜浓郁', price: '27' },
    { name: '多肉青提', desc: '新鲜青提·颗颗饱满', price: '26' },
  ],
  'c-milk':  [
    { name: '满分金凤茶王', desc: '金凤茶+鲜奶·醇香', price: '18' },
    { name: '翡翠拿铁', desc: '绿茶浓缩+燕麦奶', price: '22' },
    { name: '大红袍拿铁', desc: '岩茶·矿物韵感', price: '24' },
  ],
  'c-add':   [
    { name: '布蕾波波', desc: '香滑布蕾+黑糯米波波', price: '+5' },
    { name: '芋泥球', desc: '手工芋泥·细腻软糯', price: '+6' },
    { name: '芝士奶霜', desc: '咸香奶盖·经典搭配', price: '+6' },
  ],
  'c-side':  [
    { name: '海岩脆厚吐司', desc: '现烤吐司·外酥里嫩', price: '15' },
    { name: '可颂夹心', desc: '黄油可颂·多种夹心', price: '18' },
    { name: '班戟蛋糕', desc: '薄饼夹奶油·口感轻盈', price: '16' },
  ],
};

// ====== 购物车 ======
const cart = ref<Record<string, number>>({});

const getCount = (key: string) => cart.value[key] ?? 0;

const addItem = (key: string) => {
  cart.value[key] = (cart.value[key] ?? 0) + 1;
};
const removeItem = (key: string) => {
  if ((cart.value[key] ?? 0) > 0) cart.value[key]--;
};

const cartTotal = ref(0);
const updateTotal = () => {
  let total = 0;
  Object.entries(cart.value).forEach(([key, count]) => {
    const [cid, idx] = key.split('-');
    const price = parseFloat(goodsData[cid]?.[+idx]?.price ?? '0');
    total += price * count;
  });
  cartTotal.value = Math.round(total * 10) / 10;
};

const addWithUpdate = (key: string) => { addItem(key); updateTotal(); };
const removeWithUpdate = (key: string) => { removeItem(key); updateTotal(); };

// ====== Anchor 联动 ======
const anchorRef = ref();
const scrollIntoViewId = ref('');
const currentScrollTop = ref(0);
const hasMeasured = ref(false);
const instance = getCurrentInstance();

type AnchorItem = { href: string; top: number; height: number };

function measureTargets(baseScrollTop = currentScrollTop.value) {
  if (!instance?.proxy) return;
  const query = uni.createSelectorQuery();
  query.in(instance.proxy);
  query.select('#anchor-content').boundingClientRect();
  categories.forEach(c => query.select(`#${c.id}`).boundingClientRect());
  query.exec((res: Array<{ top?: number; height?: number } | null>) => {
    const containerRect = res[0];
    const measured: AnchorItem[] = categories
      .map((c, i) => {
        const rect = res[i + 1];
        if (!rect || typeof rect.top !== 'number') return null;
        return {
          href: c.id,
          top: rect.top - (containerRect?.top ?? 0) + baseScrollTop,
          height: rect.height ?? 0,
        };
      })
      .filter((x): x is AnchorItem => !!x)
      .sort((a, b) => a.top - b.top);
    if (measured.length > 0) {
      hasMeasured.value = true;
      anchorRef.value?.setTargets?.(measured, baseScrollTop);
    }
  });
}

const onScroll = (e: { detail: { scrollTop: number } }) => {
  currentScrollTop.value = e.detail.scrollTop;
  if (!hasMeasured.value) measureTargets(e.detail.scrollTop);
  else anchorRef.value?.onScroll?.(e.detail.scrollTop);
};

const onAnchorClick = (href: string) => {
  scrollIntoViewId.value = href;
};

onMounted(() => {
  setTimeout(() => measureTargets(), 600);
});
</script>

<template>
  <view class="order-page">
    <!-- ====== 顶部店头 Header ====== -->
    <view class="shop-header">
      <view class="shop-header__info">
        <view class="shop-header__name">🧋 LuckyTea 幸运茶</view>
        <view class="shop-header__tips">新鲜现制 · 全程可见 · 不好喝退款</view>
      </view>
      <view class="shop-header__cart">
        <view class="cart-icon">
          <text class="cart-emoji">🛒</text>
          <view v-if="cartTotal > 0" class="cart-badge">
            <text>{{ cartTotal }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- ====== 主体：左侧分类 + 右侧商品内容 ====== -->
    <view class="order-body">
      <!-- 左侧锚点导航 -->
      <view class="sidebar">
        <lk-anchor
          ref="anchorRef"
          target-container="#anchor-content"
          :show-line="true"
          :scroll-top="currentScrollTop"
          @click="onAnchorClick"
        >
          <lk-anchor-link
            v-for="cat in categories"
            :key="cat.id"
            :href="cat.id"
            :title="cat.name"
          />
        </lk-anchor>
      </view>

      <!-- 右侧商品列表 -->
      <scroll-view
        id="anchor-content"
        class="goods-content"
        scroll-y
        scroll-with-animation
        :scroll-into-view="scrollIntoViewId"
        :show-scrollbar="false"
        @scroll="onScroll"
      >
        <view
          v-for="cat in categories"
          :id="cat.id"
          :key="cat.id"
          class="goods-section"
        >
          <!-- 分类标题 -->
          <view class="goods-section__header">
            <text class="goods-section__title">{{ cat.name }}</text>
            <view v-if="cat.tag" class="goods-section__tag">{{ cat.tag }}</view>
          </view>

          <!-- 商品列表 -->
          <view
            v-for="(good, gi) in goodsData[cat.id]"
            :key="gi"
            class="goods-item"
          >
            <image
              class="goods-item__img"
              :src="`https://picsum.photos/seed/lktea-${cat.id}-${gi}/200/200`"
              mode="aspectFill"
            />
            <view class="goods-item__body">
              <text class="goods-item__name">{{ good.name }}</text>
              <text class="goods-item__desc">{{ good.desc }}</text>
              <view class="goods-item__footer">
                <text class="goods-item__price">
                  <text class="price-symbol">¥</text>{{ good.price }}
                </text>
                <!-- 数量控制 -->
                <view class="goods-item__stepper">
                  <view
                    v-if="getCount(`${cat.id}-${gi}`) > 0"
                    class="stepper-btn stepper-btn--minus"
                    @click="removeWithUpdate(`${cat.id}-${gi}`)"
                  >－</view>
                  <text
                    v-if="getCount(`${cat.id}-${gi}`) > 0"
                    class="stepper-count"
                  >{{ getCount(`${cat.id}-${gi}`) }}</text>
                  <view
                    class="stepper-btn stepper-btn--add"
                    @click="addWithUpdate(`${cat.id}-${gi}`)"
                  >＋</view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view style="height: 240rpx" />
      </scroll-view>
    </view>

    <!-- ====== 底部结算栏 ====== -->
    <view class="checkout-bar">
      <view class="checkout-bar__cart">
        <text class="checkout-bar__cart-icon">🛒</text>
        <view v-if="cartTotal > 0" class="checkout-bar__badge">{{ cartTotal }}</view>
      </view>
      <view class="checkout-bar__middle">
        <text v-if="cartTotal <= 0" class="checkout-bar__hint">还差一点~ 开始选吧～</text>
        <view v-else class="checkout-bar__total">
          <text class="total-label">合计：</text>
          <text class="total-price">¥{{ cartTotal }}</text>
        </view>
      </view>
      <view
        class="checkout-bar__btn"
        :class="{ 'checkout-bar__btn--active': cartTotal > 0 }"
      >
        <text>{{ cartTotal > 0 ? '去结算' : '选好啦' }}</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
// ===== 整体页面 =====
.order-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f4f5f7;
}

// ===== 店头 Header =====
.shop-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 30rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #f0f0f0;

  &__name {
    font-size: 34rpx;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 8rpx;
  }

  &__tips {
    font-size: 22rpx;
    color: #999;
  }

  &__cart {
    position: relative;
  }
}

.cart-icon {
  position: relative;
  font-size: 52rpx;
  line-height: 1;
}

.cart-emoji {
  font-size: 52rpx;
}

.cart-badge {
  position: absolute;
  top: -10rpx;
  right: -14rpx;
  min-width: 36rpx;
  height: 36rpx;
  background: #ff4444;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8rpx;

  text {
    font-size: 20rpx;
    color: #fff;
    font-weight: bold;
    line-height: 1;
  }
}

// ===== 主体布局 =====
.order-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

// ===== 左侧导航 =====
.sidebar {
  width: 180rpx;
  height: 100%;
  flex-shrink: 0;
}

// ===== 右侧商品 =====
.goods-content {
  flex: 1;
  height: 100%;
  background-color: #fff;
}

// ===== 分类 Section =====
.goods-section {
  padding: 0 0 20rpx 0;

  &__header {
    display: flex;
    align-items: center;
    gap: 12rpx;
    padding: 28rpx 24rpx 16rpx;
    position: sticky;
    top: 0;
    background-color: #fff;
    z-index: 10;
  }

  &__title {
    font-size: 28rpx;
    font-weight: 700;
    color: #1a1a1a;
  }

  &__tag {
    font-size: 20rpx;
    color: #fff;
    background: linear-gradient(135deg, #ff7043, #ff4444);
    padding: 2rpx 10rpx;
    border-radius: 20rpx;
    font-weight: bold;
    letter-spacing: 1px;
  }
}

// ===== 商品卡片 =====
.goods-item {
  display: flex;
  padding: 20rpx 24rpx;
  gap: 20rpx;
  border-bottom: 1rpx solid #f8f8f8;

  &__img {
    width: 160rpx;
    height: 160rpx;
    border-radius: 16rpx;
    flex-shrink: 0;
    background-color: #f4f5f7;
  }

  &__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 160rpx;
  }

  &__name {
    font-size: 28rpx;
    font-weight: 600;
    color: #1a1a1a;
    line-height: 1.4;
  }

  &__desc {
    font-size: 22rpx;
    color: #999;
    line-height: 1.5;
    margin-top: 6rpx;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12rpx;
  }

  &__price {
    font-size: 32rpx;
    font-weight: 700;
    color: #ff4444;

    .price-symbol {
      font-size: 22rpx;
      margin-right: 2rpx;
    }
  }
}

// ===== 数量步进器 =====
.goods-item__stepper {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.stepper-btn {
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 34rpx;
  line-height: 1;

  &--add {
    background: #1db954;
    color: #fff;
    font-weight: bold;
  }

  &--minus {
    background: #f4f5f7;
    color: #666;
    border: 1rpx solid #e0e0e0;
  }
}

.stepper-count {
  font-size: 30rpx;
  font-weight: 700;
  color: #1a1a1a;
  min-width: 40rpx;
  text-align: center;
}

// ===== 底部结算栏 =====
.checkout-bar {
  flex-shrink: 0;
  height: 120rpx;
  background: #2b2b2b;
  display: flex;
  align-items: center;
  padding: 0 24rpx;
  gap: 20rpx;

  &__cart {
    position: relative;
    width: 88rpx;
    height: 88rpx;
    background: #3a3a3a;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 44rpx;
  }

  &__cart-icon {
    font-size: 44rpx;
  }

  &__badge {
    position: absolute;
    top: -4rpx;
    right: -4rpx;
    min-width: 36rpx;
    height: 36rpx;
    background: #ff4444;
    border-radius: 18rpx;
    font-size: 20rpx;
    color: #fff;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 6rpx;
  }

  &__middle {
    flex: 1;
    overflow: hidden;
  }

  &__hint {
    font-size: 26rpx;
    color: #888;
  }

  &__total {
    display: flex;
    align-items: baseline;
    gap: 6rpx;

    .total-label {
      font-size: 24rpx;
      color: #aaa;
    }

    .total-price {
      font-size: 40rpx;
      font-weight: 700;
      color: #fff;
    }
  }

  &__btn {
    width: 180rpx;
    height: 80rpx;
    border-radius: 40rpx;
    background: #555;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    text {
      font-size: 30rpx;
      color: #888;
      font-weight: 600;
    }

    &--active {
      background: linear-gradient(135deg, #1db954, #17a34a);

      text {
        color: #fff;
      }
    }
  }
}
</style>
