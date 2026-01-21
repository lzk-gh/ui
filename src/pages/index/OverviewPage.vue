<template>
  <scroll-view class="overview-page" :style="{ height: contentHeight }" scroll-y>
    <view class="page-content">
      <!-- 主题调试工具 -->
      <theme-debugger />

      <!-- 统计卡片 -->
      <view class="stats-card">
        <view class="stats-item">
          <text class="stats-number">{{ totalComponents }}</text>
          <text class="stats-label">组件总数</text>
        </view>
        <view class="stats-divider"></view>
        <view class="stats-item">
          <text class="stats-number">{{ categoryCount }}</text>
          <text class="stats-label">分类</text>
        </view>
        <view class="stats-divider"></view>
        <view class="stats-item">
          <text class="stats-number">100%</text>
          <text class="stats-label">类型覆盖</text>
        </view>
      </view>

      <!-- 主题色配置 -->
      <view class="theme-config-card">
        <view class="config-header">
          <lk-icon name="palette" size="36" color="primary" />
          <text class="config-title">品牌主题色</text>
        </view>
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
              v-for="level in [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]"
              :key="level"
              class="scale-item"
              :style="{ background: `var(--color-brand-${level})` }"
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
          <lk-icon :name="category.icon" size="40" :color="category.color" />
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
              <lk-icon :name="comp.icon" size="48" />
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

<script setup lang="ts">
import { ref, computed, onMounted, inject } from 'vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import ThemeDebugger from '@/components/theme-debugger.vue';
import {
  applyBrandColor as applyBrand,
  loadBrandColor,
  DEFAULT_BRAND_COLOR,
  PRESET_COLORS,
} from '@/uni_modules/lucky-ui/theme';

defineProps<{
  contentHeight: string;
}>();

const searchKeyword = ref('');
const updateBrandColor = inject<(color: string) => void>('updateBrandColor');

// ============ 主题色配置 ============
const currentBrandColor = ref(DEFAULT_BRAND_COLOR);
const customColorInput = ref('');

// 预设主题色
const presetColors = PRESET_COLORS;

// 应用品牌色
const applyBrandColor = (color: string) => {
  applyBrand(color);
  updateBrandColor?.(color);
};

// 切换预设颜色
const changeBrandColor = (color: string) => {
  currentBrandColor.value = color;
  customColorInput.value = color;
  applyBrandColor(color);
};

// 应用自定义颜色
const applyCustomColor = () => {
  const color = customColorInput.value.trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
    currentBrandColor.value = color;
    applyBrandColor(color);
  }
};

