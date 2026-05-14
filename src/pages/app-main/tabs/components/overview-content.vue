<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useThemeStore, PRESET_COLORS, DEFAULT_BRAND_COLOR } from '@/stores/theme';
import { Locale, SUPPORTED_LOCALES, type LocaleCode } from '@/uni_modules/lucky-ui/locale';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import LkPopup from '@/uni_modules/lucky-ui/components/lk-popup/lk-popup.vue';
import LkSwitch from '@/uni_modules/lucky-ui/components/lk-switch/lk-switch.vue';

defineProps<{
  contentHeight: string;
  skipAnimation?: boolean;
}>();

const themeStore = useThemeStore();

const searchKeyword = ref('');
const currentLocale = ref(Locale.locale);
const localeOptions = SUPPORTED_LOCALES;
const showLocalePopup = ref(false);
const PREVIEW_ICON_BRAND_STORAGE_KEY = 'lk-preview-icon-follow-brand';
const currentLocaleLabel = computed(
  () => localeOptions.find(locale => locale.value === currentLocale.value)?.label || currentLocale.value
);

// ============ 主题色配置 ============
const currentBrandColor = ref(DEFAULT_BRAND_COLOR);
const customColorInput = ref('');
const previewIconsFollowBrand = ref(true);
const previewIconColor = computed(() => (previewIconsFollowBrand.value ? 'primary' : 'text'));
const previewCategoryIconColor = (color: string) =>
  previewIconsFollowBrand.value ? color : 'text';

// 预设主题色
const presetColors = PRESET_COLORS;

// 切换预设颜色
const changeBrandColor = (color: string) => {
  currentBrandColor.value = color;
  customColorInput.value = color;
  themeStore.setBrandColor(color);
};

// 应用自定义颜色
const applyCustomColor = () => {
  const color = customColorInput.value.trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
    currentBrandColor.value = color;
    themeStore.setBrandColor(color);
  }
};

const togglePreviewIconColor = (value: boolean | string | number) => {
  previewIconsFollowBrand.value = Boolean(value);
  try {
    uni.setStorageSync(PREVIEW_ICON_BRAND_STORAGE_KEY, previewIconsFollowBrand.value);
  } catch {
    // Storage is best-effort in preview pages.
  }
};

const setLocale = (lang: LocaleCode) => {
  Locale.use(lang);
  currentLocale.value = lang;
  showLocalePopup.value = false;
};

// 初始化时恢复保存的颜色
onMounted(() => {
  if (themeStore.brandColor) {
    currentBrandColor.value = themeStore.brandColor;
    customColorInput.value = themeStore.brandColor;
  }
  try {
    const savedFollowBrand = uni.getStorageSync(PREVIEW_ICON_BRAND_STORAGE_KEY);
    if (typeof savedFollowBrand === 'boolean') {
      previewIconsFollowBrand.value = savedFollowBrand;
    }
  } catch {
    // Storage is best-effort in preview pages.
  }
});

