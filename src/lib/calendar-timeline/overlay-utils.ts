import { differenceInCalendarDays, differenceInDays } from "date-fns";
import type { YearMonth, DayInfo } from "./date-utils";

export type MonthStartPosition = {
  leftPx: number;
  widthPx: number;
};

export type FutureOverlayPosition = {
  leftPx: number;
  widthPx: number;
} | null;

export function calculateMonthStartPositions(
  months: YearMonth[],
  startDate: Date,
  gridColumnWidth: number
): MonthStartPosition[] {
  return months.map((m) => {
    const monthFirstDate = new Date(m.year, m.month - 1, 1);
    const diffFromStart = differenceInCalendarDays(monthFirstDate, startDate);
    return {
      leftPx: diffFromStart * gridColumnWidth,
      widthPx: m.weekStartDays[0] * gridColumnWidth,
    };
  });
}

export function calculateFutureOverlayPosition(
  days: DayInfo[],
  gridColumnWidth: number
): FutureOverlayPosition {
  const gridWidth = days.length * gridColumnWidth;
  const currentDate = new Date();
  const timelineStart = days[0]?.date;
  const currentDatePosition = timelineStart
    ? differenceInDays(currentDate, timelineStart)
    : -1;
  const overlayStartPosition = Math.max(0, currentDatePosition);
  const overlayLeft = overlayStartPosition * gridColumnWidth;
  const overlayWidth = gridWidth - overlayLeft;

  // Only return position if current date is within timeline range and overlay has positive width
  if (currentDatePosition < 0 || overlayWidth <= 0) {
    return null;
  }

  return {
    leftPx: overlayLeft,
    widthPx: overlayWidth,
  };
}
