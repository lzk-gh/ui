/**
 * 农历工具类 (Lightweight Lunar Calendar Utility)
 * 包含：农历日期转换、节气、常用节日
 */

const LUNAR_INFO = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0xf263, 0xd950, 0x2357, 0x56a0,
  0x9ad0, 0x7552, 0x4ae0, 0xabb6, 0xa4d0, 0xd250, 0x17255, 0xb540, 0xd6a0, 0x1ad10,
  0x95b0, 0x14977, 0x4970, 0xa4b0, 0xb4b5, 0x6a50, 0x6d40, 0x1ab54, 0x2b60, 0x9570,
  0x52f2, 0x4970, 0x6566, 0xd4a0, 0xea50, 0x6e95, 0x5ad0, 0x2b60, 0x186e3, 0x92e0,
  0x1c8d7, 0xc950, 0xd4a0, 0x1d8a6, 0xb550, 0x56a0, 0x1a5b4, 0x25d0, 0x92d0, 0xd2b2,
  0xa950, 0xb557, 0x6ca0, 0xb550, 0x15355, 0x4da0, 0xa5b0, 0x14573, 0x52b0, 0xa9a8,
  0xe950, 0x6aa0, 0xaea6, 0xab50, 0x4b60, 0x0aae4, 0xa570, 0x5260, 0xf263, 0xd950,
  0x05b50, 0x056a0, 0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540,
  0x0b5a0, 0x195a6, 0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46,
  0x0ab60, 0x09570, 0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60,
  0x096d5, 0x092e0, 0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0,
  0x092d0, 0x0cab5, 0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176,
  0x052b0, 0x0a930, 0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260,
  0x0ea65, 0x0d530, 0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250,
  0x0d520, 0x0dd45, 0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255,
  0x06d20, 0x0ada0, 0x14b63,
];

const SOLAR_TERMS = [
  '小寒', '大寒', '立春', '雨水', '惊蛰', '春分',
  '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
  '小暑', '大暑', '立秋', '处暑', '白露', '秋分',
  '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'
];

const SOLAR_TERM_INFO = [
  0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693,
  263343, 285961, 308463, 330788, 352893, 374743, 396254, 417317, 437837, 457750, 477001, 495465
];

const LUNAR_MONTHS = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
const LUNAR_DAYS = ['初', '十', '廿', '卅', '初十'];
const LUNAR_DAY_NAMES = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
];

// 农历节日
const LUNAR_FESTIVALS: Record<string, string> = {
  '0101': '春节',
  '0115': '元宵节',
  '0505': '端午节',
  '0707': '七夕',
  '0815': '中秋节',
  '0909': '重阳节',
  '1208': '腊八',
  '1223': '小年',
  '1230': '除夕', // 需要逻辑判断是 29 还是 30
};

// 公历节日
const SOLAR_FESTIVALS: Record<string, string> = {
  '0101': '元旦',
  '0214': '情人节',
  '0308': '妇女节',
  '0312': '植树节',
  '0401': '愚人节',
  '0501': '劳动节',
  '0504': '青年节',
  '0601': '儿童节',
  '0801': '建军节',
  '0910': '教师节',
  '1001': '国庆节',
  '1224': '平安夜',
  '1225': '圣诞节',
};

export interface LunarInfo {
  lYear: number;
  lMonth: number;
  lDay: number;
  isLeap: boolean;
  lMonthName: string;
  lDayName: string;
  solarTerm: string | null;
  festival: string | null;
  lunarFestival: string | null;
  fullLunarName: string; // 默认显示的名称（优先显示节日/节气）
}

export function getLunar(date: Date): LunarInfo {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();

  // 计算农历日期
  let offset = (Date.UTC(y, m - 1, d) - Date.UTC(1900, 0, 31)) / 86400000;
  let leap = 0;
  let temp = 0;
  let i = 0;

  for (i = 1900; i < 2100 && offset > 0; i++) {
    temp = getYearDays(i);
    offset -= temp;
  }

  if (offset < 0) {
    offset += temp;
    i--;
  }

  const lYear = i;
  leap = getLeapMonth(i);
  let isLeap = false;

  for (i = 1; i < 13 && offset > 0; i++) {
    if (leap > 0 && i === leap + 1 && !isLeap) {
      --i;
      isLeap = true;
      temp = getLeapDays(lYear);
    } else {
      temp = getMonthDays(lYear, i);
    }

    if (isLeap && i === leap + 1) isLeap = false;
    offset -= temp;
  }

  if (offset < 0) {
    offset += temp;
    --i;
  }

  const lMonth = i;
  const lDay = offset + 1;

  // 节气
  const solarTerm = getSolarTerm(y, m, d);

  // 公历节日
  const solarFestival = SOLAR_FESTIVALS[`${pad(m)}${pad(d)}`];

  // 农历节日
  let lunarFestival = LUNAR_FESTIVALS[`${pad(lMonth)}${pad(lDay)}`];
  if (lMonth === 12 && lDay >= 29 && getMonthDays(lYear, 12) === lDay) {
    lunarFestival = '除夕';
  }

  const lMonthName = (isLeap ? '闰' : '') + LUNAR_MONTHS[lMonth - 1] + '月';
  const lDayName = LUNAR_DAY_NAMES[lDay - 1];

  let fullLunarName = solarFestival || lunarFestival || solarTerm || lDayName;
  if (lDay === 1 && !solarFestival && !lunarFestival && !solarTerm) {
    fullLunarName = lMonthName;
  }

  return {
    lYear,
    lMonth,
    lDay,
    isLeap,
    lMonthName,
    lDayName,
    solarTerm: solarTerm || null,
    festival: solarFestival || null,
    lunarFestival: lunarFestival || null,
    fullLunarName,
  };
}

function getYearDays(y: number): number {
  let i;
  let sum = 348;
  for (i = 0x8000; i > 0x8; i >>= 1) {
    sum += LUNAR_INFO[y - 1900] & i ? 1 : 0;
  }
  return sum + getLeapDays(y);
}

function getLeapMonth(y: number): number {
  return LUNAR_INFO[y - 1900] & 0xf;
}

function getLeapDays(y: number): number {
  if (getLeapMonth(y)) {
    return LUNAR_INFO[y - 1900] & 0x10000 ? 30 : 29;
  }
  return 0;
}

function getMonthDays(y: number, m: number): number {
  return LUNAR_INFO[y - 1900] & (0x10000 >> m) ? 30 : 29;
}

function getSolarTerm(y: number, m: number, d: number): string {
  const firstTermDate = new Date(
    (31556925974.7 * (y - 1900) + SOLAR_TERM_INFO[(m - 1) * 2] * 60000) + Date.UTC(1900, 0, 6, 2, 5)
  );
  const secondTermDate = new Date(
    (31556925974.7 * (y - 1900) + SOLAR_TERM_INFO[(m - 1) * 2 + 1] * 60000) + Date.UTC(1900, 0, 6, 2, 5)
  );

  if (firstTermDate.getUTCDate() === d) return SOLAR_TERMS[(m - 1) * 2];
  if (secondTermDate.getUTCDate() === d) return SOLAR_TERMS[(m - 1) * 2 + 1];
  return '';
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}