// 组件分类数据
const categories = [
  {
    name: '基础组件',
    icon: 'box-seam',
    color: 'primary',
    components: [
      { name: 'button', label: 'Button', desc: '按钮', icon: 'app-indicator' },
      { name: 'icon', label: 'Icon', desc: '图标', icon: 'house' },
      { name: 'tag', label: 'Tag', desc: '标签', icon: 'tag' },
      { name: 'badge', label: 'Badge', desc: '徽标', icon: 'bell' },
      { name: 'avatar', label: 'Avatar', desc: '头像', icon: 'house' },
      { name: 'divider', label: 'Divider', desc: '分割线', icon: 'house' },
      { name: 'notice-bar', label: 'NoticeBar', desc: '通知栏', icon: 'house' },
      { name: 'image', label: 'Image', desc: '图片', icon: 'image' },
      { name: 'grid', label: 'Grid', desc: '栅格布局', icon: 'grid-3x3-gap' },
      { name: 'space', label: 'Space', desc: '元素间距', icon: 'arrows-expand' },
    ],
  },
  {
    name: '表单组件',
    icon: 'house',
    color: 'success',
    components: [
      { name: 'form', label: 'Form', desc: '表单', icon: 'house' },
      { name: 'input', label: 'Input', desc: '输入框', icon: 'house' },
      { name: 'textarea', label: 'Textarea', desc: '文本域', icon: 'house' },
      { name: 'radio', label: 'Radio', desc: '单选框', icon: 'record-circle' },
      { name: 'checkbox', label: 'Checkbox', desc: '复选框', icon: 'check-square' },
      { name: 'select-list', label: 'SelectList', desc: '选择列表', icon: 'list-check' },
      { name: 'switch', label: 'Switch', desc: '开关', icon: 'toggle-on' },
      { name: 'stepper', label: 'Stepper', desc: '步进器', icon: 'plus-slash-minus' },
      { name: 'slider', label: 'Slider', desc: '滑块', icon: 'sliders' },
      { name: 'rate', label: 'Rate', desc: '评分', icon: 'star' },
      { name: 'upload', label: 'Upload', desc: '上传', icon: 'cloud-upload' },
      { name: 'picker', label: 'Picker', desc: '选择器', icon: 'sliders' },
      { name: 'calendar', label: 'Calendar', desc: '日历', icon: 'calendar-date' },
      { name: 'calendar-picker', label: 'CalendarPicker', desc: '日历选择器', icon: 'calendar-date' },
      { name: 'keyboard', label: 'Keyboard', desc: '虚拟键盘', icon: 'keyboard' },
      { name: 'verify-code', label: 'VerifyCode', desc: '验证码', icon: 'shield-lock' },
    ],
  },
  {
    name: '数据展示',
    icon: 'grid-3x3-gap',
    color: 'warning',
    components: [
      { name: 'card', label: 'Card', desc: '卡片', icon: 'credit-card-2-front' },
      { name: 'cell', label: 'Cell', desc: '单元格', icon: 'list-ul' },
      { name: 'collapse', label: 'Collapse', desc: '折叠面板', icon: 'house' },
      { name: 'tabs', label: 'Tabs', desc: '标签页', icon: 'house' },
      { name: 'timeline', label: 'Timeline', desc: '时间轴', icon: 'hourglass-split' },
      { name: 'progress', label: 'Progress', desc: '进度条', icon: 'reception-4' },
      { name: 'pull-refresh', label: 'PullRefresh', desc: '下拉刷新', icon: 'arrow-clockwise' },
      { name: 'loading', label: 'Loading', desc: '加载', icon: 'arrow-clockwise' },
      { name: 'countdown', label: 'Countdown', desc: '倒计时', icon: 'stopwatch' },
      { name: 'skeleton', label: 'Skeleton', desc: '骨架屏', icon: 'list-ul' },
      { name: 'empty', label: 'Empty', desc: '空状态', icon: 'inbox' },
      { name: 'carousel', label: 'Carousel', desc: '轮播', icon: 'house' },
      { name: 'segmented', label: 'Segmented', desc: '分段器', icon: 'house' },
      { name: 'number-roller', label: 'NumberRoller', desc: '数字翻牌', icon: 'reception-4' },
      { name: 'meta-row', label: 'MetaRow', desc: '结构行', icon: 'layout-three-columns' },
      {
        name: 'horizontal-scroll',
        label: 'HorizontalScroll',
        desc: '横向滚动',
        icon: 'arrows-expand',
      },
      { name: 'chart-bar', label: 'ChartBar', desc: '柱状图', icon: 'reception-4' },
      { name: 'chart-line', label: 'ChartLine', desc: '折线图', icon: 'arrow-up-circle' },
      { name: 'chart-pie', label: 'ChartPie', desc: '饼/环图', icon: 'record-circle' },
      { name: 'chart-lite', label: 'ChartLite', desc: '轻量图表', icon: 'graph-up' },
    ],
  },
  {
    name: '反馈组件',
    icon: 'chat-square-dots',
    color: 'danger',
    components: [
      { name: 'modal', label: 'Modal', desc: '对话框', icon: 'layout-text-window' },
      { name: 'popup', label: 'Popup', desc: '弹出层', icon: 'layout-three-columns' },
      { name: 'toast', label: 'Toast', desc: '轻提示', icon: 'chat-right-text' },
      { name: 'action-sheet', label: 'ActionSheet', desc: '动作面板', icon: 'list-task' },
      { name: 'overlay', label: 'Overlay', desc: '遮罩', icon: 'house' },
      { name: 'tooltip', label: 'Tooltip', desc: '气泡提示', icon: 'chat-square-quote' },
      { name: 'dropdown', label: 'Dropdown', desc: '下拉菜单', icon: 'caret-down-square' },
      { name: 'transition', label: 'Transition', desc: '过渡动画', icon: 'arrow-clockwise' },
      { name: 'curtain', label: 'Curtain', desc: '幕帘', icon: 'grid-3x2' },
    ],
  },
  {
    name: '导航组件',
    icon: 'signpost-split',
    color: 'info',
    components: [
      { name: 'navbar', label: 'Navbar', desc: '导航栏', icon: 'layout-text-window' },
      { name: 'tabbar', label: 'Tabbar', desc: '标签栏', icon: 'layout-three-columns' },
      { name: 'backtop', label: 'Backtop', desc: '回到顶部', icon: 'arrow-up-circle' },
      { name: 'fab', label: 'Fab', desc: '悬浮按钮', icon: 'plus-circle-fill' },
      { name: 'anchor', label: 'Anchor', desc: '页面锚点', icon: 'signpost-split' },
      { name: 'sticky', label: 'Sticky', desc: '粘性布局', icon: 'pin-angle' },
    ],
  },
  {
    name: '高级组件',
    icon: 'stars',
    color: 'purple',
    components: [
      { name: 'virtual-list', label: 'VirtualList', desc: '虚拟列表', icon: 'list-columns' },
      { name: 'watermark', label: 'Watermark', desc: '水印', icon: 'shield-check' },
      { name: 'waterfall', label: 'Waterfall', desc: '瀑布流', icon: 'grid-3x2' },
    ],
  },
];

