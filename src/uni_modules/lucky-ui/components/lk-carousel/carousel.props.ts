import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';

/**
 * 轮播切换效果
 */
export const CarouselEffect = {
  Fade: 'fade',
  Slide: 'slide',
} as const;

/**
 * 指示器类型
 */
export const CarouselIndicatorType = {
  Dots: 'dots',
  Bars: 'bars',
  Number: 'number',
  None: 'none',
} as const;

/**
 * 指示器位置
 */
export const CarouselIndicatorPosition = {
  Top: 'top',
  Bottom: 'bottom',
  Left: 'left',
  Right: 'right',
  Auto: 'auto',
} as const;

/**
 * 指示器对齐
 */
export const CarouselIndicatorAlign = {
  Center: 'center',
  Start: 'start',
  End: 'end',
} as const;

export type CarouselEffect = (typeof CarouselEffect)[keyof typeof CarouselEffect];
export type CarouselIndicatorType = (typeof CarouselIndicatorType)[keyof typeof CarouselIndicatorType];
export type CarouselIndicatorPosition = (typeof CarouselIndicatorPosition)[keyof typeof CarouselIndicatorPosition];
export type CarouselIndicatorAlign = (typeof CarouselIndicatorAlign)[keyof typeof CarouselIndicatorAlign];

export const carouselProps = {
  ...baseProps,

  /** 轮播数据列表 */
  carouselList: {
    type: Array as PropType<any[]>,
    default: () => [],
  },

  /** 当前索引 */
  current: LkProp.number(0),

  /** 是否自动播放 */
  autoPlay: LkProp.boolean(true),

  /** 播放间隔（毫秒） */
  interval: LkProp.number(3000),

  /**
   * 切换效果
   * @value fade 淡入淡出
   * @value slide 滑动
   */
  effect: LkProp.enum(Object.values(CarouselEffect), CarouselEffect.Fade, 'Carousel.effect'),

  /** 是否垂直 */
  vertical: LkProp.boolean(false),

  /** 是否显示指示器 */
  showIndicators: LkProp.boolean(true),

  /**
   * 指示器类型
   * @value dots 圆点
   * @value bars 条形
   * @value number 数字
   * @value none 无
   */
  indicatorType: LkProp.enum(Object.values(CarouselIndicatorType), CarouselIndicatorType.Dots, 'Carousel.indicatorType'),

  /** 指示器位置 */
  indicatorPosition: LkProp.enum(Object.values(CarouselIndicatorPosition), CarouselIndicatorPosition.Auto, 'Carousel.indicatorPosition'),

  /** 指示器对齐 */
  indicatorAlign: LkProp.enum(Object.values(CarouselIndicatorAlign), CarouselIndicatorAlign.Center, 'Carousel.indicatorAlign'),

  /** 指示器是否可点击 */
  indicatorClickable: {
    type: Boolean,
    default: undefined,
  },

  /** 指示器颜色 */
  indicatorColor: LkProp.string(''),

  /** 指示器激活颜色 */
  indicatorActiveColor: LkProp.string(''),

  /** 是否卡片模式 */
  card: {
    type: Boolean,
    default: undefined,
  },

  /** 卡片模式前边距 */
  cardPrevMargin: LkProp.string(''),

  /** 卡片模式后边距 */
  cardNextMargin: LkProp.string(''),

  /** 卡片模式缩放比例 */
  cardScale: {
    type: Number,
    default: undefined,
  },

  /** 卡片模式圆角 */
  cardRadius: LkProp.string(''),

  /** 卡片模式阴影 */
  cardShadow: LkProp.string(''),

  /** 是否露出模式 */
  peek: {
    type: Boolean,
    default: undefined,
  },

  /** 露出模式前边距 */
  peekPrevMargin: LkProp.string(''),

  /** 露出模式后边距 */
  peekNextMargin: LkProp.string(''),

  /** 指示器是否动画 */
  indicatorAnimated: {
    type: Boolean,
    default: undefined,
  },

  /** 是否自动高度 */
  autoHeight: {
    type: Boolean,
    default: undefined,
  },

  /** 高度 */
  height: {
    type: [String, Number] as PropType<string | number>,
    default: undefined,
  },

  /** 指示器是否覆盖在轮播上 */
  indicatorOverlay: LkProp.boolean(true),

  /** 是否循环播放 */
  loop: LkProp.boolean(true),
} as const;

export type CarouselProps = ExtractPropTypes<typeof carouselProps>;
