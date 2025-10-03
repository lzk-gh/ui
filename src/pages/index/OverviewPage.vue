<template>
  <scroll-view class="overview-page" :style="{ height: contentHeight }" scroll-y>
    <view class="page-content">
      <!-- 统计卡片 -->
      <view class="stats-card">
        <view class="stats-item">
          <text class="stats-number">52</text>
          <text class="stats-label">组件总数</text>
        </view>
        <view class="stats-divider"></view>
        <view class="stats-item">
          <text class="stats-number">7</text>
          <text class="stats-label">分类</text>
        </view>
        <view class="stats-divider"></view>
        <view class="stats-item">
          <text class="stats-number">100%</text>
          <text class="stats-label">类型覆盖</text>
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
          name="x-circle-fill" 
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
              <lk-icon :name="comp.icon" size="48" :color="category.color" />
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
import { ref, computed } from 'vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';

defineProps<{
  contentHeight: string;
}>();

const searchKeyword = ref('');

// 组件分类数据
const categories = [
  {
    name: '基础组件',
    icon: 'box-seam-fill',
    color: 'primary',
    components: [
      { name: 'button', label: 'Button', desc: '按钮', icon: 'app-indicator' },
      { name: 'icon', label: 'Icon', desc: '图标', icon: 'emoji-smile' },
      { name: 'tag', label: 'Tag', desc: '标签', icon: 'tag-fill' },
      { name: 'badge', label: 'Badge', desc: '徽标', icon: 'bell-fill' },
      { name: 'avatar', label: 'Avatar', desc: '头像', icon: 'person-circle' },
      { name: 'divider', label: 'Divider', desc: '分割线', icon: 'hr' },
      { name: 'notice-bar', label: 'NoticeBar', desc: '通知栏', icon: 'megaphone-fill' },
      { name: 'image', label: 'Image', desc: '图片', icon: 'image-fill' }
    ]
  },
  {
    name: '表单组件',
    icon: 'ui-checks-grid',
    color: 'success',
    components: [
      { name: 'form', label: 'Form', desc: '表单', icon: 'card-list' },
      { name: 'input', label: 'Input', desc: '输入框', icon: 'input-cursor-text' },
      { name: 'textarea', label: 'Textarea', desc: '文本域', icon: 'textarea-t' },
      { name: 'select', label: 'Select', desc: '选择器', icon: 'menu-button-wide-fill' },
      { name: 'radio', label: 'Radio', desc: '单选框', icon: 'record-circle-fill' },
      { name: 'checkbox', label: 'Checkbox', desc: '复选框', icon: 'check-square-fill' },
      { name: 'switch', label: 'Switch', desc: '开关', icon: 'toggle-on' },
      { name: 'stepper', label: 'Stepper', desc: '步进器', icon: 'plus-slash-minus' },
      { name: 'slider', label: 'Slider', desc: '滑块', icon: 'sliders' },
      { name: 'rate', label: 'Rate', desc: '评分', icon: 'star-fill' },
      { name: 'upload', label: 'Upload', desc: '上传', icon: 'cloud-upload-fill' }
    ]
  },
  {
    name: '数据展示',
    icon: 'grid-3x3-gap',
    color: 'warning',
    components: [
      { name: 'card', label: 'Card', desc: '卡片', icon: 'credit-card-2-front-fill' },
      { name: 'cell', label: 'Cell', desc: '单元格', icon: 'list-ul' },
      { name: 'collapse', label: 'Collapse', desc: '折叠面板', icon: 'arrows-collapse' },
      { name: 'table', label: 'Table', desc: '表格', icon: 'table' },
      { name: 'tabs', label: 'Tabs', desc: '标签页', icon: 'ui-radios' },
      { name: 'timeline', label: 'Timeline', desc: '时间轴', icon: 'hourglass-split' },
      { name: 'steps', label: 'Steps', desc: '步骤条', icon: 'bar-chart-steps' },
      { name: 'progress', label: 'Progress', desc: '进度条', icon: 'reception-4' },
      { name: 'loading', label: 'Loading', desc: '加载', icon: 'arrow-clockwise' },
      { name: 'skeleton', label: 'Skeleton', desc: '骨架屏', icon: 'border' },
      { name: 'carousel', label: 'Carousel', desc: '轮播', icon: 'collection-play-fill' },
      { name: 'segmented', label: 'Segmented', desc: '分段器', icon: 'segmented-nav' },
      { name: 'pagination', label: 'Pagination', desc: '分页', icon: 'three-dots' }
    ]
  },
  {
    name: '反馈组件',
    icon: 'chat-square-dots-fill',
    color: 'danger',
    components: [
      { name: 'modal', label: 'Modal', desc: '对话框', icon: 'window' },
      { name: 'popup', label: 'Popup', desc: '弹出层', icon: 'window-stack' },
      { name: 'toast', label: 'Toast', desc: '轻提示', icon: 'chat-right-text' },
      { name: 'action-sheet', label: 'ActionSheet', desc: '动作面板', icon: 'list-task' },
      { name: 'drawer', label: 'Drawer', desc: '抽屉', icon: 'layout-sidebar' },
      { name: 'overlay', label: 'Overlay', desc: '遮罩', icon: 'bounding-box' },
      { name: 'tooltip', label: 'Tooltip', desc: '气泡提示', icon: 'chat-square-quote' },
      { name: 'dropdown', label: 'Dropdown', desc: '下拉菜单', icon: 'caret-down-square-fill' }
    ]
  },
  {
    name: '导航组件',
    icon: 'signpost-split-fill',
    color: 'info',
    components: [
      { name: 'navbar', label: 'Navbar', desc: '导航栏', icon: 'layout-text-window' },
      { name: 'tabbar', label: 'Tabbar', desc: '标签栏', icon: 'layout-three-columns' },
      { name: 'breadcrumb', label: 'Breadcrumb', desc: '面包屑', icon: 'chevron-right' }
    ]
  },
  {
    name: '高级组件',
    icon: 'stars',
    color: 'purple',
    components: [
      { name: 'calendar', label: 'Calendar', desc: '日历', icon: 'calendar3' },
      { name: 'date-picker', label: 'DatePicker', desc: '日期选择', icon: 'calendar-event' },
      { name: 'time-picker', label: 'TimePicker', desc: '时间选择', icon: 'clock' },
      { name: 'date-range-picker', label: 'DateRangePicker', desc: '日期范围', icon: 'calendar-range' },
      { name: 'date-time-picker', label: 'DateTimePicker', desc: '日期时间', icon: 'calendar-check' },
      { name: 'cascader', label: 'Cascader', desc: '级联选择', icon: 'diagram-3' },
      { name: 'tree', label: 'Tree', desc: '树形控件', icon: 'diagram-2' },
      { name: 'virtual-list', label: 'VirtualList', desc: '虚拟列表', icon: 'list-columns' },
      { name: 'waterfall', label: 'Waterfall', desc: '瀑布流', icon: 'grid-3x2' }
    ]
  }
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
      components: cat.components.filter(comp => 
        comp.name.toLowerCase().includes(keyword) ||
        comp.label.toLowerCase().includes(keyword) ||
        comp.desc.includes(keyword) ||
        cat.name.includes(keyword)
      )
    }))
    .filter(cat => cat.components.length > 0);
});

// 跳转到详情页
const navigateToDetail = (componentName: string) => {
  uni.navigateTo({
    url: `/pages/component-detail/index?name=${componentName}`
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
  background: linear-gradient(135deg, var(--lk-color-primary) 0%, var(--lk-color-primary-hover) 100%);
  border-radius: var(--lk-radius-xl);
  padding: 48rpx 32rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.1);
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
  color: rgba(255,255,255,0.9);
}

.stats-divider {
  width: 2rpx;
  background: rgba(255,255,255,0.3);
  margin: 0 24rpx;
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
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
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
  background: var(--lk-color-fill);
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
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
  transition: all 0.3s;

  &:active {
    transform: scale(0.95);
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
  }
}

.card-icon {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--card-color, var(--lk-color-primary));
  opacity: 0.1;
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
