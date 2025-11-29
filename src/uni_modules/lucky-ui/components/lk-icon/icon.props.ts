import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';

export const iconProps = {
  ...baseProps,

  /** 图标名称 */
  name: {
    type: String,
    required: true as const,
    default: '',
  },

  /** 图标颜色 */
  color: LkProp.string(''),

  /** 图标大小 */
  size: {
    type: [String, Number] as PropType<string | number>,
    default: '',
  },
} as const;

export const iconEmits = {
  click: (event: Event) => !!event,
};

export type IconProps = ExtractPropTypes<typeof iconProps>;