// 过滤分类
const filteredCategories = computed(() => {
  if (!searchKeyword.value.trim()) {
    return categories;
  }

  const keyword = searchKeyword.value.toLowerCase();
  return categories
    .map(cat => ({
      ...cat,
      components: cat.components.filter(
        comp =>
          comp.name.toLowerCase().includes(keyword) ||
          comp.label.toLowerCase().includes(keyword) ||
          comp.desc.includes(keyword) ||
          cat.name.includes(keyword)
      ),
    }))
    .filter(cat => cat.components.length > 0);
});

// 统计数据
const totalComponents = computed(() =>
  categories.reduce((sum, cat) => sum + cat.components.length, 0)
);
const categoryCount = computed(() => categories.length);

// 跳转到详情页
const navigateToDetail = (componentName: string) => {
  uni.navigateTo({
    url: `/pages_sub/component-detail/index?name=${componentName}`,
  });
};
</script>

<template>
  <scroll-view
    class="overview-content"
    :style="{ height: contentHeight }"
    scroll-y
    show-scrollbar="false"
  >
    <view class="page-content">
      <!-- 统计卡片 -->
      <view class="stats-card">
        <view class="stats-copy">
          <text class="stats-kicker">Lucky UI Preview</text>
          <text class="stats-title">组件预览</text>
          <text class="stats-desc">干净的移动端组件索引，快速进入每个组件详情。</text>
        </view>
        <view class="stats-metrics">
          <view class="stats-item">
            <text class="stats-number">{{ totalComponents }}</text>
            <text class="stats-label">组件</text>
          </view>
          <view class="stats-divider"></view>
          <view class="stats-item">
            <text class="stats-number">{{ categoryCount }}</text>
            <text class="stats-label">分类</text>
          </view>
          <view class="stats-divider"></view>
          <view class="stats-item">
            <text class="stats-number">100%</text>
            <text class="stats-label">覆盖</text>
          </view>
        </view>
      </view>

      <!-- 主题色配置 -->
      <view class="theme-config-card">
        <view class="config-header">
          <lk-icon name="sliders" size="36" color="primary" />
          <text class="config-title">品牌主题色</text>
        </view>
        <view class="locale-config-row">
          <text class="custom-label">组件语言</text>
          <view class="locale-trigger" @tap="showLocalePopup = true">
            <text class="locale-trigger__value">{{ currentLocaleLabel }}</text>
            <lk-icon name="chevron-down" size="28" color="textSecondary" />
          </view>
        </view>
        <view class="icon-brand-row">
          <view class="icon-brand-copy">
            <text class="custom-label">预览图标跟随品牌色</text>
            <text class="icon-brand-hint">关闭后使用默认文字色</text>
          </view>
          <lk-switch
            :model-value="previewIconsFollowBrand"
            size="sm"
            :active-color="currentBrandColor"
            @update:model-value="togglePreviewIconColor"
          />
        </view>
        <lk-popup
          v-model="showLocalePopup"
          position="bottom"
          title="选择语言"
          closable
          height="90vh"
        >
          <view class="locale-popup-list">
            <view
              v-for="locale in localeOptions"
              :key="locale.value"
              class="locale-popup-item"
              :class="{ active: currentLocale === locale.value }"
              @tap="setLocale(locale.value)"
            >
              <text class="locale-popup-item__label">{{ locale.label }}</text>
              <text class="locale-popup-item__code">{{ locale.value }}</text>
              <lk-icon v-if="currentLocale === locale.value" name="check-circle-fill" size="32" color="primary" />
            </view>
          </view>
        </lk-popup>
        <view class="color-presets">
          <view
            v-for="color in presetColors"
            :key="color.value"
            class="color-preset-item"
            :class="{ active: currentBrandColor === color.value }"
            :style="{ '--preset-color': color.value }"
            @click="changeBrandColor(color.value)"
          >
            <view class="color-dot"></view>
            <text class="color-name">{{ color.name }}</text>
          </view>
        </view>
        <view class="custom-color-row">
          <text class="custom-label">自定义颜色</text>
          <view class="color-input-wrapper">
            <input
              v-model="customColorInput"
              class="color-input"
              placeholder="#6965db"
              maxlength="7"
              @blur="applyCustomColor"
              @confirm="applyCustomColor"
            />
            <view
              class="color-preview"
              :style="{ background: customColorInput || currentBrandColor }"
            ></view>
          </view>
        </view>
        <!-- 色阶预览 -->
        <view class="color-scale-preview">
          <text class="scale-label">色阶预览</text>
          <view class="scale-row">
            <view
              v-for="level in [100, 200, 300, 400, 500, 600, 700, 800, 900]"
              :key="level"
              class="scale-item"
              :style="{ background: `var(--lk-brand-${level})` }"
            >
              <text class="scale-level">{{ level }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 搜索框 -->
      <view class="search-box">
        <lk-icon name="search" size="32" color="textSecondary" />
        <input
          v-model="searchKeyword"
          class="search-input"
          placeholder="搜索组件名称..."
          placeholder-class="search-placeholder"
        />
        <lk-icon
          v-if="searchKeyword"
          name="x-circle"
          size="32"
          color="textTertiary"
          @click="searchKeyword = ''"
        />
      </view>

      <!-- 组件分类 -->
      <view v-for="category in filteredCategories" :key="category.name" class="category-section">
        <view class="category-header">
          <lk-icon :name="category.icon" size="40" :color="previewCategoryIconColor(category.color)" />
          <text class="category-title">{{ category.name }}</text>
          <text class="category-count">{{ category.components.length }}</text>
        </view>

        <view class="component-grid">
          <view
            v-for="comp in category.components"
            :key="comp.name"
            class="component-card"
            :style="{ '--card-color': `var(--lk-color-${category.color})` }"
            @click="navigateToDetail(comp.name)"
          >
            <view class="card-icon">
              <lk-icon :name="comp.icon" size="48" :color="previewIconColor" />
            </view>
            <text class="card-name">{{ comp.label }}</text>
            <text class="card-desc">{{ comp.desc }}</text>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="filteredCategories.length === 0" class="empty-state">
        <lk-icon name="inbox" size="120" color="textTertiary" />
        <text class="empty-text">未找到相关组件</text>
        <text class="empty-desc">试试搜索其他关键词</text>
      </view>
    </view>
  </scroll-view>
</template>
<style scoped lang="scss">
@use '@/styles/test-page.scss' as test;

.overview-content {
  width: 100%;
  background: test.$test-bg-page;
  flex: 1;
}

.page-content {
  padding: 32rpx;
}

// 统计卡片
.stats-card {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
  background: test.$test-bg-card;
  border: 1rpx solid test.$test-border-color;
  border-radius: 36rpx;
  padding: 40rpx;
  margin-bottom: 32rpx;
  box-shadow: test.$test-shadow-sm;
}

.stats-copy {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.stats-kicker {
  color: test.$test-primary;
  font-size: 22rpx;
  font-weight: 700;
}

.stats-title {
  color: test.$test-text-primary;
  font-size: 48rpx;
  font-weight: 800;
  line-height: 1.1;
}

.stats-desc {
  color: test.$test-text-secondary;
  font-size: 24rpx;
  line-height: 1.5;
}

.stats-metrics {
  display: flex;
  align-items: stretch;
  padding: 24rpx 28rpx;
  background: test.$test-gray-50;
  border: 1rpx solid test.$test-border-color;
  border-radius: 28rpx;
}

.stats-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.stats-number {
  color: test.$test-text-primary;
  font-size: 36rpx;
  font-weight: 800;
  line-height: 1;
}

.stats-label {
  color: test.$test-text-tertiary;
  font-size: 22rpx;
}

.stats-divider {
  width: 1rpx;
  background: test.$test-border-color;
  margin: 0 24rpx;
}

// 主题色配置卡片
.theme-config-card {
  background: test.$test-bg-card;
  border: 1rpx solid test.$test-border-color;
  border-radius: 32rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
  box-shadow: test.$test-shadow-sm;
}

.config-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.config-title {
  font-size: 30rpx;
  font-weight: 600;
  color: test.$test-text-primary;
}

.locale-config-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  padding: 16rpx 0 24rpx;
}

.icon-brand-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  padding: 0 0 24rpx;
}

