import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';

export type AnyItem = Record<string, any> & { id?: string | number };

export const waterfallProps = {
  ...baseProps,

  /** 数据项列表 */
  items: {
    type: Array as PropType<AnyItem[]>,
    default: () => [],
  },

  /** 视口高度 */
  height: {
    type: [Number, String] as PropType<number | string>,
    default: 600,
  },

  /** 列数 */
  column: LkProp.number(2),

  /** 间距 */
  gap: {
    type: [Number, String] as PropType<number | string>,
    default: 8,
  },

  /** 左右内边距 */
  paddingX: {
    type: [Number, String] as PropType<number | string>,
    default: 0,
  },

  /** 行单元高度 */
  rowUnit: {
    type: [Number, String] as PropType<number | string>,
    default: 50,
  },

  /** 估算高度 */
  estimateHeight: LkProp.number(200),

  /** 高度字段名 */
  heightKey: LkProp.string('height'),

  /** 触底阈值 */
  lowerThreshold: {
    type: [Number, String] as PropType<number | string>,
    default: '80rpx',
  },

  /** 预取行数 */
  prefetchRows: LkProp.number(0),

  /** 是否动态 overscan */
  dynamicOverscan: LkProp.boolean(true),

  /** 最大 overscan 行数 */
  maxOverscanRows: LkProp.number(24),

  /** overscan 加速因子 */
  overscanBoostFactor: LkProp.number(0.6),

  /** 缓冲行数 */
  buffer: LkProp.number(6),

  /** 是否启用 passive */
  enablePassive: LkProp.boolean(true),

  /** 是否增强模式 */
  enhanced: LkProp.boolean(true),

  /** 是否开启回弹 */
  bounces: LkProp.boolean(false),

  /** 是否开启滚动锚定 */
  scrollAnchoring: LkProp.boolean(true),

  /** 是否开启滚动动画 */
  scrollWithAnimation: LkProp.boolean(false),
} as const;

export type WaterfallProps = ExtractPropTypes<typeof waterfallProps>;

export const waterfallEmits = {
  prefetch: () => true,
  'reach-bottom': () => true,
  scroll: (payload: { scrollTop: number; start: number; end: number }) => true,
};
