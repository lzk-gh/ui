# Lucky UI 组件分类和演示规划

## 组件总览 (共 52 个组件)

### 📱 页面分配方案

#### 1️⃣ HomePage - 基础组件 (8个)
展示最基础、最常用的 UI 元素

- **LkButton** - 按钮
- **LkIcon** - 图标
- **LkTag** - 标签
- **LkBadge** - 徽章
- **LkAvatar** - 头像
- **LkDivider** - 分割线
- **LkNoticeBar** - 通知栏
- **LkImage** - 图片

---

#### 2️⃣ DiscoverPage - 表单组件 (15个)
展示所有表单相关的输入控件

- **LkForm** - 表单容器
- **LkFormItem** - 表单项
- **LkInput** - 输入框
- **LkTextarea** - 文本域
- **LkSelect** - 选择器
- **LkOption** - 选项
- **LkRadio** - 单选框
- **LkRadioGroup** - 单选组
- **LkCheckbox** - 复选框
- **LkCheckboxGroup** - 复选组
- **LkSwitch** - 开关
- **LkStepper** - 步进器
- **LkSlider** - 滑块
- **LkRate** - 评分
- **LkUpload** - 上传

---

#### 3️⃣ MessagePage - 数据展示组件 (16个)
展示数据展示、导航、布局类组件

- **LkCard** - 卡片
- **LkCell** - 单元格
- **LkCellGroup** - 单元格组
- **LkCollapse** - 折叠面板
- **LkCollapseItem** - 折叠项
- **LkTable** - 表格
- **LkTabs** - 标签页
- **LkTabPane** - 标签面板
- **LkTimeline** - 时间轴
- **LkTimelineItem** - 时间轴项
- **LkSteps** - 步骤条
- **LkStep** - 步骤项
- **LkProgress** - 进度条
- **LkLoading** - 加载
- **LkSkeleton** - 骨架屏
- **LkCarousel** - 轮播
- **LkCarouselItem** - 轮播项

---

#### 4️⃣ MinePage - 反馈组件 (13个)
展示弹窗、提示、遮罩等反馈类组件

- **LkModal** - 模态框
- **LkPopup** - 弹出层
- **LkToast** - 轻提示
- **LkToastManager** - Toast管理器
- **LkActionSheet** - 动作面板
- **LkDrawer** - 抽屉
- **LkOverlay** - 遮罩层
- **LkTooltip** - 文字提示
- **LkDropdown** - 下拉菜单
- **LkDropdownItem** - 下拉项
- **LkBreadcrumb** - 面包屑
- **LkBreadcrumbItem** - 面包屑项
- **LkPagination** - 分页
- **LkSegmented** - 分段控制器

---

### 🚀 可选独立页面 - 高级组件

#### 日期时间组件 (5个)
- **LkCalendar** - 日历
- **LkDatePicker** - 日期选择
- **LkTimePicker** - 时间选择
- **LkDateRangePicker** - 日期范围
- **LkDateTimePicker** - 日期时间选择

#### 高级选择器 (4个)
- **LkCascader** - 级联选择
- **LkCascaderPanel** - 级联面板
- **LkTree** - 树形控件
- **LkTreeNode** - 树节点

#### 性能优化组件 (1个)
- **LkVirtualList** - 虚拟列表

---

## 每个组件的演示要求

### ✅ 必须包含的内容

1. **基础用法** - 最简单的使用示例
2. **不同状态** - 展示各种状态(禁用、加载、激活等)
3. **尺寸变化** - 如果组件支持多种尺寸
4. **类型/样式** - 展示不同的视觉样式
5. **交互反馈** - 点击、切换等操作要有提示

### 📋 演示区块结构