.icon-brand-copy {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.icon-brand-hint {
  color: test.$test-text-tertiary;
  font-size: 22rpx;
}

.locale-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14rpx;
  min-width: 248rpx;
  height: 64rpx;
  padding: 0 22rpx;
  background: test.$test-bg-card;
  border: 1rpx solid test.$test-border-color;
  border-radius: 18rpx;
}

.locale-trigger__value {
  color: test.$test-text-secondary;
  font-size: 24rpx;
  font-weight: 700;
}

.locale-popup-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  padding: 8rpx 32rpx 24rpx;
}

.locale-popup-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12rpx;
  min-height: 78rpx;
  padding: 0 24rpx;
  border: 1rpx solid test.$test-border-color;
  border-radius: 18rpx;
  background: test.$test-bg-card;
  box-shadow: none;

  &.active {
    border-color: test.$test-primary;
    background: var(--lk-color-primary-soft);
  }
}

.locale-popup-item__label {
  flex: 1;
  color: test.$test-text-primary;
  font-size: 28rpx;
  font-weight: 700;
}

.locale-popup-item__code {
  color: test.$test-text-secondary;
  font-size: 22rpx;
}

.color-presets {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.color-preset-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx 8rpx;
  border-radius: 24rpx;
  background: test.$test-gray-50;
  border: 1rpx solid test.$test-border-color;
  transition: all 0.2s;

  &.active {
    background: var(--preset-color);
    box-shadow: test.$test-preset-active-shadow;

    .color-dot {
      border-color: #fff;
      transform: scale(1.1);
    }

    .color-name {
      color: #fff;
    }
  }

  &:active {
    transform: scale(0.95);
  }
}

