export const CalendarMode = {
  Single: 'single',
  Range: 'range',
  Multiple: 'multiple',
  Week: 'week',
  Month: 'month',
  Readonly: 'readonly',
} as const;
export type CalendarMode = (typeof CalendarMode)[keyof typeof CalendarMode];

export const CalendarView = {
  Month: 'month',
  Week: 'week',
  Scroll: 'scroll',
} as const;
export type CalendarView = (typeof CalendarView)[keyof typeof CalendarView];

export const CalendarValueType = {
  Date: 'date',
  String: 'string',
  Timestamp: 'timestamp',
} as const;
export type CalendarValueType = (typeof CalendarValueType)[keyof typeof CalendarValueType];

export type CalendarDateInput = Date | string | number;
export type CalendarModelValue =
  | CalendarDateInput
  | Array<CalendarDateInput | null>
  | [CalendarDateInput | null, CalendarDateInput | null]
  | null;

export interface CalendarHolidayItem {
  date: string;
  name: string;
  type: 'holiday' | 'workday' | 'festival' | 'solar-term';
}

export interface CalendarDayExtra {
  date: string;
  label?: string;
  subLabel?: string;
  badge?: string;
  dot?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface CalendarLunarInfo {
  text: string;
  festival: string;
  solarTerm: string;
  isLeapMonth: boolean;
}

export interface CalendarDay {
  date: Date;
  dateKey: string;
  day: number;
  monthOffset: -1 | 0 | 1;
  weekIndex: number;
  isToday: boolean;
  isWeekend: boolean;
  isDisabled: boolean;
  isSelected: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
  isHoliday: boolean;
  isWorkday: boolean;
  holidayName: string;
  lunar: CalendarLunarInfo;
  extra?: CalendarDayExtra;
}

export interface CalendarMonthChangePayload {
  year: number;
  month: number;
}

export interface CalendarSelectPayload {
  date: Date;
  dateKey: string;
  day: CalendarDay;
}

export type CalendarShortcutType =
  | 'today'
  | 'tomorrow'
  | 'yesterday'
  | 'thisWeek'
  | 'thisMonth'
  | 'last7'
  | 'last30'
  | 'clear';
