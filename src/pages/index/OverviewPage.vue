<template>
  <scroll-view class="overview-page" :style="{ height: contentHeight }" scroll-y>
    <view class="page-content">
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
              @click="showColorPicker = true"
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

defineProps<{
  contentHeight: string;
}>();

const searchKeyword = ref('');
const updateThemeStyleVars = inject<(vars: string) => void>('updateThemeStyleVars');

// ============ 主题色配置 ============
const currentBrandColor = ref('#6965db');
const customColorInput = ref('');
const showColorPicker = ref(false);

// 预设主题色
const presetColors = [
  { name: '幻紫', value: '#6965db' },
  { name: '极光蓝', value: '#1890ff' },
  { name: '翠绿', value: '#52c41a' },
  { name: '活力橙', value: '#fa8c16' },
  { name: '中国红', value: '#f5222d' },
  { name: '玫瑰粉', value: '#eb2f96' },
  { name: '极客青', value: '#13c2c2' },
  { name: '高级灰', value: '#8c8c8c' },
];

// 根据主色生成色阶的函数
const generateColorShade = (baseColor: string, level: number): string => {
  // 将 hex 转为 rgb
  const hex = baseColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  if (level === 600) {
    return baseColor;
  }

  if (level < 600) {
    // 与白色混合
    const ratio = ((600 - level) / 500) * 0.85;
    const newR = Math.round(r + (255 - r) * ratio);
    const newG = Math.round(g + (255 - g) * ratio);
    const newB = Math.round(b + (255 - b) * ratio);
    return `rgb(${newR}, ${newG}, ${newB})`;
  } else {
    // 与黑色混合
    const ratio = ((level - 600) / 400) * 0.7;
    const newR = Math.round(r * (1 - ratio));
    const newG = Math.round(g * (1 - ratio));
    const newB = Math.round(b * (1 - ratio));
    return `rgb(${newR}, ${newG}, ${newB})`;
  }
};

const serializeCssVars = (vars: Record<string, string>) =>
  Object.entries(vars)
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ');

const buildThemeVars = (color: string) => {
  const vars: Record<string, string> = {};
  const levels = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

  levels.forEach(level => {
    vars[`--color-brand-${level}`] = generateColorShade(color, level);
  });

  const color100 = vars['--color-brand-100'];
  const color300 = vars['--color-brand-300'];
  const color400 = vars['--color-brand-400'];
  const color500 = vars['--color-brand-500'];
  const color600 = vars['--color-brand-600'];
  const color700 = vars['--color-brand-700'];
  const color800 = vars['--color-brand-800'];

  const baseHex = color.replace('#', '');
  const r = parseInt(baseHex.substring(0, 2), 16);
  const g = parseInt(baseHex.substring(2, 4), 16);
  const b = parseInt(baseHex.substring(4, 6), 16);
  vars['--color-brand-rgb'] = `${r}, ${g}, ${b}`;

  vars['--color-brand-primary'] = color600;
  vars['--color-brand-primary-light'] = color100;
  vars['--color-brand-primary-hover'] = color700;
  vars['--color-brand-primary-active'] = color800;

  vars['--lk-color-primary'] = color600;
  vars['--lk-color-primary-hover'] = color700;
  vars['--lk-color-primary-active'] = color800;
  vars['--lk-color-primary-bg-soft'] = color100;
  vars['--lk-focus-ring-color'] = color100;
  vars['--lk-input-border-color-hover'] = color700;
  vars['--lk-input-border-color-active'] = color600;
  vars['--lk-input-border-color-error'] = color300;
  vars['--lk-input-shadow-focus'] = `0 0 0 4rpx ${color100}`;

  return vars;
};