.color-dot {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: var(--preset-color);
  border: 4rpx solid transparent;
  transition: all 0.2s;
}

.color-name {
  font-size: 22rpx;
  color: test.$test-text-secondary;
  transition: color 0.2s;
}

.custom-color-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 0;
  border-top: 1rpx solid test.$test-border-color;
  margin-bottom: 24rpx;
}

.custom-label {
  font-size: 26rpx;
  color: test.$test-text-secondary;
}

.color-input-wrapper {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.color-input {
  width: 180rpx;
  height: 56rpx;
  padding: 0 16rpx;
  border: 1rpx solid test.$test-border-color;
  border-radius: test.$test-border-radius;
  font-size: 26rpx;
  font-family: monospace;
  color: test.$test-text-primary;
  background: test.$test-bg-card;
}

.color-preview {
  width: 56rpx;
  height: 56rpx;
  border-radius: test.$test-border-radius;
  border: 2rpx solid test.$test-border-color;
}

.color-scale-preview {
  padding-top: 16rpx;
  border-top: 1rpx solid test.$test-border-color;
}

.scale-label {
  display: block;
  font-size: 24rpx;
  color: test.$test-text-tertiary;
  margin-bottom: 16rpx;
}

.scale-row {
  display: flex;
  border-radius: test.$test-border-radius;
  overflow: hidden;
}

.scale-item {
  flex: 1;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scale-level {
  font-size: 18rpx;
  color: #fff;
  text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.3);
}

// 搜索框
.search-box {
  display: flex;
  align-items: center;
  gap: 16rpx;
  background: test.$test-bg-card;
  border: 1rpx solid test.$test-border-color;
  border-radius: 28rpx;
  padding: 24rpx 32rpx;
  margin-bottom: 32rpx;
  box-shadow: test.$test-shadow-sm;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: test.$test-text-primary;
  height: 40rpx;
  line-height: 40rpx;
}

.search-placeholder {
  color: test.$test-text-tertiary;
}

// 分类区域
.category-section {
  margin-bottom: 48rpx;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.category-title {
  flex: 1;
  font-size: 32rpx;
  font-weight: 800;
  color: test.$test-text-primary;
}

.category-count {
  font-size: 24rpx;
  color: test.$test-text-secondary;
  background: test.$test-bg-card;
  border: 1rpx solid test.$test-border-color;
  padding: 6rpx 18rpx;
  border-radius: 999rpx;
}

// 组件网格
.component-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}

.component-card {
  background: test.$test-bg-card;
  border: 1rpx solid test.$test-border-color;
  border-radius: 28rpx;
  padding: 28rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  box-shadow: test.$test-shadow-sm;
  transition: all 0.3s;

  &:active {
    transform: scale(0.95);
    background: test.$test-bg-hover;
    box-shadow: test.$test-shadow-md;
  }
}

.card-icon {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: test.$test-primary;
  background: test.$test-gray-50;
  border-radius: 24rpx;
  margin-bottom: 8rpx;
}

.card-name {
  font-size: 26rpx;
  font-weight: 500;
  color: test.$test-text-primary;
  text-align: center;
}

.card-desc {
  font-size: 22rpx;
  color: test.$test-text-secondary;
  text-align: center;
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 48rpx;
  gap: 24rpx;
}

.empty-text {
  font-size: 32rpx;
  font-weight: 500;
  color: test.$test-text-secondary;
}

.empty-desc {
  font-size: 26rpx;
  color: test.$test-text-tertiary;
}
</style>
