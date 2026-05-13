import { formatDate } from './date';
import type { CalendarLunarInfo } from '../types';
import { Locale } from '../../../locale';

const LUNAR_INFO = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
  0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
  0x14b63,
] as const;

const SOLAR_TERM_INFO = [
  0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693,
  263343, 285989, 308563, 331033, 353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758,
];

function lunarYearDays(year: number) {
  let sum = 348;
  const info = LUNAR_INFO[year - 1900] ?? 0;
  for (let mask = 0x8000; mask > 0x8; mask >>= 1) {
    if (info & mask) sum += 1;
  }
  return sum + leapDays(year);
}

function leapMonth(year: number) {
  return (LUNAR_INFO[year - 1900] ?? 0) & 0xf;
}

function leapDays(year: number) {
  if (leapMonth(year)) {
    return (LUNAR_INFO[year - 1900] ?? 0) & 0x10000 ? 30 : 29;
  }
  return 0;
}

function monthDays(year: number, month: number) {
  return (LUNAR_INFO[year - 1900] ?? 0) & (0x10000 >> month) ? 30 : 29;
}

function lunarDayName(day: number) {
  if (day === 10) return Locale.t('lk.calendar.lunarDay10');
  if (day === 20) return Locale.t('lk.calendar.lunarDay20');
  if (day === 30) return Locale.t('lk.calendar.lunarDay30');
  const prefixes = Locale.t<string[]>('lk.calendar.lunarDayPrefixes');
  const digits = Locale.t<string[]>('lk.calendar.lunarDayDigits');
  return `${prefixes[Math.floor(day / 10)]}${digits[day % 10]}`;
}

function solarTermDate(year: number, index: number) {
  const base = Date.UTC(1900, 0, 6, 2, 5);
  const date = new Date(base + 31556925974.7 * (year - 1900) + SOLAR_TERM_INFO[index] * 60000);
  return date.getUTCDate();
}

function getSolarTerm(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const firstIndex = month * 2;
  const names = Locale.t<string[]>('lk.calendar.solarTerms');
  if (day === solarTermDate(year, firstIndex)) return names[firstIndex];
  if (day === solarTermDate(year, firstIndex + 1)) return names[firstIndex + 1];
  return '';
}

export function getLunarInfo(date: Date): CalendarLunarInfo {
  const year = date.getFullYear();
  if (year < 1900 || year > 2050) {
    const solarFestivals = Locale.t<Record<string, string>>('lk.calendar.solarFestivals');
    return { text: '', festival: solarFestivals[formatDate(date, 'MM-DD')] ?? '', solarTerm: '', isLeapMonth: false };
  }

  const baseDate = new Date(1900, 0, 31);
  let offset = Math.floor((date.getTime() - baseDate.getTime()) / 86400000);
  let lunarYear = 1900;
  let yearDays = 0;

  while (lunarYear < 2051 && offset > 0) {
    yearDays = lunarYearDays(lunarYear);
    offset -= yearDays;
    lunarYear += 1;
  }
  if (offset < 0) {
    offset += yearDays;
    lunarYear -= 1;
  }

  const leap = leapMonth(lunarYear);
  let isLeapMonth = false;
  let lunarMonth = 1;
  let monthDayCount = 0;

  while (lunarMonth < 13 && offset > 0) {
    if (leap > 0 && lunarMonth === leap + 1 && !isLeapMonth) {
      lunarMonth -= 1;
      isLeapMonth = true;
      monthDayCount = leapDays(lunarYear);
    } else {
      monthDayCount = monthDays(lunarYear, lunarMonth);
    }

    offset -= monthDayCount;
    if (isLeapMonth && lunarMonth === leap + 1) isLeapMonth = false;
    lunarMonth += 1;
  }

  if (offset === 0 && leap > 0 && lunarMonth === leap + 1) {
    if (isLeapMonth) {
      isLeapMonth = false;
    } else {
      isLeapMonth = true;
      lunarMonth -= 1;
    }
  }
  if (offset < 0) {
    offset += monthDayCount;
    lunarMonth -= 1;
  }

  const lunarDay = offset + 1;
  const lunarKey = `${lunarMonth < 10 ? `0${lunarMonth}` : lunarMonth}-${lunarDay < 10 ? `0${lunarDay}` : lunarDay}`;
  const solarKey = formatDate(date, 'MM-DD');
  const solarTerm = getSolarTerm(date);
  const lunarFestival = Locale.t<Record<string, string>>('lk.calendar.lunarFestivals')[lunarKey] ?? '';
  const solarFestival = Locale.t<Record<string, string>>('lk.calendar.solarFestivals')[solarKey] ?? '';
  const isLastDayOfYear = lunarMonth === 12 && lunarDay === monthDays(lunarYear, 12);
  const festival = isLastDayOfYear ? Locale.t('lk.calendar.lunarNewYearEve') : lunarFestival || solarFestival;
  const months = Locale.t<string[]>('lk.calendar.lunarMonths');
  const text = festival || solarTerm || (lunarDay === 1 ? `${isLeapMonth ? Locale.t('lk.calendar.leapMonthPrefix') : ''}${months[lunarMonth - 1]}${Locale.t('lk.calendar.lunarMonthSuffix')}` : lunarDayName(lunarDay));

  return {
    text,
    festival,
    solarTerm,
    isLeapMonth,
  };
}