// 初始化时恢复保存的颜色
onMounted(() => {
  const savedColor = loadBrandColor();
  if (savedColor) {
    currentBrandColor.value = savedColor;
    customColorInput.value = savedColor;
    applyBrandColor(savedColor);
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
      {
        name: 'space',
        label: 'Space',
        desc: '元素间距',
        icon: 'arrows-expand',
      },
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
      {
        name: 'checkbox',
        label: 'Checkbox',
        desc: '复选框',
        icon: 'check-square',
      },
      { name: 'switch', label: 'Switch', desc: '开关', icon: 'toggle-on' },
      {
        name: 'stepper',
        label: 'Stepper',
        desc: '步进器',
        icon: 'plus-slash-minus',
      },
      { name: 'slider', label: 'Slider', desc: '滑块', icon: 'sliders' },
      { name: 'rate', label: 'Rate', desc: '评分', icon: 'star' },
      { name: 'upload', label: 'Upload', desc: '上传', icon: 'cloud-upload' },
      {
        name: 'picker',
        label: 'Picker',
        desc: '选择器',
        icon: 'menu-button-wide',
      },
      {
        name: 'picker-view',
        label: 'PickerView',
        desc: '内联选择器',
        icon: 'columns',
      },
      {
        name: 'area-picker',
        label: 'AreaPicker',
        desc: '地区选择',
        icon: 'geo-alt',
      },
      {
        name: 'number-keyboard',
        label: 'NumberKeyboard',
        desc: '数字键盘',
        icon: '123',
      },
      {
        name: 'verify-code',
        label: 'VerifyCode',
        desc: '验证码',
        icon: 'shield-lock',
      },
    ],
  },
  {
    name: '数据展示',
    icon: 'grid-3x3-gap',
    color: 'warning',
    components: [
      {
        name: 'card',
        label: 'Card',
        desc: '卡片',
        icon: 'credit-card-2-front',
      },
      { name: 'cell', label: 'Cell', desc: '单元格', icon: 'list-ul' },
      { name: 'collapse', label: 'Collapse', desc: '折叠面板', icon: 'house' },
      { name: 'table', label: 'Table', desc: '表格', icon: 'table' },
      { name: 'tabs', label: 'Tabs', desc: '标签页', icon: 'house' },
      {
        name: 'timeline',
        label: 'Timeline',
        desc: '时间轴',
        icon: 'hourglass-split',
      },
      { name: 'steps', label: 'Steps', desc: '步骤条', icon: 'house' },
      {
        name: 'progress',
        label: 'Progress',
        desc: '进度条',
        icon: 'reception-4',
      },
      {
        name: 'loading',
        label: 'Loading',
        desc: '加载',
        icon: 'arrow-clockwise',
      },
      { name: 'skeleton', label: 'Skeleton', desc: '骨架屏', icon: 'border' },
      { name: 'carousel', label: 'Carousel', desc: '轮播', icon: 'house' },
      { name: 'segmented', label: 'Segmented', desc: '分段器', icon: 'house' },
      {
        name: 'pagination',
        label: 'Pagination',
        desc: '分页',
        icon: 'three-dots',
      },
      {
        name: 'number-roller',
        label: 'NumberRoller',
        desc: '数字翻牌',
        icon: 'speedometer',
      },
      {
        name: 'horizontal-scroll',
        label: 'HorizontalScroll',
        desc: '横向滚动',
        icon: 'distribute-horizontal',
      },
      {
        name: 'chart-bar',
        label: 'ChartBar',
        desc: '柱状图',
        icon: 'bar-chart',
      },
      {
        name: 'chart-line',
        label: 'ChartLine',
        desc: '折线图',
        icon: 'graph-up',
      },
      {
        name: 'chart-pie',
        label: 'ChartPie',
        desc: '饼/环图',
        icon: 'pie-chart',
      },
    ],
  },
  {
    name: '反馈组件',
    icon: 'chat-square-dots',
    color: 'danger',
    components: [
      { name: 'modal', label: 'Modal', desc: '对话框', icon: 'window' },
      { name: 'popup', label: 'Popup', desc: '弹出层', icon: 'window-stack' },
      {
        name: 'toast',
        label: 'Toast',
        desc: '轻提示',
        icon: 'chat-right-text',
      },
      {
        name: 'action-sheet',
        label: 'ActionSheet',
        desc: '动作面板',
        icon: 'list-task',
      },
      { name: 'overlay', label: 'Overlay', desc: '遮罩', icon: 'house' },
      {
        name: 'tooltip',
        label: 'Tooltip',
        desc: '气泡提示',
        icon: 'chat-square-quote',
      },
      {
        name: 'dropdown',
        label: 'Dropdown',
        desc: '下拉菜单',
        icon: 'caret-down-square',
      },
      {
        name: 'transition',
        label: 'Transition',
        desc: '过渡动画',
        icon: 'bezier2',
      },
      {
        name: 'curtain',
        label: 'Curtain',
        desc: '幕帘',
        icon: 'aspect-ratio',
      },
    ],
  },
  {
    name: '导航组件',
    icon: 'signpost-split',
    color: 'info',
    components: [
      {
        name: 'navbar',
        label: 'Navbar',
        desc: '导航栏',
        icon: 'layout-text-window',
      },
      {
        name: 'tabbar',
        label: 'Tabbar',
        desc: '标签栏',
        icon: 'layout-three-columns',
      },
      {
        name: 'breadcrumb',
        label: 'Breadcrumb',
        desc: '面包屑',
        icon: 'chevron-right',
      },
      {
        name: 'backtop',
        label: 'Backtop',
        desc: '回到顶部',
        icon: 'arrow-up-circle',
      },
      {
        name: 'index-bar',
        label: 'IndexBar',
        desc: '字母索引',
        icon: 'sort-alpha-down',
      },
      { name: 'anchor', label: 'Anchor', desc: '页面锚点', icon: 'hash' },
      { name: 'sticky', label: 'Sticky', desc: '粘性布局', icon: 'pin-angle' },
    ],
  },
  {
    name: '高级组件',
    icon: 'stars',
    color: 'purple',
    components: [
      { name: 'calendar', label: 'Calendar', desc: '日历', icon: 'calendar3' },
      {
        name: 'date-picker',
        label: 'DatePicker',
        desc: '日期选择',
        icon: 'calendar-event',
      },
      { name: 'cascader', label: 'Cascader', desc: '级联选择', icon: 'house' },
      {
        name: 'virtual-list',
        label: 'VirtualList',
        desc: '虚拟列表',
        icon: 'list-columns',
      },
      {
        name: 'waterfall',
        label: 'Waterfall',
        desc: '瀑布流',
        icon: 'grid-3x2',
      },
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
    url: `/pages/component-detail/index?name=${componentName}`,
  });
};
</script>

