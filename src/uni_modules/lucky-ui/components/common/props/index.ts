import type { PropType, ExtractPropTypes } from 'vue';

export const baseProps = {
  /**
   * 组件唯一id (表单联动、动画锚点、测试定位..)
   */
  id: {
    type: String,
    default: '',
  },

  /**
   * 自定义类名
   */
  customClass: {
    type: [String, Object, Array] as PropType<string | object | Array<string | object>>,
    default: '',
  },

  /**
   * 自定义样式
   */
  customStyle: {
    type: [String, Object] as PropType<string | Record<string, any>>,
    default: '',
  },

  /**
   * 节流点击
   */
  throttle: {
    type: Number,
    default: 0,
  },

  /**
   * 防抖点击
   */
  debounce: {
    type: Number,
    default: 0,
  },

  /**
   * 动画类名
   */
  animation: {
    type: [String, Object] as PropType<string | Record<string, any>>,
    default: '',
  },

  /**
   * 是否使用 teleport (弹窗)
   */
  teleport: {
    type: [String, Object, Boolean] as PropType<string | HTMLElement | boolean>,
    default: 'body',
  },

  /**
   * 层级
   */
  zIndex: {
    type: Number,
    default: 99,
  },
} as const;

type LkPropHelper = {
  string: <T extends string = string>(def: T) => { type: PropType<T>; default: T };
  number: <T extends number = number>(def: T) => { type: PropType<T>; default: T };
  boolean: (def: boolean) => { type: PropType<boolean>; default: boolean };
  /**
   * 字符串或数字（常用于尺寸类 props）
   */
  stringNumber: (def: string | number) => { type: PropType<string | number>; default: string | number };
  enum: <T extends readonly string[], D extends T[number]>(
    values: T,
    def: D,
    name?: string
  ) => {
    type: PropType<T[number]>;
    default: D;
    validator: (v: any) => v is T[number];
  };
};

export const LkProp: LkPropHelper = {
  /**
   * 字符串类型
   * @param def 默认值
   * @returns
   */
  string: <T extends string = string>(def: T) => ({
    type: String as unknown as PropType<T>,
    default: def,
  }),

  /**
   * 数字类型
   * @param def 默认值
   * @returns
   */
  number: <T extends number = number>(def: T) => ({
    type: Number as unknown as PropType<T>,
    default: def,
  }),

  /**
   * 布尔类型
   * @param def 默认值
   * @returns
   */
  boolean: (def: boolean) => ({
    type: Boolean as unknown as PropType<boolean>,
    default: def ?? false,
  }),

  stringNumber: (def: string | number) => ({
    type: [String, Number] as unknown as PropType<string | number>,
    default: def,
  }),

  /**
   * 枚举类型 - 限定可选值
   * @param values 可选值
   * @param def 默认值
   * @param name 属性名
   * @returns
   */
  enum: <T extends readonly string[], D extends T[number]>(values: T, def: D, name = 'prop') => ({
    type: String as PropType<T[number]>,
    default: def,
    validator: (v: any): v is T[number] => {
      const ok = values.includes(v);
      if (!ok) console.warn(`[LkUi] ${name} 无效值: "${v}"，可选值：${values.join(' | ')}`);
      return ok;
    },
  }),
};

export type CommonProps = ExtractPropTypes<typeof baseProps>;
