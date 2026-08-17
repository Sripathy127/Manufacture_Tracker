import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  getDate,
  getDay,
  getMonth,
  getYear,
  getDaysInMonth,
  startOfWeek,
} from "date-fns";

export interface YearMonth {
  year: number;
  month: number;
  yearMonth: string;
  monthName: string;
  daysInMonth: number;
  weekStartDays: number[];
}

export type YearMonthMap = Record<string, YearMonth>;

export interface MonthWeek {
  year: number;
  month: number;
  week: number;
  monthWeek: string;
  daysInWeek: number;
}

export type MonthWeekMap = Record<string, MonthWeek>;

export interface DayInfo {
  date: Date;
  dayOfWeek: number;
  dayOfMonth: number;
  weekOfMonth: number;
  yearMonth: string;
}

export function generateDaysBetweenMonths(startDate: Date, endDate: Date) {
  // Get the first day of the start date's month
  const firstDay = startOfMonth(startDate);

  // Get the last day of the end date's month
  const lastDay = endOfMonth(endDate);

  // If end date is before start date, return empty array
  if (lastDay < firstDay) {
    return { days: [], monthsMap: {}, monthWeeksMap: {} };
  }

  // Generate all days in the interval
  const daysBetween = eachDayOfInterval({ start: firstDay, end: lastDay });
  const monthsMap: Record<string, YearMonth> = {};
  const monthWeeksMap: Record<string, MonthWeek> = {};
  const days: DayInfo[] = [];

  // Map each day to DayInfo structure
  for (const date of daysBetween) {
    const month = getMonth(date) + 1;
    const year = getYear(date);
    const dow = getDay(date);
    const dom = getDate(date);
    const paddedMonth = String(month).padStart(2, "0");
    const yearMonthKey = `${year}${paddedMonth}`;

    // Calculate week of month (1-based)
    const firstDayOfMonth = startOfMonth(date);
    const firstWeekStart = startOfWeek(firstDayOfMonth);
    const currentWeekStart = startOfWeek(date);
    const weekOfMonth =
      Math.floor(
        (currentWeekStart.getTime() - firstWeekStart.getTime()) /
          (7 * 24 * 60 * 60 * 1000)
      ) + 1;

    const monthWeekKey = `${yearMonthKey}${weekOfMonth}`;

    // Build months map
    if (!monthsMap[yearMonthKey]) {
      monthsMap[yearMonthKey] = {
        month,
        year,
        yearMonth: yearMonthKey,
        monthName: format(date, "MMMM"),
        daysInMonth: getDaysInMonth(date),
        weekStartDays: [],
      };
    }

    // Build month weeks map
    if (!monthWeeksMap[monthWeekKey]) {
      monthWeeksMap[monthWeekKey] = {
        year,
        month,
        week: weekOfMonth,
        monthWeek: monthWeekKey,
        daysInWeek: 0,
      };
    }

    if (dow === 1) monthsMap[yearMonthKey].weekStartDays.push(dom);

    monthWeeksMap[monthWeekKey].daysInWeek++;

    days.push({
      date,
      dayOfWeek: dow,
      dayOfMonth: dom,
      weekOfMonth,
      yearMonth: yearMonthKey,
    });
  }

  return { days, monthsMap, monthWeeksMap };
}
