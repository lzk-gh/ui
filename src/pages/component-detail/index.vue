<template>
  <view class="detail-page" :class="theme === 'dark' ? 'lk-theme-dark' : 'lk-theme-light'">
    <!-- 导航栏 -->
    <lk-navbar :title="componentTitle" />

    <!-- 内容区域 -->
    <scroll-view class="page-content" scroll-y>
      <view class="content-wrapper">
        <!-- 组件信息卡片 -->
        <view class="info-card">
          <view class="info-header">
            <lk-icon :name="componentIcon" size="72" :color="componentColor" />
            <view class="info-text">
              <text class="info-title">{{ componentTitle }}</text>
              <text class="info-desc">{{ componentDesc }}</text>
            </view>
          </view>
        </view>

        <!-- 演示区域 -->
        <view class="demo-area">
          <!-- 动态加载对应的演示组件（小程序不支持 <component :is>，改用 v-if 静态切换） -->
          <ButtonDemo v-if="componentName === 'button'" />
          <IconDemo v-else-if="componentName === 'icon'" />
          <TagDemo v-else-if="componentName === 'tag'" />
          <BadgeDemo v-else-if="componentName === 'badge'" />
          <AvatarDemo v-else-if="componentName === 'avatar'" />
          <DividerDemo v-else-if="componentName === 'divider'" />
          <NoticeBarDemo v-else-if="componentName === 'notice-bar'" />
          <ImageDemo v-else-if="componentName === 'image'" />
          <GridDemo v-else-if="componentName === 'grid'" />
          <SpaceDemo v-else-if="componentName === 'space'" />

          <FormDemo v-else-if="componentName === 'form'" />
          <InputDemo v-else-if="componentName === 'input'" />
          <TextareaDemo v-else-if="componentName === 'textarea'" />
          <RadioDemo v-else-if="componentName === 'radio'" />
          <CheckboxDemo v-else-if="componentName === 'checkbox'" />
          <SwitchDemo v-else-if="componentName === 'switch'" />
          <StepperDemo v-else-if="componentName === 'stepper'" />
          <SliderDemo v-else-if="componentName === 'slider'" />
          <RateDemo v-else-if="componentName === 'rate'" />
          <UploadDemo v-else-if="componentName === 'upload'" />
          <PickerDemo v-else-if="componentName === 'picker'" />
          <PickerViewDemo v-else-if="componentName === 'picker-view'" />
          <AreaPickerDemo v-else-if="componentName === 'area-picker'" />
          <NumberKeyboardDemo v-else-if="componentName === 'number-keyboard'" />
          <VerifyCodeDemo v-else-if="componentName === 'verify-code'" />

          <CardDemo v-else-if="componentName === 'card'" />
          <CellDemo v-else-if="componentName === 'cell'" />
          <CollapseDemo v-else-if="componentName === 'collapse'" />
          <TableDemo v-else-if="componentName === 'table'" />
          <TabsDemo v-else-if="componentName === 'tabs'" />
          <TimelineDemo v-else-if="componentName === 'timeline'" />
          <StepsDemo v-else-if="componentName === 'steps'" />
          <ProgressDemo v-else-if="componentName === 'progress'" />
          <LoadingDemo v-else-if="componentName === 'loading'" />
          <NumberRollerDemo v-else-if="componentName === 'number-roller'" />
          <SkeletonDemo v-else-if="componentName === 'skeleton'" />
          <CarouselDemo v-else-if="componentName === 'carousel'" />
          <SegmentedDemo v-else-if="componentName === 'segmented'" />
          <PaginationDemo v-else-if="componentName === 'pagination'" />
          <BacktopDemo v-else-if="componentName === 'backtop'" />

          <ModalDemo v-else-if="componentName === 'modal'" />
          <PopupDemo v-else-if="componentName === 'popup'" />
          <ToastDemo v-else-if="componentName === 'toast'" />
          <ActionSheetDemo v-else-if="componentName === 'action-sheet'" />
          <OverlayDemo v-else-if="componentName === 'overlay'" />
          <TooltipDemo v-else-if="componentName === 'tooltip'" />
          <DropdownDemo v-else-if="componentName === 'dropdown'" />
          <TransitionDemo v-else-if="componentName === 'transition'" />

          <NavbarDemo v-else-if="componentName === 'navbar'" />
          <TabbarDemo v-else-if="componentName === 'tabbar'" />
          <BreadcrumbDemo v-else-if="componentName === 'breadcrumb'" />
          <IndexBarDemo v-else-if="componentName === 'index-bar'" />
          <AnchorDemo v-else-if="componentName === 'anchor'" />
          <StickyDemo v-else-if="componentName === 'sticky'" />

          <CalendarDemo v-else-if="componentName === 'calendar'" />
          <DatePickerDemo v-else-if="componentName === 'date-picker'" />
          <CascaderDemo v-else-if="componentName === 'cascader'" />
          <VirtualListDemo v-else-if="componentName === 'virtual-list'" />
          <WaterfallDemo v-else-if="componentName === 'waterfall'" />
          <CurtainDemo v-else-if="componentName === 'curtain'" />
          <HorizontalScrollDemo v-else-if="componentName === 'horizontal-scroll'" />

          <ChartBarDemo v-else-if="componentName === 'chart-bar'" />
          <ChartLineDemo v-else-if="componentName === 'chart-line'" />
          <ChartPieDemo v-else-if="componentName === 'chart-pie'" />

          <!-- 开发中提示 -->
          <view v-else class="developing-tip">
            <lk-icon name="code-square" size="100" color="textTertiary" />
            <text class="tip-text">该组件详细演示开发中...</text>
            <text class="tip-desc">请先访问其他已实现的组件</text>
          </view>
        </view>

        <!-- API 文档入口 -->
        <view class="api-section">
          <view class="section-title">
            <lk-icon name="book-fill" size="32" color="primary" />
            <text>组件 API</text>
          </view>

          <lk-cell title="属性 Props" label="查看所有可配置属性" is-link />
          <lk-cell title="事件 Events" label="查看所有事件回调" is-link />
          <lk-cell title="插槽 Slots" label="查看所有插槽说明" is-link />
          <lk-cell title="方法 Methods" label="查看组件实例方法" is-link />
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTheme } from '@/uni_modules/lucky-ui/theme';
import { onLoad } from '@dcloudio/uni-app';
import LkNavbar from '@/uni_modules/lucky-ui/components/lk-navbar/lk-navbar.vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import LkCell from '@/uni_modules/lucky-ui/components/lk-cell/lk-cell.vue';

