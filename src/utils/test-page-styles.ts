/**
 * 测试页面样式常量
 * 用于 Vue 模板的内联样式
 * 对应 test-page.scss 中的变量
 */

export const TestPageColors = {
  // 主题色
  primary: 'var(--test-primary, #3b82f6)',
  success: 'var(--test-success, #10b981)',
  warning: 'var(--test-warning, #f59e0b)',
  danger: 'var(--test-danger, #ef4444)',
  info: 'var(--test-info, #06b6d4)',

  // 中性色
  gray50: 'var(--test-gray-50, #f9fafb)',
  gray100: 'var(--test-gray-100, #f3f4f6)',
  gray200: 'var(--test-gray-200, #e5e7eb)',
  gray300: 'var(--test-gray-300, #d1d5db)',
  gray400: 'var(--test-gray-400, #9ca3af)',
  gray500: 'var(--test-gray-500, #6b7280)',
  gray600: 'var(--test-gray-600, #4b5563)',
  gray700: 'var(--test-gray-700, #374151)',
  gray800: 'var(--test-gray-800, #1f2937)',
  gray900: 'var(--test-gray-900, #111827)',

  // 背景色
  bgPage: 'var(--test-bg-page, #f5f5f7)',
  bgCard: 'var(--test-bg-card, #ffffff)',
  bgHover: 'var(--test-bg-hover, rgba(0, 0, 0, 0.04))',
  bgActive: 'var(--test-bg-active, rgba(0, 0, 0, 0.08))',

  // 文本颜色
  textPrimary: 'var(--test-text-primary, #1f2937)',
  textSecondary: 'var(--test-text-secondary, #6b7280)',
  textTertiary: 'var(--test-text-tertiary, #9ca3af)',
  textInverse: 'var(--test-text-inverse, #ffffff)',

  // 边框
  borderColor: 'var(--test-border-color, #e5e7eb)',
} as const;

export const TestPageStyles = {
  borderRadius: '12rpx',

  // 间距
  spacingXs: '8rpx',
  spacingSm: '16rpx',
  spacingMd: '24rpx',
  spacingLg: '32rpx',
  spacingXl: '48rpx',
} as const;

/**
 * 将颜色转换为 rgba 格式以支持透明度
 */
export function withOpacity(color: string, opacity: number): string {
  // 简单的 hex 转 rgba（仅支持 #rrggbb 格式）
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
