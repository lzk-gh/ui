import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';
import { TagSize, TagType } from './tag.props';

export const tagGroupProps = {
  ...baseProps,

  /** 绑定值 */
  modelValue: {
    type: [String, Number, Array] as PropType<string | number | any[]>,
    default: '',
  },

  /** 是否允许多选 */
  multiple: LkProp.boolean(false),

  /** 是否换行 */
  wrap: LkProp.boolean(true),

  /** 标签尺寸 */
  size: LkProp.enum(Object.values(TagSize), TagSize.Md, 'TagGroup.size'),

  /** 标签类型 */
  type: LkProp.enum(Object.values(TagType), TagType.Light, 'TagGroup.type'),

  /** 间距 */
  gap: LkProp.number(20),

  /** 是否圆角 */
  round: LkProp.boolean(true),

  /** 激活时的背景色 */
  activeBgColor: LkProp.string(''),

  /** 激活时的文字颜色 */
  activeTextColor: LkProp.string(''),
} as const;

export type TagGroupProps = ExtractPropTypes<typeof tagGroupProps>;

export const tagGroupEmits = ['update:modelValue', 'change'];