import ChartBarDemo from '@/components/demos/chart-bar-demo.vue';
import ChartLineDemo from '@/components/demos/chart-line-demo.vue';
import ChartPieDemo from '@/components/demos/chart-pie-demo.vue';

// 组件信息映射
const componentMap: Record<string, any> = {
  // 基础组件
  button: {
    title: 'Button 按钮',
    desc: '用于触发操作的交互元素',
    icon: 'square-fill',
    color: 'primary',
  },
  icon: {
    title: 'Icon 图标',
    desc: '语义化的矢量图标',
    icon: 'heart-fill',
    color: 'danger',
  },
  tag: {
    title: 'Tag 标签',
    desc: '用于标记和分类的标签',
    icon: 'tag-fill',
    color: 'success',
  },
  badge: {
    title: 'Badge 徽标',
    desc: '展示消息数量的徽标',
    icon: 'circle-fill',
    color: 'warning',
  },
  avatar: {
    title: 'Avatar 头像',
    desc: '用户头像展示组件',
    icon: 'person-circle',
    color: 'info',
  },
  divider: {
    title: 'Divider 分割线',
    desc: '区隔内容的分割线',
    icon: 'dash-lg',
    color: 'textSecondary',
  },
  'notice-bar': {
    title: 'NoticeBar 通知栏',
    desc: '用于展示通知消息',
    icon: 'megaphone-fill',
    color: 'warning',
  },
  image: {
    title: 'Image 图片',
    desc: '增强的图片展示组件',
    icon: 'image-fill',
    color: 'success',
  },
  grid: {
    title: 'Grid 栅格',
    desc: '24 栅格布局系统',
    icon: 'grid-3x3-gap',
    color: 'primary',
  },
  space: {
    title: 'Space 间距',
    desc: '设置组件之间的间距',
    icon: 'arrows-expand',
    color: 'primary',
  },

  // 表单组件
  form: {
    title: 'Form 表单',
    desc: '表单容器与验证',
    icon: 'ui-checks',
    color: 'primary',
  },
  input: {
    title: 'Input 输入框',
    desc: '文本输入组件',
    icon: 'input-cursor-text',
    color: 'primary',
  },
  textarea: {
    title: 'Textarea 多行输入',
    desc: '多行文本输入',
    icon: 'textarea-t',
    color: 'primary',
  },
  radio: {
    title: 'Radio 单选框',
    desc: '单项选择组件',
    icon: 'record-circle-fill',
    color: 'success',
  },
  checkbox: {
    title: 'Checkbox 复选框',
    desc: '多项选择组件',
    icon: 'check-square-fill',
    color: 'success',
  },
  switch: {
    title: 'Switch 开关',
    desc: '开关切换组件',
    icon: 'toggle-on',
    color: 'success',
  },
  stepper: {
    title: 'Stepper 步进器',
    desc: '数字增减组件',
    icon: 'plus-slash-minus',
    color: 'warning',
  },
  slider: {
    title: 'Slider 滑块',
    desc: '滑动选择组件',
    icon: 'sliders',
    color: 'warning',
  },
  rate: {
    title: 'Rate 评分',
    desc: '星级评分组件',
    icon: 'star-fill',
    color: 'warning',
  },
  upload: {
    title: 'Upload 上传',
    desc: '文件上传组件',
    icon: 'cloud-upload-fill',
    color: 'info',
  },
  picker: {
    title: 'Picker 选择器',
    desc: '弹出选择器',
    icon: 'menu-button-wide',
    color: 'success',
  },
  'picker-view': {
    title: 'PickerView 选择器视图',
    desc: '内联滚动选择视图',
    icon: 'columns',
    color: 'success',
  },
  'area-picker': {
    title: 'AreaPicker 地区选择',
    desc: '省市区三级联动选择',
    icon: 'geo-alt',
    color: 'success',
  },
  'number-keyboard': {
    title: 'NumberKeyboard 数字键盘',
    desc: '用于数字输入的虚拟键盘',
    icon: '123',
    color: 'warning',
  },
  'verify-code': {
    title: 'VerifyCode 验证码',
    desc: '短信/验证码输入',
    icon: 'shield-lock',
    color: 'warning',
  },

  // 数据展示组件
  card: {
    title: 'Card 卡片',
    desc: '通用卡片容器',
    icon: 'card-text',
    color: 'primary',
  },
  cell: {
    title: 'Cell 单元格',
    desc: '列表单元格组件',
    icon: 'list-ul',
    color: 'primary',
  },
  collapse: {
    title: 'Collapse 折叠面板',
    desc: '可折叠的内容面板',
    icon: 'arrows-collapse',
    color: 'primary',
  },
  table: {
    title: 'Table 表格',
    desc: '数据表格组件',
    icon: 'table',
    color: 'success',
  },
  tabs: {
    title: 'Tabs 标签页',
    desc: '选项卡切换组件',
    icon: 'layout-text-sidebar',
    color: 'success',
  },
  timeline: {
    title: 'Timeline 时间轴',
    desc: '垂直时间轴组件',
    icon: 'clock-history',
    color: 'warning',
  },
  steps: {
    title: 'Steps 步骤条',
    desc: '步骤流程组件',
    icon: 'diagram-3-fill',
    color: 'warning',
  },
  progress: {
    title: 'Progress 进度条',
    desc: '进度指示组件',
    icon: 'hourglass-split',
    color: 'info',
  },
  loading: {
    title: 'Loading 加载',
    desc: '加载状态提示',
    icon: 'arrow-repeat',
    color: 'info',
  },
  skeleton: {
    title: 'Skeleton 骨架屏',
    desc: '内容加载占位',
    icon: 'menu-up',
    color: 'textSecondary',
  },
  carousel: {
    title: 'Carousel 轮播图',
    desc: '图片轮播组件',
    icon: 'images',
    color: 'danger',
  },
  segmented: {
    title: 'Segmented 分段器',
    desc: '分段选择组件',
    icon: 'segmented-nav',
    color: 'primary',
  },
  pagination: {
    title: 'Pagination 分页',
    desc: '数据分页组件',
    icon: 'three-dots',
    color: 'primary',
  },
  'number-roller': {
    title: 'NumberRoller 数字翻牌',
    desc: '流畅的数值增长展示',
    icon: 'speedometer',
    color: 'info',
  },

  // 反馈组件
  modal: {
    title: 'Modal 模态框',
    desc: '模态对话框组件',
    icon: 'window',
    color: 'primary',
  },
  popup: {
    title: 'Popup 弹出层',
    desc: '多方向弹出层',
    icon: 'app-indicator',
    color: 'primary',
  },
  toast: {
    title: 'Toast 轻提示',
    desc: '轻量级提示反馈',
    icon: 'chat-left-text-fill',
    color: 'success',
  },
  'action-sheet': {
    title: 'ActionSheet 动作面板',
    desc: '底部动作选择',
    icon: 'menu-app-fill',
    color: 'success',
  },
  overlay: {
    title: 'Overlay 遮罩层',
    desc: '页面遮罩组件',
    icon: 'square',
    color: 'textSecondary',
  },
  tooltip: {
    title: 'Tooltip 文字提示',
    desc: '文字提示气泡',
    icon: 'chat-square-quote-fill',
    color: 'info',
  },
  dropdown: {
    title: 'Dropdown 下拉菜单',
    desc: '下拉菜单组件',
    icon: 'menu-down',
    color: 'danger',
  },
  transition: {
    title: 'Transition 过渡动画',
    desc: '丰富的过渡动画效果',
    icon: 'bezier2',
    color: 'primary',
  },

  // 导航组件
  navbar: {
    title: 'Navbar 导航栏',
    desc: '顶部导航栏组件',
    icon: 'phone',
    color: 'primary',
  },
  tabbar: {
    title: 'Tabbar 标签栏',
    desc: '底部标签栏组件',
    icon: 'menu-button-wide',
    color: 'success',
  },
  breadcrumb: {
    title: 'Breadcrumb 面包屑',
    desc: '导航路径组件',
    icon: 'chevron-right',
    color: 'warning',
  },
  backtop: {
    title: 'Backtop 回到顶部',
    desc: '快速返回页面顶部的悬浮按钮',
    icon: 'arrow-up-circle',
    color: 'primary',
  },
  'index-bar': {
    title: 'IndexBar 索引栏',
    desc: '字母索引快速定位',
    icon: 'sort-alpha-down',
    color: 'primary',
  },
  anchor: {
    title: 'Anchor 锚点',
    desc: '页面锚点与激活',
    icon: 'hash',
    color: 'primary',
  },
  sticky: {
    title: 'Sticky 粘性布局',
    desc: '基于位置的吸附布局',
    icon: 'pin-angle',
    color: 'primary',
  },

  // 高级组件
  calendar: {
    title: 'Calendar 日历',
    desc: '日历选择组件',
    icon: 'calendar3',
    color: 'primary',
  },
  'date-picker': {
    title: 'DatePicker 日期选择',
    desc: '日期选择器',
    icon: 'calendar-date-fill',
    color: 'success',
  },
  cascader: {
    title: 'Cascader 级联选择',
    desc: '级联选择器',
    icon: 'diagram-2-fill',
    color: 'info',
  },
  'virtual-list': {
    title: 'VirtualList 虚拟列表',
    desc: '长列表优化组件',
    icon: 'list-nested',
    color: 'primary',
  },
  waterfall: {
    title: 'Waterfall 瀑布流',
    desc: '多列不规则流布局',
    icon: 'grid-3x2-gap',
    color: 'primary',
  },
  curtain: {
    title: 'Curtain 幕帘',
    desc: '全屏广告或公告幕帘',
    icon: 'aspect-ratio',
    color: 'warning',
  },
  'horizontal-scroll': {
    title: 'HorizontalScroll 横向滚动',
    desc: '横向滚动列表容器',
    icon: 'distribute-horizontal',
    color: 'success',
  },

  'chart-bar': {
    title: 'ChartBar 柱状图',
    desc: '高性能 Canvas 柱状图组件',
    icon: 'bar-chart-fill',
    color: 'primary',
  },
  'chart-line': {
    title: 'ChartLine 折线图',
    desc: '高性能 Canvas 折线图组件',
    icon: 'graph-up',
    color: 'primary',
  },
  'chart-pie': {
    title: 'ChartPie 饼/环图',
    desc: '高性能 Canvas 饼/环图组件',
    icon: 'pie-chart-fill',
    color: 'primary',
  },
};

