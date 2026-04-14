import type { ExtractPropTypes } from 'vue';
import { baseProps, LkProp } from '../common/props';

/**
 * 按钮变体
 */
export const ButtonVariant = {
  Solid: 'solid',
  Outline: 'outline',
  Text: 'text',
  Soft: 'soft',
} as const;

/**
 * 按钮尺寸
 */
export const ButtonSize = {
  Sm: 'sm',
  Md: 'md',
  Lg: 'lg',
} as const;

/**
 * 按钮形状
 */
export const ButtonShape = {
  Default: 'default',
  Square: 'square',
  Round: 'round',
  Circle: 'circle',
} as const;

/**
 * 原生按钮类型
 */
export const ButtonNativeType = {
  Button: 'button',
  Submit: 'submit',
  Reset: 'reset',
} as const;

export type ButtonVariant = (typeof ButtonVariant)[keyof typeof ButtonVariant];
export type ButtonSize = (typeof ButtonSize)[keyof typeof ButtonSize];
export type ButtonShape = (typeof ButtonShape)[keyof typeof ButtonShape];
export type ButtonNativeType = (typeof ButtonNativeType)[keyof typeof ButtonNativeType];

export const buttonProps = {
  ...baseProps,

  /**
   * 按钮变体
   * @value solid 实体按钮
   * @value outline 轮廓按钮
   * @value text 文字按钮
   * @value soft 柔和按钮
   */
  variant: LkProp.enum(Object.values(ButtonVariant), ButtonVariant.Solid, 'Button.variant'),

  /**
   * 按钮尺寸
   * @value sm 小尺寸
   * @value md 中等尺寸
   * @value lg 大尺寸
   */
  size: LkProp.enum(Object.values(ButtonSize), ButtonSize.Md, 'Button.size'),

  /**
   * 按钮形状
   * @value default 默认圆角
   * @value square 直角
   * @value round 胶囊形
   * @value circle 圆形
   */
  shape: LkProp.enum(Object.values(ButtonShape), ButtonShape.Default, 'Button.shape'),

  /** 是否为加载状态 */
  loading: LkProp.boolean(false),

  /** 是否为禁用状态 */
  disabled: LkProp.boolean(false),

  /** 是否为块级按钮 */
  block: LkProp.boolean(false),

  /** 图标类名 */
  icon: LkProp.string(''),

  /**
   * 原生按钮类型
   * @value button 普通按钮
   * @value submit 提交按钮
   * @value reset 重置按钮
   */
  nativeType: LkProp.enum(
    Object.values(ButtonNativeType),
    ButtonNativeType.Button,
    'Button.nativeType'
  ),

  /** 开放能力，具体请看 uniapp 文档 */
  openType: LkProp.string(''),
  /** 指定按下的样式类 */
  hoverClass: LkProp.string('button-hover'),
  /** 按住后多久出现点击态，单位毫秒 */
  hoverStartTime: LkProp.number(20),
  /** 手指松开后点击态保留时间，单位毫秒 */
  hoverStayTime: LkProp.number(70),
  /** 返回用户信息的接口 */
  getUserInfo: LkProp.string(''),
  /** 微信开放能力 getPhoneNumber 的回调 */
  getPhoneNumber: LkProp.string(''),
  /** 支付宝开放能力 getAuthorize 的回调 */
  getAuthorize: LkProp.string(''),
  /** 开发能力成功回调 */
  contact: LkProp.string(''),
  /** 客服消息失败回调 */
  error: LkProp.string(''),
  /** 打开 APP 成功回调 */
  launchApp: LkProp.string(''),
  /** 打开授权设置页成功回调 */
  openSetting: LkProp.string(''),
  /** 群 ID */
  groupId: LkProp.string(''),
  /** 会话来源 */
  sessionFrom: LkProp.string(''),
  /** 发送消息标题 */
  sendMessageTitle: LkProp.string(''),
  /** 发送消息路径 */
  sendMessagePath: LkProp.string(''),
  /** 发送消息图片 */
  sendMessageImg: LkProp.string(''),
  /** 展示分享卡片 */
  showMessageCard: LkProp.boolean(false),
  /** 隐私协议授权回调 */
  agreePrivacyAuthorization: LkProp.string(''),
} as const;

export const buttonEmits = {
  click: (event: unknown) => event !== undefined,
  getuserinfo: (event: any) => !!event,
  contact: (event: any) => !!event,
  getphonenumber: (event: any) => !!event,
  error: (event: any) => !!event,
  opensetting: (event: any) => !!event,
  launchapp: (event: any) => !!event,
  chooseavatar: (event: any) => !!event,
  agreeprivacyauthorization: (event: any) => !!event,
};

export type ButtonProps = ExtractPropTypes<typeof buttonProps>;
