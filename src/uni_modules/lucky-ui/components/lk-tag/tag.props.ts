import type { ExtractPropTypes } from 'vue';
import { baseProps, LkProp } from '../common/props';

/**
 * Tag 类型
 */
export const TagType = {
  Solid: 'solid',
  Outline: 'outline',
  Light: 'light',
} as const;

/**
 * Tag 尺寸
 */
export const TagSize = {
  Sm: 'sm',
  Md: 'md',
  Lg: 'lg',
} as const;

export type TagType = (typeof TagType)[keyof typeof TagType];

export type TagSize = (typeof TagSize)[keyof typeof TagSize];

export const tagProps = {
  ...baseProps,

  /**
   * 标签类型
   * @value solid 实心标签
   * @value outline 描边标签
   * @value light 浅色标签
   */

  type: LkProp.enum(Object.values(TagType), TagType.Solid, 'Tag.type'),

  /**
   * 标签尺寸
   * @value sm 小号标签
   * @value md 中号标签
   * @value lg 大号标签
   */
  size: LkProp.enum(Object.values(TagSize), TagSize.Md, 'Tag.size'),

  /** 是否可关闭 */
  closable: LkProp.boolean(false),

  /** 是否禁用 */
  disabled: LkProp.boolean(false),

  /** 是否圆角 */
  round: LkProp.boolean(true),
} as const;

export type TagProps = ExtractPropTypes<typeof tagProps>;
