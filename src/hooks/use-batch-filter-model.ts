import { useMemo } from "react";
import useLocalStorageState from "use-local-storage-state";
import {
  BATCH_LOADING_FILTERS_STORAGE_KEY,
  type BatchLoadingFilters,
  getBatchLoadingFiltersFromStorage,
} from "@/lib/batch-filter-model-store";
import { parseFilterDate } from "@/lib/batch-date-utils";

export function useBatchLoadingFilters() {
  const [filterModel, setFilterModel] =
    useLocalStorageState<BatchLoadingFilters>(
      BATCH_LOADING_FILTERS_STORAGE_KEY,
      {
        defaultValue: getBatchLoadingFiltersFromStorage(),
      }
    );

  const setSitesProductsMRPFiltersValue = (value: {
    siteIds: string[];
    productFamilyIds: string[];
  }) => {
    setFilterModel((current) =>
      Object.assign({}, current, {
        siteIds: value.siteIds,
        productFamilyIds: value.productFamilyIds,
      })
    );
  };

  const dateRangeFilterValue = useMemo(
    () => ({
      startDate: parseFilterDate(filterModel.startDate),
      endDate: parseFilterDate(filterModel.endDate),
    }),
    [filterModel.startDate, filterModel.endDate]
  );

  const setDateRangeFilterValue = (startDate: string, endDate: string) => {
    setFilterModel((current) =>
      Object.assign({}, current, { startDate, endDate })
    );
  };

  return {
    filterModel,
    setDateRangeFilterValue,
    dateRangeFilterValue,

    setSitesProductsMRPFiltersValue,
  };
}
