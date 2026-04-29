import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';
import {
  CalendarMode,
  CalendarValueType,
  CalendarView,
  type CalendarDateInput,
  type CalendarDay,
  type CalendarDayExtra,
  type CalendarHolidayItem,
  type CalendarModelValue,
  type CalendarMonthChangePayload,
  type CalendarSelectPayload,
  type CalendarShortcutType,
} from './types';

export { CalendarMode, CalendarValueType, CalendarView };
export type {
  CalendarDateInput,
  CalendarDay,
  CalendarDayExtra,
  CalendarHolidayItem,
  CalendarModelValue,
  CalendarMonthChangePayload,
  CalendarSelectPayload,
  CalendarShortcutType,
};

export const calendarProps = {
  ...baseProps,
  /** 绑定值 */
  modelValue: {
    type: [Date, Array, String, Number] as PropType<CalendarModelValue>,
    default: null,
  },
  /** 选择模式，新 API */
  mode: {
    type: String as PropType<CalendarMode | ''>,
    default: '',
  },
  /** 日历类型，兼容旧 API */
  type: LkProp.enum(Object.values(CalendarMode), CalendarMode.Single, 'Calendar.type'),
  /** 视图模式 */
  view: LkProp.enum(Object.values(CalendarView), CalendarView.Month, 'Calendar.view'),
  /** 主题颜色 */
  color: LkProp.string('primary'),
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
  /** 最小日期（字符串） */
  min: LkProp.string(''),
  /** 最大日期（字符串） */
  max: LkProp.string(''),
  /** 每周第一天 */
  firstDay: LkProp.number(1),
  /** 是否显示相邻月份日期 */
  showAdjacentDays: LkProp.boolean(true),
  /** 是否显示头部 */
  showHeader: LkProp.boolean(true),
  /** 是否显示月/周切换 */
  showViewToggle: LkProp.boolean(true),
  /** 连续滚动视图展示月份数 */
  visibleMonthCount: LkProp.number(6),
  /** 连续滚动视图高度 */
  scrollHeight: LkProp.stringNumber(720),
  /** 横滑切月距离阈值，0 表示使用平台默认值 */
  swipeThreshold: LkProp.number(0),
  /** 横滑切月横纵比阈值，0 表示使用平台默认值 */
  swipeAngleRatio: LkProp.number(0),
  /** 是否显示快捷方式 */
  showShortcuts: LkProp.boolean(false),
  /** 是否显示今天标识 */
  showToday: LkProp.boolean(true),
  /** 是否显示农历 */
  showLunar: LkProp.boolean(true),
  /** 是否显示节日 */
  showFestival: LkProp.boolean(true),
  /** 是否显示二十四节气 */
  showSolarTerm: LkProp.boolean(true),
  /** 是否显示休/班 */
  showHoliday: LkProp.boolean(true),
  /** 使用内置节假日数据 */
  useBuiltinHoliday: LkProp.boolean(true),
  /** 法定节假日/调休数据，业务可覆盖内置数据 */
  holidayData: LkProp.array<CalendarHolidayItem>(),
  /** 业务日期扩展数据 */
  extraData: LkProp.array<CalendarDayExtra>(),
  /** 最大选择数量 */
  maxCount: LkProp.number(0),
  /** 最小区间天数 */
  minRange: LkProp.number(0),
  /** 最大区间天数 */
  maxRange: LkProp.number(0),
  /** 是否只读 */
  readonly: LkProp.boolean(false),
  /** 选择后是否立即触发 confirm */
  confirmOnSelect: LkProp.boolean(false),
  /** 值类型 */
  valueType: LkProp.enum(
    Object.values(CalendarValueType),
    CalendarValueType.Date,
    'Calendar.valueType'
  ),
  /** 值格式化 */
  valueFormat: LkProp.string('YYYY-MM-DD'),
} as const;

export type CalendarProps = ExtractPropTypes<typeof calendarProps>;

export const calendarEmits = {
  'update:modelValue': (_: CalendarModelValue | null) => true,
  change: (_: CalendarModelValue | null) => true,
  select: (_: CalendarSelectPayload) => true,
  confirm: (_: CalendarModelValue | null) => true,
  clear: () => true,
  'month-change': (_: CalendarMonthChangePayload) => true,
  'view-change': (_: CalendarView) => true,
  'range-progress': (_: [CalendarDateInput | null, CalendarDateInput | null]) => true,
  'click-day': (_: CalendarSelectPayload) => true,
  'click-disabled': (_: CalendarSelectPayload) => true,
  shortcut: (_: { type: CalendarShortcutType; value: CalendarModelValue | null }) => true,
  swipe: (_: { direction: 'prev' | 'next'; year: number; month: number }) => true,
};
