<script setup lang="ts">
import { computed, ref } from 'vue';
import { useThemeStore, type Theme } from '@/stores/theme';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';
import LkCarousel from '@/uni_modules/lucky-ui/components/lk-carousel/lk-carousel.vue';

interface FashionSlide {
  id: string;
  image: string;
  tag: string;
  title: string;
  subtitle: string;
  meta: string;
}

interface AutoHeightPanel {
  id: string;
  title: string;
  desc: string;
  stats: string[];
}

const themeStore = useThemeStore();
const currentTheme = computed(() => themeStore.theme);
const themeClass = computed(() => themeStore.themeClass);
const brandStyleVars = computed(() => themeStore.brandStyleVars);
const themeOptions: Array<{ label: string; value: Theme }> = [
  { label: '浅色', value: 'light' },
  { label: '暗色', value: 'dark' },
];

const fashionSlides = ref<FashionSlide[]>([
  {
    id: 'atelier',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
    tag: 'Atelier',
    title: '秋冬高级成衣',
    subtitle: '羊绒、皮革与低饱和灰调的层次搭配',
    meta: 'LOOK 01',
  },
  {
    id: 'gallery',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80',
    tag: 'Editorial',
    title: '城市画廊大片',
    subtitle: '利落廓形配合冷感光影，适合品牌首屏',
    meta: 'LOOK 02',
  },
  {
    id: 'resort',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
    tag: 'Resort',
    title: '度假系列精选',
    subtitle: '自然材质、柔和轮廓与高端生活方式场景',
    meta: 'LOOK 03',
  },
  {
    id: 'beauty',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
    tag: 'Beauty',
    title: '美妆新品视觉',
    subtitle: '干净背景与近景人物，突出高阶质感',
    meta: 'LOOK 04',
  },
]);

const imageList = computed(() => fashionSlides.value.map(item => item.image));
const autoPanels = ref<AutoHeightPanel[]>([
  {
    id: 'brief',
    title: 'Campaign Brief',
    desc: '适合首页运营位，承载系列标题、卖点和行动入口。',
    stats: ['4 张精选图片', 'Bars 指示器', '点击可跳转'],
  },
  {
    id: 'theme',
    title: 'Theme Ready',
    desc: '示例样式全部使用主题变量，切换亮暗主题后卡片、文本、边框会自动响应。',
    stats: ['浅色模式', '暗色模式', '品牌色联动', '无硬编码颜色'],
  },
]);

const currentHero = ref(0);
const currentBars = ref(0);
const currentCorner = ref(0);
const currentNumber = ref(0);
const currentSide = ref(0);
const currentVertical = ref(0);
const currentCard = ref(0);
const currentAutoHeight = ref(0);

function setTheme(theme: Theme) {
  themeStore.setTheme(theme);
}

function handleClick(item: unknown, index: number) {
  const title = isFashionSlide(item) ? item.title : `第 ${index + 1} 张`;
  uni.showToast({ title, icon: 'none' });
}

function isFashionSlide(item: unknown): item is FashionSlide {
  return typeof item === 'object' && item !== null && 'title' in item;
}
</script>

