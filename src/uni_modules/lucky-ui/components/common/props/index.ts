import { throttle } from '@/uni_modules/lucky-ui/core/src/utils/throttle';
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

export const LkProp = {
  /**
   * 字符串类型
   * @param def 默认值
   * @returns
   */
  string: <D extends string>(def: D) => ({
    type: String as unknown as PropType<string>,
    default: def,
  }),

  /**
   * 布尔类型
   * @param def 默认值
   * @returns
   */
  boolean: <D extends boolean>(def: D) => ({
    type: Boolean as unknown as PropType<boolean>,
    default: def ?? false,
  }),

  /**
   * 枚举类型 - 限定可选值
   * @param values 可选值
   * @param def 默认值
   * @param name 属性名
   * @returns
   */
  enum: <T extends readonly string[], D extends T[number]>(
    values: T,
    def: D,
    name = 'prop'
  ) => ({
    type: String as PropType<T[number]>,
    default: def,
    validator: (v: any): v is T[number] => {
      const ok = values.includes(v);
      if (!ok)
        console.warn(`[LkUi] ${name} 无效值: "${v}"，可选值：${values.join(' | ')}`);
      return ok;
    },
  }),
} as const;

export type CommonProps = ExtractPropTypes<typeof baseProps>;