// 当前组件名称
const componentName = ref('');
const componentTitle = computed(() => componentMap[componentName.value]?.title || '组件详情');
const componentDesc = computed(() => componentMap[componentName.value]?.desc || '');
const componentIcon = computed(() => componentMap[componentName.value]?.icon || 'box-seam');
const componentColor = computed(() => componentMap[componentName.value]?.color || 'primary');

// 动态演示组件
// 保留原变量，避免其他平台编译差异；小程序端已改用静态 v-if
const demoComponent = ref<any>(null);

// 主题
const { theme } = useTheme();

// 页面加载
onLoad(options => {
  if (options?.name) {
    componentName.value = options.name;
    loadDemoComponent(options.name);
  }
});

// 导入所有演示组件
// 基础组件
import ButtonDemo from '@/components/demos/button-demo.vue';
import IconDemo from '@/components/demos/icon-demo.vue';
import TagDemo from '@/components/demos/tag-demo.vue';
import BadgeDemo from '@/components/demos/badge-demo.vue';
import AvatarDemo from '@/components/demos/avatar-demo.vue';
import DividerDemo from '@/components/demos/divider-demo.vue';
import NoticeBarDemo from '@/components/demos/notice-bar-demo.vue';
import ImageDemo from '@/components/demos/image-demo.vue';
import GridDemo from '@/components/demos/grid-demo.vue';
import SpaceDemo from '@/components/demos/space-demo.vue';

