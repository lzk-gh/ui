import type { CalendarHolidayItem } from '../types';
import { Locale } from '../../../locale';

const BUILTIN_HOLIDAYS: CalendarHolidayItem[] = [
  { date: '2024-01-01', name: 'newYear', type: 'holiday' },
  { date: '2024-02-10', name: 'springFestival', type: 'holiday' },
  { date: '2024-02-11', name: 'springFestival', type: 'holiday' },
  { date: '2024-02-12', name: 'springFestival', type: 'holiday' },
  { date: '2024-02-13', name: 'springFestival', type: 'holiday' },
  { date: '2024-02-14', name: 'springFestival', type: 'holiday' },
  { date: '2024-02-15', name: 'springFestival', type: 'holiday' },
  { date: '2024-02-16', name: 'springFestival', type: 'holiday' },
  { date: '2024-02-17', name: 'springFestival', type: 'holiday' },
  { date: '2024-02-04', name: 'makeUpWorkday', type: 'workday' },
  { date: '2024-02-18', name: 'makeUpWorkday', type: 'workday' },
  { date: '2024-04-04', name: 'qingming', type: 'holiday' },
  { date: '2024-04-05', name: 'qingming', type: 'holiday' },
  { date: '2024-04-06', name: 'qingming', type: 'holiday' },
  { date: '2024-04-07', name: 'makeUpWorkday', type: 'workday' },
  { date: '2024-05-01', name: 'laborDay', type: 'holiday' },
  { date: '2024-05-02', name: 'laborDay', type: 'holiday' },
  { date: '2024-05-03', name: 'laborDay', type: 'holiday' },
  { date: '2024-05-04', name: 'laborDay', type: 'holiday' },
  { date: '2024-05-05', name: 'laborDay', type: 'holiday' },
  { date: '2024-04-28', name: 'makeUpWorkday', type: 'workday' },
  { date: '2024-05-11', name: 'makeUpWorkday', type: 'workday' },
  { date: '2024-06-10', name: 'dragonBoat', type: 'holiday' },
  { date: '2024-09-15', name: 'midAutumn', type: 'holiday' },
  { date: '2024-09-16', name: 'midAutumn', type: 'holiday' },
  { date: '2024-09-17', name: 'midAutumn', type: 'holiday' },
  { date: '2024-09-14', name: 'makeUpWorkday', type: 'workday' },
  { date: '2024-10-01', name: 'nationalDay', type: 'holiday' },
  { date: '2024-10-02', name: 'nationalDay', type: 'holiday' },
  { date: '2024-10-03', name: 'nationalDay', type: 'holiday' },
  { date: '2024-10-04', name: 'nationalDay', type: 'holiday' },
  { date: '2024-10-05', name: 'nationalDay', type: 'holiday' },
  { date: '2024-10-06', name: 'nationalDay', type: 'holiday' },
  { date: '2024-10-07', name: 'nationalDay', type: 'holiday' },
  { date: '2024-09-29', name: 'makeUpWorkday', type: 'workday' },
  { date: '2024-10-12', name: 'makeUpWorkday', type: 'workday' },
  { date: '2025-01-01', name: 'newYear', type: 'holiday' },
  { date: '2025-01-28', name: 'springFestival', type: 'holiday' },
  { date: '2025-01-29', name: 'springFestival', type: 'holiday' },
  { date: '2025-01-30', name: 'springFestival', type: 'holiday' },
  { date: '2025-01-31', name: 'springFestival', type: 'holiday' },
  { date: '2025-02-01', name: 'springFestival', type: 'holiday' },
  { date: '2025-02-02', name: 'springFestival', type: 'holiday' },
  { date: '2025-02-03', name: 'springFestival', type: 'holiday' },
  { date: '2025-02-04', name: 'springFestival', type: 'holiday' },
  { date: '2025-01-26', name: 'makeUpWorkday', type: 'workday' },
  { date: '2025-02-08', name: 'makeUpWorkday', type: 'workday' },
  { date: '2025-04-04', name: 'qingming', type: 'holiday' },
  { date: '2025-04-05', name: 'qingming', type: 'holiday' },
  { date: '2025-04-06', name: 'qingming', type: 'holiday' },
  { date: '2025-05-01', name: 'laborDay', type: 'holiday' },
  { date: '2025-05-02', name: 'laborDay', type: 'holiday' },
  { date: '2025-05-03', name: 'laborDay', type: 'holiday' },
  { date: '2025-05-04', name: 'laborDay', type: 'holiday' },
  { date: '2025-05-05', name: 'laborDay', type: 'holiday' },
  { date: '2025-04-27', name: 'makeUpWorkday', type: 'workday' },
  { date: '2025-05-31', name: 'dragonBoat', type: 'holiday' },
  { date: '2025-06-01', name: 'dragonBoat', type: 'holiday' },
  { date: '2025-06-02', name: 'dragonBoat', type: 'holiday' },
  { date: '2025-10-01', name: 'nationalDay', type: 'holiday' },
  { date: '2025-10-02', name: 'nationalDay', type: 'holiday' },
  { date: '2025-10-03', name: 'nationalDay', type: 'holiday' },
  { date: '2025-10-04', name: 'nationalDay', type: 'holiday' },
  { date: '2025-10-05', name: 'nationalDay', type: 'holiday' },
  { date: '2025-10-06', name: 'midAutumn', type: 'holiday' },
  { date: '2025-10-07', name: 'nationalDay', type: 'holiday' },
  { date: '2025-10-08', name: 'nationalDay', type: 'holiday' },
  { date: '2025-09-28', name: 'makeUpWorkday', type: 'workday' },
  { date: '2025-10-11', name: 'makeUpWorkday', type: 'workday' },
];

export function createHolidayMap(custom: CalendarHolidayItem[], useBuiltin: boolean) {
  const map = new Map<string, CalendarHolidayItem>();
  if (useBuiltin) {
    const holidayNames = Locale.t<Record<string, string>>('lk.calendar.holidays');
    BUILTIN_HOLIDAYS.forEach(item => {
      map.set(item.date, {
        ...item,
        name: holidayNames[item.name] || item.name,
      });
    });
  }
  custom.forEach(item => map.set(item.date, item));
  return map;
}