<style scoped lang="scss">
@import '@/styles/test-page.scss';

.overview-page {
  width: 100%;
  background: $test-bg-page;
}

// 统计卡片（使用测试页面专用渐变）
.stats-card {
  display: flex;
  align-items: stretch;
  background: $test-gradient-primary;
  border-radius: $test-border-radius;
  padding: 48rpx 32rpx;
  margin-bottom: 32rpx;
  box-shadow: $test-shadow-lg;
}

.stats-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.stats-number {
  font-size: 56rpx;
  font-weight: 700;
  color: #fff;
  line-height: 1;
}

.stats-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
}

.stats-divider {
  width: 2rpx;
  background: rgba(255, 255, 255, 0.3);
  margin: 0 24rpx;
}

// 主题色配置卡片（测试页面样式）
.theme-config-card {
  background: $test-theme-card-bg;
  border: 1rpx solid $test-theme-card-border;
  border-radius: $test-border-radius;
  padding: 32rpx;
  margin-bottom: 32rpx;
  box-shadow: $test-shadow-md;
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
  color: $test-text-primary;
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
  border-radius: $test-border-radius;
  background: $test-gray-50;
  transition: all 0.2s;

  &.active {
    background: var(--preset-color);
    box-shadow: $test-preset-active-shadow;

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
  color: $test-text-secondary;
  transition: color 0.2s;
}

.custom-color-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 0;
  border-top: 1rpx solid $test-border-color;
  margin-bottom: 24rpx;
}

.custom-label {
  font-size: 26rpx;
  color: $test-text-secondary;
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
  border: 1rpx solid $test-border-color;
  border-radius: $test-border-radius;
  font-size: 26rpx;
  font-family: monospace;
  color: $test-text-primary;
  background: $test-bg-card;
}

.color-preview {
  width: 56rpx;
  height: 56rpx;
  border-radius: $test-border-radius;
  border: 2rpx solid $test-border-color;
  cursor: pointer;
}

.color-scale-preview {
  padding-top: 16rpx;
  border-top: 1rpx solid $test-border-color;
}

.scale-label {
  display: block;
  font-size: 24rpx;
  color: $test-text-tertiary;
  margin-bottom: 16rpx;
}

.scale-row {
  display: flex;
  border-radius: $test-border-radius;
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

// 搜索框（测试页面样式）
.search-box {
  display: flex;
  align-items: center;
  gap: 16rpx;
  background: $test-bg-card;
  border: 1rpx solid $test-border-color;
  border-radius: $test-border-radius;
  padding: 24rpx 32rpx;
  margin-bottom: 32rpx;
  box-shadow: $test-shadow-sm;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: $test-text-primary;
  height: 40rpx;
  line-height: 40rpx;
}

.search-placeholder {
  color: $test-text-tertiary;
}

// 分类区域（测试页面样式）
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
  font-weight: 600;
  color: $test-text-primary;
}

.category-count {
  font-size: 24rpx;
  color: $test-text-inverse;
  background: $test-primary;
  padding: 4rpx 16rpx;
  border-radius: 999rpx;
}

// 组件网格（测试页面样式）
.component-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.component-card {
  background: $test-bg-card;
  border: 1rpx solid $test-border-color;
  border-radius: $test-border-radius;
  padding: 24rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  box-shadow: $test-shadow-sm;
  transition: all 0.3s;

  &:active {
    transform: scale(0.95);
    background: $test-bg-hover;
    box-shadow: $test-shadow-md;
  }
}

.card-icon {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $test-border-radius;
  margin-bottom: 8rpx;
}

.card-name {
  font-size: 26rpx;
  font-weight: 500;
  color: $test-text-primary;
  text-align: center;
}

.card-desc {
  font-size: 22rpx;
  color: $test-text-secondary;
  text-align: center;
}

// 空状态（测试页面样式）
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
  color: $test-text-secondary;
}

.empty-desc {
  font-size: 26rpx;
  color: $test-text-tertiary;
}
</style>