// 表单组件
import FormDemo from '@/components/demos/form-demo.vue';
import InputDemo from '@/components/demos/input-demo.vue';
import TextareaDemo from '@/components/demos/textarea-demo.vue';
import RadioDemo from '@/components/demos/radio-demo.vue';
import CheckboxDemo from '@/components/demos/checkbox-demo.vue';
import SwitchDemo from '@/components/demos/switch-demo.vue';
import StepperDemo from '@/components/demos/stepper-demo.vue';
import SliderDemo from '@/components/demos/slider-demo.vue';
import RateDemo from '@/components/demos/rate-demo.vue';
import UploadDemo from '@/components/demos/upload-demo.vue';
import PickerDemo from '@/components/demos/picker-demo.vue';
import PickerViewDemo from '@/components/demos/picker-view-demo.vue';
import AreaPickerDemo from '@/components/demos/area-picker-demo.vue';
import NumberKeyboardDemo from '@/components/demos/number-keyboard-demo.vue';
import VerifyCodeDemo from '@/components/demos/verify-code-demo.vue';

// 数据展示组件
import CardDemo from '@/components/demos/card-demo.vue';
import CellDemo from '@/components/demos/cell-demo.vue';
import CollapseDemo from '@/components/demos/collapse-demo.vue';
import TableDemo from '@/components/demos/table-demo.vue';
import TabsDemo from '@/components/demos/tabs-demo.vue';
import TimelineDemo from '@/components/demos/timeline-demo.vue';
import StepsDemo from '@/components/demos/steps-demo.vue';
import ProgressDemo from '@/components/demos/progress-demo.vue';
import LoadingDemo from '@/components/demos/loading-demo.vue';
import NumberRollerDemo from '@/components/demos/number-roller-demo.vue';
import SkeletonDemo from '@/components/demos/skeleton-demo.vue';
import CarouselDemo from '@/components/demos/carousel-demo.vue';
import SegmentedDemo from '@/components/demos/segmented-demo.vue';
import PaginationDemo from '@/components/demos/pagination-demo.vue';
import BacktopDemo from '@/components/demos/backtop-demo.vue';

