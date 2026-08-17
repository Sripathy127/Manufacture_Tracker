import type { YearMonth } from "@/lib/calendar-timeline/date-utils";
import { cn } from "@/lib/utils";

type MonthColumn = {
  start: number;
  end: number;
  name: string;
  month: YearMonth;
};

type WeekColumn = {
  start: number;
  end: number;
  weekStartDay: number;
  month: YearMonth;
};

type DayColumn = {
  start: number;
  end: number;
  day: number;
  month: YearMonth;
};

function calculateTimelineColumns(months: YearMonth[]): {
  monthColumns: MonthColumn[];
  weekColumns: WeekColumn[];
  dayColumns: DayColumn[];
} {
  const monthColumns: MonthColumn[] = [];
  const weekColumns: WeekColumn[] = [];
  const dayColumns: DayColumn[] = [];

  let startCol = 2;

  for (let i = 0; i < months.length; i++) {
    const month = months[i];
    const monthStartCol = startCol;
    const monthEndCol = startCol + month.daysInMonth;

    // Build month column
    monthColumns.push({
      start: monthStartCol,
      end: monthEndCol,
      name: month.monthName.slice(0, 3),
      month,
    });

    // Build day columns for this month (2 days per column)
    for (let day = 1; day <= month.daysInMonth; day += 2) {
      const colStart = monthStartCol + day - 1;
      const colEnd = Math.min(colStart + 2, monthEndCol);

      dayColumns.push({
        start: colStart,
        end: colEnd,
        day,
        month,
      });
    }

    // Build week columns for this month
    if (month.weekStartDays.length > 0) {
      // First column: from month start to first Monday (if first Monday is not day 1)
      const firstMondayDay = month.weekStartDays[0];
      if (firstMondayDay > 1) {
        weekColumns.push({
          start: monthStartCol,
          end: monthStartCol + firstMondayDay - 1, // End before the first Monday
          weekStartDay: 0, // Empty content for partial first week
          month,
        });
      }

      // Full weeks starting from each Monday
      for (let j = 0; j < month.weekStartDays.length; j++) {
        const weekStartDay = month.weekStartDays[j];
        const weekStartColInMonth = monthStartCol + weekStartDay - 1;

        let weekEndCol: number;
        if (j < month.weekStartDays.length - 1) {
          // Not the last week - ends before the next Monday
          const nextMondayDay = month.weekStartDays[j + 1];
          weekEndCol = monthStartCol + nextMondayDay - 1;
        } else {
          // Last week - goes to end of month
          weekEndCol = monthEndCol;
        }

        weekColumns.push({
          start: weekStartColInMonth,
          end: weekEndCol,
          weekStartDay,
          month,
        });
      }
    } else {
      // If there are no weeks (no Mondays), create one column for the entire month
      weekColumns.push({
        start: monthStartCol,
        end: monthEndCol,
        weekStartDay: 1, // Show day 1 as placeholder
        month,
      });
    }

    startCol = startCol + month.daysInMonth;
  }

  return { monthColumns, weekColumns, dayColumns };
}

export function TimelineHeader({
  months,
  gridColumnWidth,
}: {
  months: YearMonth[];
  gridColumnWidth: number;
}) {
  const { monthColumns, dayColumns } = calculateTimelineColumns(months);

  return (
    <>
      {monthColumns.map((c) => (
        <div
          key={c.month.yearMonth}
          className="border-l pl-2 flex items-center text-sm"
          style={{ gridColumn: `${c.start} / ${c.end}` }}
          role="columnheader"
          aria-label={`${c.name} ${c.month.year}`}
        >
          {c.name}
        </div>
      ))}
      {/* {weekColumns.map((week) => (
        <div
          key={`${week.month.yearMonth}-week-${week.weekStartDay}`}
          className={cn(
            "border-b flex items-center text-xs",
            week.weekStartDay < 2 ? "border-l" : ""
          )}
          style={{ gridColumn: `${week.start} / ${week.end}` }}
          role="columnheader"
          aria-label={
            week.weekStartDay > 0
              ? `Week starting day ${week.weekStartDay}`
              : "Partial week"
          }
        >
          <span
            className="text-center"
            style={{ width: `${gridColumnWidth}px` }}
          >
            {week.weekStartDay > 0 ? week.weekStartDay : ""}
          </span>
        </div>
      ))} */}
      {dayColumns.map((col) => (
        <div
          key={`${col.month.yearMonth}-day-${col.day}`}
          className={cn(
            "border-b flex items-center text-xs",
            col.day === 1 ? "border-l" : ""
          )}
          style={{ gridColumn: `${col.start} / ${col.end}` }}
          role="columnheader"
          aria-label={`Day ${col.day}`}
        >
          <span
            className="text-center"
            style={{ width: `${gridColumnWidth}px` }}
          >
            {col.day}
          </span>
        </div>
      ))}
    </>
  );
}
