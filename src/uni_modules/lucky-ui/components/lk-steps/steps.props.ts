import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';

/**
 * 步骤条样式类型
 * @value story  Instagram Story 式顶部分段进度条 + 卡片内容区
 * @value stack  层叠卡片模式，完成后向右上弹走
 */
export const StepsType = {
  Story: 'story',
  Stack: 'stack',
} as const;

export type StepsType = (typeof StepsType)[keyof typeof StepsType];

/** 卡片步骤数据项 */
export interface StepCardItem {
  /** 步骤标题 */
  title: string;
  /** 步骤副标题 */
  subtitle?: string;
  /** 步骤详细描述 */
  description?: string;
  /** 图标名（lk-icon） */
  icon?: string;
  /** 背景渐变色（story 模式用，如 ['#6965db', '#a78bfa']） */
  gradient?: [string, string];
  /** 背景大图（story 模式用） */
  bgImage?: string;
  /** 徽标标签（story 模式用） */
  tag?: string;
}

export const stepsProps = {
  ...baseProps,

  /** 当前步骤索引（支持 v-model:current） */
  current: LkProp.number(0),

  /**
   * 展示类型
   * @value story  Instagram Story 式分段进度条
   * @value stack  层叠卡片模式
   */
  type: LkProp.enum(Object.values(StepsType), StepsType.Story, 'Steps.type'),

  /** 卡片数据列表 */
  items: {
    type: Array as PropType<StepCardItem[]>,
    default: () => [],
  },

  /**
   * 卡片高度（rpx，story/stack 模式）
   * 传 0 时自适应高度
   */
  cardHeight: LkProp.number(0),

  /**
   * story 模式：每步自动播放毫秒数，0 = 不自动播放
   */
  autoplay: LkProp.number(0),

  /**
   * story 模式：顶部分段进度条填充动画时长（ms），默认跟随 autoplay
   * autoplay 为 0 时此项无效
   */
  segmentDuration: LkProp.number(0),
} as const;

export type StepsProps = ExtractPropTypes<typeof stepsProps>;

export const stepsEmits = {
  'update:current': (_val: number) => true,
  change: (_val: number) => true,
};
