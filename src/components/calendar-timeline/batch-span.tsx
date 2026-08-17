import { differenceInCalendarDays } from "date-fns";
import type { Batch } from "@/entities";
import { Item, ItemContent } from "@/components//ui/item";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { TypographyCaption1, TypographyH4 } from "@/components/ui/typography";
import { batchColorMap } from "./colors-mapping";
import { BatchStatusBadge } from "./badge-status-badge";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";

// Responsive span container breakpoints
const rc = {
  show: {
    xs: "block @[84px]/batch:hidden",
    sm: "block @[280px]/batch:hidden",
    md: "flex @[300px]/batch:hidden",
    lg: "block @[320px]/batch:hidden",
    xl: "block @[350px]/batch:hidden",
  },
  hide: {
    xs: "hidden @[84px]/batch:block",
    sm: "hidden @[280px]/batch:block",
    md: "hidden @[300px]/batch:flex",
    lg: "hidden @[320px]/batch:block",
    xl: "hidden @[350px]/batch:block",
  },
};

export function BatchSpan({
  batch,
  timelineStartDate,
  columnCount,
  gridColumnWidth,
  isExpanded,
  onToggleExpand,
}: {
  batch: Batch;
  timelineStartDate: Date;
  columnCount: number;
  gridColumnWidth: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  // Grid positioning
  const startCol =
    differenceInCalendarDays(batch.leftBound, timelineStartDate) + 1;
  const span = differenceInCalendarDays(batch.rightBound, batch.leftBound) + 1;
  const endCol = startCol + span;
  const isEndOverflow = endCol > columnCount;
  const isStartOverflow = startCol < 0;

  // Flags and status
  const isEscalation = batch.etsEscalation === "T";
  const isOverdue = batch.overdue === "T";
  const isNotStarted = batch.notStarted === "T";
  const hasFlag = isEscalation || isOverdue;

  // Visual elements
  const Chevron = isExpanded ? ChevronDownIcon : ChevronRightIcon;
  const batchColors = batchColorMap[batch.status] ?? batchColorMap.future;
  const baseBgColor = isExpanded
    ? "var(--color-neutral-lightest-gray)"
    : "white";
  const background = calculateOverdueBackground(
    batch,
    timelineStartDate,
    gridColumnWidth,
    isStartOverflow,
    baseBgColor
  );

  return (
    <Item
      className={cn(
        "@container/batch py-4 text-sm flex items-center pl-0 pr-2 relative h-[80px]",
        isEndOverflow ? "rounded-r-none " : "rounded-r-lg",
        isStartOverflow
          ? "rounded-l-none"
          : `rounded-l-lg border-l-4 ${batchColors[2]}`
      )}
      title={`Start Date: ${batch.leftBound} \n End Date: ${batch.rightBound}`}
      style={{
        gridColumn: `${startCol < 0 ? 1 : startCol} / ${endCol}`,
        gridRow: 3,
        background,
      }}
    >
      <ItemContent>
        <div className="flex items-center w-full gap-2">
          {/* Chevron - always visible */}
          <button
            type="button"
            className="text-muted-foreground shrink-0 size-6 cursor-pointer bg-transparent border-0 p-0 -translate-x-1"
            onClick={onToggleExpand}
            aria-label={`View details for batch ${batch.batch}`}
          >
            <Chevron className="size-6" aria-hidden="true" />
          </button>
          {/* Batch name - visible when container >= 84px */}
          <TypographyH4 className={cn("shrink-0", rc.hide.xs)}>
            {batch.batch}
          </TypographyH4>

          {/* Separator - visible when container >= 144px */}
          <div className={cn("h-8", rc.hide.sm)}>
            <Separator orientation="vertical" className="bg-neutral-gray" />
          </div>
          {/* Material info - visible when container >= 144px */}
          <div className={cn("shrink-0", rc.hide.sm)}>
            <TypographyCaption1 className="text-neutral-dark-gray mb-1 text-nowrap">
              {batch.materialDescription}
            </TypographyCaption1>
            <TypographyCaption1 className="text-neutral-dark-gray ">
              {batch.material}
            </TypographyCaption1>
            {/* <TypographyCaption1 className="text-neutral-dark-gray ">
              Production Cost:
              {batch.batchValue ? `$ ${batch.batchValue}` : "N/A"}
            </TypographyCaption1> */}
          </div>
          <div className={cn("ml-auto", rc.hide.md)}>
            {/* Alert flags - visible when container >= 200px */}

            {/* Status - visible when container >= 270px or >= 250px*/}
            <BatchStatusBadge
              status={batch.status}
              className={cn("ml-2", hasFlag ? rc.hide.xl : rc.hide.lg)}
            />
          </div>
        </div>
      </ItemContent>

      {/* overflow item content */}
      <ItemContent
        className={cn(
          "absolute right-0 pl-5",
          hasFlag ? rc.show.xl : rc.show.lg
        )}
        style={{ transform: "translate(100%, 0%)" }}
      >
        <div className="relative flex items-center w-full bg-gray-300/40 rounded-lg h-[66px] gap-3 px-2">
          {/* Triangle tooltip pointer on the left */}
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-0 h-0 border-y-8 border-y-transparent border-r-10 border-r-gray-300/40"
            aria-hidden="true"
          />
          {/* Batch name - hidden when container >= 84px (inverse of span) */}
          <TypographyH4 className={cn("shrink-0", rc.show.xs)}>
            {batch.batch}
          </TypographyH4>

          {/* Separator - hidden when container >= 144px */}
          <div className={cn("h-8", rc.show.sm)}>
            <Separator orientation="vertical" className="bg-neutral-gray" />
          </div>
          {/* Material info - hidden when container >= 144px (inverse of span) */}
          <div className={cn("shrink-0", rc.show.sm)}>
            <TypographyCaption1 className="text-neutral-dark-gray mb-1 text-nowrap">
              {batch.materialDescription}
            </TypographyCaption1>
            <TypographyCaption1 className="text-neutral-dark-gray">
              {batch.material}
            </TypographyCaption1>
            {/* <TypographyCaption1 className="text-neutral-dark-gray ">
              Production Cost:
              {batch.batchValue ? `$ ${batch.batchValue}` : "N/A"}
            </TypographyCaption1> */}
          </div>
          {/* Alert flags - hidden when container >= 200px (inverse of span) */}

          {/* Status - whole container is hidden when container >= 270px or >= 250px (inverse of span) */}
          <BatchStatusBadge status={batch.status} className={cn("shrink-0")} />
        </div>
      </ItemContent>
    </Item>
  );
}

// Helper functions
function calculateOverdueBackground(
  batch: Batch,
  timelineStartDate: Date,
  gridColumnWidth: number,
  isStartOverflow: boolean,
  baseBgColor: string
): string {
  const hasOverdue =
    batch.etsDueDate &&
    batch.plannedBatchEndDate &&
    differenceInCalendarDays(batch.etsDueDate, batch.plannedBatchEndDate) > 0;

  if (!hasOverdue) return baseBgColor;

  const visibleStartDate = isStartOverflow
    ? timelineStartDate
    : batch.leftBound;
  const daysUntilPlannedEnd =
    differenceInCalendarDays(batch.plannedBatchEndDate, visibleStartDate) + 1;
  const leftBorderWidth = isStartOverflow ? 0 : 4;
  const overdueStart = daysUntilPlannedEnd * gridColumnWidth - leftBorderWidth;

  return `linear-gradient(to right, ${baseBgColor} ${overdueStart}px, var(--color-neutral-lighter-gray) ${overdueStart}px)`;
}
