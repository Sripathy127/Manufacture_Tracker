import { CircleCheckIcon } from "lucide-react";
import { type DayInfo } from "@/lib/calendar-timeline/date-utils";
import { differenceInCalendarDays, isAfter, isBefore } from "date-fns";

const getDispositionPosition = (
  dispositionDate: Date,
  timelineDays: DayInfo[],
  gridColumnWidth: number
) => {
  if (isBefore(dispositionDate, timelineDays[0].date)) return null;
  if (isAfter(dispositionDate, timelineDays[timelineDays.length - 1].date))
    return null;

  const position = timelineDays
    ? differenceInCalendarDays(dispositionDate, timelineDays[0].date)
    : -1;

  if (position >= 0) return (position + 1) * gridColumnWidth;

  return null;
};

export function Disposition({
  dispositionDate,
  timelineDays,
  gridColumnWidth,
  gridrow,
}: {
  dispositionDate: Date | null;
  timelineDays: DayInfo[];
  gridColumnWidth: number;
  gridrow: number;
}) {
  if (!dispositionDate) return null;

  const left = getDispositionPosition(
    dispositionDate,
    timelineDays,
    gridColumnWidth
  );
  if (left === null) return null;

  const formattedDate = dispositionDate
    ? typeof dispositionDate === "string" &&
      /^\d{4}-\d{2}-\d{2}T/.test(dispositionDate)
      ? new Date(dispositionDate).toLocaleDateString()
      : dispositionDate instanceof Date
        ? dispositionDate.toLocaleDateString()
        : String(dispositionDate ?? "N/A")
    : "N/A";

  return (
    <>
      <span
        className=" -translate-x-1/2 text-xs whitespace-nowrap z-50 text-muted-foreground "
        style={{
          gridColumn: left / gridColumnWidth,
          gridRow: gridrow,
        }}
      >
        Disposition Date:{formattedDate}
      </span>
      <CircleCheckIcon
        className="absolute -translate-x-1/2 -translate-y-1/2 text-neutral-dark-gray h-4 w-4"
        style={{
          left: `${left}px`,
          gridRow: gridrow + 1,
        }}
        aria-hidden="true"
      />
    </>
  );
}
