import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Lucky UI',
  description: '面向 Uni-app 的跨端组件库，支持 H5 与微信小程序',
  lastUpdated: true,

  head: [
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['meta', { name: 'theme-color', content: '#7c3aed' }],
  ],

  themeConfig: {
    siteTitle: 'Lucky UI',

    nav: [
      { text: '指南', link: '/guide/', activeMatch: '/guide/' },
      { text: '组件', link: '/components/', activeMatch: '/components/' },
      {
        text: '资源',
        items: [
          { text: '更新日志', link: '/changelog' },
          { text: 'GitHub', link: 'https://github.com/lzk-gh/ui' },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '安装与引入', link: '/guide/install' },
            { text: '主题定制', link: '/guide/theme' },
          ],
        },
      ],

      '/components/': [
        {
          text: '概览',
          items: [{ text: '组件总览', link: '/components/' }],
        },
        {
          text: '基础元素',
          collapsed: false,
          items: [
            { text: 'Button 按钮', link: '/components/basic/button' },
            { text: 'Icon 图标', link: '/components/basic/icon' },
            { text: 'Avatar 头像', link: '/components/basic/avatar' },
            { text: 'Badge 徽标', link: '/components/basic/badge' },
            { text: 'Tag 标签', link: '/components/basic/tag' },
            { text: 'Divider 分割线', link: '/components/basic/divider' },
            { text: 'Cell 单元格', link: '/components/basic/cell' },
          ],
        },
        {
          text: '布局',
          collapsed: false,
          items: [
            { text: 'Grid 宫格', link: '/components/grid' },
            { text: 'Space 间距', link: '/components/space' },
          ],
        },
        {
          text: '表单控件',
          collapsed: false,
          items: [
            { text: 'Form 表单', link: '/components/form' },
            { text: 'Input 输入框', link: '/components/input' },
            { text: 'Textarea 文本域', link: '/components/textarea' },
            { text: 'Radio 单选框', link: '/components/radio' },
            { text: 'Checkbox 复选框', link: '/components/checkbox' },
            { text: 'Switch 开关', link: '/components/switch' },
            { text: 'Stepper 步进器', link: '/components/stepper' },
            { text: 'Slider 滑块', link: '/components/slider' },
            { text: 'Rate 评分', link: '/components/rate' },
            { text: 'Upload 文件上传', link: '/components/upload' },
            { text: 'Date Picker 日期选择', link: '/components/date-picker' },
            { text: 'Time Picker 时间选择', link: '/components/time-picker' },
            { text: 'Keyboard 键盘', link: '/components/keyboard' },
            { text: 'Verify Code 验证码', link: '/components/verify-code' },
          ],
        },
        {
          text: '数据展示',
          collapsed: false,
          items: [
            { text: 'Card 卡片', link: '/components/card' },
            { text: 'Carousel 轮播', link: '/components/carousel' },
            { text: 'Collapse 折叠面板', link: '/components/collapse' },
            { text: 'Timeline 时间轴', link: '/components/timeline' },
            { text: 'Steps 步骤条', link: '/components/steps' },
            { text: 'Progress 进度条', link: '/components/progress' },
            { text: 'Loading 加载', link: '/components/loading' },
            { text: 'Skeleton 骨架屏', link: '/components/skeleton' },
            { text: 'Number Roller 数字滚动', link: '/components/number-roller' },
            { text: 'Image 图片', link: '/components/image' },
            { text: 'Virtual List 虚拟列表', link: '/components/virtual-list' },
            { text: 'Waterfall 瀑布流', link: '/components/waterfall' },
          ],
        },
        {
          text: '图表',
          collapsed: true,
          items: [
            { text: 'ChartBar 柱状图', link: '/components/chart-bar' },
            { text: 'ChartLine 折线图', link: '/components/chart-line' },
            { text: 'ChartPie 饼图', link: '/components/chart-pie' },
          ],
        },
        {
          text: '导航',
          collapsed: false,
          items: [
            { text: 'Navbar 导航栏', link: '/components/navbar' },
            { text: 'Tabbar 底部导航', link: '/components/tabbar' },
            { text: 'Tabs 选项卡', link: '/components/tabs' },
            { text: 'Segmented 分段器', link: '/components/segmented' },
            { text: 'Anchor 锚点导航', link: '/components/anchor' },
            { text: 'Backtop 返回顶部', link: '/components/backtop' },
          ],
        },
        {
          text: '反馈与浮层',
          collapsed: false,
          items: [
            { text: 'Modal 模态框', link: '/components/modal' },
            { text: 'Popup 弹出层', link: '/components/popup' },
            { text: 'Toast 轻提示', link: '/components/toast' },
            { text: 'Action Sheet 动作面板', link: '/components/action-sheet' },
            { text: 'Overlay 遮罩层', link: '/components/overlay' },
            { text: 'Tooltip 文字提示', link: '/components/tooltip' },
            { text: 'Dropdown 下拉菜单', link: '/components/dropdown' },
            { text: 'Notice Bar 通知栏', link: '/components/notice-bar' },
          ],
        },
        {
          text: '高级',
          collapsed: true,
          items: [
            { text: 'Fab 悬浮按钮', link: '/components/fab' },
            { text: 'Curtain 幕帘', link: '/components/curtain' },
            { text: 'Horizontal Scroll 横向滚动', link: '/components/horizontal-scroll' },
            { text: 'Preload 预加载调试', link: '/components/preload' },
          ],
        },
        {
          text: '工具与能力',
          collapsed: true,
          items: [
            { text: 'Hooks 与工具', link: '/components/hooks-utils' },
            { text: 'Network Request 网络请求', link: '/components/request' },
          ],
        },
      ],
    },

    outline: {
      level: [2, 3],
      label: '本页内容',
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: {
            noResultsText: '没有找到相关结果',
            resetButtonTitle: '清除',
            footer: { selectText: '选择', navigateText: '导航', closeText: '关闭' },
          },
        },
      },
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/lzk-gh/ui' }],

    footer: {
      message: '基于 MIT 协议开源',
      copyright: 'Copyright © 2024-present Lucky UI',
    },

    docFooter: { prev: '上一页', next: '下一页' },
    darkModeSwitchLabel: '外观',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
  },
})
