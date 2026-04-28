import type { ExtractPropTypes, PropType } from 'vue';
import type { LiteChartPoint } from '../../core/src/chart';
import { baseProps, LkProp } from '../common/props';

export type SparklinePoint = LiteChartPoint;

export const chartSparklineProps = {
  ...baseProps,
  /** 趋势数据 */
  data: {
    type: Array as PropType<SparklinePoint[]>,
    default: () => [],
  },
  /** 容器高度 */
  height: LkProp.stringNumber(120),
  /** 内边距，单位 rpx */
  padding: LkProp.number(12),
  /** 线宽，单位 rpx */
  lineWidth: LkProp.number(5),
  /** 主题色，支持 primary 或直接传入 canvas 可识别颜色 */
  color: LkProp.string('primary'),
  /** 是否显示面积渐变 */
  area: LkProp.boolean(true),
  /** 是否显示末端高亮点 */
  showEndPoint: LkProp.boolean(true),
  /** 是否启用触摸高亮 */
  tooltip: LkProp.boolean(true),
  /** 动画时长 */
  animationDuration: LkProp.number(560),
} as const;

export type ChartSparklineProps = ExtractPropTypes<typeof chartSparklineProps>;

export const chartSparklineEmits = {
  hoverChange: (_index: number) => true,
};
