import type { ExtractPropTypes } from 'vue';
import { baseProps, LkProp } from '../common/props';

export const cellProps = {
  ...baseProps,

  /** 标题 */
  title: LkProp.string(''),

  /** 描述信息 */
  label: LkProp.string(''),

  /** 右侧内容 */
  value: LkProp.string(''),

  /** 左侧图标 */
  icon: LkProp.string(''),

  /** 是否显示右侧箭头 */
  arrow: LkProp.boolean(false),

  /** 是否可点击 */
  clickable: LkProp.boolean(false),

  /** 是否禁用 */
  disabled: LkProp.boolean(false),

  /** 是否垂直居中 */
  center: LkProp.boolean(false),

  /** 是否启用波纹点击效果（默认开启，clickable 为 true 时生效） */
  ripple: LkProp.boolean(true),
} as const;

export type CellProps = ExtractPropTypes<typeof cellProps>;

export const cellEmits = ['click'];
