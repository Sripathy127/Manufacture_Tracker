import { differenceInCalendarDays, format, isAfter, isBefore } from "date-fns";
import type { BatchMilestone } from "@/entities";
import { Item, ItemContent } from "@/components//ui/item";
import { cn } from "@/lib/utils";
import { TypographyCaption1, TypographyH4 } from "@/components/ui/typography";
import { MilestoneStatusBadge } from "./milestone-status-badge";
import { milestoneColorMap, milestoneNameMap } from "./colors-mapping";

export function MilestoneSpan({
  milestone,
  timelineStartDate,
  timelineEndDate,
  columnCount,
  rowIndex,
  gridColumnWidth,
}: {
  milestone: BatchMilestone;
  timelineStartDate: Date;
  columnCount: number;
  timelineEndDate: Date;
  rowIndex: number;
  gridColumnWidth: number;
}) {
  const milestoneName =
    milestoneNameMap[milestone.milestoneType] ?? milestone.milestoneType;

  if (
    isAfter(milestone.leftbound, timelineEndDate) ||
    isBefore(milestone.rightbound, timelineStartDate) ||
    !milestone.leftbound ||
    !milestone.rightbound
  ) {
    return null;
  }
  const startCol =
    differenceInCalendarDays(milestone.leftbound, timelineStartDate) + 1;

  const span =
    differenceInCalendarDays(milestone.rightbound, milestone.leftbound) + 1;

  const endCol = startCol + span;

  const isOverflow = endCol > columnCount;
  const isStartOverflow = startCol < 0;

  const background = calculateOverlayBackground(
    milestone,
    timelineStartDate,
    gridColumnWidth,
    isStartOverflow
  );

  const statusBorderColor = milestoneColorMap[milestone.status]?.[2] ?? "";
  return (
    <Item
      className={cn(
        "@container/step py-0   text-sm flex items-center pl-0 pr-2 relative h-8 rounded-none",

        isOverflow ? "rounded-r-none " : "rounded-r-md",
        isStartOverflow
          ? "rounded-l-none"
          : `rounded-l-md border-l-4 ${statusBorderColor}`
      )}
      style={{
        gridColumn: `${startCol > 0 ? startCol : 1} / ${endCol}`,
        gridRow: rowIndex,
        background,
      }}
    >
      <ItemContent>
        <div className="flex items-center w-full gap-2">
          <TypographyH4 className={cn("shrink-0 ml-2")}>
            {milestoneName}
          </TypographyH4>

          <div className="shrink-0 ml-auto">
            <TypographyCaption1 className="text-neutral-dark-gray text-nowrap">
              {format(milestone.leftbound, "MMM d")} -{" "}
              {format(milestone.rightbound, "MMM d")}
            </TypographyCaption1>
          </div>
          <div className="ml-2">
            <MilestoneStatusBadge status={milestone.status} />
          </div>
        </div>
      </ItemContent>
    </Item>
  );
}

function calculateOverlayBackground(
  milestone: BatchMilestone,
  timelineStartDate: Date,
  gridColumnWidth: number,
  isStartOverflow: boolean
): string {
  const hasOverdue =
    differenceInCalendarDays(milestone.actual_end, milestone.planned_end) > 0 &&
    milestone.actual_end != null;

  if (!hasOverdue) return "white";

  const visibleStartDate = isStartOverflow
    ? timelineStartDate
    : milestone.leftbound;
  const daysUntilPlannedEnd =
    differenceInCalendarDays(milestone.planned_end, visibleStartDate) + 1;
  const leftBorderWidth = isStartOverflow ? 0 : 4;
  const overdueStart = daysUntilPlannedEnd * gridColumnWidth - leftBorderWidth;

  return `linear-gradient(to right, white ${overdueStart}px, var(--color-neutral-lighter-gray) ${overdueStart}px)`;
}
