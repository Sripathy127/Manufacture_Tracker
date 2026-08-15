import { format, parse, endOfMonth, subMonths, addMonths } from "date-fns";

/**
 * Get the start date for batch filtering: 1 day prior to the previous month
 * @returns formatted date string in YYYYMMDD format
 */
export function getBatchFilterStartDate(): string {
  const currentDate = new Date();
  const previousMonth = subMonths(currentDate, 1);

  return format(previousMonth, "yyyyMMdd");
}

/**
 * Get the end date for batch filtering: end of the 3rd month from current month
 * @returns formatted date string in YYYYMMDD format
 */
export function getBatchFilterEndDate(): string {
  const currentDate = new Date();
  const thirdMonthFromNow = addMonths(currentDate, 3);
  const endOfThirdMonth = endOfMonth(thirdMonthFromNow);

  return format(endOfThirdMonth, "yyyyMMdd");
}

/**
 * Get the default date range for batch filtering
 * @returns object with startDate and endDate in YYYYMMDD format
 */
export function getDefaultBatchDateRange() {
  return {
    startDate: getBatchFilterStartDate(),
    endDate: getBatchFilterEndDate(),
  };
}

/**
 * Parse a date string in YYYYMMDD format to a Date object
 * @param dateString - date string in YYYYMMDD format
 * @returns Date object
 */
export function parseFilterDate(dateString: string): Date {
  return parse(dateString, "yyyyMMdd", new Date());
}
