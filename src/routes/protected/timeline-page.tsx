import { useMemo } from "react";

// import { BatchTimeline } from "@/components/calendar-timeline/batch-timeline";
import { BatchTimeline } from "./../../components/calendar-timeline/batches-timeline";
import { LoadingOverlay } from "@/components/loading-overlay";
import { useQuery } from "@tanstack/react-query";
import { apiEndpoints } from "@/api/endpoints";
import type { Batch } from "@/entities";
import { useBatchLoadingFilters } from "@/hooks/use-batch-filter-model";
import { ErrorDisplay } from "@/components/error-disaplay";
import { fetchMockBatches } from "@/tests/factories/batch";
export function TimelinePage() {
  const { filterModel } = useBatchLoadingFilters();

  const batchesQueryBody = useMemo(
    () => ({
      siteIds: filterModel.siteIds,
      productFamilyIds: filterModel.productFamilyIds,
      leftbound: filterModel.startDate,
      rightbound: filterModel.endDate,
    }),
    [
      filterModel.siteIds,
      filterModel.productFamilyIds,
      filterModel.startDate,
      filterModel.endDate,
    ]
  );

  const {
    data: loaded,
    isFetching,
    isPlaceholderData,
    error,
    refetch,
  } = useQuery<{
    data: Batch[];
  }>({
    queryKey: ["batches", apiEndpoints.batches, batchesQueryBody],
    queryFn: async () => {
      const response = await fetchMockBatches(100);
      return response;
    },

    placeholderData: (prev) => prev,
  });

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        title="Failed to load data"
        description="An error occurred while fetching the data"
        onRetry={() => refetch()}
        retryLabel="Try Again"
        fullScreen={false}
      />
    );
  }

  const showOverlay = !loaded || (isFetching && isPlaceholderData);

  const batchesData = loaded?.data ?? [];

  return (
    <>
      <BatchTimeline batches={batchesData} />
      {showOverlay && <LoadingOverlay delay={loaded ? 100 : 0} />}
    </>
  );
}
