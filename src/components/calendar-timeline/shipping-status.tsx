import { PlaneTakeoffIcon } from "lucide-react";
import { type DayInfo } from "@/lib/calendar-timeline/date-utils";
import { differenceInCalendarDays, isAfter, isBefore } from "date-fns";
import { cn } from "@/lib/utils";
import { Item, ItemContent } from "@/components/ui/item";
import { TypographyCaption1, TypographyH4 } from "../ui/typography";
import { format } from "date-fns";
const getPosition = (
  shippeddate: Date,
  timelineDays: DayInfo[],
  gridColumnWidth: number
) => {
  if (isBefore(shippeddate, timelineDays[0].date)) return null;
  if (isAfter(shippeddate, timelineDays[timelineDays.length - 1].date))
    return null;

  const position = timelineDays
    ? differenceInCalendarDays(shippeddate, timelineDays[0].date)
    : -1;

  if (position >= 0) return (position + 1) * gridColumnWidth;

  return null;
};

export function ShippingStatus({
  shippedon,
  shippedto,
  timelineDays,
  gridColumnWidth,
  gridrow,
  columnCount,
}: {
  shippedon: Date | null;
  shippedto: string | null;
  timelineDays: DayInfo[];
  gridColumnWidth: number;
  gridrow: number;
  columnCount: number;
}) {
  if (!shippedon || !shippedto) return null;

  const left = getPosition(shippedon, timelineDays, gridColumnWidth);
  if (left === null) return null;

  const startCol =
    differenceInCalendarDays(shippedon, timelineDays[0].date) + 1;

  const span = differenceInCalendarDays(shippedon, shippedon) + 1;

  const endCol = startCol + span;

  const isOverflow = endCol > columnCount;
  const isStartOverflow = startCol < 0;

  return (
    <Item
      className={cn(
        "@container/step py-0 bg-white text-sm flex items-center pl-0 pr-2 relative h-8 rounded-none",

        isOverflow ? "rounded-r-none " : "rounded-r-md",
        isStartOverflow ? "rounded-l-none" : "rounded-l-md"
      )}
      style={{
        gridColumn: `${startCol > 0 ? startCol : 1} / ${endCol}`,
        gridRow: gridrow,
      }}
    >
      <ItemContent>
        <div className="flex items-center w-full gap-2">
          <div>
            <PlaneTakeoffIcon className="h-4 w-4 text-neutral-dark-gray stroke-orange-60" />
          </div>
          <TypographyH4 className={cn("shrink-0 ")}>
            {`Shipped to : ${shippedto} `}
          </TypographyH4>

          <div className="shrink-0 ml-auto">
            <TypographyCaption1 className="text-neutral-dark-gray text-nowrap">
              {format(shippedon, "MMM d")} - {format(shippedon, "MMM d")}
            </TypographyCaption1>
          </div>
        </div>
      </ItemContent>
    </Item>
  );
}
