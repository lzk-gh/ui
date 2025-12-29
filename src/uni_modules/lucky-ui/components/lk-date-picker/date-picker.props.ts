import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';

/** 日期选择器类型 */
const DatePickerType = {
  Date: 'date',
  Range: 'range',
  YearMonth: 'year-month',
  Multiple: 'multiple',
  DateTime: 'date-time',
  RangeDateTime: 'range-date-time',
} as const;
export type DatePickerType = (typeof DatePickerType)[keyof typeof DatePickerType];

/** 时间精度 */
const TimePrecision = {
  Hour: 'hour',
  Minute: 'minute',
  Second: 'second',
} as const;
export type TimePrecision = (typeof TimePrecision)[keyof typeof TimePrecision];

export const datePickerProps = {
  ...baseProps,
  /** 是否显示 */
  modelValue: LkProp.boolean(false),
  /** 选中的值 */
  value: {
    type: [Date, Array] as PropType<Date | [Date, Date] | Date[] | null>,
    default: null,
  },
  /** 选择器类型 */
  type: LkProp.enum(Object.values(DatePickerType), DatePickerType.Date, 'DatePicker.type'),
  /** 标题 */
  title: LkProp.string('选择日期'),
  /** 主题颜色 */
  color: LkProp.string('primary'),
  /** 每周第一天 */
  firstDay: LkProp.number(1),
  /** 是否显示快捷方式 */
  showShortcuts: LkProp.boolean(false),
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
  /** 时间精度 */
  timePrecision: LkProp.enum(Object.values(TimePrecision), TimePrecision.Minute, 'DatePicker.timePrecision'),
} as const;

export type DatePickerProps = ExtractPropTypes<typeof datePickerProps>;

export const datePickerEmits = {
  'update:modelValue': (v: boolean) => true,
  confirm: (v: Date | [Date, Date] | Date[] | null) => true,
  cancel: () => true,
};