```vue
<demo-block title="组件名称">
  <!-- 基础用法 -->
  <view class="demo-section">
    <text class="section-label">基础用法</text>
    <组件示例 />
  </view>

  <!-- 不同类型 -->
  <view class="demo-section">
    <text class="section-label">不同类型</text>
    <view class="demo-row">
      <组件变体1 />
      <组件变体2 />
      <组件变体3 />
    </view>
  </view>

  <!-- 尺寸 -->
  <view class="demo-section">
    <text class="section-label">尺寸</text>
    <view class="demo-row">
      <组件 size="small" />
      <组件 size="medium" />
      <组件 size="large" />
    </view>
  </view>

  <!-- 状态 -->
  <view class="demo-section">
    <text class="section-label">状态</text>
    <view class="demo-row">
      <组件 disabled />
      <组件 loading />
    </view>
  </view>

  <!-- 自定义 -->
  <view class="demo-section">
    <text class="section-label">自定义</text>
    <组件自定义示例 />
  </view>
</demo-block>
```

---

## 统一样式规范

### 间距
- 页面内边距: `24rpx`
- 组件间距: `24rpx`
- 演示区块内部间距: `16rpx`
- 元素间距: `12-16rpx`

### 字体
- 页面标题: `40rpx` / `font-weight: 700`
- 区块标题: 使用 `demo-block` 的默认样式
- 说明标签: `26rpx` / `font-weight: 600` / 次要文字色
- 描述文字: `24rpx` / 三级文字色

### 颜色
- 使用 CSS 变量，确保主题切换正常
- `var(--lk-color-primary)` - 主色
- `var(--lk-color-text)` - 主要文字
- `var(--lk-color-text-secondary)` - 次要文字
- `var(--lk-color-text-tertiary)` - 三级文字
- `var(--lk-color-bg-surface)` - 卡片背景
- `var(--lk-color-border)` - 边框色

---

## 交互规范

### 点击反馈
所有可交互的演示都要有反馈:
```typescript
const showToast = (msg: string) => {
  uni.showToast({
    title: msg,
    icon: 'none',
    duration: 2000
  });
};
```

### 复制功能
对于代码片段、图标名称等，提供一键复制:
```typescript
const copyText = (text: string) => {
  // H5
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  }
  // 小程序/App
  uni.setClipboardData({ data: text });
  showToast(`已复制: ${text}`);
};
```

### 状态切换
演示中的状态要可以切换，不要只是静态展示:
```typescript
const loading = ref(false);
const handleClick = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    showToast('操作完成');
  }, 2000);
};
```

---

## 实施优先级

### P0 - 核心组件 (必须完成)
- Button, Input, Form, Modal, Toast
- 这些是使用频率最高的组件

### P1 - 常用组件 (优先完成)
- Icon, Tag, Badge, Avatar, Card, Cell
- Table, Tabs, Select, Switch, Checkbox, Radio

### P2 - 扩展组件 (其次完成)
- Collapse, Timeline, Steps, Progress, Loading
- Drawer, Popup, ActionSheet, Dropdown

### P3 - 高级组件 (最后完成)
- Calendar, DatePicker, Cascader, Tree
- VirtualList, Carousel, Upload

---

## 开发checklist

每个组件演示完成后，确认:

- [ ] 组件导入正确
- [ ] 所有 props 都有演示
- [ ] 所有 events 都有响应
- [ ] 支持主题切换
- [ ] H5 端测试通过
- [ ] 小程序端测试通过(如果需要)
- [ ] 没有控制台错误
- [ ] 交互反馈正常
- [ ] 样式符合规范
- [ ] 代码格式化

---

## 参考资料

- Vant 演示: https://vant-ui.github.io/vant/#/zh-CN
- Ant Design Mobile: https://mobile.ant.design/zh/components
- Element Plus: https://element-plus.org/zh-CN/component/button.html
- NutUI: https://nutui.jd.com/h5/vue/4x/#/zh-CN/component/button

---

**制定日期**: 2025-10-02  
**当前状态**: 架构完成，等待逐步实现各页面的组件演示
