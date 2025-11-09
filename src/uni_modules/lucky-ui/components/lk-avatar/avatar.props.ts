import type { ExtractPropTypes } from 'vue';
import { baseProps, LkProp } from '../common/props';

/**
 * Avatar 形状
 * @value circle 圆形
 * @value square 方形
 * @value rounded 圆角方形
 */
export const AvatarShape = {
  Circle: 'circle',
  Square: 'square',
  Rounded: 'rounded',
} as const;

export type AvatarShape = (typeof AvatarShape)[keyof typeof AvatarShape];

export const avatarProps = {
  ...baseProps,

  /**
   * 头像形状
   * @value circle 圆形
   * @value square 方形
   * @value rounded 圆角方形
   */
  shape: LkProp.enum(Object.values(AvatarShape), AvatarShape.Circle, 'Avatar.shape'),

  /** 头像尺寸 - 单位 rpx */
  size: LkProp.string('48'),

  /** 头像图片地址 */
  src: LkProp.string(''),

  /** 图片加载失败时显示的替代文本 */
  alt: LkProp.string(''),

  /** 头像背景颜色 */
  bg: LkProp.string(''),

  /** 头像文字 */
  text: LkProp.string(''),

  /** 文字颜色 */
  color: LkProp.string(''),
} as const;

export type AvatarProps = ExtractPropTypes<typeof avatarProps>;
