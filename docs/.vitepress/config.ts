export default {
  lang: 'zh-CN',
  title: 'Lucky UI',
  description: 'Lucky UI 基础组件文档（VitePress）',
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: '组件', link: '/components/' },
      { text: '工程文档', link: '/IMPLEMENTATION_SUMMARY' },
      { text: 'GitHub', link: 'https://github.com/lzk-gh/ui' }
    ],
    sidebar: {
      '/components/': [
        {
          text: '概览',
          items: [
            { text: '组件总览', link: '/components/' },
            { text: 'Hooks 与工具', link: '/components/hooks-utils' }
          ]
        },
        {
          text: '基础组件',
          items: [
            { text: 'Button 按钮', link: '/components/basic/button' },
            { text: 'Icon 图标', link: '/components/basic/icon' },
            { text: 'Badge 徽标', link: '/components/basic/badge' },
            { text: 'Avatar 头像', link: '/components/basic/avatar' },
            { text: 'Cell 单元格', link: '/components/basic/cell' },
            { text: 'Divider 分割线', link: '/components/basic/divider' },
            { text: 'Tag 标签', link: '/components/basic/tag' }
          ]
        },
        {
          text: '所有组件',
          items: [
            { text: 'Action Sheet 动作面板', link: '/components/action-sheet' },
            { text: 'Anchor 锚点导航', link: '/components/anchor' },
            { text: 'Backtop 返回顶部', link: '/components/backtop' },
            { text: 'Breadcrumb 面包屑', link: '/components/breadcrumb' },
            { text: 'Calendar 日历', link: '/components/calendar' },
            { text: 'Card 卡片', link: '/components/card' },
            { text: 'Carousel 轮播', link: '/components/carousel' },
            { text: 'Cascader 级联选择', link: '/components/cascader' },
            { text: 'Cascader Panel 级联面板', link: '/components/cascader-panel' },
            { text: 'ChartBar 柱状图', link: '/components/chart-bar' },
            { text: 'ChartLine 折线图', link: '/components/chart-line' },
            { text: 'ChartPie 饼/环图', link: '/components/chart-pie' },
            { text: 'Checkbox 复选框', link: '/components/checkbox' },
            { text: 'Collapse 折叠面板', link: '/components/collapse' },
            { text: 'Date Picker 日期选择器', link: '/components/date-picker' },
            { text: 'Dropdown 下拉菜单', link: '/components/dropdown' },
            { text: 'Fab 悬浮按钮', link: '/components/fab' },
            { text: 'Form 表单', link: '/components/form' },
            { text: 'Image 图片', link: '/components/image' },
            { text: 'Input 输入框', link: '/components/input' },
            { text: 'Loading 加载', link: '/components/loading' },
            { text: 'Modal 模态框', link: '/components/modal' },
            { text: 'Navbar 导航栏', link: '/components/navbar' },
            { text: 'Notice Bar 通知栏', link: '/components/notice-bar' },
            { text: 'Overlay 遮罩层', link: '/components/overlay' },
            { text: 'Popup 弹出层', link: '/components/popup' },
            { text: 'Preload 预加载', link: '/components/preload' },
            { text: 'Progress 进度条', link: '/components/progress' },
            { text: 'Radio 单选框', link: '/components/radio' },
            { text: 'Rate 评分', link: '/components/rate' },
            { text: 'Segmented 分段器', link: '/components/segmented' },
            { text: 'Skeleton 骨架屏', link: '/components/skeleton' },
            { text: 'Slider 滑块', link: '/components/slider' },
            { text: 'Stepper 步进器', link: '/components/stepper' },
            { text: 'Steps 步骤条', link: '/components/steps' },
            { text: 'Switch 开关', link: '/components/switch' },
            { text: 'Tabbar 底部导航', link: '/components/tabbar' },
            { text: 'Tabs 选项卡', link: '/components/tabs' },
            { text: 'Textarea 文本域', link: '/components/textarea' },
            { text: 'Time Picker 时间选择器', link: '/components/time-picker' },
            { text: 'Timeline 时间轴', link: '/components/timeline' },
            { text: 'Toast 轻提示', link: '/components/toast' },
            { text: 'Tooltip 文字提示', link: '/components/tooltip' },
            { text: 'Upload 上传', link: '/components/upload' },
            { text: 'Verify Code 验证码', link: '/components/verify-code' },
            { text: 'Virtual List 虚拟列表', link: '/components/virtual-list' },
            { text: 'Waterfall 瀑布流', link: '/components/waterfall' }
          ]
        }
      ],
      '/': [
        {
          text: '开始',
          items: [
            { text: '概览', link: '/' }
          ]
        },
        {
          text: '工程文档',
          items: [
            { text: '实施总结', link: '/IMPLEMENTATION_SUMMARY' },
            { text: '新架构', link: '/NEW_ARCHITECTURE' },
            { text: '测试指南', link: '/TESTING_GUIDE' },
            { text: 'Demo 计划', link: '/DEMO_IMPLEMENTATION_PLAN' },
            { text: '组件完成度', link: '/COMPONENT_COMPLETION_SUMMARY' }
          ]
        }
      ]
    },
    outline: [2, 3],
    search: {
      provider: 'local'
    }
  }
}
