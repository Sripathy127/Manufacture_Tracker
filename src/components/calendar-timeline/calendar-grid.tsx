import { useRef, useMemo, useState } from "react";
import { generateDaysBetweenMonths } from "@/lib/calendar-timeline/date-utils";
import { TimelineHeader } from "./timeline-header";
import { TimelineEmptyState } from "./timeline-empty-state";
import { TimelineVirtualizedRows } from "./timeline-virtualized-rows";
import type { Batch } from "@/entities";
import {
  calculateFutureOverlayPosition,
  calculateMonthStartPositions,
} from "@/lib/calendar-timeline/overlay-utils";
import { BatchDetailsDrawer } from "./batch-details-drawer";
import { BatchFilters } from "../filters/batch-filters";
import { useBatchAllFilterModel } from "@/hooks/use-batch-all-filter-model";
import { CompareBatches } from "./compare-batches";

const REGULAR_DAY_WIDTH = 18;
// const COMPACT_DAY_WIDTH = 12;

const BATCH_COLUMN_WIDTH = 250;

export function CalendarGrid({
  startDate,
  endDate,
  batches,
  unfilteredBatches,
  GenealogyView,
  datesFilterElement,
  open,
  setfilterDraweropen,
  compareOpen,
  setcompareDraweropen,
  compareBatches,
  setCompareBatches,
}: {
  startDate: Date;
  endDate: Date;
  batches: Batch[];
  unfilteredBatches: Batch[];
  GenealogyView?: boolean;
  datesFilterElement?: React.ReactNode;
  open: boolean;
  setfilterDraweropen: (open: boolean) => void;
  compareOpen: boolean;
  setcompareDraweropen: (open: boolean) => void;
  compareBatches: Batch[];
  setCompareBatches: (batches: Batch[]) => void;
}) {
  const { days, monthsMap } = useMemo(
    () => generateDaysBetweenMonths(startDate, endDate),
    [startDate, endDate]
  );
  const months = Object.values(monthsMap);
  const { filterModel, setFilterModel } = useBatchAllFilterModel();

  const gridColWidth = REGULAR_DAY_WIDTH;
  const gridWidth = days.length * gridColWidth + BATCH_COLUMN_WIDTH;
  const columnCount = days.length;

  const monthStartPositions = useMemo(
    () => calculateMonthStartPositions(months, days[0].date, gridColWidth),
    [months, days, gridColWidth]
  );

  const futureOverlayPosition = useMemo(
    () => calculateFutureOverlayPosition(days, gridColWidth),
    [days, gridColWidth]
  );

  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("details");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      id="calendar-grid-container"
      ref={parentRef}
      className="flex-1 min-h-0 h-full overflow-x-auto overflow-y-auto relative"
    >
      <div style={{ width: `${gridWidth}px` }}>
        <div
          className="grid calendar-header sticky top-0 bg-white z-20 "
          style={{
            gridTemplateColumns: `${BATCH_COLUMN_WIDTH - 1}px repeat(${days.length}, ${gridColWidth}px)`,
            gridTemplateRows: `28px 28px`,
          }}
        >
          {!GenealogyView && (
            <div className="border-r border-b flex flex-col justify-center sticky left-0 px-6 bg-white z-10 col-1 row-[1/span_2]">
              {datesFilterElement}
            </div>
          )}
          {GenealogyView && (
            <div className="border-r border-b flex flex-col justify-center sticky left-0 px-6 bg-white z-10 col-1 row-[1/span_2]">
              Genealogy View
            </div>
          )}
          <TimelineHeader months={months} gridColumnWidth={gridColWidth} />
        </div>

        {batches.length > 0 && (
          <TimelineVirtualizedRows
            batches={batches}
            days={days}
            gridColumnWidth={gridColWidth}
            batchColumnWidth={BATCH_COLUMN_WIDTH}
            columnCount={columnCount}
            monthStartPositions={monthStartPositions}
            futureOverlayPosition={futureOverlayPosition}
            parentRef={parentRef}
            onMenuItemSelect={(batch, tab) => {
              setSelectedBatch(batch);
              setSelectedTab(tab);
              setIsDrawerOpen(true);
            }}
          />
        )}
      </div>
      {batches.length === 0 && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <TimelineEmptyState />
        </div>
      )}
      {selectedBatch && (
        <BatchDetailsDrawer
          batch={selectedBatch}
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          onClosed={() => setSelectedBatch(null)}
          containerRef={parentRef}
          defaultTab={selectedTab}
        />
      )}
      {open && (
        <BatchFilters
          open={open}
          onOpenChange={setfilterDraweropen}
          filterModel={filterModel}
          setFilterModel={setFilterModel}
          containerRef={parentRef}
          batches={batches}
          unfilteredBatches={unfilteredBatches}
        />
      )}
      {compareOpen && (
        <CompareBatches
          open={compareOpen}
          onOpenChange={setcompareDraweropen}
          onClosed={() => setcompareDraweropen(false)}
          containerRef={parentRef}
          batches={unfilteredBatches}
          compareBatches={compareBatches}
          setCompareBatches={setCompareBatches}
        />
      )}
    </div>
  );
}
