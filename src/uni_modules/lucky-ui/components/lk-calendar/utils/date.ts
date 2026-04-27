import type { CalendarDateInput, CalendarValueType } from '../types';

const DAY_TIME = 24 * 60 * 60 * 1000;

export function pad2(value: number) {
  return value < 10 ? `0${value}` : `${value}`;
}

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function makeDate(year: number, month: number, day: number) {
  return new Date(year, month - 1, day);
}

export function addDays(date: Date, days: number) {
  const next = startOfDay(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function addMonths(date: Date, months: number) {
  const next = startOfDay(date);
  next.setDate(1);
  next.setMonth(next.getMonth() + months);
  return next;
}

export function getMonthLength(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

export function isSameDay(a: Date | null, b: Date | null) {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function isBeforeDay(a: Date, b: Date) {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}

export function isAfterDay(a: Date, b: Date) {
  return startOfDay(a).getTime() > startOfDay(b).getTime();
}

export function isBetweenDays(date: Date, start: Date | null, end: Date | null) {
  if (!start || !end) return false;
  const time = startOfDay(date).getTime();
  return time >= startOfDay(start).getTime() && time <= startOfDay(end).getTime();
}

export function diffDays(start: Date, end: Date) {
  return Math.round((startOfDay(end).getTime() - startOfDay(start).getTime()) / DAY_TIME);
}

export function formatDate(date: Date | null, format = 'YYYY-MM-DD') {
  if (!date) return '';
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return format
    .replace('YYYY', String(year))
    .replace('MM', pad2(month))
    .replace('DD', pad2(day));
}

export function parseDate(input: CalendarDateInput | null | undefined): Date | null {
  if (input === null || input === undefined || input === '') return null;
  if (input instanceof Date) {
    if (Number.isNaN(input.getTime())) return null;
    return startOfDay(input);
  }
  if (typeof input === 'number') {
    const date = new Date(input);
    return Number.isNaN(date.getTime()) ? null : startOfDay(date);
  }
  const matched = input.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (matched) {
    return makeDate(Number(matched[1]), Number(matched[2]), Number(matched[3]));
  }
  const date = new Date(input);
  return Number.isNaN(date.getTime()) ? null : startOfDay(date);
}

export function normalizeDateList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map(item => parseDate(item as CalendarDateInput)).filter((item): item is Date => item !== null);
}

export function outputDate(date: Date | null, valueType: CalendarValueType, valueFormat: string) {
  if (!date) return null;
  if (valueType === 'string') return formatDate(date, valueFormat);
  if (valueType === 'timestamp') return date.getTime();
  return date;
}

export function getWeekStart(date: Date, firstDay: number) {
  const current = startOfDay(date);
  const offset = (current.getDay() - firstDay + 7) % 7;
  return addDays(current, -offset);
}

export function getWeekDates(date: Date, firstDay: number) {
  const start = getWeekStart(date, firstDay);
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

export function getMonthGridDates(year: number, month: number, firstDay: number, fixedRows: boolean) {
  const first = makeDate(year, month, 1);
  const offset = (first.getDay() - firstDay + 7) % 7;
  const total = fixedRows ? 42 : Math.ceil((offset + getMonthLength(year, month)) / 7) * 7;
  const start = addDays(first, -offset);
  return Array.from({ length: total }, (_, index) => addDays(start, index));
}
