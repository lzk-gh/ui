import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';

/** 日历类型 */
const CalendarType = {
  Single: 'single',
  Range: 'range',
  Multiple: 'multiple',
} as const;
export type CalendarType = (typeof CalendarType)[keyof typeof CalendarType];

/** 值类型 */
const CalendarValueType = {
  Date: 'date',
  String: 'string',
} as const;
export type CalendarValueType = (typeof CalendarValueType)[keyof typeof CalendarValueType];

export const calendarProps = {
  ...baseProps,
  /** 绑定值 */
  modelValue: {
    type: [Date, Array, String] as PropType<Date | string | [Date | string, Date | string] | Array<Date | string> | null>,
    default: null,
  },
  /** 日历类型 */
  type: LkProp.enum<CalendarType>(CalendarType.Single),
  /** 主题颜色 */
  color: LkProp.string('primary'),
  /** 禁用日期函数 */
  disabledDate: {
    type: Function as PropType<(d: Date) => boolean>,
    default: undefined,
  },
  /** 最小日期 */
  minDate: {
    type: [Date, String] as PropType<Date | string | null>,
    default: null,
  },
  /** 最大日期 */
  maxDate: {
    type: [Date, String] as PropType<Date | string | null>,
    default: null,
  },
  /** 最小日期（字符串） */
  min: LkProp.string(''),
  /** 最大日期（字符串） */
  max: LkProp.string(''),
  /** 每周第一天 */
  firstDay: LkProp.number(1),
  /** 是否显示头部 */
  showHeader: LkProp.boolean(true),
  /** 是否显示快捷方式 */
  showShortcuts: LkProp.boolean(false),
  /** 最大选择数量 */
  maxCount: LkProp.number(0),
  /** 值类型 */
  valueType: LkProp.enum<CalendarValueType>(CalendarValueType.Date),
  /** 值格式化 */
  valueFormat: LkProp.string('YYYY-MM-DD'),
} as const;

export type CalendarProps = ExtractPropTypes<typeof calendarProps>;

export const calendarEmits = ['update:modelValue', 'change', 'month-change', 'confirm', 'clear'];
