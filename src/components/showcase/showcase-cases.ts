export interface ShowcaseCase {
  slug: string;
  title: string;
  group: 'basic' | 'form' | 'feedback' | 'advanced';
  verifyStatus: 'verified' | 'pending';
  riskLevel: 'low' | 'medium' | 'high';
  visualEnabled: boolean;
  riskNotes: string[];
}

/**
 * Showcase 组件清单。
 * 注意事项：仅放可稳定回归的组件，避免动画组件引入噪音截图。
 */
export const SHOWCASE_CASES: ShowcaseCase[] = [
  {
    slug: 'button',
    title: 'Button 按钮',
    group: 'basic',
    verifyStatus: 'verified',
    riskLevel: 'low',
    visualEnabled: true,
    riskNotes: ['点击态在小程序按压反馈与 H5 不一致。'],
  },
  {
    slug: 'input',
    title: 'Input 输入框',
    group: 'form',
    verifyStatus: 'verified',
    riskLevel: 'medium',
    visualEnabled: true,
    riskNotes: ['不同平台 placeholder 渲染基线存在细微差异。'],
  },
  {
    slug: 'picker',
    title: 'Picker 选择器',
    group: 'form',
    verifyStatus: 'pending',
    riskLevel: 'high',
    visualEnabled: true,
    riskNotes: ['⚠️可能存在平台差异：各端选择器 UI 与交互能力不同。'],
  },
  {
    slug: 'tabs',
    title: 'Tabs 标签页',
    group: 'basic',
    verifyStatus: 'pending',
    riskLevel: 'medium',
    visualEnabled: true,
    riskNotes: ['滚动与下划线动画在低端机型可能出现抖动。'],
  },
  {
    slug: 'tooltip',
    title: 'Tooltip 文字提示',
    group: 'feedback',
    verifyStatus: 'pending',
    riskLevel: 'high',
    visualEnabled: true,
    riskNotes: ['⚠️可能存在平台差异：定位与层级在 App/WebView 需重点验证。'],
  },
  {
    slug: 'waterfall',
    title: 'Waterfall 瀑布流',
    group: 'advanced',
    verifyStatus: 'pending',
    riskLevel: 'high',
    visualEnabled: true,
    riskNotes: ['⚠️可能存在平台差异：图片加载节奏会影响列高计算。'],
  },
  {
    slug: 'meta-row',
    title: 'MetaRow 结构行',
    group: 'basic',
    verifyStatus: 'pending',
    riskLevel: 'low',
    visualEnabled: true,
    riskNotes: ['用于信息行布局，建议重点验证长文本省略与金额对齐。'],
  },
];
