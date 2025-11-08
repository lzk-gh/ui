import type { ExtractPropTypes } from 'vue';

/**
 * 按钮变体
 * - `solid`: 实体按钮 (默认)
 * - `outline`: 轮廓按钮
 * - `text`: 文字按钮
 * - `soft`: 柔和按钮
 * - `danger`: 危险按钮
 */
export type LkButtonVariant = 'solid' | 'outline' | 'text' | 'soft' | 'danger';

/**
 * 按钮尺寸
 * - `sm`: 小尺寸
 * - `md`: 中等尺寸 (默认)
 * - `lg`: 大尺寸
 */
export type LkButtonSize = 'sm' | 'md' | 'lg';

/**
 * 按钮形状
 * - `default`: 默认圆角
 * - `square`: 直角，无圆角
 * - `round`: 胶囊/药丸形状（超圆角）
 * - `circle`: 正圆形
 */
export type LkButtonShape = 'default' | 'square' | 'round' | 'circle';

// 原生按钮类型
export type NativeType = 'button' | 'submit' | 'reset';

export const lkButtonProps = {
  /**
   * 按钮变体
   */
  variant: {
    type: String as () => LkButtonVariant,
    default: 'solid',
  },
  /**
   * 按钮尺寸
   */
  size: {
    type: String as () => LkButtonSize,
    default: 'medium',
  },
  /**
   * 按钮形状
   */
  shape: {
    type: String as () => LkButtonShape,
    default: 'default',
  },
  /**
   * 是否为加载状态
   */
  loading: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否为禁用状态
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否为块级按钮
   */
  block: {
    type: Boolean,
    default: false,
  },
  /**
   * 图标类名
   */
  icon: {
    type: String,
    default: '',
  },
  /**
   * 原生按钮类型
   */
  nativeType: {
    type: String as () => NativeType,
    default: 'button',
  },
} as const;

export const lkButtonEmits = {
  click: (event: MouseEvent) => event instanceof MouseEvent,
};

export type LkButtonProps = ExtractPropTypes<typeof lkButtonProps>;
