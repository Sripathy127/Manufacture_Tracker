import { useMemo } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { TypographyH3 } from "@/components/ui/typography";
import { CalendarGrid } from "./calendar-grid";
import { StatusFilter } from "./status-filter";
import { NameFilter } from "./name-filter";
import { SortBatches } from "./batch-sort";
import { ListFilterIcon, GitCompareArrowsIcon } from "lucide-react";
import { aggregateBatchesByStatus } from "@/lib/calendar-timeline/filter-utils";
import { useState } from "react";

import { useBatchLoadingFilters } from "@/hooks/use-batch-filter-model";
import type { Batch } from "@/entities";
import { RangeDatePicker } from "../range-date-picker";
import { useFilteredRows } from "@/hooks/use-filtered-rows";
import { useSortedRows } from "@/hooks/use-sorted-rows";
import { useBatchSortModel } from "@/hooks/use-batch-sort-model";
import { useBatchAllFilterModel } from "@/hooks/use-batch-all-filter-model";
import { Badge } from "../ui/badge";
import { countVisibleFilters } from "@/lib/filter-model/config";

const BATCH_COLUMN_WIDTH = 250;

export function BatchTimeline({
  TimeLineDates,
  batches,
}: {
  TimeLineDates?: { startDate?: Date; endDate?: Date };
  batches: Batch[];
}) {
  const { dateRangeFilterValue, setDateRangeFilterValue } =
    useBatchLoadingFilters();
  const [compareBatches, setCompareBatches] = useState<Batch[]>([]);
  const GenealogyView = !!(TimeLineDates?.startDate && TimeLineDates?.endDate);
  const { sortModel, setSortModel } = useBatchSortModel();
  const { filterModel, setFilter, activeFilters } = useBatchAllFilterModel();
  const batchesLength = batches.length;
  const firstBatchId = batchesLength ? (batches[0]?.batchId ?? "") : "";
  const lastBatchId = batchesLength
    ? (batches[batchesLength - 1]?.batchId ?? "")
    : "";
  const batchesVersion = useMemo(() => {
    return `${batchesLength}:${firstBatchId}:${lastBatchId}`;
  }, [batchesLength, firstBatchId, lastBatchId]);

  const compareIds = useMemo(() => {
    if (compareBatches.length === 0) return null as Set<string> | null;
    return new Set(batches.map((b) => b.batchId));
  }, [batchesVersion, compareBatches.length, batches]);

  const effectiveCompareBatches = useMemo(
    () => compareBatches.filter((cb) => compareIds?.has(cb.batchId)),
    [compareBatches, compareIds]
  );
  const filteredBatches = useFilteredRows(
    effectiveCompareBatches?.length > 0 ? effectiveCompareBatches : batches,
    activeFilters
  );
  const sortedFilteredBatches = useSortedRows(filteredBatches, sortModel);

  const statusCounts = useMemo(
    () => aggregateBatchesByStatus(batches),
    [batches]
  );
  const value =
    filterModel.batch?.operator === "contains" &&
    typeof filterModel.batch.value === "string"
      ? filterModel.batch.value
      : "";

  const [isActive, setIsActive] = useState(!!value);
  const [searchValue, setSearchValue] = useState(value);

  const handleClearFilters = () => {
    setFilter("batch", null);
    setFilter("status", null);
    setFilter("flags", null);
    setIsActive(false);
    setSearchValue("");
    setCompareBatches([]);
  };

  const [filterdraweropen, setfilterDraweropen] = useState(false);
  const [compareDrawerOpen, setcompareDraweropen] = useState(false);

  return (
    <>
      <div className="flex py-2 pr-2 gap-2 items-center border-b border-gray-300 ">
        <div
          className={`w-[${BATCH_COLUMN_WIDTH}px] pl-6 pr-2 shrink-0 flex items-center justify-between gap-0.5`}
        >
          <NameFilter
            isActive={isActive}
            setIsActive={setIsActive}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />

          <div className="flex gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Filter Batches"
              className="relative size-8"
              title="Filter batches"
              onClick={() => setfilterDraweropen(true)}
            >
              <ListFilterIcon className="size-4 text-orange-100 " />

              {countVisibleFilters(filterModel) > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-orange-100 text-white size-5 p-0">
                  {countVisibleFilters(filterModel)}
                </Badge>
              )}
            </Button>

            <SortBatches sortModel={sortModel} setSortModel={setSortModel} />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Compare Batches"
              className="relative size-8"
              title="Compare batches"
              onClick={() => setcompareDraweropen(true)}
            >
              <GitCompareArrowsIcon className="size-4 text-orange-100 " />

              {effectiveCompareBatches.length > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-orange-100 text-white size-4 p-0"></Badge>
              )}
            </Button>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex gap-5 items-center">
            <TypographyH3 className="text-nowrap text-sm w-[100px]">
              Total: {batches.length}
            </TypographyH3>
            <div className="flex flex-col gap-1">
              <StatusFilter counts={statusCounts} />
            </div>
            {(filterModel.status ||
              filterModel.batch ||
              (filterModel.flags &&
                Array.isArray(filterModel.flags.value) &&
                filterModel.flags.value.length > 0)) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-orange-600 hover:text-orange-800"
                aria-label="Clear all filters"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>
      <CalendarGrid
        batches={sortedFilteredBatches}
        unfilteredBatches={batches}
        startDate={TimeLineDates?.startDate ?? dateRangeFilterValue.startDate}
        endDate={TimeLineDates?.endDate ?? dateRangeFilterValue.endDate}
        GenealogyView={GenealogyView}
        datesFilterElement={
          <RangeDatePicker
            startDate={dateRangeFilterValue.startDate}
            endDate={dateRangeFilterValue.endDate}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                setDateRangeFilterValue(
                  format(range.from, "yyyyMMdd"),
                  format(range.to, "yyyyMMdd")
                );
              }
            }}
          />
        }
        open={filterdraweropen}
        setfilterDraweropen={setfilterDraweropen}
        compareOpen={compareDrawerOpen}
        setcompareDraweropen={setcompareDraweropen}
        compareBatches={effectiveCompareBatches}
        setCompareBatches={setCompareBatches}
      />
    </>
  );
}