// 反馈组件
import ModalDemo from '@/components/demos/modal-demo.vue';
import PopupDemo from '@/components/demos/popup-demo.vue';
import ToastDemo from '@/components/demos/toast-demo.vue';
import ActionSheetDemo from '@/components/demos/action-sheet-demo.vue';
import OverlayDemo from '@/components/demos/overlay-demo.vue';
import TooltipDemo from '@/components/demos/tooltip-demo.vue';
import DropdownDemo from '@/components/demos/dropdown-demo.vue';
import TransitionDemo from '@/components/demos/transition-demo.vue';

// 导航组件
import NavbarDemo from '@/components/demos/navbar-demo.vue';
import TabbarDemo from '@/components/demos/tabbar-demo.vue';
import BreadcrumbDemo from '@/components/demos/breadcrumb-demo.vue';
import IndexBarDemo from '@/components/demos/index-bar-demo.vue';
import AnchorDemo from '@/components/demos/anchor-demo.vue';
import StickyDemo from '@/components/demos/sticky-demo.vue';

// 高级组件
import CalendarDemo from '@/components/demos/calendar-demo.vue';
import DatePickerDemo from '@/components/demos/date-picker-demo.vue';
import CascaderDemo from '@/components/demos/cascader-demo.vue';
import VirtualListDemo from '@/components/demos/virtual-list-demo.vue';
import WaterfallDemo from '@/components/demos/waterfall-demo.vue';
import CurtainDemo from '@/components/demos/curtain-demo.vue';
import HorizontalScrollDemo from '@/components/demos/horizontal-scroll-demo.vue';

