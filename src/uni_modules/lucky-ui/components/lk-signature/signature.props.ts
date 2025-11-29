import type { ExtractPropTypes } from 'vue';
import { baseProps, LkProp } from '../common/props';

export const signatureProps = {
  ...baseProps,
  /** 画布宽度 */
  width: LkProp.number(600),
  /** 画布高度 */
  height: LkProp.number(300),
  /** 线条宽度 */
  lineWidth: LkProp.number(3),
  /** 笔迹颜色 */
  color: LkProp.string('#111'),
  /** 背景色 */
  background: LkProp.string('#fff'),
  /** 是否支持撤销 */
  undo: LkProp.boolean(true),
} as const;

export type SignatureProps = ExtractPropTypes<typeof signatureProps>;
