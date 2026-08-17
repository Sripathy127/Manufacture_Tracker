import { type DayInfo } from "@/lib/calendar-timeline/date-utils";
import { differenceInCalendarDays, isAfter, isBefore } from "date-fns";

const getIEDPosition = (
  iedDate: Date,
  timelineDays: DayInfo[],
  gridColumnWidth: number
) => {
  if (isBefore(iedDate, timelineDays[0].date)) return null;
  if (isAfter(iedDate, timelineDays[timelineDays.length - 1].date)) return null;

  const position = timelineDays
    ? differenceInCalendarDays(iedDate, timelineDays[0].date)
    : -1;

  if (position >= 0) return (position + 1) * gridColumnWidth;

  return null;
};

export function IEDDate({
  iedDate,
  timelineDays,
  gridColumnWidth,
  iedName,
  gridrow,
}: {
  iedDate: Date | null;
  timelineDays: DayInfo[];
  gridColumnWidth: number;
  iedName: string;
  gridrow: number;
}) {
  if (!iedDate) return null;

  const left = getIEDPosition(iedDate, timelineDays, gridColumnWidth);
  if (left === null) return null;

  return (
    <>
      <div
        className="pointer-events-none absolute  bottom-0 border-l-2 z-50 border-dashed border-l-neutral-blue"
        style={{
          left: `${left}px`,
          top: gridrow === 1 ? "30px" : "50px",
        }}
        aria-hidden="true"
      ></div>
      <span
        className=" -translate-x-1/2 text-xs whitespace-nowrap z-50 text-muted-foreground "
        style={{
          gridColumn: left / gridColumnWidth,
          gridRow: gridrow,
        }}
      >
        {iedName}
      </span>
    </>
  );
}
