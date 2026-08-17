import { useState, useLayoutEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { type DayInfo } from "@/lib/calendar-timeline/date-utils";
import type { Batch, BatchDetail } from "@/entities";
import { apiEndpoints } from "@/api/endpoints";

import { TypographyH3, TypographyCaption1 } from "@/components/ui/typography";
import { BatchStatusBadge } from "./badge-status-badge";
import { BatchSpan } from "./batch-span";
import { MilestoneSpan } from "./milestone-span";
import { LoadingOverlay } from "../loading-overlay";
import { EllipsisVerticalIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useNavigate } from "react-router";

import { IEDDate } from "./inspection-end-date";
import { Disposition } from "./disposition";
import { cn } from "@/lib/utils";
import { InvestigationsDropdown } from "./investigation-data-dropdown";
import { ShippingStatus } from "./shipping-status";
import { isAfter, isBefore } from "date-fns";
import { createBatchDetailFromRequest } from "@/tests/factories/batch-detail";

export function TimelineRow({
  batch,
  timelineDays,
  gridColumnWidth,
  batchColumnWidth,
  columnCount,
  virtualStart,
  dataIndex,
  measureElement,
  onMenuItemSelect,
  children,
}: {
  batch: Batch;
  timelineDays: DayInfo[];
  gridColumnWidth: number;
  batchColumnWidth: number;
  columnCount: number;
  virtualStart: number;
  dataIndex?: number;
  measureElement?: (el: Element | null) => void;
  onMenuItemSelect: (batch: Batch | null, tab: string) => void;
  children: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  const { data: batchDetails, isLoading } = useQuery<BatchDetail>({
    queryKey: ["batch-detail", apiEndpoints.batch(batch.batchId)],
    queryFn: async () => {
      const response = await createBatchDetailFromRequest(batch.batchId, batch);
      return response;
    },
    enabled: isExpanded,
  });

  const timelineStartDate = timelineDays[0].date;
  const timelineEndDate = timelineDays[timelineDays.length - 1].date;
  const isExpandedContent = isExpanded && !!batchDetails;

  const navigate = useNavigate();

  const milestonesCount =
    batchDetails?.milestones?.filter((milestone) => {
      if (!milestone.leftbound || !milestone.rightbound) return false;
      if (isAfter(milestone.leftbound, timelineEndDate)) return false;
      if (isBefore(milestone.rightbound, timelineStartDate)) return false;
      return true;
    }).length ?? 0;

  // Remeasure height when expansion state changes or data loads
  useLayoutEffect(() => {
    if (measureElement && rowRef.current) {
      measureElement(rowRef.current);
    }
  }, [isExpanded, batchDetails, measureElement]);

  return (
    <div
      ref={rowRef}
      data-index={dataIndex}
      data-expanded={isExpanded}
      className="group flex absolute top-0 left-0 w-full"
      style={{
        transform: `translateY(${virtualStart}px)`,
      }}
      role="row"
      aria-label={`Batch ${batch.batch}`}
    >
      {isLoading && <LoadingOverlay />}
      <div
        className="shrink-0 sticky left-0 z-200 pl-8 pr-4 flex flex-col gap-2 border-r-2 border-b min-h-26 py-4 bg-white group-data-[expanded=true]:bg-neutral-lightest-gray"
        style={{ width: `${batchColumnWidth}px` }}
      >
        <div className="flex items-center gap-2">
          <TypographyH3>{batch.batch}</TypographyH3>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-auto">
                <EllipsisVerticalIcon className="size-4" />
                <span className="sr-only">Open menu </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem
                onClick={() => onMenuItemSelect(batch, "details")}
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onMenuItemSelect(batch, "edit")}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onMenuItemSelect(batch, "comments")}
              >
                Comments
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <BatchStatusBadge status={batch.status} />

        {isExpandedContent && (
          <>
            <TypographyH3 className="mt-2 mb-0">Genealogy</TypographyH3>

            {/* <TypographyCaption1 className="text-neutral-dark-gray">
              Previous batches:
              <GenealogyBatchDropdown
                Batchlist={batchDetails.previousBatch}
                placeholder={"Previous batches"}
              />
            </TypographyCaption1>
            <TypographyCaption1 className="text-neutral-dark-gray">
              Next batches:
              <GenealogyBatchDropdown
                Batchlist={batchDetails.nextBatch}
                placeholder={"Next batches"}
              />
            </TypographyCaption1> */}
            <Button
              variant="default"
              className="p-0 text-white  bg-orange-100 hover:bg-orange-60"
              onClick={() => navigate(`/batch-tracker/graph/${batch.batchId}`)}
            >
              View Genealogy
            </Button>

            <TypographyH3 className="mt-2 mb-0">Investigations</TypographyH3>
            <TypographyCaption1 className="text-neutral-dark-gray">
              {/* Open: {batchDetails.etsOpenCount ?? 0} */}
              Open:
              <InvestigationsDropdown
                Batchlist={batchDetails.etsOpen}
                Responsible_Person={batch?.Responsible_Person}
                Title="Open"
              />
            </TypographyCaption1>
            <TypographyCaption1 className="text-neutral-dark-gray">
              {/* Closed: {batchDetails.etsClosedCount ?? 0} */}
              Closed:
              <InvestigationsDropdown
                Batchlist={batchDetails.etsClosed}
                Responsible_Person={batch?.Responsible_Person}
                Title="Closed"
              />
            </TypographyCaption1>
            <TypographyH3 className="mt-2 mb-0">Shipping details</TypographyH3>
            <TypographyCaption1 className="text-neutral-dark-gray">
              Shipped quantity: {batchDetails.shipped_quantity ?? "N/A"}
            </TypographyCaption1>
            <TypographyCaption1 className="text-neutral-dark-gray">
              Quantity ordered: {batchDetails.quantity_ordered ?? "N/A"}
            </TypographyCaption1>
            <TypographyCaption1 className="text-neutral-dark-gray">
              Units: {batchDetails.units ?? "N/A"}
            </TypographyCaption1>
          </>
        )}
      </div>

      <div
        className={cn(
          `grid relative min-h-26 border-b  py-4`,
          isExpanded ? "border-[#c2d4f2ff]" : "border-[#D0DEF5]"
        )}
        style={{
          gridTemplateColumns: `repeat(${timelineDays.length}, ${gridColumnWidth}px)`,
          gridAutoFlow: "dense",
          gridRowGap: "8px",
          backgroundImage: !isExpanded
            ? `repeating-linear-gradient(to right, #E9F1FF 0 ${gridColumnWidth - 1}px, #D0DEF5 ${gridColumnWidth - 1}px ${gridColumnWidth}px)`
            : `repeating-linear-gradient(to right, #dde9fdff 0 ${gridColumnWidth - 1}px, #c2d4f2ff ${gridColumnWidth - 1}px ${gridColumnWidth}px)`,
        }}
      >
        {children}

        {isExpandedContent && (
          <>
            <IEDDate
              iedDate={
                batchDetails.milestones.find(
                  (m) => m.milestoneType === "Testing"
                )?.planned_end ?? null
              }
              timelineDays={timelineDays}
              gridColumnWidth={gridColumnWidth}
              iedName="Current EID" // Original EID is Current EID for now
              gridrow={1}
            />
            {/* <IEDDate
              iedDate={
                batchDetails.milestones.find(
                  (m) => m.milestoneType === "Testing"
                )?.actual_end ?? null
              }
              timelineDays={timelineDays}
              gridColumnWidth={gridColumnWidth}
              iedName="Current EID"
              gridrow={2}
            /> */}
            <Disposition
              dispositionDate={batch.actualBatchEndDate ?? null}
              timelineDays={timelineDays}
              gridColumnWidth={gridColumnWidth}
              gridrow={4} // this requires +1 row
            />
            <ShippingStatus
              shippedon={batchDetails.shipped_on ?? null}
              shippedto={batchDetails.shipped_to ?? null}
              timelineDays={timelineDays}
              gridColumnWidth={gridColumnWidth}
              gridrow={milestonesCount + 6}
              columnCount={columnCount}
            />
          </>
        )}

        <BatchSpan
          batch={batch}
          timelineStartDate={timelineStartDate}
          columnCount={columnCount}
          gridColumnWidth={gridColumnWidth}
          isExpanded={isExpanded}
          onToggleExpand={() => setIsExpanded(!isExpanded)}
        />
        {isExpanded &&
          batchDetails?.milestones?.map((milestone, index) => (
            <MilestoneSpan
              key={milestone.milestoneId}
              milestone={milestone}
              timelineStartDate={timelineStartDate}
              timelineEndDate={timelineEndDate}
              columnCount={columnCount}
              rowIndex={index + 6}
              gridColumnWidth={gridColumnWidth}
            />
          ))}
      </div>
    </div>
  );
}