// 演示组件映射
const demoComponentMap: Record<string, any> = {
  // 基础组件
  button: ButtonDemo,
  icon: IconDemo,
  tag: TagDemo,
  badge: BadgeDemo,
  avatar: AvatarDemo,
  divider: DividerDemo,
  'notice-bar': NoticeBarDemo,
  image: ImageDemo,
  grid: GridDemo,
  space: SpaceDemo,

  // 表单组件
  form: FormDemo,
  input: InputDemo,
  textarea: TextareaDemo,
  radio: RadioDemo,
  checkbox: CheckboxDemo,
  switch: SwitchDemo,
  stepper: StepperDemo,
  slider: SliderDemo,
  rate: RateDemo,
  upload: UploadDemo,
  picker: PickerDemo,
  'picker-view': PickerViewDemo,
  'area-picker': AreaPickerDemo,
  'number-keyboard': NumberKeyboardDemo,
  'verify-code': VerifyCodeDemo,

  // 数据展示组件
  card: CardDemo,
  cell: CellDemo,
  collapse: CollapseDemo,
  table: TableDemo,
  tabs: TabsDemo,
  timeline: TimelineDemo,
  steps: StepsDemo,
  progress: ProgressDemo,
  loading: LoadingDemo,
  'number-roller': NumberRollerDemo,
  skeleton: SkeletonDemo,
  carousel: CarouselDemo,
  segmented: SegmentedDemo,
  pagination: PaginationDemo,
  backtop: BacktopDemo,

  // 反馈组件
  modal: ModalDemo,
  popup: PopupDemo,
  toast: ToastDemo,
  'action-sheet': ActionSheetDemo,
  overlay: OverlayDemo,
  tooltip: TooltipDemo,
  dropdown: DropdownDemo,
  transition: TransitionDemo,

  // 导航组件
  navbar: NavbarDemo,
  tabbar: TabbarDemo,
  breadcrumb: BreadcrumbDemo,
  'index-bar': IndexBarDemo,
  anchor: AnchorDemo,
  sticky: StickyDemo,

  // 高级组件
  calendar: CalendarDemo,
  'date-picker': DatePickerDemo,
  cascader: CascaderDemo,
  'virtual-list': VirtualListDemo,
  waterfall: WaterfallDemo,
  curtain: CurtainDemo,
  'horizontal-scroll': HorizontalScrollDemo,
};

// 加载对应的演示组件
const loadDemoComponent = async (name: string) => {
  try {
    demoComponent.value = demoComponentMap[name] || null;
    console.log('加载组件演示:', name, demoComponent.value ? '成功' : '暂无');
  } catch (error) {
    console.error('加载组件演示失败:', error);
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/test-page.scss';

.detail-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: $test-bg-page;
}

.page-content {
  flex: 1;
  overflow-y: auto;
}

.content-wrapper {
  padding: 24rpx;
}

// 信息卡片（测试页面样式）
.info-card {
  background: $test-gradient-primary;
  border-radius: $test-border-radius;
  padding: 40rpx;
  margin-bottom: 24rpx;
  box-shadow: $test-shadow-lg;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.info-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.info-title {
  font-size: 40rpx;
  font-weight: 700;
  color: $test-text-inverse;
}

.info-desc {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
}

// 演示区域
.demo-area {
  min-height: 400rpx;
  margin-bottom: 24rpx;
}

// 开发中提示（测试页面样式）
.developing-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 48rpx;
  background: $test-bg-card;
  border-radius: $test-border-radius;
  border: 2rpx dashed $test-border-color;
}

.tip-text {
  font-size: 28rpx;
  font-weight: 600;
  color: $test-text-secondary;
  margin-top: 24rpx;
}

.tip-desc {
  font-size: 24rpx;
  color: $test-text-tertiary;
  margin-top: 12rpx;
}

// API 区域（测试页面样式）
.api-section {
  background: $test-bg-card;
  border: 1rpx solid $test-border-color;
  border-radius: $test-border-radius;
  overflow: hidden;
  box-shadow: $test-shadow-sm;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 32rpx 32rpx 24rpx;
  font-size: 32rpx;
  font-weight: 700;
  color: $test-text-primary;
}
</style>
