import { useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { generateDaysBetweenMonths } from "@/lib/calendar-timeline/date-utils";
import { TimelineRow } from "./timeline-row";
import type { Batch } from "@/entities";
import { getDate } from "date-fns";
import { FutureOverlay } from "./future-overlay";
import { MonthStartOverlay } from "./month-start-overlay";
import {
  calculateFutureOverlayPosition,
  calculateMonthStartPositions,
} from "@/lib/calendar-timeline/overlay-utils";

export const ROW_HEIGHT = 104;

export function TimelineVirtualizedRows({
  batches,
  days,
  gridColumnWidth,
  batchColumnWidth,
  columnCount,
  monthStartPositions,
  futureOverlayPosition,
  parentRef,
  onMenuItemSelect,
}: {
  batches: Batch[];
  days: ReturnType<typeof generateDaysBetweenMonths>["days"];
  gridColumnWidth: number;
  batchColumnWidth: number;
  columnCount: number;
  monthStartPositions: ReturnType<typeof calculateMonthStartPositions>;
  futureOverlayPosition: ReturnType<typeof calculateFutureOverlayPosition>;
  parentRef: React.RefObject<HTMLDivElement | null>;
  onMenuItemSelect: (batch: Batch | null, tab: string) => void;
}) {
  const rowVirtualizer = useVirtualizer({
    count: batches.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5,
  });

  // Reset scroll and remeasure when batches change (e.g., due to filtering)
  useEffect(() => {
    rowVirtualizer.measure();
    rowVirtualizer.scrollToOffset(0, { align: "start" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batches.length]);

  const virtualItems = rowVirtualizer.getVirtualItems();
  const timelineKey =
    days.length > 0 ? `${days[0].date}-${days.length}` : "empty";
  return (
    <div
      className="min-h-0 relative"
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`,
      }}
    >
      {virtualItems.map((virtualRow, index) => {
        const batch = batches[virtualRow.index];
        return (
          <TimelineRow
            key={`${batch.batchId}-${timelineKey}-${virtualRow.index}-${batches.length}`}
            batch={batch}
            timelineDays={days}
            gridColumnWidth={gridColumnWidth}
            batchColumnWidth={batchColumnWidth}
            columnCount={columnCount}
            virtualStart={virtualRow.start}
            dataIndex={virtualRow.index}
            measureElement={rowVirtualizer.measureElement}
            onMenuItemSelect={onMenuItemSelect}
          >
            <MonthStartOverlay positions={monthStartPositions} />
            <FutureOverlay position={futureOverlayPosition}>
              {index === 0 && (
                <span className=" text-(--color-orange-100) font-light pl-1">
                  {getDate(new Date())}
                </span>
              )}
            </FutureOverlay>
          </TimelineRow>
        );
      })}
    </div>
  );
}