// 应用品牌色
const applyBrandColor = (color: string) => {
  const vars = buildThemeVars(color);

  if (typeof document !== 'undefined') {
    const targets: (HTMLElement | null)[] = [
      document.documentElement,
      document.body,
      document.querySelector('page'),
    ];
    const setVar = (name: string, value: string) => {
      targets.forEach(el => el?.style.setProperty(name, value));
    };

    Object.entries(vars).forEach(([key, value]) => setVar(key, value));
  }

  const inlineStyle = serializeCssVars(vars);
  updateThemeStyleVars?.(inlineStyle);

  uni.setStorageSync('lucky-ui-brand-color', color);
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
  const savedColor = uni.getStorageSync('lucky-ui-brand-color');
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
      { name: 'select', label: 'Select', desc: '选择器', icon: 'house' },
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
      { name: 'drawer', label: 'Drawer', desc: '抽屉', icon: 'layout-sidebar' },
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
      {
        name: 'time-picker',
        label: 'TimePicker',
        desc: '时间选择',
        icon: 'clock',
      },
      {
        name: 'date-range-picker',
        label: 'DateRangePicker',
        desc: '日期范围',
        icon: 'calendar-range',
      },
      {
        name: 'date-time-picker',
        label: 'DateTimePicker',
        desc: '日期时间',
        icon: 'calendar-check',
      },
      { name: 'cascader', label: 'Cascader', desc: '级联选择', icon: 'house' },
      { name: 'tree', label: 'Tree', desc: '树形控件', icon: 'house' },
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
      {
        name: 'image-cropper',
        label: 'ImageCropper',
        desc: '图片裁剪',
        icon: 'crop',
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
.overview-page {
  width: 100%;
  background: var(--lk-color-bg-page);
}

.page-content {
  padding: 24rpx;
}

// 统计卡片
.stats-card {
  display: flex;
  align-items: stretch;
  background: linear-gradient(
    135deg,
    var(--lk-color-primary) 0%,
    var(--lk-color-primary-hover) 100%
  );
  border-radius: var(--lk-radius-xl);
  padding: 48rpx 32rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
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

// 主题色配置卡片
.theme-config-card {
  background: var(--lk-color-bg-surface);
  border-radius: var(--lk-radius-xl);
  padding: 32rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
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
  color: var(--lk-color-text);
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
  border-radius: var(--lk-radius-md);
  background: var(--lk-color-bg-page);
  transition: all 0.2s;

  &.active {
    background: var(--preset-color);

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
  color: var(--lk-color-text-secondary);
  transition: color 0.2s;
}

.custom-color-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 0;
  border-top: 1rpx solid var(--lk-color-border);
  margin-bottom: 24rpx;
}

.custom-label {
  font-size: 26rpx;
  color: var(--lk-color-text-secondary);
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
  border: 1rpx solid var(--lk-color-border);
  border-radius: var(--lk-radius-sm);
  font-size: 26rpx;
  font-family: monospace;
  color: var(--lk-color-text);
  background: var(--lk-color-bg-page);
}

.color-preview {
  width: 56rpx;
  height: 56rpx;
  border-radius: var(--lk-radius-sm);
  border: 2rpx solid var(--lk-color-border);
  cursor: pointer;
}

.color-scale-preview {
  padding-top: 16rpx;
  border-top: 1rpx solid var(--lk-color-border);
}

.scale-label {
  display: block;
  font-size: 24rpx;
  color: var(--lk-color-text-tertiary);
  margin-bottom: 16rpx;
}

.scale-row {
  display: flex;
  border-radius: var(--lk-radius-md);
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
  background: var(--lk-color-bg-surface);
  border-radius: var(--lk-radius-lg);
  padding: 24rpx 32rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: var(--lk-color-text);
  height: 40rpx;
  line-height: 40rpx;
}

.search-placeholder {
  color: var(--lk-color-text-tertiary);
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
  font-weight: 600;
  color: var(--lk-color-text);
}

.category-count {
  font-size: 24rpx;
  color: var(--lk-color-text-secondary);
  background: var(--lk-color);
  padding: 4rpx 16rpx;
  border-radius: 999rpx;
}

// 组件网格
.component-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.component-card {
  background: var(--lk-color-bg-surface);
  border-radius: var(--lk-radius-lg);
  padding: 24rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s;

  &:active {
    transform: scale(0.95);
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  }
}

.card-icon {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--lk-radius-md);
  margin-bottom: 8rpx;
}

.card-name {
  font-size: 26rpx;
  font-weight: 500;
  color: var(--lk-color-text);
  text-align: center;
}

.card-desc {
  font-size: 22rpx;
  color: var(--lk-color-text-secondary);
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
  color: var(--lk-color-text-secondary);
}

.empty-desc {
  font-size: 26rpx;
  color: var(--lk-color-text-tertiary);
}
</style>