<template>
  <view class="component-demo" :class="themeClass" :style="brandStyleVars">
    <demo-block title="主题切换" desc="切换后观察轮播容器、文字、边框和指示器的亮暗主题表现。">
      <view class="theme-panel">
        <view class="theme-panel__info">
          <text class="theme-panel__eyebrow">Theme Preview</text>
          <text class="theme-panel__title">
            当前为 {{ currentTheme === 'dark' ? '暗色模式' : '浅色模式' }}
          </text>
          <text class="theme-panel__desc">示例使用主题 token，适合直接验证多主题适配。</text>
        </view>
        <view class="theme-panel__actions">
          <view
            v-for="item in themeOptions"
            :key="item.value"
            class="theme-chip"
            :class="{ 'theme-chip--active': currentTheme === item.value }"
            @tap="setTheme(item.value)"
          >
            <text>{{ item.label }}</text>
          </view>
        </view>
      </view>
    </demo-block>

    <demo-block title="高级时尚 Banner" desc="自定义插槽叠加标题、标签与内容信息，适合品牌首屏。">
      <lk-carousel
        v-model:current="currentHero"
        :carousel-list="fashionSlides"
        indicator-type="bars"
        indicator-position="bottom-left"
        indicator-active-color="var(--carousel-demo-on-media)"
        indicator-inactive-color="var(--carousel-demo-indicator-muted)"
        :indicator-clickable="true"
        height="440rpx"
        @click="handleClick"
      >
        <template #default="{ item }">
          <view class="hero-slide">
            <image class="hero-slide__image" :src="item.image" mode="aspectFill" />
            <view class="hero-slide__shade" />
            <view class="hero-slide__content">
              <text class="hero-slide__tag">{{ item.tag }}</text>
              <text class="hero-slide__title">{{ item.title }}</text>
              <text class="hero-slide__subtitle">{{ item.subtitle }}</text>
              <text class="hero-slide__meta">{{ item.meta }}</text>
            </view>
          </view>
        </template>
      </lk-carousel>
    </demo-block>

    <demo-block title="基础图片轮播" desc="图片素材更换为时尚大片，默认圆点指示器适合通用场景。">
      <lk-carousel
        v-model:current="currentBars"
        :carousel-list="imageList"
        indicator-type="dots"
        height="360rpx"
        @click="handleClick"
      />
    </demo-block>

    <demo-block title="圆润条形指示器" desc="覆盖指示器颜色时仍使用 CSS 变量，亮暗主题更稳定。">
      <lk-carousel
        v-model:current="currentCorner"
        :carousel-list="imageList"
        indicator-type="bars"
        indicator-active-color="var(--carousel-demo-on-media)"
        indicator-inactive-color="var(--carousel-demo-indicator-muted)"
        height="360rpx"
      />
    </demo-block>

    <demo-block title="角落数字指示器">
      <lk-carousel
        v-model:current="currentNumber"
        :carousel-list="imageList"
        indicator-position="top-right"
        indicator-type="number"
        height="360rpx"
      />
    </demo-block>

    <demo-block title="侧边垂直指示器">
      <lk-carousel
        v-model:current="currentSide"
        :carousel-list="imageList"
        indicator-position="left"
        indicator-type="bars"
        height="360rpx"
      />
    </demo-block>

    <demo-block title="竖向轮播">
      <lk-carousel
        v-model:current="currentVertical"
        :carousel-list="imageList"
        :vertical="true"
        indicator-position="right"
        indicator-type="dots"
        height="420rpx"
      />
    </demo-block>

    <demo-block title="卡片模式" desc="圆角、阴影、缩放和预览边距组合，适合专题入口和商品系列展示。">
      <view class="card-demo-bg">
        <lk-carousel
          v-model:current="currentCard"
          :carousel-list="fashionSlides"
          :card="true"
          height="400rpx"
          card-prev-margin="56rpx"
          card-next-margin="56rpx"
          :card-scale="0.9"
          card-radius="28rpx"
          card-shadow="var(--lk-shadow-lg)"
          indicator-type="bars"
          indicator-position="bottom"
        >
          <template #default="{ item }">
            <view class="card-slide">
              <image class="card-slide__image" :src="item.image" mode="aspectFill" />
              <view class="card-slide__caption">
                <text>{{ item.title }}</text>
              </view>
            </view>
          </template>
        </lk-carousel>
      </view>
    </demo-block>

    <demo-block title="自适应高度" desc="不同内容长度下自动测量高度，适合营销说明与活动信息卡。">
      <lk-carousel
        v-model:current="currentAutoHeight"
        :carousel-list="autoPanels"
        :auto-height="true"
        indicator-type="dots"
        indicator-active-color="var(--lk-color-primary)"
        indicator-color="var(--lk-color-border-light)"
      >
        <template #default="{ item }">
          <view class="custom-content">
            <view class="content-card">
              <text class="content-card__title">{{ item.title }}</text>
              <text class="content-card__desc">{{ item.desc }}</text>
              <view class="content-card__stats">
                <text v-for="stat in item.stats" :key="stat" class="content-card__stat">
                  {{ stat }}
                </text>
              </view>
            </view>
          </view>
        </template>
      </lk-carousel>
    </demo-block>
  </view>
</template>

<style scoped lang="scss">
.component-demo {
  --carousel-demo-on-media: var(--lk-color-text-inverse);
  --carousel-demo-indicator-muted: var(--lk-color-border-light);

  min-height: 100vh;
  padding-bottom: var(--lk-rpx-60);
  background: var(--lk-color-bg-page);
}

