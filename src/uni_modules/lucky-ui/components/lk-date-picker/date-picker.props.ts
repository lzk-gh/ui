import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';
import {
  CalendarValueType,
  CalendarView,
  type CalendarDayExtra,
  type CalendarHolidayItem,
} from '../lk-calendar/calendar.props';

/** 日期选择器类型 */
export const DatePickerType = {
  Date: 'date',
  Range: 'range',
  YearMonth: 'year-month',
  Multiple: 'multiple',
  Time: 'time',
  DateTime: 'date-time',
  RangeDateTime: 'range-date-time',
} as const;
export type DatePickerType = (typeof DatePickerType)[keyof typeof DatePickerType];

/** 日期选择展示模式 */
export const DatePickerDisplayMode = {
  Auto: 'auto',
  Calendar: 'calendar',
  Wheel: 'wheel',
} as const;
export type DatePickerDisplayMode =
  (typeof DatePickerDisplayMode)[keyof typeof DatePickerDisplayMode];

/** 时间精度 */
export const TimePrecision = {
  Hour: 'hour',
  Minute: 'minute',
  Second: 'second',
} as const;
export type TimePrecision = (typeof TimePrecision)[keyof typeof TimePrecision];

export type DatePickerDateInput = Date | string | number;
export type DatePickerValue =
  | DatePickerDateInput
  | Array<DatePickerDateInput | null>
  | [DatePickerDateInput | null, DatePickerDateInput | null]
  | null;

export const datePickerProps = {
  ...baseProps,
  /** 是否显示，兼容旧 v-model 用法 */
  modelValue: LkProp.boolean(false),
  /** 是否显示，支持 v-model:show */
  show: {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined,
  },
  /** 选中的值 */
  value: {
    type: [Date, String, Number, Array] as PropType<DatePickerValue>,
    default: null,
  },
  /** 选择器类型 */
  type: LkProp.enum(Object.values(DatePickerType), DatePickerType.Date, 'DatePicker.type'),
  /** 展示模式：auto 自动、calendar 日历、wheel 滚轮 */
  pickerMode: LkProp.enum(
    Object.values(DatePickerDisplayMode),
    DatePickerDisplayMode.Auto,
    'DatePicker.pickerMode'
  ),
  /** 标题 */
  title: LkProp.string('选择日期'),
  /** 主题颜色 */
  color: LkProp.string('primary'),
  /** 值类型 */
  valueType: LkProp.enum(
    Object.values(CalendarValueType),
    CalendarValueType.Date,
    'DatePicker.valueType'
  ),
  /** 字符串值格式 */
  valueFormat: LkProp.string('YYYY-MM-DD'),
  /** 每周第一天 */
  firstDay: LkProp.number(1),
  /** 日历视图 */
  view: LkProp.enum(Object.values(CalendarView), CalendarView.Month, 'DatePicker.view'),
  /** 是否显示月/周/滚动切换 */
  showViewToggle: LkProp.boolean(false),
  /** 是否显示快捷方式 */
  showShortcuts: LkProp.boolean(false),
  /** 是否显示农历 */
  showLunar: LkProp.boolean(true),
  /** 是否显示节日 */
  showFestival: LkProp.boolean(true),
  /** 是否显示二十四节气 */
  showSolarTerm: LkProp.boolean(true),
  /** 是否显示休/班 */
  showHoliday: LkProp.boolean(true),
  /** 使用内置节假日 */
  useBuiltinHoliday: LkProp.boolean(true),
  /** 节假日数据 */
  holidayData: LkProp.array<CalendarHolidayItem>(),
  /** 业务日期扩展数据 */
  extraData: LkProp.array<CalendarDayExtra>(),
  /** 禁用日期函数 */
  disabledDate: {
    type: Function as PropType<(d: Date) => boolean>,
    default: undefined,
  },
  /** 禁用星期，0 表示周日 */
  disabledWeekDays: LkProp.array<number>(),
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
  /** 最大多选数量 */
  maxCount: LkProp.number(0),
  /** 最小区间天数 */
  minRange: LkProp.number(0),
  /** 最大区间天数 */
  maxRange: LkProp.number(0),
  /** 连续滚动视图展示月份数 */
  visibleMonthCount: LkProp.number(6),
  /** 连续滚动视图高度 */
  scrollHeight: LkProp.stringNumber(720),
  /** 选择后是否立即确认 */
  confirmOnSelect: LkProp.boolean(false),
  /** 时间精度 */
  timePrecision: LkProp.enum(
    Object.values(TimePrecision),
    TimePrecision.Minute,
    'DatePicker.timePrecision'
  ),
  /** 小时步长 */
  stepHour: LkProp.number(1),
  /** 分钟步长 */
  stepMinute: LkProp.number(1),
  /** 秒步长 */
  stepSecond: LkProp.number(1),
} as const;

export type DatePickerProps = ExtractPropTypes<typeof datePickerProps>;

export const datePickerEmits = {
  'update:modelValue': (_v: boolean) => true,
  'update:show': (_v: boolean) => true,
  'update:value': (_v: DatePickerValue) => true,
  change: (_v: DatePickerValue) => true,
  select: (_v: DatePickerValue) => true,
  confirm: (_v: DatePickerValue) => true,
  cancel: (_v: DatePickerValue) => true,
  open: () => true,
  close: () => true,
};