.component-demo.lk-theme-dark {
  --carousel-demo-on-media: var(--lk-text-primary);
}

.theme-panel {
  display: flex;
  flex-direction: column;
  gap: var(--lk-spacing-md);
  padding: var(--lk-spacing-md);
  border: var(--lk-rpx-2) solid var(--lk-color-border-light);
  border-radius: var(--lk-radius-lg);
  background: var(--lk-color-bg-surface);
}

.theme-panel__info {
  display: flex;
  flex-direction: column;
  gap: var(--lk-spacing-xs);
}

.theme-panel__eyebrow {
  color: var(--lk-color-primary);
  font-size: var(--lk-font-size-xs);
  font-weight: 700;
  letter-spacing: var(--lk-rpx-2);
  text-transform: uppercase;
}

.theme-panel__title {
  color: var(--lk-color-text);
  font-size: var(--lk-font-size-lg);
  font-weight: 700;
}

.theme-panel__desc {
  color: var(--lk-color-text-secondary);
  font-size: var(--lk-font-size-sm);
  line-height: 1.6;
}

.theme-panel__actions {
  display: flex;
  gap: var(--lk-spacing-sm);
}

.theme-chip {
  flex: 1;
  height: var(--lk-rpx-64);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--lk-radius-full);
  background: var(--lk-color-fill-tertiary);
  color: var(--lk-color-text-secondary);
  font-size: var(--lk-font-size-sm);
}

.theme-chip--active {
  background: var(--lk-color-primary-bg-soft);
  color: var(--lk-color-primary);
  font-weight: 700;
}

.hero-slide,
.card-slide {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: inherit;
}

.hero-slide__image,
.card-slide__image {
  width: 100%;
  height: 100%;
  display: block;
}

.hero-slide__shade {
  position: absolute;
  inset: 0;
  background: var(--lk-overlay-bg);
}

.hero-slide__content {
  position: absolute;
  left: var(--lk-spacing-lg);
  right: var(--lk-spacing-lg);
  bottom: var(--lk-spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--lk-spacing-xs);
  color: var(--carousel-demo-on-media);
}

.hero-slide__tag,
.hero-slide__meta {
  font-size: var(--lk-font-size-xs);
  font-weight: 700;
  letter-spacing: var(--lk-rpx-2);
  text-transform: uppercase;
}

.hero-slide__title {
  font-size: var(--lk-rpx-42);
  font-weight: 800;
  line-height: 1.15;
}

.hero-slide__subtitle {
  max-width: var(--lk-rpx-560);
  font-size: var(--lk-font-size-sm);
  line-height: 1.6;
}

.hero-slide__meta {
  margin-top: var(--lk-spacing-sm);
}

.card-demo-bg {
  padding: var(--lk-spacing-sm) 0;
}

.card-slide__caption {
  position: absolute;
  left: var(--lk-spacing-md);
  right: var(--lk-spacing-md);
  bottom: var(--lk-spacing-md);
  padding: var(--lk-spacing-sm) var(--lk-spacing-md);
  border-radius: var(--lk-radius-full);
  background: var(--lk-overlay-bg);
  color: var(--carousel-demo-on-media);
  font-size: var(--lk-font-size-sm);
  font-weight: 700;
}

.custom-content {
  width: 100%;
  padding: var(--lk-spacing-sm);
  box-sizing: border-box;
}

.content-card {
  display: flex;
  flex-direction: column;
  gap: var(--lk-spacing-sm);
  padding: var(--lk-spacing-lg);
  border: var(--lk-rpx-2) solid var(--lk-color-border-light);
  border-radius: var(--lk-radius-lg);
  background: var(--lk-color-bg-surface);
}

.content-card__title {
  color: var(--lk-color-text);
  font-size: var(--lk-font-size-lg);
  font-weight: 700;
}

.content-card__desc {
  color: var(--lk-color-text-secondary);
  font-size: var(--lk-font-size-sm);
  line-height: 1.7;
}

.content-card__stats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--lk-spacing-xs);
}

.content-card__stat {
  padding: var(--lk-rpx-8) var(--lk-rpx-16);
  border-radius: var(--lk-radius-full);
  background: var(--lk-color-primary-bg-soft);
  color: var(--lk-color-primary);
  font-size: var(--lk-font-size-xs);
}
</style>
